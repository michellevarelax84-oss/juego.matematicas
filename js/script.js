let avatarSeleccionado = "";

// Seleccionar avatar
function seleccionarAvatar(img){

    const avatares = document.querySelectorAll(".avatars img");

    avatares.forEach(function(avatar){
        avatar.classList.remove("selected");
    });

    img.classList.add("selected");

    avatarSeleccionado = img.src;

    document.getElementById("audioClick").play();
}

// Voz
function hablar(texto){

    const mensaje = new SpeechSynthesisUtterance(texto);

    mensaje.lang = "es-ES";

    speechSynthesis.speak(mensaje);
}

// Ingresar
function ingresar(){

    const nombre = document.getElementById("nombre").value.trim();

    if(nombre === "" || avatarSeleccionado === ""){

        hablar("Por favor ingresa un nombre y selecciona un avatar");

        document.getElementById("audioError").play();

        return;
    }

    localStorage.setItem("nombre", nombre);
    localStorage.setItem("avatar", avatarSeleccionado);

    document.getElementById("audioConfeti").play();

    setTimeout(function(){

        window.location.href = "inicio.html";

    },2000);
}

// 4° Básico
function irABasico4(){

    const nombre = document.getElementById("nombre").value.trim();

    if(nombre === "" || avatarSeleccionado === ""){

        hablar("Por favor ingresa un nombre y selecciona un avatar");

        document.getElementById("audioError").play();

        return;
    }

    localStorage.setItem("nombre", nombre);
    localStorage.setItem("avatar", avatarSeleccionado);

    window.location.href = "basico4.html";
}