/**
 * Gestione della Dashboard Utente
 */

document.addEventListener('DOMContentLoaded', () => {
    // Verifica autenticazione
    if (!window.App.state.isAuthenticated) {
        window.location.href = '/index.html';
        return;
    }

    // Inizializza la dashboard
    initDashboard();
    
    // Carica i dati utente e gli ordini
    loadUserData();
    loadRecentOrders();
    updateCartBadge();
    
    // Gestione tema
    setupThemeToggle();
    
    // Gestione menu utente
    setupUserMenu();
});

/**
 * Inizializza la dashboard
 */
function initDashboard() {
    // Aggiorna il nome utente nella dashboard
    const userNameElements = document.querySelectorAll('#userName, #welcomeName');
    if (window.App.state.user?.name) {
        userNameElements.forEach(el => {
            el.textContent = window.App.state.user.name;
        });
    }
    
    // Nascondi elementi admin se l'utente non è admin
    if (!window.App.state.isAdmin) {
        document.querySelectorAll('[data-admin]').forEach(el => el.style.display = 'none');
    }
}

/**
 * Carica i dati utente
 */
async function loadUserData() {
    try {
        const response = await fetch('/api/utenti/me', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Errore nel caricamento dei dati utente');
        }
        
        const userData = await response.json();
        updateUserStats(userData.stats);
    } catch (error) {
        console.error('Errore nel caricamento dei dati utente:', error);
        window.App.showAlert('error', 'Impossibile caricare i tuoi dati. Riprova più tardi.');
    }
}

/**
 * Aggiorna le statistiche utente
 * @param {Object} stats Statistiche utente
 */
function updateUserStats(stats) {
    if (!stats) return;
    
    if (stats.ordiniAttivi !== undefined) {
        document.getElementById('activeOrders').textContent = stats.ordiniAttivi;
    }
    
    if (stats.ordiniCompletati !== undefined) {
        document.getElementById('completedOrders').textContent = stats.ordiniCompletati;
    }
    
    if (stats.carrello !== undefined) {
        document.getElementById('cartItems').textContent = stats.carrello;
    }
}

/**
 * Carica gli ordini recenti
 */
async function loadRecentOrders() {
    try {
        const response = await fetch('/api/ordini/recenti', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Errore nel caricamento degli ordini');
        }
        
        const ordini = await response.json();
        renderRecentOrders(ordini);
    } catch (error) {
        console.error('Errore nel caricamento degli ordini:', error);
        // Non mostrare l'errore all'utente se non ci sono ordini
    }
}

/**
 * Renderizza la tabella degli ordini recenti
 * @param {Array} ordini Lista degli ordini
 */
function renderRecentOrders(ordini) {
    const tbody = document.querySelector('#recentOrdersTable tbody');
    if (!tbody) return;
    
    if (!ordini || ordini.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center">
                    <p>Nessun ordine recente</p>
                    <a href="catalogo.html" class="btn btn-primary mt-2">Inizia a fare acquisti</a>
                </td>
            </tr>`;
        return;
    }
    
    tbody.innerHTML = ordini.map(ordine => `
        <tr>
            <td>#${ordine.id}</td>
            <td>${new Date(ordine.data).toLocaleDateString()}</td>
            <td><span class="badge ${getStatusBadgeClass(ordine.stato)}">${ordine.stato}</span></td>
            <td>${ordine.totale.toFixed(2)} €</td>
            <td>
                <a href="ordine.html?id=${ordine.id}" class="btn btn-sm btn-outline">
                    Dettagli
                </a>
            </td>
        </tr>
    `).join('');
}

/**
 * Restituisce la classe CSS per lo stato dell'ordine
 * @param {string} stato Stato dell'ordine
 * @returns {string} Classe CSS
 */
function getStatusBadgeClass(stato) {
    const statusClasses = {
        'completato': 'bg-success',
        'in elaborazione': 'bg-warning',
        'spedito': 'bg-info',
        'annullato': 'bg-danger',
        'in attesa': 'bg-secondary'
    };
    
    return statusClasses[stato.toLowerCase()] || 'bg-secondary';
}

/**
 * Aggiorna il badge del carrello
 */
function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    const badge = document.getElementById('cartBadge');
    if (badge) {
        badge.textContent = totalItems;
        badge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
    
    // Aggiorna anche il contatore nella dashboard
    const cartItems = document.getElementById('cartItems');
    if (cartItems) {
        cartItems.textContent = totalItems;
    }
}

/**
 * Configura il toggle del tema
 */
function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    
    // Imposta lo stato iniziale
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Aggiorna l'icona
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    });
    
    // Imposta l'icona corretta all'avvio
    const icon = themeToggle.querySelector('i');
    if (icon) {
        icon.className = currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

/**
 * Configura il menu a tendina utente
 */
function setupUserMenu() {
    const userMenuButton = document.getElementById('userMenuButton');
    const userDropdown = document.getElementById('userDropdown');
    
    if (!userMenuButton || !userDropdown) return;
    
    // Mostra/nascondi il menu al click
    userMenuButton.addEventListener('click', (e) => {
        e.stopPropagation();
        userDropdown.classList.toggle('show');
    });
    
    // Chiudi il menu al click fuori
    document.addEventListener('click', (e) => {
        if (!userMenuButton.contains(e.target) && !userDropdown.contains(e.target)) {
            userDropdown.classList.remove('show');
        }
    });
    
    // Gestisci il logout
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.App.logout();
        });
    }
}

// Esponi le funzioni necessarie
window.Dashboard = {
    updateCartBadge
};
