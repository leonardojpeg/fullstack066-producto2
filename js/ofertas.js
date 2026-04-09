import { almacenaje } from "./almacenaje.js";
import { ofertas, demandas } from "./datos.js";

const formularioOferta = document.getElementById("form-oferta");
const inputTipo = document.getElementById("tipo");
const inputTitulo = document.getElementById("titulo");
const inputEmpresa = document.getElementById("empresa");
const inputUbicacion = document.getElementById("ubicacion");
const inputDescripcion = document.getElementById("descripcion");
const mensajeOferta = document.getElementById("mensaje-oferta");
const contenedorOfertas = document.getElementById("contenedor-ofertas");
const tablaOfertas = document.getElementById("tabla-ofertas");

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
    if (!mensajeOferta) return;

    mensajeOferta.textContent = texto;
    mensajeOferta.className = "";

    if (tipo === "error") {
        mensajeOferta.classList.add("mensaje-error");
    }

    if (tipo === "ok") {
        mensajeOferta.classList.add("mensaje-ok");
    }
}

function obtenerNuevoId(array) {
    if (array.length === 0) {
        return 1;
    }

    const ids = array.map((elemento) => elemento.id);
    return Math.max(...ids) + 1;
}

function pintarPublicaciones() {
    pintarTarjetas();
    pintarTabla();
    registrarEventosEliminar();
}

function pintarTarjetas() {
    if (!contenedorOfertas) return;

    let html = "";

    ofertas.forEach((oferta) => {
        html += `
            <div class="col-md-6 col-xl-4">
                <article class="card dashboard-card oferta-card h-100 shadow-sm">
                    <div class="card-body">
                        <span class="small text-uppercase text-primary fw-semibold mb-2 d-block">Oferta laboral</span>
                        <h3 class="card-title h4">${oferta.titulo}</h3>
                        <p class="card-text mb-2"><strong>Empresa:</strong> ${oferta.empresa}</p>
                        <p class="card-text mb-3"><strong>Ubicación:</strong> ${oferta.ubicacion}</p>
                        <p class="text-muted small">${oferta.descripcion ?? "Sin descripción."}</p>
                        <div class="d-flex justify-content-between align-items-center mt-4">
                            <span class="badge rounded-pill text-bg-primary px-3 py-2">Oferta</span>
                            <button type="button" class="btn btn-outline-danger btn-sm btn-eliminar-oferta" data-id="${oferta.id}">
                                Eliminar
                            </button>
                        </div>
                    </div>
                </article>
            </div>
        `;
    });

    demandas.forEach((demanda) => {
        html += `
            <div class="col-md-6 col-xl-4">
                <article class="card dashboard-card demanda-card h-100 shadow-sm">
                    <div class="card-body">
                        <span class="small text-uppercase text-success fw-semibold mb-2 d-block">Perfil candidato</span>
                        <h3 class="card-title h4">${demanda.nombre}</h3>
                        <p class="card-text mb-2"><strong>Busca:</strong> ${demanda.profesion}</p>
                        <p class="card-text mb-3"><strong>Disponibilidad:</strong> ${demanda.disponibilidad}</p>
                        <p class="text-muted small">${demanda.descripcion ?? "Sin descripción."}</p>
                        <div class="d-flex justify-content-between align-items-center mt-4">
                            <span class="badge rounded-pill text-bg-success px-3 py-2">Demanda</span>
                            <button type="button" class="btn btn-outline-danger btn-sm btn-eliminar-demanda" data-id="${demanda.id}">
                                Eliminar
                            </button>
                        </div>
                    </div>
                </article>
            </div>
        `;
    });

    contenedorOfertas.innerHTML = html;
}

function pintarTabla() {
    if (!tablaOfertas) return;

    let html = "";

    ofertas.forEach((oferta) => {
        html += `
            <tr>
                <td>${oferta.id}</td>
                <td><span class="badge text-bg-primary">Oferta</span></td>
                <td>${oferta.titulo}</td>
                <td>${oferta.empresa}</td>
                <td>${oferta.ubicacion}</td>
                <td>${oferta.descripcion ?? "Sin descripción."}</td>
                <td class="text-end">
                    <button type="button" class="btn btn-outline-danger btn-sm btn-eliminar-oferta" data-id="${oferta.id}">
                        Eliminar
                    </button>
                </td>
            </tr>
        `;
    });

    demandas.forEach((demanda) => {
        html += `
            <tr>
                <td>${demanda.id}</td>
                <td><span class="badge text-bg-success">Demanda</span></td>
                <td>${demanda.nombre}</td>
                <td>${demanda.profesion}</td>
                <td>${demanda.disponibilidad}</td>
                <td>${demanda.descripcion ?? "Sin descripción."}</td>
                <td class="text-end">
                    <button type="button" class="btn btn-outline-danger btn-sm btn-eliminar-demanda" data-id="${demanda.id}">
                        Eliminar
                    </button>
                </td>
            </tr>
        `;
    });

    tablaOfertas.innerHTML = html;
}

function registrarEventosEliminar() {
    const botonesEliminarOferta = document.querySelectorAll(".btn-eliminar-oferta");
    const botonesEliminarDemanda = document.querySelectorAll(".btn-eliminar-demanda");

    botonesEliminarOferta.forEach((boton) => {
        boton.addEventListener("click", () => {
            const id = Number(boton.dataset.id);
            eliminarOferta(id);
        });
    });

    botonesEliminarDemanda.forEach((boton) => {
        boton.addEventListener("click", () => {
            const id = Number(boton.dataset.id);
            eliminarDemanda(id);
        });
    });
}

function eliminarOferta(id) {
    const indice = ofertas.findIndex((oferta) => oferta.id === id);

    if (indice !== -1) {
        ofertas.splice(indice, 1);
        pintarPublicaciones();
        mostrarMensaje("Oferta eliminada correctamente.", "ok");
    }
}

function eliminarDemanda(id) {
    const indice = demandas.findIndex((demanda) => demanda.id === id);

    if (indice !== -1) {
        demandas.splice(indice, 1);
        pintarPublicaciones();
        mostrarMensaje("Demanda eliminada correctamente.", "ok");
    }
}

function crearPublicacion(evento) {
    evento.preventDefault();

    const tipo = inputTipo.value.trim();
    const titulo = inputTitulo.value.trim();
    const empresa = inputEmpresa.value.trim();
    const ubicacion = inputUbicacion.value.trim();
    const descripcion = inputDescripcion.value.trim();

    if (tipo === "" || titulo === "" || empresa === "" || ubicacion === "") {
        mostrarMensaje("Debes rellenar todos los campos obligatorios.", "error");
        return;
    }

    if (tipo === "oferta") {
        ofertas.push({
            id: obtenerNuevoId(ofertas),
            titulo,
            empresa,
            ubicacion,
            descripcion
        });

        mostrarMensaje("Oferta creada correctamente.", "ok");
    } else if (tipo === "demanda") {
        demandas.push({
            id: obtenerNuevoId(demandas),
            nombre: titulo,
            profesion: empresa,
            disponibilidad: ubicacion,
            descripcion
        });

        mostrarMensaje("Demanda creada correctamente.", "ok");
    } else {
        mostrarMensaje("Debes seleccionar un tipo de publicación.", "error");
        return;
    }

    if (formularioOferta) {
        formularioOferta.reset();
    }

    pintarPublicaciones();
}

actualizarNavbar();

if (formularioOferta) {
    formularioOferta.addEventListener("submit", crearPublicacion);
}

pintarPublicaciones();