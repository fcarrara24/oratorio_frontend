# Documentazione Frontend Oratorio

## 📋 Indice
1. [Panoramica](#-panoramica)
2. [Struttura del Progetto](#-struttura-del-progetto)
3. [Configurazione](#-configurazione)
4. [Componenti Principali](#-componenti-principali)
5. [Gestione dello Stato](#-gestione-dello-stato)
6. [API Integration](#-api-integration)
7. [Stili e Design System](#-stili-e-design-system)
8. [Guida allo Sviluppo](#-guida-allo-sviluppo)
9. [Deployment](#-deployment)
10. [Troubleshooting](#-troubleshooting)

---

## 🌟 Panoramica
Applicazione web per la gestione dell'oratorio con:
- Autenticazione utenti (login/registrazione)
- Catalogo prodotti
- Carrello
- Dashboard amministrativa
- Gestione ordini

**Tecnologie utilizzate:**
- HTML5, CSS3, JavaScript puro (ES6+)
- CSS con variabili e metodologia BEM
- API RESTful

---

## 📁 Struttura del Progetto

```
oratorio_frontend/
├── assets/               # Immagini, icone, font
├── css/
│   └── style.css         # Stili globali
├── js/
│   ├── main.js          # Configurazione e logica principale
│   └── pages/            # Logica specifica per ogni pagina
│       └── register.js   # Esempio: logica registrazione
├── pages/                # Pagine HTML aggiuntive
├── index.html            # Pagina di login
├── registrazione.html    # Pagina di registrazione
└── README.md            # Questo file
```

---

## ⚙️ Configurazione

### Variabili d'ambiente
Il file `js/main.js` contiene le configurazioni principali:

```javascript
const CONFIG = {
    API_BASE_URL: 'http://localhost:3000/api',
    TOKEN_KEY: 'authToken',
    USER_KEY: 'userData',
    THEME_KEY: 'appTheme'
};
```

### Avvio del progetto
```bash
# Sviluppo locale
npx serve .
# Oppure con Live Server di VSCode
```

---

## 🧩 Componenti Principali

### 1. Autenticazione
- **File correlati:** `index.html`, `registrazione.html`, `js/main.js`
- **Funzionalità:**
  - Login/logout
  - Registrazione utente
  - Gestione token JWT

### 2. Gestione Prodotti
- **File correlati:** `pages/catalogo.html` (da creare)
- **Funzionalità:**
  - Visualizzazione griglia prodotti
  - Filtri e ricerca
  - Dettaglio prodotto

### 3. Carrello
- **File correlati:** `pages/carrello.html` (da creare)
- **Funzionalità:**
  - Aggiunta/rimozione prodotti
  - Calcolo totale
  - Checkout

---

## 🧠 Gestione dello Stato

Lo stato dell'applicazione è gestito in `js/main.js`:

```javascript
const state = {
    user: null,              // Dati utente corrente
    isAuthenticated: false,  // Stato autenticazione
    isAdmin: false,         // Ruolo utente
    isLoading: false,       // Stato caricamento
    theme: 'light'          // Tema attivo
};
```

---

## 🔌 API Integration

### Endpoint principali
Vedi il file completo in `prompting/metodologia/api_endpoints.md`

**Esempio chiamata login:**
```javascript
const response = await fetch(`${CONFIG.API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
});
```

---

## 🎨 Stili e Design System

### Variabili CSS
```css
:root {
    --primary: #2c3e50;
    --secondary: #3498db;
    --success: #2ecc71;
    --danger: #e74c3c;
    --spacing-sm: 8px;
    --spacing-md: 16px;
    --border-radius: 4px;
}
```

### Breakpoint
- Mobile: < 576px
- Tablet: ≥ 576px
- Desktop: ≥ 992px

---

## 🛠️ Guida allo Sviluppo

### Convenzioni di codice
- **JavaScript**: camelCase per variabili e funzioni
- **CSS**: BEM (Block__Element--Modifier)
- **Commit**: Conventional Commits

### Aggiungere una nuova pagina
1. Crea il file HTML in `pages/`
2. Aggiungi il relativo JS in `js/pages/`
3. Collega i file nell'HTML:
```html
<script type="module" src="/js/main.js"></script>
<script type="module" src="/js/pages/tuapagina.js"></script>
```

---

## 🚀 Deployment

### Produzione
1. Esegui il build (se necessario)
2. Carica i file su un server web (es: Apache, Nginx)

### Variabili d'ambiente
Assicurati di aggiornare `API_BASE_URL` in produzione.

---

## 🐛 Troubleshooting

### Problemi comuni
1. **API non raggiungibili**
   - Verifica che il backend sia in esecuzione
   - Controlla i log del server

2. **Errori di autenticazione**
   - Verifica che il token JWT sia valido
   - Controlla i permessi dell'utente

---

## 📝 Note aggiuntive
- Il progetto segue i principi del mobile-first design
- Tutte le chiamate API includono gestione errori
- I componenti sono progettati per essere riutilizzabili

---

📅 **Ultimo aggiornamento**: 22 Maggio 2025  
👤 **Mantenuto da**: [Il tuo Nome]
