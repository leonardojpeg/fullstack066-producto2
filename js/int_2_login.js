/*
IA utilizada: ChatGPT

Prompt 1: "Cómo validar un login en JavaScript usando funciones de un módulo almacenaje.js"
Prompt 2: "Cómo usar addEventListener en un formulario de login"
Prompt 3: "Cómo guardar datos de sesión con sessionStorage"
Prompt 4: "Cómo mostrar el correo del usuario logueado en la navbar de una app frontend"
*/

import { validarLogin } from "./almacenaje.js";

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
    const emailGuardado = sessionStorage.getItem("usuarioLogueado");

    if (!zonaSesion) return;

    if (emailGuardado) {
        zonaSesion.innerHTML = `
            <span class="nav-link mb-0">${emailGuardado}</span>
            <button id="btn-logout" class="btn btn-outline-light btn-sm ms-lg-2 mt-2 mt-lg-0" type="button">
                Cerrar sesión
            </button>
        `;

        const botonLogout = document.getElementById("btn-logout");

        if (botonLogout) {
            botonLogout.addEventListener("click", cerrarSesion);
        }
    } else {
        zonaSesion.innerHTML = `
            <a class="nav-link" href="login.html">Login</a>
        `;
    }
}

function cerrarSesion() {
    sessionStorage.removeItem("usuarioLogueado");
    sessionStorage.removeItem("nombreUsuario");
    sessionStorage.removeItem("rolUsuario");
    window.location.href = "login.html";
}

function iniciarSesion(evento) {
    evento.preventDefault();

    const email = inputEmail.value.trim();
    const password = inputPassword.value.trim();

    if (email === "" || password === "") {
        mostrarMensaje("Debes rellenar el correo y la contraseña.", "error");
        return;
    }

    const usuarioEncontrado = validarLogin(email, password);

    if (!usuarioEncontrado) {
        mostrarMensaje("Correo o contraseña incorrectos.", "error");
        return;
    }

    sessionStorage.setItem("usuarioLogueado", usuarioEncontrado.email);
    sessionStorage.setItem("nombreUsuario", usuarioEncontrado.nombre);
    sessionStorage.setItem("rolUsuario", usuarioEncontrado.rol);

    mostrarMensaje(`Bienvenido, ${usuarioEncontrado.nombre}.`, "ok");
    actualizarNavbar();

    if (formularioLogin) {
        formularioLogin.reset();
    }

    setTimeout(() => {
        window.location.href = "index.html";
    }, 1000);
}

actualizarNavbar();

if (formularioLogin) {
    formularioLogin.addEventListener("submit", iniciarSesion);
}