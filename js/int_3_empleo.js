/*
IA utilizada: ChatGPT

Adaptación definitiva de int_3_empleo.js para Producto 2:
- empleos gestionados en IndexedDB mediante almacenaje.js
- entidad unificada Empleo
- render de tarjetas y tabla
- borrado persistente
- gráfico Canvas nativo
*/

import {
    inicializarAlmacenaje,
    obtenerEmpleos,
    crearEmpleo,
    eliminarEmpleo,
    obtenerUsuarioActivo,
    cerrarSesion
} from "./almacenaje.js";

const formularioOferta = document.getElementById("form-oferta");
const inputTipo = document.getElementById("tipo");
const inputTitulo = document.getElementById("titulo");
const inputEmail = document.getElementById("email");
const inputFecha = document.getElementById("fecha");
const inputDescripcion = document.getElementById("descripcion");

const mensajeOferta = document.getElementById("mensaje-oferta");
const contenedorOfertas = document.getElementById("contenedor-ofertas");
const tablaOfertas = document.getElementById("tabla-ofertas");
const canvasGrafico = document.getElementById("grafico-empleos");

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

function normalizarTipo(valor) {
    if (valor === "oferta") return "Oferta";
    if (valor === "demanda") return "Demanda";
    return "";
}

function validarFormularioEmpleo(tipo, titulo, email, fecha, descripcion) {
    if (!tipo || !titulo || !email || !fecha || !descripcion) {
        throw new Error("Debes rellenar todos los campos obligatorios.");
    }

    if (!["Oferta", "Demanda"].includes(tipo)) {
        throw new Error('El tipo debe ser "Oferta" o "Demanda".');
    }

    const emailValido = /\S+@\S+\.\S+/.test(email);
    if (!emailValido) {
        throw new Error("Debes introducir un correo electrónico válido.");
    }
}

