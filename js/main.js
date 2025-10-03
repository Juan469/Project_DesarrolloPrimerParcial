// ===========================================
// 1. DEFINICIÓN DEL WEB COMPONENT <product-card>
// ===========================================
class ProductCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' }); 
    }

    static get observedAttributes() {
        return ['nombre', 'autor', 'precio', 'descripcion', 'imagen'];
    }

    attributeChangedCallback() {
        this.render();
    }

    render() {
        const nombre = this.getAttribute('nombre') || 'Libro Desconocido';
        const autor = this.getAttribute('autor') || 'Autor Anónimo';
        const precio = this.getAttribute('precio') || '0.00';
        const descripcion = this.getAttribute('descripcion') || 'Sin descripción.';
        const imagen = this.getAttribute('imagen') || 'placeholder.jpg';
        
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="./css/styles.css"> 
            
            <article class="card">
                <img src="./img/${imagen}" alt="Portada de ${nombre}">
                <h3>${nombre}</h3>
                <p class="autor">Por: ${autor}</p>
                <p>${descripcion.substring(0, 70)}...</p>
                <span class="price">$${parseFloat(precio).toFixed(2)}</span>
                <button>Añadir al Carrito</button>
            </article>
        `;
    }
}

customElements.define('product-card', ProductCard);


// ===========================================
// 2. LÓGICA DE LA APLICACIÓN PRINCIPAL
// ===========================================

document.addEventListener('DOMContentLoaded', () => {
    const fragmentos = [
        { id: 'header-placeholder', path: './components/header.html' },
        { id: 'footer-placeholder', path: './components/footer.html' },
        { id: 'sidebar-placeholder', path: './components/sidebar.html' }
    ];

    let fragmentsLoaded = 0;
    const totalFragments = fragmentos.length;

    fragmentos.forEach(frag => {
        cargarFragmento(frag.id, frag.path, () => {
            fragmentsLoaded++;
            if (fragmentsLoaded === totalFragments) {
                setupSidebarToggle();
            }
        });
    });

    cargarProductos();
});

// Función para cargar un fragmento HTML
async function cargarFragmento(elementId, path, callback) {
    try {
        const response = await fetch(path);
        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;
        if (callback) callback();
    } catch (error) {
        console.error(`Error al cargar el fragmento ${path}:`, error);
        if (callback) callback();
    }
}

// Toggle del sidebar en móvil
function setupSidebarToggle() {
    const menuButton = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.main-sidebar');

    if (menuButton && sidebar) {
        menuButton.addEventListener('click', () => {
            sidebar.classList.toggle('is-open');
        });

        const sidebarLinks = sidebar.querySelectorAll('a');
        sidebarLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) { 
                    sidebar.classList.remove('is-open');
                }
            });
        });
    }
}

// ===========================================
// 3. FUNCIÓN PARA CARGAR PRODUCTOS
// ===========================================
async function cargarProductos() {
    // Mapear contenedores por género
    const contenedores = {
        "ciencia-ficcion": document.getElementById("product-list-ciencia"),
        "historia": document.getElementById("product-list-historia")
    };

    try {
        const response = await fetch('./data/productos.json');
        const productos = await response.json();

        // Limpiar contenedores
        Object.values(contenedores).forEach(c => c.innerHTML = '');

        productos.forEach((producto, index) => {
            let card;

            if (index < 3) {
                // Los 3 primeros con template
                const template = document.getElementById('product-template');
                const clone = template.content.cloneNode(true);
                clone.querySelector('[data-target="nombre"]').textContent = producto.nombre;
                clone.querySelector('[data-target="autor"]').textContent = `Autor: ${producto.autor}`;
                clone.querySelector('[data-target="descripcion"]').textContent = producto.descripcion;
                clone.querySelector('[data-target="precio"]').textContent = `$${producto.precio.toFixed(2)}`;
                clone.querySelector('[data-target="imagen-url"]').src = `./img/${producto.imagen}`;
                clone.querySelector('[data-target="imagen-url"]').alt = producto.nombre;
                card = clone;
            } else {
                // Resto con Web Component
                const comp = document.createElement('product-card');
                comp.setAttribute('nombre', producto.nombre);
                comp.setAttribute('autor', producto.autor); 
                comp.setAttribute('precio', producto.precio);
                comp.setAttribute('descripcion', producto.descripcion);
                comp.setAttribute('imagen', producto.imagen);
                card = comp;
            }

            // Insertar en el contenedor correcto según el género
            if (contenedores[producto.genero]) {
                contenedores[producto.genero].appendChild(card);
            } else {
                console.warn(`⚠️ Género no reconocido: ${producto.genero}`);
            }
        });

    } catch (error) {
        console.error('Error al cargar los productos:', error);
    }
}
