# Componenti UI e Linee Guida di Stile

## Schema Colori

```json
{
  "primary": "#2c3e50",
  "secondary": "#3498db",
  "success": "#2ecc71",
  "danger": "#e74c3c",
  "warning": "#f39c12",
  "light": "#ecf0f1",
  "dark": "#2c3e50",
  "gray": {
    "100": "#f8f9fa",
    "200": "#e9ecef",
    "300": "dee2e6",
    "400": "#ced4da",
    "500": "#adb5bd",
    "600": "#6c757d",
    "700": "#495057",
    "800": "#343a40",
    "900": "#212529"
  }
}
```

## Tipografia

- **Font Family**: 'Segoe UI', Roboto, -apple-system, sans-serif
- **Scala Tipografica**:
  - h1: 2.5rem (40px)
  - h2: 2rem (32px)
  - h3: 1.75rem (28px)
  - h4: 1.5rem (24px)
  - h5: 1.25rem (20px)
  - p: 1rem (16px)
  - small: 0.875rem (14px)

## Componenti Base

### 1. Pulsanti

```html
<!-- Pulsante Primario -->
<button class="btn btn-primary">Testo</button>

<!-- Pulsante Secondario -->
<button class="btn btn-secondary">Testo</button>

<!-- Pulsante di Successo -->
<button class="btn btn-success">Testo</button>
<!-- Pulsante di Pericolo -->
<button class="btn btn-danger">Testo</button>
<!-- Pulsante Disabilitato -->
<button class="btn" disabled>Testo</button>
```

### 2. Form

```html
<div class="form-group">
  <label for="email">Email</label>
  <input type="email" id="email" class="form-control" placeholder="Inserisci email" required>
  <div class="invalid-feedback">Inserisci un'email valida</div>
</div>

<div class="form-group">
  <label for="password">Password</label>
  <input type="password" id="password" class="form-control" required>
</div>

<select class="form-control">
  <option value="">Seleziona un'opzione</option>
  <option value="1">Opzione 1</option>
</select>
```

### 3. Card Prodotto

```html
<div class="card product-card">
  <div class="product-badge">In Offerta</div>
  <img src="path/to/image.jpg" class="card-img-top" alt="Nome Prodotto">
  <div class="card-body">
    <h5 class="card-title">Nome Prodotto</h5>
    <p class="card-text">Breve descrizione del prodotto...</p>
    <div class="d-flex justify-content-between align-items-center">
      <span class="price">€ 19.99</span>
      <button class="btn btn-primary btn-sm">Aggiungi</button>
    </div>
  </div>
</div>
```

### 4. Navbar

```html
<nav class="navbar">
  <div class="navbar-brand">
    <a href="/">Oratorio</a>
  </div>
  <div class="navbar-nav">
    <a href="/prodotti" class="nav-link">Prodotti</a>
    <a href="/carrello" class="nav-link">
      Carrello <span class="badge">3</span>
    </a>
    <div class="dropdown">
      <button class="btn dropdown-toggle" data-toggle="dropdown">
        Nome Utente
      </button>
      <div class="dropdown-menu">
        <a class="dropdown-item" href="/profilo">Profilo</a>
        <a class="dropdown-item" href="/ordini">I miei ordini</a>
        <div class="dropdown-divider"></div>
        <button class="dropdown-item" id="logout">Esci</button>
      </div>
    </div>
  </div>
</nav>
```

## Pagine

### 1. Pagina di Login

```html
<div class="auth-container">
  <div class="auth-card">
    <h2>Accedi</h2>
    <form id="loginForm">
      <div class="form-group">
        <input type="email" id="email" placeholder="Email" required>
      </div>
      <div class="form-group">
        <input type="password" id="password" placeholder="Password" required>
      </div>
      <button type="submit" class="btn btn-primary btn-block">Accedi</button>
    </form>
    <div class="auth-footer">
      Non hai un account? <a href="/registrazione">Registrati</a>
    </div>
  </div>
</div>
```

### 2. Dettaglio Prodotto

```html
<div class="product-detail">
  <div class="product-gallery">
    <img src="path/to/main.jpg" alt="Prodotto" class="main-image">
    <div class="thumbnails">
      <img src="path/to/thumb1.jpg" alt="Miniatura 1">
      <img src="path/to/thumb2.jpg" alt="Miniatura 2">
    </div>
  </div>
  <div class="product-info">
    <h1>Nome Prodotto</h1>
    <div class="price">€ 29.99</div>
    <div class="description">
      <p>Descrizione dettagliata del prodotto...</p>
    </div>
    <div class="add-to-cart">
      <div class="quantity-selector">
        <button class="btn btn-sm">-</button>
        <input type="number" value="1" min="1">
        <button class="btn btn-sm">+</button>
      </div>
      <button class="btn btn-primary">Aggiungi al carrello</button>
    </div>
  </div>
</div>
```

## Responsive Design

- **Mobile First**: Tutti gli stili partono dalla visualizzazione mobile
- **Breakpoints**:
  - `sm`: 576px
  - `md`: 768px
  - `lg`: 992px
  - `xl`: 1200px
  - `xxl`: 1400px

## Animazioni

```css
/* Transizioni base */
.btn {
  transition: all 0.2s ease-in-out;
}

/* Animazione al caricamento */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.product-card {
  animation: fadeIn 0.3s ease-out forwards;
}
```

## Variabili CSS

```css
:root {
  --primary: #2c3e50;
  --secondary: #3498db;
  --success: #2ecc71;
  --danger: #e74c3c;
  --warning: #f39c12;
  --light: #ecf0f1;
  --dark: #2c3e50;
  
  --border-radius: 4px;
  --box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  --transition: all 0.2s ease;
}
```
