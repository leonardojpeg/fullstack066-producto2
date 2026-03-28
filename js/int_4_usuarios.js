/*
IA utilizada: ChatGPT

Adaptación de int_4_usuarios.js para Producto 2:
- usuarios persistidos en localStorage mediante almacenaje.js
- navbar conectada al usuario activo del módulo
- inicialización modular
*/

import {
    inicializarAlmacenaje,
    obtenerUsuarios,
    crearUsuario,
    eliminarUsuario,
    obtenerUsuarioActivo,
    cerrarSesion
} from "./almacenaje.js";

const formularioUsuario = document.getElementById("form-usuario");
const inputNombre = document.getElementById("nombre");
const inputEmailUsuario = document.getElementById("email-usuario");
const inputPasswordUsuario = document.getElementById("password-usuario");
const inputRolUsuario = document.getElementById("rol-usuario");
const mensajeUsuario = document.getElementById("mensaje-usuario");
const contenedorUsuarios = document.getElementById("contenedor-usuarios");

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
    try {
        eliminarUsuario(id);
        pintarUsuarios();
        actualizarNavbar();
        mostrarMensaje("Usuario eliminado correctamente.", "ok");
    } catch (error) {
        mostrarMensaje(error.message || "No se pudo eliminar el usuario.", "error");
    }
}

function validarFormularioUsuario(nombre, email, password, rol) {
    if (!nombre || !email || !password || !rol) {
        throw new Error("Debes rellenar todos los campos.");
    }
}

function gestionarCreacionUsuario(evento) {
    evento.preventDefault();

    const nombre = inputNombre.value.trim();
    const email = inputEmailUsuario.value.trim();
    const password = inputPasswordUsuario.value.trim();
    const rol = inputRolUsuario.value.trim();

    try {
        validarFormularioUsuario(nombre, email, password, rol);

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
    } catch (error) {
        mostrarMensaje(error.message || "No se pudo crear el usuario.", "error");
    }
}

async function inicializarUsuariosVista() {
    try {
        await inicializarAlmacenaje();
        actualizarNavbar();
        pintarUsuarios();

        if (formularioUsuario) {
            formularioUsuario.addEventListener("submit", gestionarCreacionUsuario);
        }
    } catch (error) {
        console.error("Error al inicializar la vista de usuarios:", error);
        mostrarMensaje("Error al cargar la gestión de usuarios.", "error");
    }
}

document.addEventListener("DOMContentLoaded", inicializarUsuariosVista);