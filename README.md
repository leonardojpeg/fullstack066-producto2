# AgroJobs - Producto 2

Aplicación web frontend desarrollada como prototipo de gestión de ofertas y demandas de empleo en el sector agrícola.

## Demo

Disponible en CodeSandbox:  
https://codesandbox.io/p/sandbox/github/leonardojpeg/fullstack066-producto2/main

## Descripción del proyecto

AgroJobs es una aplicación web construida con HTML, CSS y JavaScript Vanilla que permite gestionar una plataforma de empleo donde los usuarios pueden:

- iniciar sesión en la aplicación
- registrar nuevos usuarios
- crear ofertas y demandas de empleo
- consultar y eliminar publicaciones
- visualizar publicaciones en un dashboard interactivo
- seleccionar publicaciones mediante arrastrar y soltar

Este producto corresponde a la evolución del Producto 1, incorporando persistencia en el navegador y APIs HTML5 para dejar el frontend preparado para futuras integraciones con backend.

## Funcionalidades principales

### Login
- validación de credenciales
- gestión de usuario activo
- persistencia del usuario activo en `localStorage`
- actualización dinámica de la navbar

### Gestión de usuarios
- alta de usuarios
- consulta de usuarios
- borrado de usuarios
- persistencia en `localStorage`

### Gestión de ofertas y demandas
- alta de publicaciones
- consulta de publicaciones
- borrado de publicaciones
- persistencia en `IndexedDB`
- gráfico nativo mediante `canvas`

### Dashboard
- visualización de publicaciones disponibles
- selección de publicaciones
- arrastrar y soltar entre dos zonas
- persistencia de la selección en el navegador

## Tecnologías utilizadas

- HTML5
- CSS3
- Bootstrap 5
- JavaScript Vanilla (ES Modules)
- WebStorage (`localStorage`)
- IndexedDB
- HTML5 Canvas
- HTML5 Drag and Drop API
- CodeSandbox

## Estructura del proyecto

```text
/css
└── style.css

/docs
└── uml mvc.jpeg

/img
├── android-chrome-192x192.png
├── android-chrome-512x512.png
├── apple-touch-icon.png
├── favicon-16x16.png
├── favicon-32x32.png
└── favicon.ico

/js
├── almacenaje.js
├── int_1_dashboard.js
├── int_2_login.js
├── int_3_empleo.js
└── int_4_usuarios.js

Archivos HTML
├── index.html
├── login.html
├── ofertas.html
└── usuarios.html