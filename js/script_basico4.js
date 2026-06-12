// =======================
// DATOS DEL USUARIO
// =======================

const nombre = localStorage.getItem("nombre");
const avatar = localStorage.getItem("avatar");

if(nombre){
    document.getElementById("saludo").textContent =
    "👋 Bienvenido " + nombre;
}else{
    document.getElementById("saludo").textContent =
    "👋 Bienvenido estudiante";
}

if(avatar){
    document.getElementById("avatarUsuario").src = avatar;
}else{
    document.getElementById("avatarUsuario").src = "img/avatar1.png";
}

// =======================
// ACTIVIDADES
// =======================

const act2 = document.getElementById("act2");
const act3 = document.getElementById("act3");
const act4 = document.getElementById("act4");
const act5 = document.getElementById("act5");
const act6 = document.getElementById("act6");

// =======================
// BLOQUEAR POR DEFECTO
// =======================

act2.style.pointerEvents = "none";
act3.style.pointerEvents = "none";
act4.style.pointerEvents = "none";
act5.style.pointerEvents = "none";
act6.style.pointerEvents = "none";

act2.style.opacity = "0.5";
act3.style.opacity = "0.5";
act4.style.opacity = "0.5";
act5.style.opacity = "0.5";
act6.style.opacity = "0.5";

// =======================
// DESBLOQUEAR SEGÚN PROGRESO
// =======================

// Si completó actividad 1
if(localStorage.getItem("actividad1") === "completada"){
    act2.style.pointerEvents = "auto";
    act2.style.opacity = "1";
}

// Si completó actividad 2
if(localStorage.getItem("actividad2") === "completada"){
    act3.style.pointerEvents = "auto";
    act3.style.opacity = "1";
}

// Si completó actividad 3
if(localStorage.getItem("actividad3") === "completada"){
    act4.style.pointerEvents = "auto";
    act4.style.opacity = "1";
}

// Si completó actividad 4
if(localStorage.getItem("actividad4") === "completada"){
    act5.style.pointerEvents = "auto";
    act5.style.opacity = "1";
}

// Si completó actividad 5
if(localStorage.getItem("actividad5") === "completada"){
    act6.style.pointerEvents = "auto";
    act6.style.opacity = "1";
}
// =======================
// VOZ DE BIENVENIDA
// =======================

function hablar(texto){

    const mensaje = new SpeechSynthesisUtterance(texto);

    mensaje.lang = "es-ES";
    mensaje.rate = 1;
    mensaje.pitch = 1.2;

    const voces = speechSynthesis.getVoices();

    const vozEspanol = voces.find(
        voz => voz.lang.includes("es")
    );

    if(vozEspanol){
        mensaje.voice = vozEspanol;
    }

    speechSynthesis.speak(mensaje);
}

// Esperar que cargue la página
window.onload = function(){

    let nombreUsuario =
    localStorage.getItem("nombre");

    if(nombreUsuario){

        hablar(
        "Bienvenido " +
        nombreUsuario +
        ". Selecciona una actividad para comenzar."
        );

    }else{

        hablar(
        "Bienvenido estudiante. Selecciona una actividad para comenzar."
        );
    }
};