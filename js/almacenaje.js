/*
IA utilizada: ChatGPT

Reescritura de almacenaje.js orientada a Producto 2:
- Usuarios y sesión en localStorage
- Empleos en IndexedDB
- Selección del dashboard en localStorage
- Entidad unificada Empleo con tipo Oferta/Demanda
*/

const CLAVES_STORAGE = {
    USUARIOS: "agrojobs_usuarios",
    USUARIO_ACTIVO: "agrojobs_usuario_activo",
    SELECCION_DASHBOARD: "agrojobs_seleccion_dashboard",
    DATOS_INICIALES_CARGADOS: "agrojobs_datos_iniciales_cargados"
};

const DB_NAME = "AgroJobsDB";
const DB_VERSION = 1;
const STORE_EMPLEOS = "empleos";

/* =========================
   DATOS INICIALES
========================= */

const USUARIOS_INICIALES = [
    {
        id: 1,
        nombre: "Admin",
        email: "admin@agrojobs.com",
        password: "1234",
        rol: "ADMIN"
    },
    {
        id: 2,
        nombre: "Laura Gómez",
        email: "laura@correo.com",
        password: "1234",
        rol: "CANDIDATO"
    },
    {
        id: 3,
        nombre: "Campo Grande",
        email: "rrhh@campogrande.com",
        password: "1234",
        rol: "EMPRESA"
    }
];

const EMPLEOS_INICIALES = [
    {
        id: 1,
        titulo: "Tractorista",
        email: "rrhh@campogrande.com",
        fecha: "2026-04-01",
        descripcion: "Manejo de maquinaria agrícola y apoyo en tareas de campo.",
        tipo: "Oferta"
    },
    {
        id: 2,
        titulo: "Ingeniero agrónomo",
        email: "rrhh@campogrande.com",
        fecha: "2026-04-02",
        descripcion: "Gestión de fincas, mejora de producción y coordinación técnica.",
        tipo: "Oferta"
    },
    {
        id: 3,
        titulo: "Especialista en marketing digital",
        email: "laura@correo.com",
        fecha: "2026-04-03",
        descripcion: "Busco oportunidades en comunicación digital, redes sociales y campañas online.",
        tipo: "Demanda"
    },
    {
        id: 4,
        titulo: "Técnica de soporte IT",
        email: "laura@correo.com",
        fecha: "2026-04-04",
        descripcion: "Experiencia en soporte técnico, incidencias y atención a usuarios.",
        tipo: "Demanda"
    }
];

/* =========================
   UTILIDADES
========================= */

function generarId(lista) {
    if (!Array.isArray(lista) || lista.length === 0) {
        return 1;
    }

    return Math.max(...lista.map(item => Number(item.id) || 0)) + 1;
}

function leerStorage(clave, valorPorDefecto) {
    const dato = localStorage.getItem(clave);

    if (!dato) {
        return valorPorDefecto;
    }

    try {
        return JSON.parse(dato);
    } catch (error) {
        console.error(`Error al parsear la clave ${clave} de localStorage:`, error);
        return valorPorDefecto;
    }
}

function escribirStorage(clave, valor) {
    localStorage.setItem(clave, JSON.stringify(valor));
}

function normalizarTexto(valor) {
    return String(valor ?? "").trim();
}

function validarEmailBasico(email) {
    return /\S+@\S+\.\S+/.test(email);
}

/* =========================
   USUARIOS + SESIÓN
========================= */

export function inicializarUsuarios() {
    const usuariosGuardados = leerStorage(CLAVES_STORAGE.USUARIOS, null);

    if (!usuariosGuardados) {
        escribirStorage(CLAVES_STORAGE.USUARIOS, USUARIOS_INICIALES);
    }
}

export function obtenerUsuarios() {
    inicializarUsuarios();
    return leerStorage(CLAVES_STORAGE.USUARIOS, []);
}

function guardarUsuarios(usuarios) {
    escribirStorage(CLAVES_STORAGE.USUARIOS, usuarios);
}

export function buscarUsuarioPorEmail(email) {
    const emailNormalizado = normalizarTexto(email).toLowerCase();
    return obtenerUsuarios().find(usuario => usuario.email.toLowerCase() === emailNormalizado) || null;
}

