/**
 * Dashboard Amministrativa - Logica
 */

document.addEventListener('DOMContentLoaded', () => {
    // Verifica permessi amministrativi
    if (!window.App.state.isAuthenticated || !window.App.state.isAdmin) {
        window.location.href = '/index.html';
        return;
    }

    // Inizializza la dashboard
    initAdminDashboard();
    
    // Carica i dati
    loadDashboardData();
    
    // Imposta i gestori eventi
    setupEventHandlers();
});

/**
 * Inizializza la dashboard amministrativa
 */
function initAdminDashboard() {
    // Aggiorna il nome utente
    const userNameElements = document.querySelectorAll('#userName');
    if (window.App.state.user?.name) {
        userNameElements.forEach(el => {
            el.textContent = window.App.state.user.name;
        });
    }
    
    // Imposta la data di aggiornamento
    document.getElementById('lastUpdate').textContent = new Date().toLocaleString('it-IT');
}

/**
 * Carica i dati della dashboard
 */
async function loadDashboardData() {
    try {
        // Mostra indicatori di caricamento
        showLoadingStates();
        
        // Carica le statistiche
        await loadStats();
        
        // Carica i grafici
        await loadCharts();
        
        // Carica gli ultimi ordini
        await loadRecentOrders();
        
        // Carica i prodotti più venduti
        await loadTopProducts();
        
    } catch (error) {
        console.error('Errore nel caricamento della dashboard:', error);
        window.App.showAlert('error', 'Impossibile caricare i dati della dashboard');
    }
}

/**
 * Mostra gli stati di caricamento
 */
function showLoadingStates() {
    // Mostra spinner nelle tabelle
    document.querySelectorAll('#recentOrdersTable tbody, #topProductsTable tbody').forEach(tbody => {
        tbody.innerHTML = `
            <tr>
                <td colspan="${tbody.closest('table').querySelectorAll('th').length}" class="text-center py-4">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Caricamento...</span>
                    </div>
                </td>
            </tr>`;
    });
}

/**
 * Carica le statistiche della dashboard
 */
async function loadStats() {
    try {
        const response = await fetch('/api/admin/stats', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Errore nel caricamento delle statistiche');
        }
        
        const stats = await response.json();
        
        // Aggiorna le card delle statistiche
        if (stats.todayOrders !== undefined) {
            document.getElementById('todayOrders').textContent = stats.todayOrders.count;
            updateChangeIndicator('todayOrdersChange', stats.todayOrders.change);
        }
        
        if (stats.todayRevenue !== undefined) {
            document.getElementById('todayRevenue').textContent = `€${stats.todayRevenue.amount.toFixed(2)}`;
            updateChangeIndicator('revenueChange', stats.todayRevenue.change);
        }
        
        if (stats.newUsers !== undefined) {
            document.getElementById('newUsers').textContent = stats.newUsers.count;
            updateChangeIndicator('usersChange', stats.newUsers.change);
        }
        
        if (stats.products !== undefined) {
            document.getElementById('totalProducts').textContent = stats.products.total;
            document.getElementById('lowStockCount').textContent = stats.products.lowStock;
        }
        
        if (stats.pendingOrders !== undefined) {
            const badge = document.getElementById('pendingOrdersBadge');
            if (badge) {
                badge.textContent = stats.pendingOrders;
                badge.style.display = stats.pendingOrders > 0 ? 'flex' : 'none';
            }
        }
        
    } catch (error) {
        console.error('Errore nel caricamento delle statistiche:', error);
        throw error;
    }
}

/**
 * Aggiorna l'indicatore di variazione
 * @param {string} elementId ID dell'elemento
 * @param {number} change Variazione percentuale
 */
