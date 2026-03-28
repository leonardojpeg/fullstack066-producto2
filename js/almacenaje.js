/*
IA utilizada: ChatGPT

Prompt 1: "Cómo organizar un almacenaje.js para una aplicación frontend sin base de datos"
Prompt 2: "Cómo definir arrays privados y métodos públicos en un módulo JavaScript"
Prompt 3: "Cómo modelar usuarios, ofertas de empleo y demandas de empleo en memoria"
Prompt 4: "Cómo separar crearPublicacion() y crearEmpleo() según el tipo de publicación"
*/

let usuarios = [
    {
        id: 1,
        nombre: "Admin",
        email: "admin@agrojobs.com",
        password: "1234", // Solo demo
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

let demandas = [
    {
        id: 1,
        usuarioId: 2,
        nombre: "Laura Gómez",
        profesion: "Marketing Digital",
        disponibilidad: "Inmediata",
        descripcion: "Interesada en comunicación digital, redes sociales y campañas online."
    },
    {
        id: 2,
        usuarioId: 2,
        nombre: "Laura Gómez",
        profesion: "Soporte IT",
        disponibilidad: "15 días",
        descripcion: "Experiencia en soporte técnico, incidencias y atención a usuarios."
    }
];

let ofertas = [
    {
        id: 1,
        empresaId: 3,
        empresa: "Campo Grande",
        titulo: "Tractorista",
        ubicacion: "Tòrrec (Lleida)",
        descripcion: "Manejo de maquinaria agrícola y apoyo en tareas de campo.",
        salario: "1600€/mes",
        tipoContrato: "Temporal"
    },
    {
        id: 2,
        empresaId: 3,
        empresa: "Campo Grande",
        titulo: "Ingeniero agrónomo",
        ubicacion: "Agramunt (Lleida)",
        descripcion: "Gestión de fincas, mejora de producción y coordinación técnica.",
        salario: "2200€/mes",
        tipoContrato: "Indefinido"
    }
];

function generarId(lista) {
    if (lista.length === 0) return 1;
    return Math.max(...lista.map(item => item.id)) + 1;
}

/* =========================
   USUARIOS
========================= */

export function obtenerUsuarios() {
    return usuarios;
}

export function buscarUsuarioPorEmail(email) {
    return usuarios.find(usuario => usuario.email === email);
}

export function validarLogin(email, password) {
    return usuarios.find(
        usuario => usuario.email === email && usuario.password === password
    );
}

export function crearUsuario(nuevoUsuario) {
    const usuario = {
        id: generarId(usuarios),
        ...nuevoUsuario
    };

    usuarios.push(usuario);
    return usuario;
}

export function eliminarUsuario(id) {
    usuarios = usuarios.filter(usuario => usuario.id !== id);
}

/* =========================
   DEMANDAS / PUBLICACIONES
========================= */

export function obtenerDemandas() {
    return demandas;
}

export function obtenerPublicaciones() {
    return demandas;
}

export function obtenerPublicacionPorId(id) {
    return demandas.find(publicacion => publicacion.id === id);
}

export function crearPublicacion(nuevaPublicacion) {
    const publicacion = {
        id: generarId(demandas),
        ...nuevaPublicacion
    };

    demandas.push(publicacion);
    return publicacion;
}

export function editarPublicacion(id, datosActualizados) {
    const indice = demandas.findIndex(publicacion => publicacion.id === id);

    if (indice !== -1) {
        demandas[indice] = {
            ...demandas[indice],
            ...datosActualizados
        };
        return demandas[indice];
    }

    return null;
}

export function eliminarPublicacion(id) {
    demandas = demandas.filter(publicacion => publicacion.id !== id);
}

/* =========================
   OFERTAS / EMPLEOS
========================= */

export function obtenerOfertas() {
    return ofertas;
}

export function obtenerEmpleoPorId(id) {
    return ofertas.find(oferta => oferta.id === id);
}

export function crearEmpleo(nuevoEmpleo) {
    const empleo = {
        id: generarId(ofertas),
        ...nuevoEmpleo
    };

    ofertas.push(empleo);
    return empleo;
}

export function editarEmpleo(id, datosActualizados) {
    const indice = ofertas.findIndex(oferta => oferta.id === id);

    if (indice !== -1) {
        ofertas[indice] = {
            ...ofertas[indice],
            ...datosActualizados
        };
        return ofertas[indice];
    }

    return null;
}

export function eliminarEmpleo(id) {
    ofertas = ofertas.filter(oferta => oferta.id !== id);
}