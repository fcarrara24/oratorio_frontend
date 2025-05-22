/**
 * Punto di ingresso principale dell'applicazione
 * Gestisce l'inizializzazione e il routing di base
 */

// Configurazione
const CONFIG = {
    API_BASE_URL: 'http://localhost:3000/api',
    TOKEN_KEY: 'authToken',
    USER_KEY: 'userData',
    THEME_KEY: 'appTheme',
    DEFAULT_THEME: 'light'
};

// Stato dell'applicazione
const state = {
    user: null,
    isAuthenticated: false,
    isAdmin: false,
    isLoading: false,
    theme: localStorage.getItem(CONFIG.THEME_KEY) || CONFIG.DEFAULT_THEME
};

/**
 * Inizializza l'applicazione
 */
function init() {
    // Applica il tema salvato
    applyTheme(state.theme);
    
    // Verifica l'autenticazione
    checkAuth();
    
    // Inizializza i componenti della pagina corrente
    initPageComponents();
    
    // Aggiungi gestori eventi globali
    setupGlobalEventListeners();
}

/**
 * Verifica se l'utente è autenticato
 */
function checkAuth() {
    const token = localStorage.getItem(CONFIG.TOKEN_KEY);
    const userData = localStorage.getItem(CONFIG.USER_KEY);
    
    if (token && userData) {
        try {
            state.user = JSON.parse(userData);
            state.isAuthenticated = true;
            state.isAdmin = state.user?.role === 'admin';
            
            // Aggiorna l'UI in base all'autenticazione
            updateUIAuthState();
            
        } catch (error) {
            console.error('Errore nel parsing dei dati utente:', error);
            logout();
        }
    }
}

/**
 * Gestisce il login dell'utente
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<void>}
 */
async function login(email, password) {
    if (!email || !password) {
        showAlert('error', 'Inserisci email e password');
        return;
    }

    setIsLoading(true);

    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Errore durante il login');
        }

        // Salva il token e i dati utente
        localStorage.setItem(CONFIG.TOKEN_KEY, data.token);
        localStorage.setItem(CONFIG.USER_KEY, JSON.stringify(data.user));
        
        // Aggiorna lo stato
        state.user = data.user;
        state.isAuthenticated = true;
        state.isAdmin = data.user.role === 'admin';
        
        // Reindirizza alla dashboard appropriata
        redirectToDashboard();
        
    } catch (error) {
        console.error('Login error:', error);
        showAlert('error', error.message || 'Errore durante il login. Riprova.');
    } finally {
        setIsLoading(false);
    }
}

/**
 * Effettua il logout dell'utente
 */
function logout() {
    // Rimuovi i dati di autenticazione
    localStorage.removeItem(CONFIG.TOKEN_KEY);
    localStorage.removeItem(CONFIG.USER_KEY);
    
    // Resetta lo stato
    state.user = null;
    state.isAuthenticated = false;
    state.isAdmin = false;
    
    // Reindirizza alla pagina di login
    if (!window.location.pathname.includes('login')) {
        window.location.href = '/login.html';
    } else {
        updateUIAuthState();
    }
}

/**
 * Reindirizza alla dashboard appropriata in base al ruolo
 */
function redirectToDashboard() {
    if (state.isAdmin) {
        window.location.href = '/admin/dashboard.html';
    } else {
        window.location.href = '/dashboard.html';
    }
}

/**
 * Mostra un messaggio di notifica
 * @param {string} type - Tipo di notifica (success, error, warning, info)
 * @param {string} message - Messaggio da mostrare
 * @param {number} [duration=5000] - Durata in millisecondi
 */
