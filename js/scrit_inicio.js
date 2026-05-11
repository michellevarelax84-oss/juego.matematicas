 // obtener datos
        const nombreUsuario = localStorage.getItem("nombreUsuario");
        const avatarUsuario = localStorage.getItem("avatarUsuario");

        // mostrar datos
        document.getElementById("saludol").innerHTML
            "Bienvenido " + nombreUsuario;

        //mostrar avatar
        document.getElementById("avatar").src = avatarUsuario;
        // ir al juego 1
        function irJuego1() {
    window.location.href = "juego1.html";
}document.getElementById("saludol").innerHTML