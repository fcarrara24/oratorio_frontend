/**
 * Gestione della pagina Catalogo
 */

document.addEventListener('DOMContentLoaded', () => {
    // Verifica autenticazione
    if (!window.App.state.isAuthenticated) {
        window.location.href = '/index.html';
        return;
    }

    // Inizializza la pagina catalogo
    initCatalogPage();
    
    // Carica i prodotti
    loadProducts();
    
    // Carica le categorie
    loadCategories();
    
    // Aggiorna il badge del carrello
    updateCartBadge();
    
    // Imposta il nome utente
    updateUserName();
    
    // Gestione eventi
    setupEventListeners();
});

/**
 * Inizializza la pagina catalogo
 */
function initCatalogPage() {
    // Inizializza gli slider del prezzo (se necessario)
    initPriceSlider();
}

/**
 * Carica i prodotti dal server
 */
async function loadProducts(filters = {}) {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    // Mostra lo spinner di caricamento
    productsGrid.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner"></div>
            <p>Caricamento prodotti...</p>
        </div>`;
    
    try {
        // Costruisci l'URL con i filtri
        const url = new URL('/api/prodotti', window.location.origin);
        
        // Aggiungi i filtri ai parametri di ricerca
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== null && value !== '') {
                url.searchParams.append(key, value);
            }
        });
        
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Errore nel caricamento dei prodotti');
        }
        
        const products = await response.json();
        renderProducts(products);
    } catch (error) {
        console.error('Errore nel caricamento dei prodotti:', error);
        productsGrid.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>Impossibile caricare i prodotti. Riprova più tardi.</p>
                <button class="btn btn-primary" onclick="window.location.reload()">Ricarica</button>
            </div>`;
    }
}

/**
 * Renderizza i prodotti nella griglia
 * @param {Array} products Array di prodotti
 */
function renderProducts(products) {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    if (!products || products.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>Nessun prodotto trovato</h3>
                <p>Prova a modificare i filtri di ricerca</p>
            </div>`;
        return;
    }
    
    // Crea la griglia dei prodotti
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card" data-id="${product.id}">
            ${product.inOfferta ? '<span class="product-badge">Offerta</span>' : ''}
            <div class="product-image">
                <img src="${product.immagine || '../img/placeholder-product.jpg'}" alt="${product.nome}">
            </div>
            <div class="product-details">
                <h3 class="product-title">${product.nome}</h3>
                <div class="product-price">
                    ${product.prezzoScontato ? `
                        <span class="original-price">€${product.prezzo.toFixed(2)}</span>
                        <span class="discounted-price">€${product.prezzoScontato.toFixed(2)}</span>
                    ` : `
                        <span class="current-price">€${product.prezzo.toFixed(2)}</span>
                    `}
                </div>
                <div class="product-stock ${product.quantita > 0 ? 'in-stock' : 'out-of-stock'}">
                    ${product.quantita > 0 ? 'Disponibile' : 'Esaurito'}
                </div>
                <button class="btn btn-primary btn-block add-to-cart" 
                        ${product.quantita === 0 ? 'disabled' : ''}
                        data-product-id="${product.id}">
                    <i class="fas fa-cart-plus"></i>
                    ${product.quantita > 0 ? 'Aggiungi al carrello' : 'Non disponibile'}
                </button>
            </div>
        </div>
    `).join('');
    
    // Aggiungi gli event listener ai pulsanti "Aggiungi al carrello"
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

/**
 * Carica le categorie dal server
 */
async function loadCategories() {
    const categoryFilters = document.getElementById('categoryFilters');
    if (!categoryFilters) return;
    
    try {
        const response = await fetch('/api/categorie', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Errore nel caricamento delle categorie');
        }
        
        const categories = await response.json();
        renderCategoryFilters(categories);
    } catch (error) {
        console.error('Errore nel caricamento delle categorie:', error);
        categoryFilters.innerHTML = '<p>Impossibile caricare le categorie</p>';
    }
}

/**
 * Renderizza i filtri delle categorie
 * @param {Array} categories Array di categorie
 */
function renderCategoryFilters(categories) {
    const categoryFilters = document.getElementById('categoryFilters');
    if (!categoryFilters) return;
    
    if (!categories || categories.length === 0) {
        categoryFilters.innerHTML = '<p>Nessuna categoria disponibile</p>';
        return;
    }
    
    categoryFilters.innerHTML = categories.map(category => `
        <div class="form-check">
            <input type="checkbox" id="cat-${category.id}" 
                   class="form-check-input category-filter" 
                   value="${category.id}">
            <label for="cat-${category.id}" class="form-check-label">
                ${category.nome}
            </label>
        </div>
    `).join('');
}

/**
 * Inizializza lo slider del prezzo
 */
function initPriceSlider() {
    // Implementazione dello slider del prezzo
    // Può utilizzare una libreria come noUiSlider o implementazione personalizzata
    console.log('Inizializzazione slider prezzo');
    // TODO: Implementare la logica dello slider
}

/**
 * Aggiunge un prodotto al carrello
 * @param {Event} event Evento del click
 */
async function addToCart(event) {
    const button = event.currentTarget;
    const productId = button.dataset.productId;
    
    if (!productId) return;
    
    // Disabilita il pulsante durante l'operazione
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Aggiungo...';
    
    try {
        const response = await fetch('/api/carrello/aggiungi', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify({
                prodotto_id: parseInt(productId),
                quantita: 1
            })
        });
        
        if (!response.ok) {
            throw new Error('Errore nell\'aggiunta al carrello');
        }
        
        // Aggiorna il badge del carrello
        updateCartBadge();
        
        // Mostra notifica di successo
        window.App.showAlert('success', 'Prodotto aggiunto al carrello!');
        
        // Reimposta il pulsante
        button.innerHTML = '<i class="fas fa-check"></i> Aggiunto';
        
        // Dopo 2 secondi, ripristina il testo originale
        setTimeout(() => {
            button.innerHTML = '<i class="fas fa-cart-plus"></i> Aggiungi al carrello';
            button.disabled = false;
        }, 2000);
        
    } catch (error) {
        console.error('Errore nell\'aggiunta al carrello:', error);
        window.App.showAlert('error', 'Impossibile aggiungere il prodotto al carrello');
        
        // Reimposta il pulsante in caso di errore
        button.innerHTML = '<i class="fas fa-cart-plus"></i> Riprova';
        button.disabled = false;
    }
}

