import { almacenaje } from "./almacenaje.js";
import { usuarios as usuariosIniciales } from "./datos.js";

const formularioUsuario = document.getElementById("form-usuario");
const inputNombre = document.getElementById("nombre");
const inputEmailUsuario = document.getElementById("email-usuario");
const inputPasswordUsuario = document.getElementById("password-usuario");
const inputRolUsuario = document.getElementById("rol-usuario");
const mensajeUsuario = document.getElementById("mensaje-usuario");
const contenedorUsuarios = document.getElementById("contenedor-usuarios");

let usuarios = JSON.parse(localStorage.getItem("listaUsuarios"));

function gestionUsuarios() {
    localStorage.setItem("listaUsuarios", JSON.stringify(usuarios));
}

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

function visualizarUsuarios() {
    if (!contenedorUsuarios) return;
    
    let filas = "";
    usuarios.forEach((u) => {
        filas += `
            <tr>
                <td>${u.id}</td>
                <td>${u.nombre}</td>
                <td>${u.email}</td>
                <td>${u.rol}</td>
                <td class="text-end">
                    <button class="btn btn-danger btn-sm" onclick="eliminarUsuario(${u.id})">Eliminar</button>
                </td>
            </tr>`;
    });
    contenedorUsuarios.innerHTML = filas;
}

// Funcion que suprime un usuario a partir de su identificador
window.eliminarUsuario = function(id) {
    usuarios = usuarios.filter(u => u.id !== id); 
    gestionUsuarios();
    visualizarUsuarios();
};


//Funcion que crea un usuario
function crearUsuario(e) {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const email = document.getElementById("email-usuario").value;
    const pass = document.getElementById("password-usuario").value;
    const rol = document.getElementById("rol-usuario").value;

    if (!nombre || !email || !pass || !rol) {
        alert("Rellena todos los campos");
        return;
    }

    //Asociación de un id consecutivo en función del último registrado
    const nuevoId = usuarios.length > 0 ? usuarios[usuarios.length - 1].id + 1 : 1;

    usuarios.push({ id: nuevoId, nombre, email, password: pass, rol });
    
    gestionUsuarios();
    visualizarUsuarios();
    formularioUsuario.reset();
}

//Evento DOMContentLoaded:
document.addEventListener("DOMContentLoaded", () => {
    mostrarUsuarioActivo();
    visualizarUsuarios();
    if (formularioUsuario) formularioUsuario.onsubmit = crearUsuario;
});