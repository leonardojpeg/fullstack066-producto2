import { almacenaje } from "./almacenaje.js";

const formularioOferta = document.getElementById("form-oferta");
const inputTipo = document.getElementById("tipo");
const inputTitulo = document.getElementById("titulo");
const inputUbicacion = document.getElementById("ubicacion");
const inputDescripcion = document.getElementById("descripcion");
const mensajeOferta = document.getElementById("mensaje-oferta");
const contenedorOfertas = document.getElementById("contenedor-ofertas");
const tablaOfertas = document.getElementById("tabla-ofertas");
const inputEmailContacto = document.getElementById("email"); 
const inputFecha = document.getElementById("fechaPublicacion"); 

//Se recoge-recopila todos los datos de ofertas (consulta) y demandas ys e muestran
async function inicializarPagina() {
    const listaOfertas = await almacenaje.obtenerTodo("ofertas");
    const listaDemandas = await almacenaje.obtenerTodo("demandas");

    pintarTarjetas(listaOfertas, listaDemandas);
    pintarTabla(listaOfertas, listaDemandas);
    graficoOfertasDemandas(listaOfertas.length, listaDemandas.length);
}

document.addEventListener("DOMContentLoaded", inicializarPagina);

//Tenemos en cuenta las funciones de ofertas.js para publicar y para eliminar objetos 
//Lógica de alta
async function crearPublicacion(evento) { 
    evento.preventDefault();

    const tipo = inputTipo.value.trim();
    const titulo = inputTitulo.value.trim();
    const email = inputEmail.value.trim(); 
    const fecha = inputFecha.value;
    const ubicacion = inputUbicacion.value.trim();
    const descripcion = inputDescripcion.value.trim();

    if (tipo === "" || titulo === "" || email === "" || fecha === "" || ubicacion === "") {
        mostrarMensaje("Debes rellenar todos los campos", "error");
        return;
    }

    const nuevaPublicacion = {
        id: Date.now(), 
        titulo,
        email,
        fecha,
        ubicacion,
        descripcion
    };

    if (tipo === "oferta") {
        await almacenaje.guardar("ofertas", nuevaPublicacion);
        mostrarMensaje("Oferta creada.", "ok");
    } else if (tipo === "demanda") {
        await almacenaje.guardar("demandas", nuevaPublicacion);
        mostrarMensaje("Demanda creada.", "ok");
    }
    if (formularioOferta) formularioOferta.reset();
    await inicializarPagina(); 
}

//Lógica suprimir/eliminar
async function eliminarOferta(id) {
    await almacenaje.borrar("ofertas", id);
    mostrarMensaje("Oferta eliminada.", "ok");
    await inicializarPagina(); 
}

async function eliminarDemanda(id) {
    await almacenaje.borrar("demandas", id);
    mostrarMensaje("Demanda creada.", "ok");
    await inicializarPagina();
}