export function crearUsuario(nuevoUsuario) {
    const nombre = normalizarTexto(nuevoUsuario?.nombre);
    const email = normalizarTexto(nuevoUsuario?.email).toLowerCase();
    const password = normalizarTexto(nuevoUsuario?.password);
    const rol = normalizarTexto(nuevoUsuario?.rol).toUpperCase();

    if (!nombre || !email || !password || !rol) {
        throw new Error("Todos los campos del usuario son obligatorios.");
    }

    if (!validarEmailBasico(email)) {
        throw new Error("El correo electrónico no es válido.");
    }

    const usuarios = obtenerUsuarios();

    const existe = usuarios.some(usuario => usuario.email.toLowerCase() === email);
    if (existe) {
        throw new Error("Ya existe un usuario con ese correo.");
    }

    const usuario = {
        id: generarId(usuarios),
        nombre,
        email,
        password,
        rol
    };

    usuarios.push(usuario);
    guardarUsuarios(usuarios);

    return usuario;
}

export function eliminarUsuario(id) {
    const idNumero = Number(id);
    const usuarios = obtenerUsuarios();
    const usuariosFiltrados = usuarios.filter(usuario => Number(usuario.id) !== idNumero);

    guardarUsuarios(usuariosFiltrados);

    const usuarioActivo = obtenerUsuarioActivo();
    if (usuarioActivo && Number(usuarioActivo.id) === idNumero) {
        cerrarSesion();
    }
}

export function loguearUsuario(email, password) {
    const emailNormalizado = normalizarTexto(email).toLowerCase();
    const passwordNormalizada = normalizarTexto(password);

    if (!emailNormalizado || !passwordNormalizada) {
        throw new Error("Debes introducir correo y contraseña.");
    }

    const usuario = obtenerUsuarios().find(
        item =>
            item.email.toLowerCase() === emailNormalizado &&
            item.password === passwordNormalizada
    );

    if (!usuario) {
        throw new Error("Correo o contraseña incorrectos.");
    }

    guardarUsuarioActivo(usuario);
    return usuario;
}

export function validarLogin(email, password) {
    try {
        return loguearUsuario(email, password);
    } catch {
        return null;
    }
}

export function guardarUsuarioActivo(usuario) {
    escribirStorage(CLAVES_STORAGE.USUARIO_ACTIVO, usuario);
}

export function obtenerUsuarioActivo() {
    return leerStorage(CLAVES_STORAGE.USUARIO_ACTIVO, null);
}

export function cerrarSesion() {
    localStorage.removeItem(CLAVES_STORAGE.USUARIO_ACTIVO);
}

/* =========================
   INDEXEDDB - EMPLEOS
========================= */

export function abrirDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => {
            reject(new Error("No se pudo abrir IndexedDB."));
        };

        request.onupgradeneeded = event => {
            const db = event.target.result;

            if (!db.objectStoreNames.contains(STORE_EMPLEOS)) {
                const store = db.createObjectStore(STORE_EMPLEOS, {
                    keyPath: "id"
                });

                store.createIndex("tipo", "tipo", { unique: false });
                store.createIndex("email", "email", { unique: false });
                store.createIndex("fecha", "fecha", { unique: false });
            }
        };

        request.onsuccess = () => {
            resolve(request.result);
        };
    });
}

function transaccionPromesa(store, modo) {
    return abrirDB().then(db => {
        const tx = db.transaction(STORE_EMPLEOS, modo);
        const objectStore = tx.objectStore(STORE_EMPLEOS);

        return { db, tx, objectStore };
    });
}

export async function inicializarEmpleos() {
    const yaCargados = localStorage.getItem(CLAVES_STORAGE.DATOS_INICIALES_CARGADOS);

    if (yaCargados === "true") {
        return;
    }

    const empleosActuales = await obtenerEmpleos();
    if (empleosActuales.length > 0) {
        localStorage.setItem(CLAVES_STORAGE.DATOS_INICIALES_CARGADOS, "true");
        return;
    }

    for (const empleo of EMPLEOS_INICIALES) {
        await crearEmpleo(empleo, true);
    }

    localStorage.setItem(CLAVES_STORAGE.DATOS_INICIALES_CARGADOS, "true");
}

