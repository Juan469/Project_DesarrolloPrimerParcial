
let cart = []; 


function updateCartCount() {
    const count = cart.length;
    const newText = `🛒 Carrito (${count})`;
    
    const cartLinkSidebar = document.getElementById('cart-count'); 
    if (cartLinkSidebar) {
        cartLinkSidebar.textContent = newText;
    }
    
    const cartLinkHeader = document.getElementById('cart-count-header'); 
    if (cartLinkHeader) {
        cartLinkHeader.textContent = newText;
    }
}


function addToCart(productId) {
    const id = parseInt(productId); 
    if (isNaN(id)) return;
    
    cart.push(id);
    updateCartCount();
    
    console.log(`Producto ID ${id} agregado. Total: ${cart.length}`);
}
window.addToCart = addToCart; 



class ProductCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' }); 
    }

    static get observedAttributes() {
        return ['nombre', 'autor', 'precio', 'descripcion', 'imagen', 'data-product-id'];
    }

    attributeChangedCallback() {
        this.render();
    }
    
    connectedCallback() {
        this.render();
    }

    render() {
        const nombre = this.getAttribute('nombre') || 'Libro Desconocido';
        const autor = this.getAttribute('autor') || 'Autor Anónimo';
        const precio = parseFloat(this.getAttribute('precio')) || 0;
        const precioDisplay = precio.toLocaleString('es-CO'); 
        const descripcion = this.getAttribute('descripcion') || 'Sin descripción.';
        const imagen = this.getAttribute('imagen') || 'placeholder.jpg';
        const id = this.getAttribute('data-product-id'); 

        this.shadowRoot.innerHTML = `
            <style>@import url("./css/styles.css");</style> 
            
            <article class="card">
                <img src="./img/${imagen}" alt="Portada de ${nombre}"> 
                <h3>${nombre}</h3>
                <p class="autor">Por: ${autor}</p>
                <p>${descripcion.substring(0, 70)}...</p>
                <span class="price">$${precioDisplay}</span>
                <button class="add-to-cart-btn">Añadir al Carrito</button>
            </article>
        `;

        const button = this.shadowRoot.querySelector('.add-to-cart-btn');
        if (button) {
             button.addEventListener('click', () => {
                if (window.addToCart && id) { 
                    window.addToCart(id);
                }
            });
        }
    }
}
if (!customElements.get('product-card')) {
    customElements.define('product-card', ProductCard);
}


async function cargarFragmento(elementId, path) {
    try {
        const response = await fetch(path);
        const html = await response.text();
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = html;
        }
    } catch (error) {
        console.error(`Error al cargar el fragmento ${path}:`, error);
    }
}

function setupSidebarToggle() {
    const menuButton = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.main-sidebar');

    if (menuButton && sidebar) {
        menuButton.addEventListener('click', () => {
            sidebar.classList.toggle('is-open');
        });

        
        sidebar.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) { 
                    sidebar.classList.remove('is-open');
                }
            });
        });
    }
}


async function cargarProductos() {
    const contenedores = {
        "ciencia-ficcion": document.getElementById("product-list-ciencia"),
        "historia": document.getElementById("product-list-historia")
    };

    try {
        const response = await fetch('./data/productos.json');
        const productos = await response.json();

        Object.values(contenedores).forEach(c => {
            if (c) c.innerHTML = '';
        });

        productos.forEach((producto, index) => {
            let card;
            const formattedPrice = producto.precio ? producto.precio.toLocaleString('es-CO') : 'N/A';
            
            if (index < 3) {
                
                const template = document.getElementById('product-template');
                if (!template) return;
                
                const clone = document.importNode(template.content, true);
                
                clone.querySelector('[data-target="nombre"]').textContent = producto.nombre;
                clone.querySelector('[data-target="autor"]').textContent = `Autor: ${producto.autor}`;
                clone.querySelector('[data-target="descripcion"]').textContent = producto.descripcion;
                clone.querySelector('[data-target="precio"]').textContent = `$${formattedPrice}`;
                
                
                clone.querySelector('[data-target="imagen-url"]').src = `./img/${producto.imagen}`; 
                clone.querySelector('[data-target="imagen-url"]').alt = producto.nombre;
                
                
                const addButton = clone.querySelector('.add-to-cart-btn'); 
                if (addButton) {
                    addButton.addEventListener('click', () => addToCart(producto.id));
                }
                
                card = clone;
            } else {
                // Resto con Web Component
                const comp = document.createElement('product-card');
                comp.setAttribute('nombre', producto.nombre);
                comp.setAttribute('autor', producto.autor); 
                comp.setAttribute('precio', producto.precio); 
                comp.setAttribute('descripcion', producto.descripcion);
                comp.setAttribute('imagen', producto.imagen);
                comp.setAttribute('data-product-id', producto.id);
                
                card = comp;
            }

            if (contenedores[producto.genero] && card) {
                contenedores[producto.genero].appendChild(card);
            }
        });

    } catch (error) {
        console.error('Error al cargar los productos:', error);
    }
}




document.addEventListener('DOMContentLoaded', async () => {
    // 1. Carga de fragmentos de estructura (se usa await para forzar el orden y estabilidad)
    await cargarFragmento('header-placeholder', './components/header.html');
    await cargarFragmento('footer-placeholder', './components/footer.html');
    
    // 2. Carga del Sidebar 
    await cargarFragmento('sidebar-placeholder', './components/sidebar.html');
    setupSidebarToggle();
    updateCartCount(); 

    cargarProductos();
});