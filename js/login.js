
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    // Credenciales quemadas 
    const USER = 'admin';
    const PASS = '12345';
    let loginAttempts = 0;
    const MAX_ATTEMPTS = 3;

    // Función para mostrar el error y activar la animación
    function displayError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        
        const container = document.querySelector('.login-container');
        container.classList.add('shake-error');
        
        setTimeout(() => {
            container.classList.remove('shake-error');
        }, 500); 
    }

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const username = usernameInput.value;
        const password = passwordInput.value;

        if (username === USER && password === PASS) {
           
            window.location.href = 'index.html';
        } else {
            loginAttempts++;
            
            if (loginAttempts >= MAX_ATTEMPTS) {
                displayError("🚨 Bloqueado: Has superado el límite de intentos. Recarga la página.");
                
                loginForm.querySelector('.btn-login').disabled = true; 
            } else {
                const remaining = MAX_ATTEMPTS - loginAttempts;
                displayError(`Credenciales incorrectas. Te quedan ${remaining} intentos.`);
                passwordInput.value = ''; // Limpiar solo la contraseña
            }
        }
    });
    
    
    const inputFields = [usernameInput, passwordInput];
    inputFields.forEach(input => {
        input.addEventListener('focus', () => {
          
            if (loginAttempts < MAX_ATTEMPTS && errorMessage.style.display !== 'none') {
                 errorMessage.textContent = 'Ingresa tus datos de acceso.';
                 errorMessage.style.display = 'none';
            }
        });
    });
});