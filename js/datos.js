/*
IA utilizada: ChatGPT

Prompt 1: "Cómo organizar datos de ejemplo en un archivo modular JavaScript"
Prompt 2: "Cómo exportar arrays de objetos para reutilizarlos en varios archivos JS"
Prompt 3: "Qué estructura deben tener usuarios, ofertas y demandas en un prototipo frontend"
Prompt 4: "Cómo definir datos iniciales en memoria para una aplicación sin persistencia"
*/

export let ofertas = [
    {
        id: 1,
        titulo: "Tractorista",
        empresa: "Campo Grande",
        ubicacion: "Tórrec",
        descripcion: "Manejo de maquinaria agrícola y apoyo en tareas de campo."
    },
    {
        id: 2,
        titulo: "Ingeniero agrónomo",
        empresa: "Monmalo",
        ubicacion: "Agramunt",
        descripcion: "Gestión de fincas, mejora de producción y coordinación técnica."
    }
];

export let demandas = [
    {
        id: 1,
        nombre: "Laura Gómez",
        profesion: "Marketing Digital",
        disponibilidad: "Inmediata",
        descripcion: "Interesada en comunicación digital, redes sociales y campañas online."
    },
    {
        id: 2,
        nombre: "Carlos Pérez",
        profesion: "Soporte IT",
        disponibilidad: "15 días",
        descripcion: "Experiencia en soporte técnico, incidencias y atención a usuarios."
    }
];

export let usuarios = [
    {
        id: 1,
        nombre: "Admin",
        email: "admin@agrojobs.com",
        password: "1234",
        rol: "Administrador"
    },
    {
        id: 2,
        nombre: "Laura Gómez",
        email: "laura@correo.com",
        password: "1234",
        rol: "Candidato"
    },
    {
        id: 3,
        nombre: "Campo Grande",
        email: "rrhh@campogrande.com",
        password: "1234",
        rol: "Empresa"
    }
];