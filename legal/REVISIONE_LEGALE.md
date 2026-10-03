# Revisione di privacy e termini

Aggiornamento: 4 ottobre 2026. Documento interno, non parte dei termini accettati dall'utente.

Il testo in `docs/privacy.html` di questo repository è stato revisionato in italiano e inglese rispetto al codice
di develop: FE `ecb8d76`, BE `559b54a`. Non è un parere professionale né un'attestazione
di conformità. **Resta una bozza non pubblicabile** finché i punti sotto non hanno evidenza
di chiusura. Non sono stati attivati vendite, loghi o consenso e non sono state cambiate
configurazioni remote.

## Esito della revisione indipendente

Claude Opus 5.5, effort high, ha completato una revisione del testo, del codice e delle
fonti ufficiali il 3 ottobre. Il responso è **REVISIONE NECESSARIA**, non un'approvazione
legale. I rilievi testuali verificati sono stati applicati in entrambe le lingue il
4 ottobre; non è stata chiesta una seconda revisione e non si attribuisce al revisore
un'approvazione del testo modificato. Vedi `REVISIONE_OPUS_5_5.md` per rilievi ed esiti.

La parte tecnica della pagina è verificata da 15 controlli documentali. Questi controlli
non attestano conformità giuridica né la pubblicazione del testo sul sito pubblico.

## Correzioni apportate

- Privacy: dati necessari e facoltativi, email di assistenza inviata solo dall'utente,
  importazione AI, hosting e database, telemetria, loghi, copie locali e trasferimenti.
- Conservazione: risposta dell'importazione con scadenza di 24 ore e pulizia asincrona;
  rimozione con l'account; acquisti pseudonimi non dichiarati anonimi; durate del fornitore
  distinte dalla cancellazione StockRush. Nessuna durata inventata per log o backup.
- Diritti privacy: un mese per il riscontro, con eventuale estensione motivata di altri
  due mesi comunicata entro il primo mese, non una generica promessa di 30 giorni.
- Termini: Free distinto da Pro, condizioni e prezzi effettivi mostrati prima dell'acquisto,
  rinnovo distinto da recesso e rimborso, rimedi di conformità, modifiche del servizio,
  uso corretto e tutela del foro del consumatore.
- Metodo finanziario: card/widget sul costo o sulla base del periodo, grafico Home TWR
  ricostruito, grafico del titolo di solo prezzo; limiti su dividendi, cambi storici,
  imposte, commissioni, liquidità e posizioni chiuse.
- Pagina: eliminate le richieste automatiche a Google Fonts; conservati gli indirizzi
  interni `#privacy`, `#deletion`, `#subscriptions` e le versioni inglesi.
  `?lang=it` o `?lang=en` sceglie la lingua; senza parametro si usa l'inglese.
  I selettori IT / ENG conservano il documento aperto, senza cookie o memoria locale.
  Pagina, immagini e controlli documentali sono mantenuti solo qui, non nel frontend.

## Prima di pubblicare la privacy

| Punto | Evidenza attuale | Azione necessaria |
|---|---|---|
| Identità e recapito | Nome legale, indirizzo professionale e dati dell'attività non confermati | Confermare titolare e fornitore, recapito effettivamente utilizzabile, eventuali dati fiscali/registri dovuti. Un ufficio di terzi richiede autorizzazione e ricezione effettiva della corrispondenza; non usare un indirizzo di comodo. |
| Analytics e diagnostica | `firebase.json` abilita raccolta automatica Analytics e Crashlytics; non c'è scelta dedicata Analytics | Valutare separatamente le due finalità e la disciplina degli identificativi sul dispositivo. Per Analytics, predisporre consenso preventivo e revoca oppure documentare un'esenzione realmente applicabile; in alternativa spegnere la raccolta. Una formula nell'informativa non cambia il comportamento dell'SDK. |
| Conservazione | Periodi mancanti per assistenza, Analytics, log e backup; acquisti e lavori di verifica senza TTL generale | Definire necessità, durata/criteri, responsabile della pulizia e procedura verificabile, anche per record pseudonimi, notifiche d'acquisto in quarantena e backup. Per i fornitori acquisire impostazioni effettive e condizioni applicabili, non soltanto i default pubblici. |
| Fornitori e trasferimenti | Heroku, Atlas, Google/Firebase, Apple, Anthropic e Gmail individuati; contratti e regioni di produzione non verificati | Registrare entità contrattuale, servizio, ruolo, regioni, subfornitori e garanzia di trasferimento per ogni flusso. Verificare DPA, eventuale adeguatezza del destinatario, SCC e valutazioni/misure pertinenti; non presumere conformità solo perché il server è in Europa. |
| Accessibilità e dichiarazioni store | Privacy raggiungibile dal Login, non dalle impostazioni dell'utente autenticato | Verificare accessibilità richiesta dagli store e aggiungere un accesso semplice anche dopo il login se necessario. Allineare App Privacy e Data Safety a telemetria, importazione, acquisti e notifiche realmente attivi. |
| Lingua dei link app e store | Il sito usa inglese se `lang` manca; il link app attuale non passa la lingua | Alla pubblicazione collegare `?lang=it` per l'utente italiano, `?lang=en` per quello inglese, senza cambiare il default del sito. Verificare anche i link nelle schede degli store. |

