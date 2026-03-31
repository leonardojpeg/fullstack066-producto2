/*
IA utilizada: ChatGPT

Prompt 1: "Cómo crear y renderizar ofertas y demandas con JavaScript y arrays"
Prompt 2: "Cómo usar un formulario para añadir elementos a un array en JavaScript"
Prompt 3: "Cómo eliminar tarjetas dinámicas con addEventListener y data attributes"
Prompt 4: "Cómo mostrar ofertas y demandas con estilos diferentes usando Bootstrap"
*/

import { ofertas as ofertasIniciales, demandas as demandasIniciales } from "./datos.js";
import { Almacenaje, actualizarNavbar } from "./almacenaje.js";

document.addEventListener("DOMContentLoaded", () => {
    // 1. Sincronización inicial con LocalStorage
    if (Almacenaje.obtenerOfertas().length === 0) Almacenaje.guardarOfertas(ofertasIniciales);
    if (Almacenaje.obtenerDemandas().length === 0) Almacenaje.guardarDemandas(demandasIniciales);

    const formularioOferta = document.getElementById("form-oferta");
    const inputTipo = document.getElementById("tipo");
    const inputTitulo = document.getElementById("titulo");
    const inputEmpresa = document.getElementById("empresa");
    const inputUbicacion = document.getElementById("ubicacion");
    const inputDescripcion = document.getElementById("descripcion");
    const mensajeOferta = document.getElementById("mensaje-oferta");
    const contenedorOfertas = document.getElementById("contenedor-ofertas");
    const tablaOfertas = document.getElementById("tabla-ofertas");

    function mostrarMensaje(texto, tipo) {
        if (!mensajeOferta) return;
        mensajeOferta.textContent = texto;
        mensajeOferta.className = "";
        mensajeOferta.classList.add(tipo === "error" ? "mensaje-error" : "mensaje-ok");
    }

    function obtenerNuevoId(array) {
        return array.length === 0 ? 1 : Math.max(...array.map(e => e.id)) + 1;
    }

    function pintarPublicaciones() {
        const ofertas = Almacenaje.obtenerOfertas();
        const demandas = Almacenaje.obtenerDemandas();
        
        pintarTarjetas(ofertas, demandas);
        pintarTabla(ofertas, demandas);
        registrarEventosEliminar();
    }

    function pintarTarjetas(ofertas, demandas) {
        if (!contenedorOfertas) return;
        let html = "";

        ofertas.forEach((o) => {
            html += `
                <div class="col-md-6 col-xl-4">
                    <article class="card dashboard-card h-100 shadow-sm">
                        <div class="card-body">
                            <span class="small text-uppercase text-primary fw-semibold d-block mb-2">Oferta laboral</span>
                            <h3 class="card-title h4">${o.titulo}</h3>
                            <p class="card-text mb-1"><strong>${o.empresa}</strong></p>
                            <p class="card-text text-muted small">${o.ubicacion}</p>
                            <p class="mt-3 small">${o.descripcion || "Sin descripción."}</p>
                            <div class="d-flex justify-content-between align-items-center mt-4">
                                <span class="badge rounded-pill text-bg-primary">Oferta</span>
                                <button class="btn btn-outline-danger btn-sm btn-eliminar-oferta" data-id="${o.id}">Eliminar</button>
                            </div>
                        </div>
                    </article>
                </div>`;
        });

        demandas.forEach((d) => {
            html += `
                <div class="col-md-6 col-xl-4">
                    <article class="card dashboard-card h-100 shadow-sm">
                        <div class="card-body">
                            <span class="small text-uppercase text-success fw-semibold d-block mb-2">Perfil candidato</span>
                            <h3 class="card-title h4">${d.nombre}</h3>
                            <p class="card-text mb-1"><strong>${d.profesion}</strong></p>
                            <p class="card-text text-muted small">${d.disponibilidad}</p>
                            <p class="mt-3 small">${d.descripcion || "Sin descripción."}</p>
                            <div class="d-flex justify-content-between align-items-center mt-4">
                                <span class="badge rounded-pill text-bg-success">Demanda</span>
                                <button class="btn btn-outline-danger btn-sm btn-eliminar-demanda" data-id="${d.id}">Eliminar</button>
                            </div>
                        </div>
                    </article>
                </div>`;
        });
        contenedorOfertas.innerHTML = html;
    }

    function pintarTabla(ofertas, demandas) {
        if (!tablaOfertas) return;
        let html = "";
        
        const fila = (id, tipo, t1, t2, t3, desc, clase, btnClase) => `
            <tr>
                <td>${id}</td>
                <td><span class="badge ${clase}">${tipo}</span></td>
                <td>${t1}</td><td>${t2}</td><td>${t3}</td>
                <td class="small">${desc || "-"}</td>
                <td class="text-end">
                    <button class="btn btn-outline-danger btn-sm ${btnClase}" data-id="${id}">Eliminar</button>
                </td>
            </tr>`;

        ofertas.forEach(o => html += fila(o.id, "Oferta", o.titulo, o.empresa, o.ubicacion, o.descripcion, "text-bg-primary", "btn-eliminar-oferta"));
        demandas.forEach(d => html += fila(d.id, "Demanda", d.nombre, d.profesion, d.disponibilidad, d.descripcion, "text-bg-success", "btn-eliminar-demanda"));
        
        tablaOfertas.innerHTML = html;
    }

    function registrarEventosEliminar() {
        document.querySelectorAll(".btn-eliminar-oferta").forEach(b => {
            b.onclick = () => {
                const lista = Almacenaje.obtenerOfertas().filter(o => o.id !== Number(b.dataset.id));
                Almacenaje.guardarOfertas(lista);
                pintarPublicaciones();
                mostrarMensaje("Oferta eliminada", "ok");
            };
        });
        document.querySelectorAll(".btn-eliminar-demanda").forEach(b => {
            b.onclick = () => {
                const lista = Almacenaje.obtenerDemandas().filter(d => d.id !== Number(b.dataset.id));
                Almacenaje.guardarDemandas(lista);
                pintarPublicaciones();
                mostrarMensaje("Demanda eliminada", "ok");
            };
        });
    }

    function crearPublicacion(evento) {
        evento.preventDefault();
        const tipo = inputTipo.value;
        const datos = {
            titulo: inputTitulo.value.trim(),
            empresa: inputEmpresa.value.trim(),
            ubicacion: inputUbicacion.value.trim(),
            descripcion: inputDescripcion.value.trim()
        };

        if (!tipo || !datos.titulo || !datos.empresa || !datos.ubicacion) {
            mostrarMensaje("Rellena todos los campos", "error");
            return;
        }

        if (tipo === "oferta") {
            const lista = Almacenaje.obtenerOfertas();
            lista.push({ id: obtenerNuevoId(lista), ...datos });
            Almacenaje.guardarOfertas(lista);
        } else {
            const lista = Almacenaje.obtenerDemandas();
            lista.push({ 
                id: obtenerNuevoId(lista), 
                nombre: datos.titulo, 
                profesion: datos.empresa, 
                disponibilidad: datos.ubicacion, 
                descripcion: datos.descripcion 
            });
            Almacenaje.guardarDemandas(lista);
        }

        formularioOferta.reset();
        pintarPublicaciones();
        mostrarMensaje("Publicado con éxito", "ok");
    }

    actualizarNavbar();
    pintarPublicaciones();
    if (formularioOferta) formularioOferta.addEventListener("submit", crearPublicacion);
});