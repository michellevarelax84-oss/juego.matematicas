let avatarSeleccionado = "";

// Seleccionar avatar
function seleccionarAvatar(img) {

    const avatares = document.querySelectorAll(".avatars img");

    avatares.forEach(function(avatar) {
        avatar.classList.remove("selected");
    });

    img.classList.add("selected");

    avatarSeleccionado = img.src;

    // Sonido click
    document.getElementById("audioClick").play();
}


// Función voz
function hablar(texto) {

    speechSynthesis.cancel();

    const mensaje = new SpeechSynthesisUtterance(texto);

    const voces = speechSynthesis.getVoices();

    const vozFemenina = voces.find(voz =>
        voz.lang.startsWith("es")
    );

    if (vozFemenina) {
        mensaje.voice = vozFemenina;
    }

    mensaje.lang = "es-ES";
    mensaje.rate = 1;
    mensaje.pitch = 1.2;

    speechSynthesis.speak(mensaje);
}


// Botón Ingresar
function ingresar() {

    const nombre = document.getElementById("nombre").value.trim();

    if (nombre === "" || avatarSeleccionado === "") {

        hablar("Por favor ingresa un nombre y selecciona un avatar");

        document.getElementById("audioError").play();

        return;
    }

    // Guardar datos
    localStorage.setItem("nombre", nombre);
    localStorage.setItem("avatar", avatarSeleccionado);

    hablar("Bienvenido " + nombre);

    document.getElementById("audioConfeti").play();

    setTimeout(function() {
        window.location.href = "inicio.html";
    }, 2000);
}


// Botón 4° Básico
function irABasico4() {

    const nombre = document.getElementById("nombre").value.trim();

    if (nombre === "" || avatarSeleccionado === "") {

        hablar("Por favor ingresa un nombre y selecciona un avatar");

        document.getElementById("audioError").play();

        return;
    }

    // Guardar datos
    localStorage.setItem("nombre", nombre);
    localStorage.setItem("avatar", avatarSeleccionado);

    window.location.href = "basico4.html";
}


// Cargar voces cuando estén disponibles
window.speechSynthesis.onvoiceschanged = function() {
    speechSynthesis.getVoices();
};