L'importazione AI trasmette il testo del documento, non solo ticker anonimi: verificare
che l'utente riceva questa informazione **prima dell'invio**, soprattutto se il percorso
AI è scelto automaticamente. Il permesso di notifiche o Face ID del sistema operativo
non è un consenso generale ad Analytics.

I loghi rimangono disabilitati: prima di attivarli chiudere anche le verifiche di
`docs/logos/BRANDFETCH.md`, compresi uso nativo, cache, ruoli e trasferimenti.

## Prima di aprire le vendite Pro

1. Completare i punti privacy e l'identità del fornitore; far verificare il testo
   da un professionista sulla forma concreta dell'attività e dell'offerta.
2. Verificare acquisto mensile e annuale negli store italiani: prezzo totale, durata,
   rinnovo, ripristino, accesso dopo disdetta e ricevuta/conferma dei termini su supporto
   durevole. La sola pagina HTML non dimostra una valida informazione precontrattuale.
3. Definire come mantenere i limiti acquistati nel periodo pagato: il backend applica
   la configurazione corrente. Il documento **non attesta** che esista una fotografia
   contrattuale dei limiti per ciascun acquisto. Non ridurre unilateralmente benefici
   pagati senza la disciplina e i rimedi dovuti.
4. Qualificare il servizio digitale, verificare richiesta di attivazione immediata,
   eventuali consensi e loro prova, destinatario del recesso ed effetti economici.
   Non trattare automaticamente ogni acquisto IAP come rinuncia ai 14 giorni.
5. **Recesso online dal 19 giugno 2026:** art. 54-bis del Codice del consumo introdotto
   dal d.lgs. 209/2025. Individuare la funzione richiesta nelle interfacce del contratto,
   chi la fornisce e come sono raccolti conferma e ricevuta con data/ora. Verificare
   il ruolo dello store con prove del flusso italiano; non dichiarare conforme una
   normale email o il solo pulsante di disdetta. Implementare ciò che resta a carico
   del fornitore se lo store non lo copre.
6. Definire comunicazioni su supporto durevole e gestione delle modifiche sostanziali,
   non soltanto aggiornamento di una pagina. Verificare riduzione, risoluzione e rimborsi
   per non conformità e per modifiche pregiudizievoli nei casi previsti dalla legge.

## Evidenze del codice

Percorsi relativi ai rispettivi repository, letti senza modificare le funzioni:

| Repository | File | Fatto rilevante |
|---|---|---|
| FE | `firebase.json`, `src/firebase.js` | Raccolta automatica e filtraggio dei parametri; non equivalgono a consenso o anonimizzazione. |
| FE | `src/services/SupportEmailService.js` | Bozza mailto senza invio automatico, account, token, portafoglio o allegati automatici. |
| FE | `src/constants/legal.ts` | Privacy pubblica collegata; `SUBSCRIPTION_TERMS_URL` ancora null, mantenuto tale. |
| FE | `src/utils/instrumentLogo.ts`, `docs/logos/BRANDFETCH.md` | Richieste dirette su mapping limitati; verifiche per l'attivazione ancora necessarie. |
| BE | `src/main/java/com/stockrush/service/UserService.java` | Cancella risposta idempotente e portafoglio; avvia revoca Apple; cleanup di account/billing. |
| BE | `src/main/java/com/stockrush/service/idempotency/IdempotencyService.java` | Risposta elaborata dell'import conservata con scadenza di 24 ore. |
| BE | `src/main/java/com/stockrush/controller/BillingPurchaseController.java` | Anche verifica e ripristino acquisti usano risposte idempotenti con scadenza di 24 ore; non è il TTL dei record d'acquisto separati. |
| BE | `src/main/java/com/stockrush/service/auth/AppleSignInTokenService.java` | Token Apple conservato nel documento utente, non cifrato per campo; revoca tentata prima della cancellazione, senza bloccarla se fallisce. |
| BE | `src/main/java/com/stockrush/service/billing/FreemiumAccountCleanup.java`, `BillingIndexes.java` nella stessa cartella | Restano associazioni protette e acquisti pseudonimi; nessun TTL generale su catene d'acquisto o lavoro pendente. |
| BE | `docs/adr/ADR-01-portfolio-return-semantics.md` | Metodo diverso per card/widget, grafico Home e grafico dello strumento; limiti del perimetro. |