function escaparHTML(texto) {
    return String(texto ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

async function pintarPublicaciones() {
    try {
        const empleos = await obtenerEmpleos();
        pintarTarjetas(empleos);
        pintarTabla(empleos);
        registrarEventosEliminar();
        dibujarGraficoCanvas(empleos);
    } catch (error) {
        console.error("Error al pintar publicaciones:", error);
        mostrarMensaje("No se pudieron cargar las publicaciones.", "error");
    }
}

function pintarTarjetas(empleos) {
    if (!contenedorOfertas) return;

    let html = "";

    empleos.forEach((empleo) => {
        const esOferta = empleo.tipo === "Oferta";
        const claseCard = esOferta ? "oferta-card" : "demanda-card";
        const claseTexto = esOferta ? "text-primary" : "text-success";
        const claseBadge = esOferta ? "text-bg-primary" : "text-bg-success";
        const etiqueta = esOferta ? "Oferta laboral" : "Demanda de empleo";

        html += `
            <div class="col-md-6 col-xl-4">
                <article class="card dashboard-card ${claseCard} h-100 shadow-sm">
                    <div class="card-body">
                        <span class="small text-uppercase ${claseTexto} fw-semibold mb-2 d-block">${etiqueta}</span>
                        <h3 class="card-title h4">${escaparHTML(empleo.titulo)}</h3>
                        <p class="card-text mb-2"><strong>Email:</strong> ${escaparHTML(empleo.email)}</p>
                        <p class="card-text mb-3"><strong>Fecha:</strong> ${escaparHTML(empleo.fecha)}</p>
                        <p class="text-muted small">${escaparHTML(empleo.descripcion)}</p>
                        <div class="d-flex justify-content-between align-items-center mt-4">
                            <span class="badge rounded-pill ${claseBadge} px-3 py-2">${escaparHTML(empleo.tipo)}</span>
                            <button
                                type="button"
                                class="btn btn-outline-danger btn-sm btn-eliminar-empleo"
                                data-id="${empleo.id}">
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

function pintarTabla(empleos) {
    if (!tablaOfertas) return;

    let html = "";

    empleos.forEach((empleo) => {
        const claseBadge = empleo.tipo === "Oferta" ? "text-bg-primary" : "text-bg-success";

        html += `
            <tr>
                <td>${empleo.id}</td>
                <td><span class="badge ${claseBadge}">${escaparHTML(empleo.tipo)}</span></td>
                <td>${escaparHTML(empleo.titulo)}</td>
                <td>${escaparHTML(empleo.email)}</td>
                <td>${escaparHTML(empleo.fecha)}</td>
                <td>${escaparHTML(empleo.descripcion)}</td>
                <td class="text-end">
                    <button
                        type="button"
                        class="btn btn-outline-danger btn-sm btn-eliminar-empleo"
                        data-id="${empleo.id}">
                        Eliminar
                    </button>
                </td>
            </tr>
        `;
    });

    tablaOfertas.innerHTML = html;
}

function registrarEventosEliminar() {
    const botonesEliminar = document.querySelectorAll(".btn-eliminar-empleo");

    botonesEliminar.forEach((boton) => {
        boton.addEventListener("click", async () => {
            const id = Number(boton.dataset.id);
            await gestionarEliminacionEmpleo(id);
        });
    });
}

async function gestionarEliminacionEmpleo(id) {
    try {
        await eliminarEmpleo(id);
        await pintarPublicaciones();
        mostrarMensaje("Publicación eliminada correctamente.", "ok");
    } catch (error) {
        console.error("Error al eliminar empleo:", error);
        mostrarMensaje(error.message || "No se pudo eliminar la publicación.", "error");
    }
}

async function gestionarCreacionPublicacion(evento) {
    evento.preventDefault();

    const tipo = normalizarTipo(inputTipo.value.trim());
    const titulo = inputTitulo.value.trim();
    const email = inputEmail.value.trim();
    const fecha = inputFecha.value.trim();
    const descripcion = inputDescripcion.value.trim();

    try {
        validarFormularioEmpleo(tipo, titulo, email, fecha, descripcion);

        await crearEmpleo({
            titulo,
            email,
            fecha,
            descripcion,
            tipo
        });

        if (formularioOferta) {
            formularioOferta.reset();
        }

        await pintarPublicaciones();
        mostrarMensaje("Publicación creada correctamente.", "ok");
    } catch (error) {
        console.error("Error al crear empleo:", error);
        mostrarMensaje(error.message || "No se pudo crear la publicación.", "error");
    }
}

function dibujarGraficoCanvas(empleos) {
    if (!canvasGrafico) return;

    const ctx = canvasGrafico.getContext("2d");
    if (!ctx) return;

    const ofertas = empleos.filter(empleo => empleo.tipo === "Oferta").length;
    const demandas = empleos.filter(empleo => empleo.tipo === "Demanda").length;

    const width = canvasGrafico.width;
    const height = canvasGrafico.height;

    ctx.clearRect(0, 0, width, height);

    // Fondo
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    // Título
    ctx.fillStyle = "#212529";
    ctx.font = "bold 18px Inter, sans-serif";
    ctx.fillText("Gráfico de ofertas y demandas", 20, 30);

    // Ejes
    ctx.strokeStyle = "#adb5bd";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(60, 260);
    ctx.lineTo(640, 260);
    ctx.moveTo(60, 60);
    ctx.lineTo(60, 260);
    ctx.stroke();

    const maxValor = Math.max(ofertas, demandas, 1);
    const escala = 160 / maxValor;

    const alturaOfertas = ofertas * escala;
    const alturaDemandas = demandas * escala;

    // Barra ofertas
    ctx.fillStyle = "#0d6efd";
    ctx.fillRect(150, 260 - alturaOfertas, 120, alturaOfertas);

    // Barra demandas
    ctx.fillStyle = "#198754";
    ctx.fillRect(380, 260 - alturaDemandas, 120, alturaDemandas);

    // Etiquetas
    ctx.fillStyle = "#212529";
    ctx.font = "14px Inter, sans-serif";
    ctx.fillText("Ofertas", 180, 285);
    ctx.fillText("Demandas", 395, 285);

    // Valores
    ctx.font = "bold 14px Inter, sans-serif";
    ctx.fillText(String(ofertas), 200, Math.max(80, 250 - alturaOfertas));
    ctx.fillText(String(demandas), 430, Math.max(80, 250 - alturaDemandas));
}

async function inicializarVistaEmpleos() {
    try {
        await inicializarAlmacenaje();
        actualizarNavbar();
        await pintarPublicaciones();

        if (formularioOferta) {
            formularioOferta.addEventListener("submit", gestionarCreacionPublicacion);
        }
    } catch (error) {
        console.error("Error al inicializar la vista de empleos:", error);
        mostrarMensaje("Error al cargar la gestión de empleos.", "error");
    }
}

document.addEventListener("DOMContentLoaded", inicializarVistaEmpleos);