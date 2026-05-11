    let avatarSeleccionado = "";

    // Seleccionar avatar
    function seleccionarAvatar(img) {
        const avatares = document.querySelectorAll(".avatars img");

        avatares.forEach(function(avatar) {
            avatar.classList.remove("selected");
        });

        img.classList.add("selected");
        avatarSeleccionado = img.src;

        // Reproducir sonido clic
        document.getElementById("audioClick").play();
    }

// función para hablar con voz femenina
function hablar(texto) {
    const mensaje = new SpeechSynthesisUtterance(texto);

    // buscar una voz femenina en español
    const voces = speechSynthesis.getVoices();

    const vozFemenina = voces.find(voz =>
        voz.lang.includes("es") &&
        (voz.name.includes("Female") ||
        voz.name.includes("Paulina") ||
        voz.name.includes("Helena") ||
        voz.name.includes("Google español"))
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

    if (nombre === "" || avatarSeleccionado === "") {

        // voz de error
        hablar("Por favor ingresa tu nombre y selecciona un avatar");

        // sonido error
        document.getElementById("audioError").play();

    } else {

        // voz bienvenida
        hablar("Bienvenido " + nombre);

        // sonido confeti
        document.getElementById("audioConfeti").play();

        // esperar 2 segundos antes de redirigir
        setTimeout(function () {
            window.location.href = "inicio.html";
        }, 2000);
    }
}