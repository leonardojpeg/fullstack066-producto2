/*
IA utilizada: ChatGPT

Prompt 1: "Cómo pintar tarjetas dinámicas con JavaScript a partir de arrays"
Prompt 2: "Cómo mostrar ofertas y demandas en un dashboard con Bootstrap"
Prompt 3: "Cómo crear tarjetas visuales con imágenes placeholder en JavaScript"
Prompt 4: "Cómo mostrar usuario logueado y botón cerrar sesión en la navbar"
*/

import { ofertas, demandas } from "./datos.js";

const contenedor = document.getElementById("contenedor-tarjetas");

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
    window.location.href = "login.html";
}

function pintarTarjetas() {
    if (!contenedor) return;

    let html = "";

    ofertas.forEach((oferta) => {
        html += `
            <div class="col-md-6 col-xl-4">
                <article class="card dashboard-card oferta-card h-100 shadow-sm">
                    <img 
                        src="https://placehold.co/600x320/eaf2ff/0d6efd?text=Oferta+de+empleo" 
                        class="card-img-top dashboard-card-img" 
                        alt="Imagen de oferta de empleo"
                    >
                    <div class="card-body d-flex flex-column">
                        <span class="small text-uppercase text-primary fw-semibold mb-2">Oferta laboral</span>
                        <h3 class="card-title h4">${oferta.titulo}</h3>
                        <p class="card-text mb-2"><strong>Empresa:</strong> ${oferta.empresa}</p>
                        <p class="card-text mb-4"><strong>Ubicación:</strong> ${oferta.ubicacion}</p>
                        <div class="mt-auto">
                            <span class="badge rounded-pill text-bg-primary px-3 py-2">Oferta</span>
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
                    <img 
                        src="https://placehold.co/600x320/eafaf1/198754?text=Demanda+de+empleo" 
                        class="card-img-top dashboard-card-img" 
                        alt="Imagen de demanda de empleo"
                    >
                    <div class="card-body d-flex flex-column">
                        <span class="small text-uppercase text-success fw-semibold mb-2">Perfil candidato</span>
                        <h3 class="card-title h4">${demanda.nombre}</h3>
                        <p class="card-text mb-2"><strong>Busca:</strong> ${demanda.profesion}</p>
                        <p class="card-text mb-4"><strong>Disponibilidad:</strong> ${demanda.disponibilidad}</p>
                        <div class="mt-auto">
                            <span class="badge rounded-pill text-bg-success px-3 py-2">Demanda</span>
                        </div>
                    </div>
                </article>
            </div>
        `;
    });

    contenedor.innerHTML = html;
}

actualizarNavbar();
pintarTarjetas();