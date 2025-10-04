# Project_DesarrolloPrimerParcial
## 192456 Juan José Quintero
## 192519 Kelly Jacome
# Book Store

Este proyecto es una implementación moderna de un sitio web de comercio electrónico de libros, enfocado en la modularidad y el uso de tecnologías web avanzadas como Fragmentos HTML, la etiqueta `<template>` y Web Components.

---

## 1. Modularidad: Fragmentos, Plantillas y Web Components

Para lograr una estructura limpia, reutilizable y fácil de mantener, el proyecto se basa en tres pilares de modularidad:

### 📄 Fragmentos HTML (Inyección de Estructura)
Los fragmentos son archivos HTML externos que contienen bloques de la estructura de la página.
* **Implementación:** Se utilizan para componentes estructurales repetitivos.
* **Uso en el Proyecto:** El **Header**, el **Sidebar** (navegación), y el **Footer** están separados en archivos (`header.html`, `sidebar.html`, `footer.html`). Se inyectan en `index.html` usando la función `fetch` y JavaScript (`main.js`), asegurando un único punto de mantenimiento para la estructura principal.

### 🧩 Etiqueta `<template>` (Plantillas Estáticas)
La etiqueta `<template>` define un fragmento de HTML que no se renderiza automáticamente, sino que sirve como molde para ser clonado e insertado dinámicamente mediante JavaScript.
* **Uso en el Proyecto:** Se usa exclusivamente para renderizar los **primeros tres productos** de la sección **Novedades**. Esto demuestra el uso de un patrón de inyección de contenido directo a partir de una plantilla HTML.

### 🌐 Web Components (Encapsulamiento y Reutilización)
Los Web Components (`<product-card>`) son etiquetas HTML personalizadas y reutilizables, que encapsulan su marcado y su estilo usando el *Shadow DOM*.
* **Implementación:** El componente `<product-card>` se utiliza para renderizar **todos los demás productos** (a partir del cuarto producto y en las secciones Historia y Ciencia Ficción). Esto garantiza que el estilo de la tarjeta de producto no se filtre ni afecte a otros elementos de la página.

---

## 2. Implementación del Formulario de Inicio de Sesión

El formulario de inicio de sesión (`login.html`) se implementó para ser altamente profesional y estético, alineado con la paleta de colores Marrón/Dorado de la librería.

* **Estructura:** Formulario simple ubicado en el contenedor `login-container`.
* **Diseño Profesional (CSS):**
    * **Contraste:** Utiliza un fondo blanco puro sobre el fondo tostado de la página.
    * **Foco Visual:** Se implementaron bordes y sombras de foco (**Dorado**) en los campos de texto para guiar al usuario.
    * **Botón Principal:** El botón de Login (`btn-login`) es prominente, usa el color **Marrón Café** (`--color-primary`) y tiene un efecto visual de "levantamiento" (`transform: translateY(-2px)` en hover), haciendo el llamado a la acción más efectivo.
    * **Feedback:** Se diseñó la animación `shake-error` para proporcionar feedback visual elegante en caso de error de autenticación.

---

## 3. Buenas Prácticas Aplicadas

Durante el desarrollo del proyecto, se aplicaron las siguientes buenas prácticas de desarrollo web para garantizar la calidad y mantenibilidad del código:

* **Diseño Orientado a Componentes:** Separación de la interfaz de usuario en bloques lógicos y reutilizables (Fragmentos y Web Components).
* **CSS Modular (Variables):** Uso de variables CSS (`:root`) para centralizar la paleta de colores. Esto permite cambiar el tema completo del sitio modificando solo 5 variables.
* **Diseño Responsivo (`Mobile-First`):** Implementación de **Media Queries** en `styles.css` para adaptar la disposición de la página y el Sidebar a dispositivos móviles y tablets.
* **Carga Asíncrona Estable:** Uso riguroso de `async/await` en `main.js` para la carga de los fragmentos HTML y la data JSON, asegurando que la estructura se construya de forma secuencial y sin errores de elementos no encontrados.
* **Encapsulamiento del DOM:** El uso del **Shadow DOM** en el Web Component `<product-card>` evita conflictos de estilos.

---

## 4. Evidencia de Colaboración en GitHub

El desarrollo de este proyecto se llevó a cabo utilizando **GitHub** y siguiendo buenas prácticas de trabajo en equipo y control de versiones.

Esto se evidencia en:

1.  **Historial de Commits Detallado:** El historial de `commits` (confirmaciones) muestra contribuciones consistentes de **múltiples autores**, con mensajes claros y descriptivos que detallan la implementación de características específicas.
2.  **Manejo de Ramas (Branches):** Se utilizaron ramas dedicadas para el desarrollo de nuevas funcionalidades y corrección de errores, asegurando que el código fuera estable antes de su integración.
3.  **Código Revisado:** Las contribuciones fueron integradas a través de *Pull Requests* (PR), lo que implicó una revisión del código para asegurar su calidad y funcionalidad antes de ser fusionado a la rama principal del proyecto.

