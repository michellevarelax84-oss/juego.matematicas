        // Obtener datos guardados
        const nombreUsuario = localStorage.getItem("nombreUsuario");
        const avatarUsuario = localStorage.getItem("avatarUsuario");

        // Mostrar saludo
        if (nombreUsuario) {
            document.getElementById("saludol").innerHTML =
                "Bienvenido " + nombreUsuario + " 🎉";
        }

        // Mostrar avatar seleccionado
        if (avatarUsuario) {
            document.getElementById("avatar").src = avatarUsuario;
        } else {
            // Avatar por defecto si no encuentra nada
            document.getElementById("avatar").src = "img/avatar1.png";
        }

        // Ir al juego
        function irJuego1() {
            window.location.href = "juego1.html";
        }
        