

# Specifiche Progetto: Gestionale Oratorio
Panoramica
Sviluppa un'applicazione web completa per la gestione di un oratorio, con autenticazione differenziata tra utenti amministratori e utenti standard. L'applicazione deve essere sviluppata utilizzando HTML, CSS e JavaScript puro, senza l'utilizzo di framework esterni.

Struttura del Progetto
- index.html - Pagina principale con form di login
- registrazione.html - Pagina di registrazione nuovi utenti
- admin/nuovo-prodotto.html - Area amministrativa per l'aggiunta di prodotti
- carrello.html - Area utente per la gestione del carrello
- admin/gestione-ordini.html - Pannello di controllo amministrativo per la gestione degli ordini
- css/style.css - File di stile principale
- js/ - Cartella contenente tutti i file JavaScript
- auth.js - Gestione autenticazione
- products.js - Gestione prodotti
- cart.js - Gestione carrello
- admin.js - Funzionalità amministrative
Funzionalità Richieste
1. Autenticazione
- Login: Form di accesso per utenti e amministratori
- Registrazione: Creazione di nuovi account utente
- Logout: Pulsante per terminare la sessione
2. Area Pubblica
- Pagina di benvenuto con descrizione del servizio
- Form di login centrale
- Link alla pagina di registrazione
3. Area Utente
- Visualizzazione catalogo prodotti
- Aggiunta/rimozione prodotti al carrello
- Visualizzazione carrello corrente
- Invio ordine
4. Area Amministrativa
- Aggiunta nuovi prodotti (nome, descrizione, prezzo, quantità)
- Visualizzazione e gestione di tutti gli ordini
- Modifica stato ordini (in attesa, confermato, annullato)
- Statistiche ordini
5. Requisiti Tecnici
- Design responsive per dispositivi mobile e desktop
- Validazione lato client dei form
- Gestione dello stato dell'applicazione con localStorage
- Feedback visivi per le azioni dell'utente
6. Sicurezza
- Hash delle password (simulato lato client)
- Protezione delle rotte admin
- Validazione input utente
- Gestione della sessione utente
7. Extra
- Notifiche per azioni importanti
- Conferme per operazioni critiche
- Pulsante "Torna su" nelle pagine lunghe
- Caricamento animato durante le operazioni asincrone
#### Istruzioni di Sviluppo
- Inizia con la struttura base HTML
- Aggiungi gli stili CSS
- Implementa la logica JavaScript
- Testa tutte le funzionalità
- Ottimizza le prestazioni
#### Note Aggiuntive
Mantieni il codice ben organizzato e commentato
Utilizza nomi significativi per variabili e funzioni
Implementa una gestione degli errori appropriata
Assicurati che l'interfaccia sia intuitiva e accessibile