function showAlert(type, message, duration = 5000) {
    // Crea il contenitore degli alert se non esiste
    let alertContainer = document.getElementById('alert-container');
    if (!alertContainer) {
        alertContainer = document.createElement('div');
        alertContainer.id = 'alert-container';
        alertContainer.style.position = 'fixed';
        alertContainer.style.top = '20px';
        alertContainer.style.right = '20px';
        alertContainer.style.zIndex = '9999';
        document.body.appendChild(alertContainer);
    }
    
    // Crea l'alert
    const alertId = `alert-${Date.now()}`;
    const alert = document.createElement('div');
    alert.id = alertId;
    alert.className = `alert alert-${type}`;
    alert.style.marginBottom = '10px';
    alert.style.opacity = '0';
    alert.style.transition = 'opacity 0.3s ease';
    
    // Icona in base al tipo
    let icon = 'info-circle';
    switch (type) {
        case 'success': icon = 'check-circle'; break;
        case 'error': icon = 'exclamation-circle'; break;
        case 'warning': icon = 'exclamation-triangle'; break;
        default: icon = 'info-circle';
    }
    
    alert.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
        <button class="close-alert" data-alert-id="${alertId}">&times;</button>
    `;
    
    // Aggiungi l'alert al contenitore
    alertContainer.appendChild(alert);
    
    // Forza il reflow per abilitare la transizione
    void alert.offsetWidth;
    alert.style.opacity = '1';
    
    // Rimuovi l'alert dopo la durata specificata
    const timeoutId = setTimeout(() => {
        const alertToRemove = document.getElementById(alertId);
        if (alertToRemove) {
            alertToRemove.style.opacity = '0';
            setTimeout(() => alertToRemove.remove(), 300);
        }
    }, duration);
    
    // Aggiungi gestore per la chiusura manuale
    const closeBtn = alert.querySelector('.close-alert');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            clearTimeout(timeoutId);
            alert.style.opacity = '0';
            setTimeout(() => alert.remove(), 300);
        });
    }
}

/**
 * Imposta lo stato di caricamento
 * @param {boolean} isLoading 
 */
function setIsLoading(isLoading) {
    state.isLoading = isLoading;
    
    // Trova tutti i pulsanti di submit
    const buttons = document.querySelectorAll('button[type="submit"]');
    buttons.forEach(button => {
        const originalText = button.getAttribute('data-original-text') || button.innerHTML;
        
        if (isLoading) {
            button.setAttribute('data-original-text', originalText);
            button.disabled = true;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Caricamento...';
        } else {
            button.disabled = false;
            button.innerHTML = originalText;
        }
    });
}

/**
 * Applica il tema specificato
 * @param {string} theme - Nome del tema (light/dark)
 */
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(CONFIG.THEME_KEY, theme);
    state.theme = theme;
    
    // Aggiorna il toggle del tema se presente
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.checked = theme === 'dark';
    }
}

/**
 * Inizializza i componenti della pagina corrente
 */
function initPageComponents() {
    // Gestione del form di login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email')?.value;
            const password = document.getElementById('password')?.value;
            await login(email, password);
        });
        
        // Mostra/nascondi password
        const togglePassword = document.querySelector('.toggle-password');
        if (togglePassword) {
            togglePassword.addEventListener('click', () => {
                const passwordInput = document.getElementById('password');
                if (passwordInput) {
                    const type = passwordInput.type === 'password' ? 'text' : 'password';
                    passwordInput.type = type;
                    const icon = togglePassword.querySelector('i');
                    if (icon) {
                        icon.classList.toggle('fa-eye');
                        icon.classList.toggle('fa-eye-slash');
                    }
                }
            });
        }
    }
    
    // Gestione del toggle del tema
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('change', (e) => {
            applyTheme(e.target.checked ? 'dark' : 'light');
        });
    }
    
    // Gestione del logout
    const logoutButtons = document.querySelectorAll('.logout-btn');
    logoutButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    });
}

/**
 * Imposta i gestori di eventi globali
 */
function setupGlobalEventListeners() {
    // Gestione dei click sui link interni
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[data-internal]');
        if (link) {
            e.preventDefault();
            const href = link.getAttribute('href');
            if (href) {
                navigateTo(href);
            }
        }
    });
    
    // Gestione del tasto indietro/avanti del browser
    window.addEventListener('popstate', () => {
        // Qui puoi implementare il caricamento della pagina appropriata
        // in base all'URL corrente
    });
}

/**
 * Naviga verso un URL specifico
 * @param {string} url 
 */
function navigateTo(url) {
    // Qui puoi implementare il caricamento della pagina senza ricaricare
    // l'intera applicazione (SPA - Single Page Application)
    window.location.href = url;
}

/**
 * Aggiorna l'UI in base allo stato di autenticazione
 */
function updateUIAuthState() {
    // Aggiorna la navbar/navigation
    const authElements = document.querySelectorAll('[data-auth]');
    const guestElements = document.querySelectorAll('[data-guest]');
    const adminElements = document.querySelectorAll('[data-admin]');
    
    authElements.forEach(el => {
        el.style.display = state.isAuthenticated ? '' : 'none';
    });
    
    guestElements.forEach(el => {
        el.style.display = !state.isAuthenticated ? '' : 'none';
    });
    
    adminElements.forEach(el => {
        el.style.display = (state.isAuthenticated && state.isAdmin) ? '' : 'none';
    });
    
    // Aggiorna il nome utente se presente
    const userElements = document.querySelectorAll('[data-user-name]');
    if (state.user?.name) {
        userElements.forEach(el => {
            el.textContent = state.user.name;
        });
    }
}

// Inizializza l'app quando il DOM è completamente caricato
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Esponi le funzioni necessarie all'oggetto window
window.App = {
    state,
    login,
    logout,
    showAlert,
    setIsLoading,
    applyTheme,
    navigateTo
};
