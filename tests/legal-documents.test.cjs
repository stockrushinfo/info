// These checks cover document integrity and URL navigation, not legal compliance.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'docs/privacy.html'), 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
const baseUrl = 'https://stockrushinfo.github.io/info/privacy.html';

function navigation(href = baseUrl) {
    const context = vm.createContext({ URL, window: { location: { href } } });
    // Execute the production URL rules, before the DOM rendering entry point.
    vm.runInContext(script.slice(0, script.indexOf('    function syncPage()')), context);
    return context;
}

test('HTML, language controls and existing document anchors remain valid', () => {
    assert.match(html, /<html lang="en">/);
    assert.equal(ids.length, new Set(ids).size);
    for (const id of ['privacy', 'deletion', 'subscriptions', 'privacy-en', 'deletion-en', 'subscriptions-en']) {
        assert.ok(ids.includes(id), id);
    }
    for (const [, id] of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(id), id);
    assert.match(html, /data-language="it"[^>]*>IT<\/a>/);
    assert.match(html, /data-language="en"[^>]*>ENG<\/a>/);
    assert.doesNotMatch(html, /Read in English|Leggi in italiano/);
    new vm.Script(script);
});

test('opening the page loads no third-party scripts, fonts or images', () => {
    assert.doesNotMatch(html, /<(?:script|img|iframe)[^>]+src\s*=\s*["'](?:https?:)?\/\//i);
    assert.doesNotMatch(html, /<link\b[^>]*href\s*=\s*["'](?:https?:)?\/\//i);
    assert.doesNotMatch(html, /(?:@import|url\s*\()[^;\n]*https?:\/\//i);
    assert.doesNotMatch(script, /localStorage|sessionStorage|document\.cookie|navigator\.language/);
    for (const [, file] of html.matchAll(/<img[^>]+src="([^"]+)"/g)) {
        assert.ok(fs.existsSync(path.join(root, 'docs', file)), file);
    }
});

for (const [query, language] of [
    ['', 'en'], ['?lang=en', 'en'], ['?lang=it', 'it'], ['?lang=IT', 'it'],
    ['?lang=', 'en'], ['?lang=fr', 'en'],
]) {
    test('language resolved from URL: ' + (query || 'default English'), () => {
        const state = navigation().pageState(baseUrl + query + '#subscriptions');
        assert.deepEqual({ ...state }, { lang: language, documentId: 'subscriptions', anchor: 'subscriptions' });
    });
}

test('both languages preserve each document and the retention deep link', () => {
    for (const language of ['it', 'en']) {
        for (const documentId of ['privacy', 'deletion', 'subscriptions', 'privacy-retention']) {
            const current = baseUrl + '?other=kept&lang=' + language + '#' + documentId;
            const api = navigation(current);
            const otherLanguage = language === 'it' ? 'en' : 'it';
            const relative = api.pageUrl(otherLanguage, documentId);
            const switched = new URL(relative, baseUrl);
            assert.equal(switched.searchParams.get('lang'), otherLanguage);
            assert.equal(switched.searchParams.get('other'), 'kept');
            assert.equal(switched.hash, '#' + documentId);
            assert.equal(switched.origin, new URL(baseUrl).origin);
            assert.equal(api.pageState(switched.href).anchor, documentId);
        }
    }
});

test('legacy English anchors follow the explicit language; unknown fragments safely fall back', () => {
    const api = navigation();
    assert.deepEqual({ ...api.pageState(baseUrl + '?lang=it#deletion-en') },
        { lang: 'it', documentId: 'deletion', anchor: 'deletion' });
    assert.deepEqual({ ...api.pageState(baseUrl + '#privacy-retention-en') },
        { lang: 'en', documentId: 'privacy', anchor: 'privacy-retention' });
    for (const fragment of ['missing', '%3Cimg%20onerror=alert(1)%3E', '__proto__']) {
        assert.deepEqual({ ...api.pageState(baseUrl + '#' + fragment) },
            { lang: 'en', documentId: 'privacy', anchor: 'privacy' });
    }
});

test('privacy translations cover the same sections, retention and telemetry limitations', () => {
    const italian = html.split('<div id="privacy"')[1].split('<div id="privacy-en"')[0];
    const english = html.split('<div id="privacy-en"')[1].split('<!-- SECTION 3')[0];
    const headings = text => [...text.matchAll(/<h[23][^>]*>(\d+)\./g)].map(match => Number(match[1]));
    assert.deepEqual(headings(italian), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
    assert.deepEqual(headings(english), headings(italian));
    assert.match(italian, /Bozza non pronta per la pubblicazione/);
    assert.match(english, /Draft, not ready for publication/);
    assert.match(italian, /<strong>un mese<\/strong>/);
    assert.match(english, /<strong>one month<\/strong>/);
    for (const text of [italian, english]) {
        for (const topic of ['24', '30', '90', 'Heroku', 'MongoDB', 'Analytics', 'Anthropic', 'Brandfetch', 'FCM']) {
            assert.ok(text.includes(topic), topic);
        }
    }
    assert.match(italian, /Oggi non esiste una scelta dedicata per Analytics/);
    assert.match(english, /There is currently no dedicated Analytics choice/);
    assert.match(english, /Application parameters do not include tickers, benchmark names, searches, chosen country\s+or portfolio amounts/);
    assert.match(english, /installation identifier and push token at startup even with[\s\S]*notifications off/);
});

test('automatic SDK data is not confused with allowlisted portfolio parameters', () => {
    assert.match(html, /area geografica approssimativa dall'IP, senza GPS/);
    assert.match(html, /approximate area from the IP address, without GPS/);
    assert.match(html, /modalità d'inserimento per quantità o importo/);
    assert.match(html, /entry mode by units or amount/);
    assert.match(html, /prodotto, prezzo e valuta/);
    assert.match(html, /product, price and currency/);
});

test('deletion does not promise expiry of every record or guaranteed Apple revocation', () => {
    assert.doesNotMatch(html, /Technical records expire separately|retained for up to\s+24 hours|conservato fino a 24 ore/);
    assert.match(html, /some currently have no automatic expiry/);
    assert.match(html, /revoca presso Apple è tentata ma non garantita/);
    assert.match(html, /Revocation with Apple is attempted, not guaranteed/);
    assert.match(html, /nuovo account con la stessa identità/);
    assert.match(html, /new account using that same\s+identity/);
    assert.match(html, /Separate purchase records do not follow this expiry/);
});

test('static defaults, headings and print rules follow the selected document', () => {
    assert.match(html, /<div id="privacy-en" class="section active" lang="en">/);
    assert.doesNotMatch(html, /<div id="privacy" class="section active"/);
    assert.doesNotMatch(html, /<h3>\d+\./);
    const print = html.split('@media print {')[1].split('        h1 {')[0];
    assert.match(print, /\.js \.section \{ display: none; \}/);
    assert.match(print, /\.js \.section\.active \{ display: block; \}/);
});

test('terms cover the same thirteen subjects without hardcoded prices or an implied effective contract', () => {
    const italian = html.split('<div id="subscriptions"')[1].split('<div id="subscriptions-en"')[0];
    const english = html.split('<div id="subscriptions-en"')[1].split('</main>')[0];
    const headings = text => [...text.matchAll(/<h[23][^>]*>(\d+)\./g)].map(match => Number(match[1]));
    assert.deepEqual(headings(italian), Array.from({ length: 13 }, (_, index) => index + 1));
    assert.deepEqual(headings(english), headings(italian));
    assert.match(italian, /Non in vigore/);
    assert.match(english, /Not in effect/);
    assert.match(italian, /Funzione di recesso online/);
    assert.match(english, /Online withdrawal function/);
    for (const text of [italian, english]) {
        assert.ok(text.includes('TWR'));
        assert.doesNotMatch(text, /(?:€|EUR|\beuro\b)\s*\d+[.,]\d{2}|\d+[.,]\d{2}\s*(?:€|EUR|\beuro\b)/i);
    }
});
