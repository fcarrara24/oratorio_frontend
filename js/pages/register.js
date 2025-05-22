// Gestione della pagina di registrazione

document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registrationForm');
    if (!registrationForm) return;

    // Inizializza i componenti della pagina
    initRegistrationForm();
    setupPasswordToggles();
    registrationForm.addEventListener('submit', handleRegistration);
});

function initRegistrationForm() {
    // Precompila l'email se presente nei parametri URL
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');
    if (email) {
        const emailInput = document.getElementById('email');
        if (emailInput) emailInput.value = email;
    }
}

function setupPasswordToggles() {
    const toggleButtons = document.querySelectorAll('.toggle-password');
    toggleButtons.forEach(button => {
        button.addEventListener('click', function () {
            const input = this.previousElementSibling;
            if (input && input.tagName === 'INPUT') {
                input.type = input.type === 'password' ? 'text' : 'password';
                const icon = this.querySelector('i');
                if (icon) {
                    icon.classList.toggle('fa-eye');
                    icon.classList.toggle('fa-eye-slash');
                }
            }
        });
    });
}

async function handleRegistration(e) {
    e.preventDefault();
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const terms = document.getElementById('terms').checked;

    // Validazione base
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        window.App.showAlert('error', 'Compila tutti i campi obbligatori');
        return;
    }
    if (password.length < 8) {
        window.App.showAlert('error', 'La password deve contenere almeno 8 caratteri');
        return;
    }
    if (password !== confirmPassword) {
        window.App.showAlert('error', 'Le password non coincidono');
        return;
    }
    if (!terms) {
        window.App.showAlert('error', 'Devi accettare i termini di servizio');
        return;
    }

    // Chiamata API di registrazione
    try {
        window.App.setIsLoading(true);
        const response = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nome: firstName,
                cognome: lastName,
                email,
                password
            })
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Errore durante la registrazione');
        }
        window.App.showAlert('success', 'Registrazione avvenuta con successo! Ora puoi accedere.');
        setTimeout(() => window.location.href = '/index.html', 2000);
    } catch (err) {
        window.App.showAlert('error', err.message || 'Errore durante la registrazione');
    } finally {
        window.App.setIsLoading(false);
    }
}
