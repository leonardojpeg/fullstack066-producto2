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
    }
}
