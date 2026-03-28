/*
IA utilizada: ChatGPT

Adaptación de int_2_login.js para Producto 2:
- login usando almacenaje.js
- usuario activo en localStorage
- navbar conectada al módulo
*/

import {
    inicializarAlmacenaje,
    loguearUsuario,
    obtenerUsuarioActivo,
    cerrarSesion
} from "./almacenaje.js";

const formularioLogin = document.getElementById("form-login");
const inputEmail = document.getElementById("email");
const inputPassword = document.getElementById("password");
const mensajeLogin = document.getElementById("mensaje-login");

function mostrarMensaje(texto, tipo) {
    if (!mensajeLogin) return;

    mensajeLogin.textContent = texto;
    mensajeLogin.className = "";

    if (tipo === "error") {
        mensajeLogin.classList.add("mensaje-error");
    }

    if (tipo === "ok") {
        mensajeLogin.classList.add("mensaje-ok");
    }
}

function actualizarNavbar() {
    const zonaSesion = document.getElementById("zona-sesion");
    const usuarioActivo = obtenerUsuarioActivo();

    if (!zonaSesion) return;

    if (usuarioActivo) {
        zonaSesion.innerHTML = `
            <span class="nav-link mb-0">${usuarioActivo.email}</span>
            <button id="btn-logout" class="btn btn-outline-light btn-sm ms-lg-2 mt-2 mt-lg-0" type="button">
                Cerrar sesión
            </button>
        `;

        const botonLogout = document.getElementById("btn-logout");

        if (botonLogout) {
            botonLogout.addEventListener("click", gestionarCierreSesion);
        }
    } else {
        zonaSesion.innerHTML = `
            <a class="nav-link" href="login.html">Login</a>
        `;
    }
}

function gestionarCierreSesion() {
    cerrarSesion();
    window.location.href = "login.html";
}

function validarFormularioLogin(email, password) {
    if (email === "" || password === "") {
        throw new Error("Debes rellenar el correo y la contraseña.");
    }
}

async function iniciarSesion(evento) {
    evento.preventDefault();

    const email = inputEmail.value.trim();
    const password = inputPassword.value.trim();

    try {
        validarFormularioLogin(email, password);

        const usuarioEncontrado = loguearUsuario(email, password);

        mostrarMensaje(`Bienvenido, ${usuarioEncontrado.nombre}.`, "ok");
        actualizarNavbar();

        if (formularioLogin) {
            formularioLogin.reset();
        }

        setTimeout(() => {
            window.location.href = "index.html";
        }, 1000);
    } catch (error) {
        mostrarMensaje(error.message || "No se pudo iniciar sesión.", "error");
    }
}

async function inicializarLogin() {
    try {
        await inicializarAlmacenaje();
        actualizarNavbar();

        if (formularioLogin) {
            formularioLogin.addEventListener("submit", iniciarSesion);
        }
    } catch (error) {
        console.error("Error al inicializar la página de login:", error);
        mostrarMensaje("Error al cargar el sistema de login.", "error");
    }
}

document.addEventListener("DOMContentLoaded", inicializarLogin);