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

// Content checks: they pin the facts the texts must state (verified against the app code on
// 2026-10-17) and the parity between Italian and English. They do not certify legal compliance.
const sectionOf = (id, nextMarker) => html.split('<div id="' + id + '"')[1].split(nextMarker)[0];
const docs = {
    deletion: { it: sectionOf('deletion', '<div id="deletion-en"'), en: sectionOf('deletion-en', '<!-- SECTION 2') },
    privacy: { it: sectionOf('privacy', '<div id="privacy-en"'), en: sectionOf('privacy-en', '<!-- SECTION 3') },
    terms: { it: sectionOf('subscriptions', '<div id="subscriptions-en"'), en: sectionOf('subscriptions-en', '</main>') },
};
const numbered = text => [...text.matchAll(/<h2[^>]*>(\d+)\./g)].map(match => Number(match[1]));
const count = (text, pattern) => (text.match(pattern) || []).length;

test('every document opens with a summary and has the same structure in both languages', () => {
    for (const [name, { it, en }] of Object.entries(docs)) {
        assert.match(it, /<div class="info"><strong>In breve<\/strong>/, name);
        assert.match(en, /<div class="info"><strong>In short<\/strong>/, name);
        assert.equal(count(it, /<h2/g), count(en, /<h2/g), name + ' headings');
        assert.equal(count(it, /<tr>/g), count(en, /<tr>/g), name + ' table rows');
        assert.equal(count(it, /<li>/g), count(en, /<li>/g), name + ' list items');
    }
    assert.deepEqual(numbered(docs.privacy.it), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
    assert.deepEqual(numbered(docs.privacy.en), numbered(docs.privacy.it));
    assert.deepEqual(numbered(docs.terms.it), Array.from({ length: 13 }, (_, index) => index + 1));
    assert.deepEqual(numbered(docs.terms.en), numbered(docs.terms.it));
});

test('published version: no placeholders or draft banners, decided values in place', () => {
    for (const text of [docs.privacy.it, docs.privacy.en, docs.terms.it, docs.terms.en]) {
        assert.equal(count(text, /class="todo"/g), 0);
        assert.doesNotMatch(text, /\[(TITOLARE|CONTROLLER|SUPPLIER|PREAVVISO|NOTICE|CONSERVAZIONE|RETENTION)[^\]]*\]/);
        assert.doesNotMatch(text, /Bozza|Draft|Non in vigore|Not in effect/);
    }
    assert.match(docs.terms.it, /In vigore dal 17 ottobre 2026/);
    assert.match(docs.terms.en, /In effect from October 17, 2026/);
    assert.match(docs.terms.it, /almeno 30\s+giorni prima/);
    assert.match(docs.terms.en, /at least 30\s+days before/);
    const mailboxes = new Set([...html.matchAll(/mailto:([^"]+)"/g)].map(match => match[1]));
    assert.deepEqual([...mailboxes], ['stockrushinfo@gmail.com']);
});

test('terms state the decided prices, limits and store-only purchase', () => {
    const { it, en } = docs.terms;
    for (const fact of ['3,49 €', '29,99 €', 'IVA inclusa', 'App Store o Google Play', 'prova gratuita', 'condivisione in famiglia']) {
        assert.ok(it.includes(fact), fact);
    }
    for (const fact of ['€3.49', '€29.99', 'VAT included', 'App Store or Google Play', 'free trial', 'family sharing']) {
        assert.ok(en.includes(fact), fact);
    }
    for (const text of [it, en]) {
        assert.match(text, /<td>\D+<\/td><td>20<\/td><td>50<\/td>/);
        assert.match(text, /<td>\D+<\/td><td>3<\/td><td>20<\/td>/);
        assert.ok(text.includes('TWR'));
    }
});

test('terms do not promise limits locked for the paid period and explain what the user can do', () => {
    const { it, en } = docs.terms;
    assert.match(it, /Questi sono i limiti di oggi e possono cambiare<\/strong>, anche durante un periodo già\s+pagato/);
    assert.match(en, /These are today's limits and they may change<\/strong>, even during a period you have\s+already paid for/);
    assert.match(it, /puoi disdire il rinnovo dallo store, senza costi/);
    assert.match(en, /you can cancel renewal in the store at no cost/);
    assert.match(it, /recedere gratuitamente entro 30 giorni dall'avviso/);
    assert.match(en, /withdraw free of charge within 30 days of the notice/);
    assert.match(it, /con un messaggio che puoi conservare/);
    assert.match(en, /with a message you can keep/);
    assert.match(it, /se il problema si ripete o se è grave fin da subito/);
    assert.match(en, /the problem keeps coming back, or it is serious from the start/);
    for (const text of [it, en]) {
        assert.doesNotMatch(text, /garantit[io] per tutta la durata|bloccat[io] per il periodo|locked (?:for|during) the paid|guaranteed for the whole/i);
    }
});

test('Pro expiry keeps data, the first 20 instruments and blocked values in the total', () => {
    assert.match(docs.terms.it, /Restano aggiornati i primi 20 titoli/);
    assert.match(docs.terms.it, /«Bloccato»[\s\S]*Restano nel totale del portafoglio/);
    assert.match(docs.terms.en, /Your first 20 instruments, in the order they entered your portfolio, stay updated/);
    assert.match(docs.terms.en, /“Blocked”[\s\S]*They stay in your portfolio total/);
    assert.match(docs.terms.it, /due account StockRush diversi/);
    assert.match(docs.terms.en, /two different StockRush\s+accounts/);
});

test('withdrawal is explained to the user without internal notes for the lawyer', () => {
    for (const text of [docs.terms.it, docs.terms.en]) {
        assert.match(text, /14 (?:giorni|days)/);
        assert.ok(text.includes('answer/15576634'));
        assert.ok(text.includes('CELEX:32011L0083'));
        assert.match(text, /(?:conferma per email con data e ora|confirmation with date and time)/);
        assert.doesNotMatch(text, /per il legale|for the lawyer|professionista|professional must|da verificare|verify before|Funzione di recesso online/i);
    }
});

test('privacy states opt-in Analytics, Crashlytics basis and grouped retention periods', () => {
    const { it, en } = docs.privacy;
    assert.match(it, /solo se dici sì/);
    assert.match(en, /only if you say yes/);
    assert.match(it, /Impostazioni → Privacy → Statistiche d'uso/);
    assert.match(en, /Settings → Privacy → Usage statistics/);
    assert.match(it, /Finché\s+non rispondi, o se dici no, la raccolta resta spenta\. Chiudere la domanda con la ✕ vale come no/);
    assert.match(en, /Until\s+you answer, or if you say no, collection stays off\. Closing the question with the ✕ counts as no/);
    assert.match(it, /cancelliamo i dati di Analytics salvati sul\s+telefono/);
    assert.match(en, /we delete the Analytics data stored on\s+your phone/);
    assert.match(it, /interesse legittimo a offrirti un'app stabile e sicura/);
    assert.match(en, /legitimate interest in offering you a stable and\s+secure app/);
    assert.doesNotMatch(html, /Oggi non esiste una scelta dedicata per Analytics|no dedicated Analytics choice/);
    const retentionIt = it.split('id="privacy-retention"')[1].split('<h2>7.')[0];
    const retentionEn = en.split('id="privacy-retention-en"')[1].split('<h2>7.')[0];
    for (const period of ['24 ore', '30 giorni', '12 mesi', '24 mesi', '90 giorni', '7 giorni']) {
        assert.ok(retentionIt.includes(period), period);
    }
    for (const period of ['24 hours', '30 days', '12 months', '24 months', '90 days', '7 days']) {
        assert.ok(retentionEn.includes(period), period);
    }
    for (const text of [it, en]) {
        for (const provider of ['Heroku', 'MongoDB', 'Firebase', 'Anthropic', 'Twelve Data', 'EODHD', 'OpenFIGI', 'Massive', 'Brandfetch', 'GitHub', 'Gmail', 'FCM']) {
            assert.ok(text.includes(provider), provider);
        }
    }
    assert.match(it, /<strong>un mese<\/strong>/);
    assert.match(en, /<strong>one month<\/strong>/);
});

test('deletion page keeps the subscription warning and the 24-month purchase retention', () => {
    assert.match(docs.deletion.it, /Se hai Pro, disdici anche nello store/);
    assert.match(docs.deletion.en, /If you have Pro, also cancel it in the store/);
    assert.match(docs.deletion.it, /Restano fino a 24 mesi/);
    assert.match(docs.deletion.en, /Kept for up to 24 months/);
    assert.match(docs.deletion.it, /Elimina definitivamente/);
    assert.match(docs.deletion.en, /Delete permanently/);
});

test('static defaults and print rules follow the selected document', () => {
    assert.match(html, /<div id="privacy-en" class="section active" lang="en">/);
    assert.doesNotMatch(html, /<div id="(?!privacy-en)[^"]+" class="section active"/);
    const print = html.split('@media print {')[1].split('        h1 {')[0];
    assert.match(print, /\.js \.section \{ display: none; \}/);
    assert.match(print, /\.js \.section\.active \{ display: block; \}/);
});
