/*
IA utilizada: ChatGPT

Adaptación definitiva de int_1_dashboard.js para Producto 2:
- dashboard con drag and drop nativo
- selección persistida en localStorage
- publicaciones leídas desde IndexedDB mediante almacenaje.js
*/

import {
    inicializarAlmacenaje,
    obtenerEmpleos,
    guardarSeleccionDashboard,
    obtenerSeleccionDashboard,
    obtenerUsuarioActivo,
    cerrarSesion
} from "./almacenaje.js";

const contenedorDisponibles = document.getElementById("contenedor-disponibles");
const contenedorSeleccionados = document.getElementById("contenedor-seleccionados");

let empleosCache = [];
let seleccionadosIds = [];

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

function escaparHTML(texto) {
    return String(texto ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function crearTarjetaHTML(empleo) {
    const esOferta = empleo.tipo === "Oferta";
    const claseCard = esOferta ? "oferta-card" : "demanda-card";
    const claseTexto = esOferta ? "text-primary" : "text-success";
    const claseBadge = esOferta ? "text-bg-primary" : "text-bg-success";

    return `
        <div class="col-12" data-id="${empleo.id}">
            <article
                class="card dashboard-card ${claseCard} h-100 shadow-sm tarjeta-empleo"
                draggable="true"
                data-id="${empleo.id}"
            >
                <div class="card-body d-flex flex-column">
                    <span class="small text-uppercase ${claseTexto} fw-semibold mb-2">
                        ${escaparHTML(empleo.tipo)}
                    </span>
                    <h3 class="card-title h5">${escaparHTML(empleo.titulo)}</h3>
                    <p class="card-text mb-2"><strong>Email:</strong> ${escaparHTML(empleo.email)}</p>
                    <p class="card-text mb-3"><strong>Fecha:</strong> ${escaparHTML(empleo.fecha)}</p>
                    <p class="text-muted small mb-4">${escaparHTML(empleo.descripcion)}</p>
                    <div class="mt-auto">
                        <span class="badge rounded-pill ${claseBadge} px-3 py-2">${escaparHTML(empleo.tipo)}</span>
                    </div>
                </div>
            </article>
        </div>
    `;
}

function renderZona(contenedor, listaEmpleos, mensajeVacio) {
    if (!contenedor) return;

    if (listaEmpleos.length === 0) {
        contenedor.innerHTML = `
            <div class="col-12">
                <div class="border rounded p-4 text-center text-muted bg-light-subtle">
                    ${mensajeVacio}
                </div>
            </div>
        `;
        return;
    }

    contenedor.innerHTML = listaEmpleos.map(crearTarjetaHTML).join("");
    registrarEventosDragEnTarjetas(contenedor);
}

function pintarDashboard() {
    const disponibles = empleosCache.filter(
        empleo => !seleccionadosIds.includes(Number(empleo.id))
    );

    const seleccionados = empleosCache.filter(
        empleo => seleccionadosIds.includes(Number(empleo.id))
    );

    renderZona(
        contenedorDisponibles,
        disponibles,
        "No hay publicaciones disponibles."
    );

    renderZona(
        contenedorSeleccionados,
        seleccionados,
        "Todavía no has seleccionado ninguna publicación."
    );
}

function registrarEventosDragEnTarjetas(contenedor) {
    const tarjetas = contenedor.querySelectorAll(".tarjeta-empleo");

    tarjetas.forEach((tarjeta) => {
        tarjeta.addEventListener("dragstart", (evento) => {
            const id = tarjeta.dataset.id;
            evento.dataTransfer.setData("text/plain", id);
            evento.dataTransfer.effectAllowed = "move";
        });
    });
}

function configurarZonaDrop(zona, destino) {
    if (!zona) return;

    zona.addEventListener("dragover", (evento) => {
        evento.preventDefault();
        evento.dataTransfer.dropEffect = "move";
        zona.classList.add("border", "border-2", "border-primary");
    });

    zona.addEventListener("dragleave", () => {
        zona.classList.remove("border", "border-2", "border-primary");
    });

    zona.addEventListener("drop", (evento) => {
        evento.preventDefault();
        zona.classList.remove("border", "border-2", "border-primary");

        const id = Number(evento.dataTransfer.getData("text/plain"));
        if (!id) return;

        moverTarjeta(id, destino);
    });
}

function moverTarjeta(id, destino) {
    const yaSeleccionado = seleccionadosIds.includes(id);

    if (destino === "seleccionados" && !yaSeleccionado) {
        seleccionadosIds.push(id);
    }

    if (destino === "disponibles" && yaSeleccionado) {
        seleccionadosIds = seleccionadosIds.filter(itemId => itemId !== id);
    }

    guardarSeleccionDashboard(seleccionadosIds);
    pintarDashboard();
}

function configurarDragAndDrop() {
    configurarZonaDrop(contenedorDisponibles, "disponibles");
    configurarZonaDrop(contenedorSeleccionados, "seleccionados");
}

async function cargarDatosDashboard() {
    empleosCache = await obtenerEmpleos();
    seleccionadosIds = obtenerSeleccionDashboard().map(Number);
}

async function inicializarDashboard() {
    try {
        await inicializarAlmacenaje();
        actualizarNavbar();
        await cargarDatosDashboard();
        configurarDragAndDrop();
        pintarDashboard();
    } catch (error) {
        console.error("Error al inicializar el dashboard:", error);

        if (contenedorDisponibles) {
            contenedorDisponibles.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-danger mb-0">
                        No se pudo cargar el dashboard.
                    </div>
                </div>
            `;
        }

        if (contenedorSeleccionados) {
            contenedorSeleccionados.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-warning mb-0">
                        No se pudo cargar la selección guardada.
                    </div>
                </div>
            `;
        }
    }
}

document.addEventListener("DOMContentLoaded", inicializarDashboard);