    let avatarSeleccionado = "";

// Seleccionar avatar
function seleccionarAvatar(img) {

    const avatares = document.querySelectorAll(".avatars img");

    avatares.forEach(function(avatar) {
        avatar.classList.remove("selected");
    });

    img.classList.add("selected");

    avatarSeleccionado = img.src;

    // sonido click
    document.getElementById("audioClick").play();
}


// Función voz femenina
function hablar(texto) {

    const mensaje = new SpeechSynthesisUtterance(texto);

    const voces = speechSynthesis.getVoices();

    const vozFemenina = voces.find(voz =>
        voz.lang.includes("es")
    );

    if (vozFemenina) {
        mensaje.voice = vozFemenina;
    }

    mensaje.lang = "es-ES";
    mensaje.rate = 1;
    mensaje.pitch = 1.2;

    speechSynthesis.speak(mensaje);
}


// Botón ingresar
function ingresar() {

    const nombre = document.getElementById("nombre").value;

    // Validación
    if (nombre === "" || avatarSeleccionado === "") {

        hablar("Por favor ingresa tu nombre y selecciona un avatar");

        document.getElementById("audioError").play();

    } else {

        hablar("Bienvenido " + nombre);

        document.getElementById("audioConfeti").play();

        // redirección
        setTimeout(function () {

            window.location.href = "inicio.html";

        }, 2000);
    }
}