function updateChangeIndicator(elementId, change) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const container = element.closest('.stat-change');
    if (!container) return;
    
    element.textContent = `${Math.abs(change)}%`;
    
    // Rimuovi le classi esistenti
    container.classList.remove('positive', 'negative');
    
    // Aggiungi la classe appropriata
    if (change > 0) {
        container.classList.add('positive');
        container.querySelector('i').className = 'fas fa-arrow-up';
    } else if (change < 0) {
        container.classList.add('negative');
        container.querySelector('i').className = 'fas fa-arrow-down';
    } else {
        container.classList.add('neutral');
        container.querySelector('i').className = 'fas fa-equals';
    }
}

/**
 * Carica i grafici
 */
async function loadCharts() {
    try {
        // Carica i dati per i grafici
        const [ordersData, statusData] = await Promise.all([
            fetch('/api/admin/charts/orders?days=30').then(res => res.json()),
            fetch('/api/admin/charts/status').then(res => res.json())
        ]);
        
        // Inizializza i grafici
        initOrdersChart(ordersData);
        initStatusChart(statusData);
        
    } catch (error) {
        console.error('Errore nel caricamento dei grafici:', error);
        throw error;
    }
}

/**
 * Inizializza il grafico degli ordini
 * @param {Object} data Dati degli ordini
 */
function initOrdersChart(data) {
    const ctx = document.getElementById('ordersChart');
    if (!ctx) return;
    
    // Se esiste già un'istanza del grafico, distruggila
    if (window.ordersChart) {
        window.ordersChart.destroy();
    }
    
    window.ordersChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels || [],
            datasets: [{
                label: 'Ordini',
                data: data.values || [],
                borderColor: 'rgba(52, 152, 219, 1)',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                borderWidth: 2,
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });
}

/**
 * Inizializza il grafico a torta degli stati degli ordini
 * @param {Object} data Dati degli stati
 */
function initStatusChart(data) {
    const ctx = document.getElementById('ordersStatusChart');
    if (!ctx) return;
    
    // Se esiste già un'istanza del grafico, distruggila
    if (window.statusChart) {
        window.statusChart.destroy();
    }
    
    // Colori per i diversi stati
    const backgroundColors = [
        'rgba(52, 152, 219, 0.8)',  // In attesa
        'rgba(241, 196, 15, 0.8)',  // In elaborazione
        'rgba(46, 204, 113, 0.8)',  // Completato
        'rgba(231, 76, 60, 0.8)',   // Annullato
        'rgba(155, 89, 182, 0.8)'   // Spedito
    ];
    
    window.statusChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: data.labels || [],
            datasets: [{
                data: data.values || [],
                backgroundColor: backgroundColors,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            },
            cutout: '70%'
        }
    });
}

/**
 * Carica gli ultimi ordini
 */
async function loadRecentOrders() {
    try {
        const response = await fetch('/api/admin/orders/recent', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Errore nel caricamento degli ordini recenti');
        }
        
        const orders = await response.json();
        renderRecentOrders(orders);
        
    } catch (error) {
        console.error('Errore nel caricamento degli ordini recenti:', error);
        throw error;
    }
}

/**
 * Renderizza la tabella degli ordini recenti
 * @param {Array} orders Lista degli ordini
 */
