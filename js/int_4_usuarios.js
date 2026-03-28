/*
IA utilizada: ChatGPT

Prompt 1: "Cómo crear usuarios en JavaScript a partir de un formulario HTML usando un módulo almacenaje.js"
Prompt 2: "Cómo listar usuarios dinámicamente en una tabla con Bootstrap"
Prompt 3: "Cómo eliminar usuarios usando funciones de un módulo JavaScript"
Prompt 4: "Cómo usar addEventListener para registrar eventos de formulario y botones"
*/

import {
    obtenerUsuarios,
    crearUsuario,
    eliminarUsuario
} from "./almacenaje.js";

const formularioUsuario = document.getElementById("form-usuario");
const inputNombre = document.getElementById("nombre");
const inputEmailUsuario = document.getElementById("email-usuario");
const inputPasswordUsuario = document.getElementById("password-usuario");
const inputRolUsuario = document.getElementById("rol-usuario");
const mensajeUsuario = document.getElementById("mensaje-usuario");
const contenedorUsuarios = document.getElementById("contenedor-usuarios");

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

function mostrarMensaje(texto, tipo) {
    if (!mensajeUsuario) return;

    mensajeUsuario.textContent = texto;
    mensajeUsuario.className = "";

    if (tipo === "error") {
        mensajeUsuario.classList.add("mensaje-error");
    }

    if (tipo === "ok") {
        mensajeUsuario.classList.add("mensaje-ok");
    }
}

function pintarUsuarios() {
    if (!contenedorUsuarios) return;

    const usuarios = obtenerUsuarios();

    let html = "";

    usuarios.forEach((usuario) => {
        html += `
            <tr>
                <td>${usuario.id}</td>
                <td>${usuario.nombre}</td>
                <td>${usuario.email}</td>
                <td>${usuario.rol}</td>
                <td class="text-end">
                    <button type="button" class="btn btn-outline-danger btn-sm btn-eliminar-usuario" data-id="${usuario.id}">
                        Eliminar
                    </button>
                </td>
            </tr>
        `;
    });

    contenedorUsuarios.innerHTML = html;
    registrarEventosEliminar();
}

function registrarEventosEliminar() {
    const botonesEliminar = document.querySelectorAll(".btn-eliminar-usuario");

    botonesEliminar.forEach((boton) => {
        boton.addEventListener("click", () => {
            const id = Number(boton.dataset.id);
            gestionarEliminacionUsuario(id);
        });
    });
}

function gestionarEliminacionUsuario(id) {
    eliminarUsuario(id);
    pintarUsuarios();
    mostrarMensaje("Usuario eliminado correctamente.", "ok");
}

function gestionarCreacionUsuario(evento) {
    evento.preventDefault();

    const nombre = inputNombre.value.trim();
    const email = inputEmailUsuario.value.trim();
    const password = inputPasswordUsuario.value.trim();
    const rol = inputRolUsuario.value.trim();

    if (nombre === "" || email === "" || password === "" || rol === "") {
        mostrarMensaje("Debes rellenar todos los campos.", "error");
        return;
    }

    const usuarios = obtenerUsuarios();
    const emailRepetido = usuarios.some((usuario) => usuario.email === email);

    if (emailRepetido) {
        mostrarMensaje("Ya existe un usuario con ese correo.", "error");
        return;
    }

    crearUsuario({
        nombre,
        email,
        password,
        rol
    });

    if (formularioUsuario) {
        formularioUsuario.reset();
    }

    pintarUsuarios();
    mostrarMensaje("Usuario creado correctamente.", "ok");
}

actualizarNavbar();

if (formularioUsuario) {
    formularioUsuario.addEventListener("submit", gestionarCreacionUsuario);
}

pintarUsuarios();