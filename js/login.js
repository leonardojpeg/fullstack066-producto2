import { almacenaje } from "./almacenaje.js";
import { usuarios } from "./datos.js";

const formularioLogin = document.getElementById("form-login");
const inputEmail = document.getElementById("email");
const inputPassword = document.getElementById("password");
const mensajeLogin = document.getElementById("mensaje-login");

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


//Funcion loguearUsuario: 
function loguearUsuario(email, password) {
    return almacenaje.loguearUsuario(email, password, usuarios);
}

//Evento DOMContentLoaded:
document.addEventListener("DOMContentLoaded", () => {
    mostrarUsuarioActivo(); 

    if (formularioLogin) {
        formularioLogin.addEventListener("submit", manejarEventoLogin);
    }
});

//Manejo del evento de clic en el botón de inicio de sesión:
function manejarEventoLogin(evento) {
    evento.preventDefault();

    const email = inputEmail.value.trim();
    const password = inputPassword.value.trim();

    const usuarioEncontrado = loguearUsuario(email, password);

    if (usuarioEncontrado) {
        alert(`Acceso correcto: ${usuarioEncontrado.nombre}`);
        mostrarUsuarioActivo();
        window.location.href = "index.html";
    } else {
        alert("Correo electrónico o contraseña incorrectos. Vuelva a intentarlo.");
    }
}
