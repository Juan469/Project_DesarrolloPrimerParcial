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
        
        // 🚨 IMPORTANTE: Cargamos los estilos externos dentro del Shadow DOM.
        // Esto permite que el componente use las clases CSS globales (ej. .card)
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
    // 2.1. Cargar fragmentos reutilizables dinámicamente
    const fragmentos = [
        { id: 'header-placeholder', path: './components/header.html' },
        { id: 'footer-placeholder', path: './components/footer.html' },
        { id: 'sidebar-placeholder', path: './components/sidebar.html' }
    ];

    // Usaremos un contador para saber cuándo todos los fragmentos han cargado.
    let fragmentsLoaded = 0;
    const totalFragments = fragmentos.length;

    fragmentos.forEach(frag => {
        cargarFragmento(frag.id, frag.path, () => {
            fragmentsLoaded++;
            if (fragmentsLoaded === totalFragments) {
                // Ejecutar lógica de responsividad solo después de cargar todo
                setupSidebarToggle();
            }
        });
    });

    // 2.2. Cargar y renderizar productos
    cargarProductos();
});

// Función para cargar un fragmento HTML (se modifica para usar callback)
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

// Lógica para el toggle del sidebar en móvil
function setupSidebarToggle() {
    const menuButton = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.main-sidebar');

    if (menuButton && sidebar) {
        menuButton.addEventListener('click', () => {
            sidebar.classList.toggle('is-open');
        });

        // Cerrar el menú al hacer clic en un enlace (en móvil)
        const sidebarLinks = sidebar.querySelectorAll('a');
        sidebarLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Solo si el sidebar está visible
                if (window.innerWidth <= 768) { 
                    sidebar.classList.remove('is-open');
                }
            });
        });
    }
}

// Función para cargar productos con Fetch y renderizar (se mantiene igual)
async function cargarProductos() {
    // ... (Cuerpo de la función cargarProductos se mantiene igual, ya maneja el JSON y la alternancia) ...
    const productList = document.getElementById('product-list');
    const productTemplate = document.getElementById('product-template');
    
    try {
        const response = await fetch('./data/productos.json');
        const productos = await response.json();

        productList.innerHTML = '';

        productos.forEach((producto, index) => {
            if (index < 3) {
                // Productos 1, 2 y 3: Renderizar con la plantilla <template>
                const clone = productTemplate.content.cloneNode(true);
                
                clone.querySelector('[data-target="nombre"]').textContent = producto.nombre;
                clone.querySelector('[data-target="autor"]').textContent = `Autor: ${producto.autor}`; 
                clone.querySelector('[data-target="descripcion"]').textContent = producto.descripcion;
                clone.querySelector('[data-target="precio"]').textContent = `$${producto.precio.toFixed(2)}`;
                clone.querySelector('[data-target="imagen-url"]').src = `./img/${producto.imagen}`;
                clone.querySelector('[data-target="imagen-url"]').alt = producto.nombre;
                
                productList.appendChild(clone);
            } else {
                // Productos 4, 5 y siguientes: Renderizar con el Web Component
                const card = document.createElement('product-card');
                
                card.setAttribute('nombre', producto.nombre);
                card.setAttribute('autor', producto.autor); 
                card.setAttribute('precio', producto.precio);
                card.setAttribute('descripcion', producto.descripcion);
                card.setAttribute('imagen', producto.imagen);

                productList.appendChild(card);
            }
        });

    } catch (error) {
        console.error('Error al cargar los productos:', error);
    }
}