function renderRecentOrders(orders) {
    const tbody = document.querySelector('#recentOrdersTable tbody');
    if (!tbody) return;
    
    if (!orders || orders.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-4">
                    <p>Nessun ordine trovato</p>
                </td>
            </tr>`;
        return;
    }
    
    tbody.innerHTML = orders.map(order => `
        <tr>
            <td>#${order.id}</td>
            <td>${order.customerName || 'N/D'}</td>
            <td>${new Date(order.date).toLocaleDateString('it-IT')}</td>
            <td>
                <span class="badge ${getStatusBadgeClass(order.status)}">
                    ${getStatusLabel(order.status)}
                </span>
            </td>
            <td>€${order.total.toFixed(2)}</td>
            <td>
                <a href="gestione-ordini/dettaglio.html?id=${order.id}" class="btn btn-sm btn-outline">
                    Dettagli
                </a>
            </td>
        </tr>
    `).join('');
}

/**
 * Carica i prodotti più venduti
 */
async function loadTopProducts() {
    try {
        const response = await fetch('/api/admin/products/top', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Errore nel caricamento dei prodotti più venduti');
        }
        
        const products = await response.json();
        renderTopProducts(products);
        
    } catch (error) {
        console.error('Errore nel caricamento dei prodotti più venduti:', error);
        throw error;
    }
}

/**
 * Renderizza la tabella dei prodotti più venduti
 * @param {Array} products Lista dei prodotti
 */
function renderTopProducts(products) {
    const tbody = document.querySelector('#topProductsTable tbody');
    if (!tbody) return;
    
    if (!products || products.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-4">
                    <p>Nessun prodotto trovato</p>
                </td>
            </tr>`;
        return;
    }
    
    tbody.innerHTML = products.map(product => `
        <tr>
            <td>
                <div class="d-flex align-items-center">
                    ${product.image ? 
                        `<img src="${product.image}" alt="${product.name}" class="product-thumb">` : 
                        `<div class="product-thumb-placeholder">
                            <i class="fas fa-box"></i>
                        </div>`
                    }
                    <div>
                        <div class="fw-bold">${product.name}</div>
                        <small class="text-muted">${product.category || 'Nessuna categoria'}</small>
                    </div>
                </div>
            </td>
            <td>${product.soldQuantity || 0}</td>
            <td>€${(product.revenue || 0).toFixed(2)}</td>
            <td>
                <div class="d-flex align-items-center">
                    <div class="stock-indicator ${product.stock <= 5 ? 'low' : ''}">
                        ${product.stock || 0}
                    </div>
                </div>
            </td>
            <td>
                <a href="gestione-prodotti/modifica.html?id=${product.id}" class="btn btn-sm btn-outline">
                    <i class="fas fa-edit"></i>
                </a>
            </td>
        </tr>
    `).join('');
}

/**
 * Restituisce la classe CSS per lo stato dell'ordine
 * @param {string} status Stato dell'ordine
 * @returns {string} Classe CSS
 */
function getStatusBadgeClass(status) {
    const statusClasses = {
        'pending': 'bg-secondary',
        'processing': 'bg-warning',
        'completed': 'bg-success',
        'cancelled': 'bg-danger',
        'shipped': 'bg-info'
    };
    
    return statusClasses[status.toLowerCase()] || 'bg-secondary';
}

/**
 * Restituisce l'etichetta leggibile per lo stato
 * @param {string} status Stato dell'ordine
 * @returns {string} Etichetta
 */
function getStatusLabel(status) {
    const labels = {
        'pending': 'In attesa',
        'processing': 'In elaborazione',
        'completed': 'Completato',
        'cancelled': 'Annullato',
        'shipped': 'Spedito'
    };
    
    return labels[status.toLowerCase()] || status;
}

/**
 * Imposta i gestori eventi
 */
function setupEventHandlers() {
    // Gestione cambio periodo grafico
    document.querySelectorAll('[data-period]').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const days = parseInt(e.target.getAttribute('data-period'));
            
            // Aggiorna lo stato attivo dei pulsanti
            document.querySelectorAll('[data-period]').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            // Ricarica i dati del grafico
            try {
                const response = await fetch(`/api/admin/charts/orders?days=${days}`);
                const data = await response.json();
                initOrdersChart(data);
            } catch (error) {
                console.error('Errore nel caricamento dei dati del grafico:', error);
                window.App.showAlert('error', 'Impossibile aggiornare il grafico');
            }
        });
    });
    
    // Aggiornamento automatico ogni 5 minuti
    setInterval(() => {
        loadDashboardData().catch(console.error);
    }, 5 * 60 * 1000);
}

// Esponi le funzioni necessarie
window.AdminDashboard = {
    loadDashboardData
};