## Fonti ufficiali consultate

Consultate il 3 ottobre 2026. I collegamenti informano la revisione, ma non provano la
configurazione effettiva dell'app o dei fornitori. Nessuna clausola è stata copiata
da un concorrente.

- [Garante, principi e diritti GDPR](https://garanteprivacy.it/web/guest/home/principi-fondamentali-del-trattamento):
  informativa, basi e tempi del riscontro.
- [Garante, linee guida sui tracciamenti](https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/9677876):
  disciplina dell'accesso al dispositivo e condizioni delle esenzioni.
- [MIMIT, contratti a distanza](https://www.mimit.gov.it/it/mercato-e-consumatori/tutela-del-consumatore/diritti-del-consumatore/vendita-a-distanza):
  informazioni precontrattuali e tutela dei consumatori.
- [Gazzetta Ufficiale, d.lgs. 173/2021](https://www.gazzettaufficiale.it/atto/serie_generale/caricaArticoloDefault/originario?atto.codiceRedazionale=21G00186&atto.dataPubblicazioneGazzetta=2021-11-26&atto.tipoProvvedimento=DECRETO+LEGISLATIVO):
  servizi digitali, conformità, rimedi e modifiche.
- [Gazzetta Ufficiale, d.lgs. 209/2025](https://www.gazzettaufficiale.it/atto/serie_generale/caricaArticoloDefault/originario?atto.codiceRedazionale=26G00002&atto.dataPubblicazioneGazzetta=2026-01-08&atto.tipoProvvedimento=DECRETO+LEGISLATIVO):
  funzione di recesso per i contratti conclusi tramite interfaccia online.
- [Google Play, recesso nello SEE](https://support.google.com/googleplay/answer/15576634?hl=it)
  e [Apple Media Services Italia](https://www.apple.com/legal/internet-services/itunes/it/terms.html):
  non confondere servizi digitali, contenuti digitali, recesso e rimborso dello store.
- [Firebase, privacy e conservazione](https://firebase.google.com/support/privacy)
  e [Analytics, conservazione](https://support.google.com/analytics/answer/7667196?hl=it):
  condizioni del fornitore, distinte dalle impostazioni reali del progetto.
- [Google Analytics, eventi automatici](https://support.google.com/analytics/answer/9234069)
  e [dimensioni predefinite](https://support.google.com/analytics/answer/9268042),
  riverificati il 4 ottobre: dati automatici SDK distinti dai parametri applicativi.
- [Anthropic, conservazione API](https://privacy.claude.com/en/articles/7996866-how-long-do-you-store-my-organization-s-data):
  periodo standard di 30 giorni e relative eccezioni, non cancellazione immediata.
- [Heroku, GDPR](https://devcenter.heroku.com/articles/gdpr),
  [MongoDB, DPA](https://www.mongodb.com/legal/data-processing-agreement),
  [Anthropic, DPA](https://www.anthropic.com/legal/data-processing-addendum)
  e [GitHub, privacy](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement):
  contratti e flussi da verificare per i servizi effettivamente usati.

## Pubblicazione successiva

Questa revisione modifica il sorgente locale del sito `info`; la copia nel frontend è rimossa.
Non è un'autorizzazione a pubblicare la bozza su GitHub Pages.
Quando i punti sono chiusi, aggiornare entrambe le lingue e la data, rimuovere le avvertenze
di bozza con evidenza della chiusura e pubblicare intenzionalmente `docs/privacy.html`.
Verificare l'URL pubblico senza autenticazione su mobile, i tre tab, i collegamenti degli
store, l'inglese predefinito e i selettori di lingua.

Solo dopo pubblicazione e verifica aggiornare l'URL dei termini nell'app, provare il gate
di acquisto e autorizzare separatamente l'apertura delle vendite. Questa revisione non
autorizza nessuno di questi passaggi.
