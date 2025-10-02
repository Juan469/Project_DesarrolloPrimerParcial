// Usando camelCase para variables y funciones (Buena Práctica)
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
        
        // 💡 CREATIVIDAD: Activar la animación de "temblor" del formulario
        const container = document.querySelector('.login-container');
        container.classList.add('shake-error');
        
        // Remover la clase después de la animación para permitir que se repita
        setTimeout(() => {
            container.classList.remove('shake-error');
        }, 500); 
    }

    // Evento de intento de login
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const username = usernameInput.value;
        const password = passwordInput.value;

        if (username === USER && password === PASS) {
            // Login correcto
            window.location.href = 'index.html';
        } else {
            loginAttempts++;
            
            if (loginAttempts >= MAX_ATTEMPTS) {
                displayError("🚨 Bloqueado: Has superado el límite de intentos. Recarga la página.");
                // Deshabilitar el formulario
                loginForm.querySelector('.btn-login').disabled = true; 
            } else {
                const remaining = MAX_ATTEMPTS - loginAttempts;
                displayError(`Credenciales incorrectas. Te quedan ${remaining} intentos.`);
                passwordInput.value = ''; // Limpiar solo la contraseña
            }
        }
    });
    
    // 💡 CREATIVIDAD: Limpiar el error cuando el usuario vuelve a enfocarse en los campos
    const inputFields = [usernameInput, passwordInput];
    inputFields.forEach(input => {
        input.addEventListener('focus', () => {
            // Solo si aún quedan intentos o si el error está visible
            if (loginAttempts < MAX_ATTEMPTS && errorMessage.style.display !== 'none') {
                 errorMessage.textContent = 'Ingresa tus datos de acceso.';
                 errorMessage.style.display = 'none';
            }
        });
    });
});