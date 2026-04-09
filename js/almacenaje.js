export const almacenaje={

    //Función mostrarUsuarioActivo:
    mostrarUsuarioActivo: function(){
        return localStorage.getItem("usuarioActivo");
    },

    //Funcion loguearUsuario
   loguearUsuario: function(email, password, listaUsuarios){
        const usuarioEncontrado= listaUsuarios.find(usuario =>usuario.email === email && usuario.password ===password);
        if(usuarioEncontrado){
            localStorage.setItem("usuarioActivo", usuarioEncontrado.email);
            return usuarioEncontrado;
        }
        return null;
    },

    //Funcion cerrar la sesion
    cerrarSesion: function() {
    localStorage.removeItem("usuarioActivo");
    },

//Fuente de datos ofertas y demandas IndexeDB
    dbName: "AgroJobs",
    
    conectar: () => {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open("AgroJobs", 1);
            
            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains("ofertas")) db.createObjectStore("ofertas", { keyPath: "id" });
                if (!db.objectStoreNames.contains("demandas")) db.createObjectStore("demandas", { keyPath: "id" });
            };

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject("Error al abrir IndexedDB");
        });
    },

    //Alta (put)
    guardar: async (tabla, datos) => {
        const db = await almacenaje.conectar();
        const tx = db.transaction(tabla, "readwrite");
        tx.objectStore(tabla).put(datos);
    },

    //Visualizar 
    obtenerTodo: async (tabla) => {
        const db = await almacenaje.conectar();
        return new Promise((resolve) => {
            const tx = db.transaction(tabla, "readonly");
            const request = tx.objectStore(tabla).getAll();
            request.onsuccess = () => resolve(request.result);
        });
    },

    //Eliminar (delete)
    borrar: async (tabla, id) => {
        const db = await almacenaje.conectar();
        const tx = db.transaction(tabla, "readwrite");
        tx.objectStore(tabla).delete(id);
    }
}