/**
 * Aggiorna il badge del carrello
 */
function updateCartBadge() {
    const cartBadge = document.getElementById('cartBadge');
    if (!cartBadge) return;
    
    // Recupera il carrello dal localStorage o dal server
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const totalItems = cart.reduce((total, item) => total + item.quantita, 0);
    
    cartBadge.textContent = totalItems;
    cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
}

/**
 * Imposta il nome utente nella navbar
 */
function updateUserName() {
    const userNameElements = document.querySelectorAll('#userName');
    if (window.App.state.user?.name) {
        userNameElements.forEach(el => {
            el.textContent = window.App.state.user.name;
        });
    }
}

/**
 * Imposta gli event listener
 */
function setupEventListeners() {
    // Filtri
    document.querySelectorAll('.category-filter').forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });
    
    // Ricerca
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(applyFilters, 500);
        });
    }
    
    // Ordinamento
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', applyFilters);
    }
    
    // Pulsante azzera filtri
    const clearFiltersBtn = document.getElementById('clearFilters');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', resetFilters);
    }
    
    // Logout
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.App.logout();
        });
    }
}

/**
 * Applica i filtri di ricerca
 */
function applyFilters() {
    const filters = {
        search: document.getElementById('searchInput')?.value || '',
        sort: document.getElementById('sortSelect')?.value || 'name_asc',
        categories: Array.from(document.querySelectorAll('.category-filter:checked'))
            .map(checkbox => checkbox.value)
            .join(','),
        minPrice: document.getElementById('minPrice')?.value || '',
        maxPrice: document.getElementById('maxPrice')?.value || '',
        inStockOnly: document.getElementById('inStockOnly')?.checked || false
    };
    
    // Carica i prodotti con i filtri applicati
    loadProducts(filters);
}

/**
 * Reimposta tutti i filtri
 */
function resetFilters() {
    // Reimposta i campi di input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = '';
    
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) sortSelect.value = 'name_asc';
    
    document.querySelectorAll('.category-filter').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    const minPrice = document.getElementById('minPrice');
    const maxPrice = document.getElementById('maxPrice');
    if (minPrice) minPrice.value = '';
    if (maxPrice) maxPrice.value = '';
    
    const inStockOnly = document.getElementById('inStockOnly');
    if (inStockOnly) inStockOnly.checked = false;
    
    // Reimposta lo slider del prezzo se presente
    // TODO: Reimpostare lo slider se si utilizza una libreria
    
    // Ricarica i prodotti senza filtri
    loadProducts({});
}

// Esponi le funzioni necessarie
document.addToCart = addToCart;
document.updateCartBadge = updateCartBadge;
