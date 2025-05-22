# Guida allo Sviluppo

## Prerequisiti

- Node.js 16+ (per gli strumenti di sviluppo)
- Git (per il controllo versione)
- Un editor di codice (VS Code consigliato)

## Struttura del Progetto

```
oratorio_frontend/
├── assets/               # File statici
│   ├── images/           # Immagini
│   ├── fonts/            # Font personalizzati
│   └── icons/            # Icone SVG
├── css/                  # Stili CSS
│   ├── components/       # Stili dei componenti
│   ├── pages/            # Stili specifici delle pagine
│   ├── themes/           # Temi e variabili
│   └── style.css         # Stile principale
├── js/                   # Codice JavaScript
│   ├── components/       # Componenti riutilizzabili
│   ├── services/         # Servizi (API, auth, etc.)
│   ├── utils/           # Funzioni di utilità
│   ├── config.js         # Configurazione
│   ├── main.js           # Punto di ingresso
│   └── router.js         # Gestione delle rotte
├── pages/                # Pagine HTML
│   ├── index.html        # Homepage
│   ├── login.html        # Login
│   ├── registrazione.html # Registrazione
│   ├── prodotti/         # Lista prodotti
│   ├── prodotto/         # Dettaglio prodotto
│   ├── carrello/         # Carrello
│   └── admin/            # Area amministrativa
└── index.html            # Entry point
```

## Configurazione Iniziale

1. Clonare il repository
2. Installare le dipendenze:
   ```bash
   npm install
   ```
3. Avviare il server di sviluppo:
   ```bash
   npm run dev
   ```

## Convenzioni di Codice

### HTML
- Usare la sintassi HTML5
- Usare attributi data-* per il JavaScript
- Mantenere l'indentazione coerente (2 spazi)
- Usare nomi descrittivi per classi e ID

### CSS
- Usare la metodologia BEM per i nomi delle classi
- Ordinare le proprietà in modo logico (posizionamento, box model, tipografia, ecc.)
- Usare variabili CSS per colori e dimensioni
- Mantenere una gerarchia chiara nei selettori

### JavaScript
- Usare ES6+ syntax
- Usare async/await invece di promise chain
- Commentare le funzioni complesse
- Usare nomi di variabili e funzioni descrittivi
- Rispettare il pattern Module per organizzare il codice

## Struttura di un Componente

```javascript
// components/ProductCard.js
export default class ProductCard {
  constructor(product) {
    this.product = product;
    this.element = this.create();
  }

  
  create() {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${this.product.image}" alt="${this.product.name}">
      <h3>${this.product.name}</h3>
      <p>${this.product.price}€</p>
      <button class="add-to-cart" data-id="${this.product.id}">
        Aggiungi al carrello
      </button>
    `;
    
    this.addEventListeners(card);
    return card;
  }
  
  addEventListeners(element) {
    element.querySelector('.add-to-cart')
      .addEventListener('click', () => this.addToCart());
  }
  
  addToCart() {
    // Logica per aggiungere al carrello
  }
}
```

## Gestione dello Stato

Usare il pattern Observer per gestire lo stato dell'applicazione:

```javascript
// services/StateManager.js
class StateManager {
  constructor() {
    this.state = {
      cart: [],
      user: null,
      products: []
    };
    this.subscribers = [];
  }
  
  getState() {
    return this.state;
  }
  
  updateState(newState) {
    this.state = { ...this.state, ...newState };
    this.notify();
  }
  
  subscribe(callback) {
    this.subscribers.push(callback);
  }
  
  notify() {
    this.subscribers.forEach(callback => callback(this.state));
  }
}

export const stateManager = new StateManager();
```

## Gestione delle API

Creare un servizio dedicato per le chiamate API:

```javascript
// services/api.js
const API_BASE_URL = 'https://api.orssino.it/v1';

export const api = {
  async get(url, options = {}) {
    return this.request('GET', url, null, options);
  },
  
  async post(url, data, options = {}) {
    return this.request('POST', url, data, options);
  },
  
  async request(method, url, data = null, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };
    
    // Aggiungi token di autenticazione se presente
    const token = localStorage.getItem('authToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const config = {
      method,
      headers,
      ...options
    };
    
    if (data) {
      config.body = JSON.stringify(data);
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, config);
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.message || 'Errore nella richiesta');
      }
      
      return responseData;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
};
```

## Gestione degli Errori

Implementare un gestore globale degli errori:

```javascript
// utils/errorHandler.js
export function handleError(error) {
  console.error('Errore:', error);
  
  // Mostra un messaggio all'utente
  showNotification({
    type: 'error',
    message: error.message || 'Si è verificato un errore',
    duration: 5000
  });
  
  // Reindirizza alla pagina di login se non autorizzato
  if (error.status === 401) {
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  }
}

// Esempio di utilizzo
try {
  const data = await api.get('/some-endpoint');
  // Gestisci i dati
} catch (error) {
  handleError(error);
}
```

## Testing

### Test Unitari
Scrivere test per i componenti critici:

```javascript
// tests/ProductCard.test.js
import ProductCard from '../js/components/ProductCard';

describe('ProductCard', () => {
  let product;
  
  beforeEach(() => {
    product = {
      id: 1,
      name: 'Prodotto Test',
      price: 9.99,
      image: 'test.jpg'
    };
  });
  
  it('dovrebbe creare una card prodotto', () => {
    const card = new ProductCard(product);
    expect(card.element).toBeTruthy();
    expect(card.element.textContent).toContain('Prodotto Test');
    expect(card.element.textContent).toContain('9.99');
  });
});
```

### Test E2E
Usare Cypress per i test end-to-end:

```javascript
// cypress/integration/cart.spec.js
describe('Carrello', () => {
  beforeEach(() => {
    cy.visit('/');
    // Login se necessario
  });
  
  it('dovrebbe aggiungere un prodotto al carrello', () => {
    cy.get('.product-card').first().find('.add-to-cart').click();
    cy.get('.cart-badge').should('contain', '1');
    cy.visit('/carrello');
    cy.get('.cart-item').should('have.length', 1);
  });
});
```

## Performance

### Ottimizzazione delle Immagini
- Usare formati moderni come WebP
- Ridimensionare le immagini alla dimensione massima necessaria
- Usare lazy loading per le immagini fuori dallo schermo

### Bundle JavaScript
- Code splitting per caricare solo il codice necessario
- Minificare e comprimere i file di produzione
- Usare il precaricamento per le rotte critiche

## Deployment

### Build di Produzione
```bash
npm run build
```

Questo comando:
1. Minifica CSS e JavaScript
2. Ottimizza le immagini
3. Genera i file pronti per la produzione nella cartella `dist/`

### Configurazione del Server
Assicurarsi che il server sia configurato per:
1. Servire i file statici compressi
2. Reindirizzare tutte le richieste a `index.html` per il routing lato client
3. Impostare le intestazioni di caching appropriate

## Manutenzione

### Versioning
- Usare Semantic Versioning (MAJOR.MINOR.PATCH)
- Creare branch per le nuove funzionalità
- Usare pull request per la revisione del codice

### Monitoraggio
- Implementare il tracciamento degli errori lato client
- Monitorare le prestazioni delle pagine
- Tracciare le metriche di utilizzo

## Risorse Utili

- [MDN Web Docs](https://developer.mozilla.org/)
- [CSS Tricks](https://css-tricks.com/)
- [JavaScript Info](https://javascript.info/)
- [Web.dev](https://web.dev/)

## Supporto
Per problemi o domande, aprire una issue sul repository del progetto.
