import { almacenaje } from "./almacenaje.js";
import { usuarios } from "./datos.js";

const formularioUsuario = document.getElementById("form-usuario");
const inputNombre = document.getElementById("nombre");
const inputEmailUsuario = document.getElementById("email-usuario");
const inputPasswordUsuario = document.getElementById("password-usuario");
const inputRolUsuario = document.getElementById("rol-usuario");
const mensajeUsuario = document.getElementById("mensaje-usuario");
const contenedorUsuarios = document.getElementById("contenedor-usuarios");

//Funcion MostrarusuarioActivo (antes: función actualizarNavbar):
function mostrarUsuarioActivo() {
    const usuarioActivo = document.getElementById("usuarioActivo");
    const emailGuardado = almacenaje.mostrarUsuarioActivo();

    if (!usuarioActivo) return;

    if (emailGuardado && emailGuardado !== "-no login-") {
        usuarioActivo.classList.add("d-flex", "align-items-center");
        usuarioActivo.innerHTML = `
            <span class="me-3 text-white">${emailGuardado}</span>
            <button id="btn-logout" class="btn btn-outline-light btn-sm" type="button">
                Cerrar sesión
            </button>
        `;

        document.getElementById("btn-logout").addEventListener("click", () => {
            almacenaje.cerrarSesion();
            window.location.href = "login.html";
        });
    } else {
        usuarioActivo.classList.remove("d-flex", "align-items-center");
        usuarioActivo.innerHTML = `<a class="nav-link" href="login.html">Login</a>`;
    }
}

//Evento DOMContentLoaded:
document.addEventListener("DOMContentLoaded", () => {
    mostrarUsuarioActivo(); 

    if (formularioLogin) {
        formularioLogin.addEventListener("submit", manejarEventoLogin);
    }
});

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

function obtenerNuevoId(array) {
    if (array.length === 0) {
        return 1;
    }

    const ids = array.map((elemento) => elemento.id);
    return Math.max(...ids) + 1;
}

function pintarUsuarios() {
    if (!contenedorUsuarios) return;

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
            eliminarUsuario(id);
        });
    });
}

function eliminarUsuario(id) {
    const indice = usuarios.findIndex((usuario) => usuario.id === id);

    if (indice !== -1) {
        usuarios.splice(indice, 1);
        pintarUsuarios();
        mostrarMensaje("Usuario eliminado correctamente.", "ok");
    }
}

function crearUsuario(evento) {
    evento.preventDefault();

    const nombre = inputNombre.value.trim();
    const email = inputEmailUsuario.value.trim();
    const password = inputPasswordUsuario.value.trim();
    const rol = inputRolUsuario.value.trim();

    if (nombre === "" || email === "" || password === "" || rol === "") {
        mostrarMensaje("Debes rellenar todos los campos.", "error");
        return;
    }

    const emailRepetido = usuarios.some((usuario) => usuario.email === email);

    if (emailRepetido) {
        mostrarMensaje("Ya existe un usuario con ese correo.", "error");
        return;
    }

    usuarios.push({
        id: obtenerNuevoId(usuarios),
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
    formularioUsuario.addEventListener("submit", crearUsuario);
}

pintarUsuarios();