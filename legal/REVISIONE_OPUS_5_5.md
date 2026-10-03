# Revisione indipendente di privacy e termini

Revisore: Claude Opus 5.5, effort high, eseguito dal terminale il 3 ottobre 2026.
Sessione: `5d97c7d3-af67-4a77-84ab-3a3073fe61cb`. Esecuzione conclusa, nessun errore
o rifiuto di accesso dichiarato. Esito: **REVISIONE NECESSARIA**.

Questa è una sintesi dei rilievi e della loro verifica, non la trascrizione integrale
dell'output né un parere di un avvocato. Il revisore ha consultato sorgente locale,
codice FE/BE e fonti pubbliche. Non ha approvato automaticamente le modifiche successive.

## Rilievi ed esito

| Rilievo | Valutazione e azione del 4 ottobre |
|---|---|
| R1. Pagina pubblica precedente alla bozza locale | La nuova bozza non è pubblicata. Non si usa il risultato di una lettura automatica per certificare ciò che il browser pubblico renderizza. Pubblicazione intenzionalmente sospesa finché mancano dati e verifiche; l'app non deve collegare i termini come definitivi. |
| R2. Dati automatici Analytics non sufficientemente descritti | Fondato. Separate raccolta automatica SDK e parametri applicativi: identificativi, dispositivo, uso, area approssimativa da IP, integrazioni di acquisti e notifiche. Nessuna promessa di anonimato o di assenza di localizzazione approssimativa. |
| R3. Cancellazione descritta come scadenza di ogni record | Fondato. Alcuni record pseudonimi non hanno un TTL generale. La procedura EN e la formulazione IT rinviano ai criteri reali senza promettere scadenze inesistenti. |
| R4. Ripristino dopo cancellazione ambiguo | Fondato. Il codice protetto riguarda l'identità del provider di accesso, non il solo account store. Può consentire un ripristino verificato su un nuovo account con la stessa identità; il portafoglio eliminato non viene ricreato. |
| R5. Token Apple e revoca non dichiarati con precisione | Fondato. Esplicitati token server, rimozione con l'account e revoca tentata, non garantita. La descrizione degli archivi sicuri è limitata al dispositivo. Il testo non modifica il meccanismo di revoca né introduce cifratura server. |
| R6. Utente italiano indirizzato al default inglese | Il default EN è una richiesta di prodotto e rimane. Prima di pubblicare, i link app/store devono passare la lingua appropriata. Il link attuale e il gate dei termini non sono cambiati mentre la bozza non è pubblica. |
| R7. Limiti finanziari incompleti | Fondato. Distinti dividendi esclusi e ignoti, ultimo cambio disponibile anche datato/di età ignota, reinvestimento del benchmark ad accumulazione. Non si promette ricostruzione di flussi, vendite, tasse e commissioni. |
| R8. Scadenza 24 ore attribuita solo agli import | Fondato. Inclusi i risultati di verifica/ripristino acquisti. Distinte scadenza applicativa, rimozione asincrona e conservazione dei record d'acquisto separati. |
| R9. Analytics usato anche come nome della schermata | Fondato. Specificato quando si intende la sezione Analisi dell'app e quando il servizio Firebase Analytics. La richiesta logo rivela il titolo consultato, non una quantità o una prova di possesso. |
| R10. Modalità d'inserimento omessa e commenti FE non più veri | Fondato. Privacy descrive la scelta quantità/importo, non il dato finanziario. Commenti FE aggiornati: i test bloccano i domini, non confrontano più una copia locale del testo pubblico. |
| R11. Gerarchia, default statico e stampa bilingue | Applicato. Privacy EN attiva nel markup, titoli numerati h2 in entrambe le lingue, stampa del documento selezionato, immagini della procedura anche IT, placeholder del titolare corretto in EN. Senza JavaScript tutti i documenti restano leggibili; la selezione tramite parametro richiede JavaScript. |

## Ciò che rimane da chiudere

Identità e recapito reali del titolare/fornitore; durate e procedure di conservazione;
ruoli, regioni e accordi dei fornitori; scelta e base della telemetria; accessibilità
dell'informativa; protezione dei benefici pagati e comunicazioni su supporto durevole;
qualificazione del servizio, recesso e flussi effettivi degli store italiani.

Il dettaglio operativo e le fonti sono in `REVISIONE_LEGALE.md`. Una revisione AI
non sostituisce la verifica professionale né trasforma questi punti in formalità.