export async function obtenerEmpleos() {
    const { db, objectStore } = await transaccionPromesa(STORE_EMPLEOS, "readonly");

    return new Promise((resolve, reject) => {
        const request = objectStore.getAll();

        request.onsuccess = () => {
            db.close();
            const empleos = Array.isArray(request.result) ? request.result : [];
            empleos.sort((a, b) => Number(a.id) - Number(b.id));
            resolve(empleos);
        };

        request.onerror = () => {
            db.close();
            reject(new Error("No se pudieron obtener los empleos."));
        };
    });
}

export async function obtenerEmpleoPorId(id) {
    const { db, objectStore } = await transaccionPromesa(STORE_EMPLEOS, "readonly");

    return new Promise((resolve, reject) => {
        const request = objectStore.get(Number(id));

        request.onsuccess = () => {
            db.close();
            resolve(request.result || null);
        };

        request.onerror = () => {
            db.close();
            reject(new Error("No se pudo obtener el empleo."));
        };
    });
}

export async function crearEmpleo(nuevoEmpleo, mantenerId = false) {
    const titulo = normalizarTexto(nuevoEmpleo?.titulo);
    const email = normalizarTexto(nuevoEmpleo?.email).toLowerCase();
    const fecha = normalizarTexto(nuevoEmpleo?.fecha);
    const descripcion = normalizarTexto(nuevoEmpleo?.descripcion);
    const tipo = normalizarTexto(nuevoEmpleo?.tipo);

    if (!titulo || !email || !fecha || !descripcion || !tipo) {
        throw new Error("Todos los campos del empleo son obligatorios.");
    }

    if (!validarEmailBasico(email)) {
        throw new Error("El email del empleo no es válido.");
    }

    if (tipo !== "Oferta" && tipo !== "Demanda") {
        throw new Error('El tipo debe ser "Oferta" o "Demanda".');
    }

    const empleos = await obtenerEmpleos();

    const empleo = {
        id: mantenerId && nuevoEmpleo.id ? Number(nuevoEmpleo.id) : generarId(empleos),
        titulo,
        email,
        fecha,
        descripcion,
        tipo
    };

    const { db, objectStore } = await transaccionPromesa(STORE_EMPLEOS, "readwrite");

    return new Promise((resolve, reject) => {
        const request = objectStore.add(empleo);

        request.onsuccess = () => {
            db.close();
            resolve(empleo);
        };

        request.onerror = () => {
            db.close();
            reject(new Error("No se pudo crear el empleo."));
        };
    });
}

export async function eliminarEmpleo(id) {
    const { db, objectStore } = await transaccionPromesa(STORE_EMPLEOS, "readwrite");

    return new Promise((resolve, reject) => {
        const request = objectStore.delete(Number(id));

        request.onsuccess = () => {
            db.close();
            resolve(true);
        };

        request.onerror = () => {
            db.close();
            reject(new Error("No se pudo eliminar el empleo."));
        };
    });
}

/* =========================
   COMPATIBILIDAD TEMPORAL
========================= */

export async function obtenerOfertas() {
    const empleos = await obtenerEmpleos();
    return empleos.filter(empleo => empleo.tipo === "Oferta");
}

export async function obtenerDemandas() {
    const empleos = await obtenerEmpleos();
    return empleos.filter(empleo => empleo.tipo === "Demanda");
}

export async function crearPublicacion(nuevaPublicacion) {
    return crearEmpleo({
        titulo: nuevaPublicacion?.titulo ?? nuevaPublicacion?.nombre ?? "",
        email: nuevaPublicacion?.email ?? "",
        fecha: nuevaPublicacion?.fecha ?? new Date().toISOString().split("T")[0],
        descripcion: nuevaPublicacion?.descripcion ?? "",
        tipo: "Demanda"
    });
}

export async function eliminarPublicacion(id) {
    return eliminarEmpleo(id);
}

/* =========================
   DASHBOARD
========================= */

export function guardarSeleccionDashboard(idsSeleccionados) {
    if (!Array.isArray(idsSeleccionados)) {
        throw new Error("La selección del dashboard debe ser un array.");
    }

    escribirStorage(CLAVES_STORAGE.SELECCION_DASHBOARD, idsSeleccionados);
}

export function obtenerSeleccionDashboard() {
    return leerStorage(CLAVES_STORAGE.SELECCION_DASHBOARD, []);
}

/* =========================
   INICIALIZACIÓN GENERAL
========================= */

export async function inicializarAlmacenaje() {
    inicializarUsuarios();
    await inicializarEmpleos();
}