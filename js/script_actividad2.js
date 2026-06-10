const pantallaInicio = document.getElementById("pantallaInicio");
const pantallaJuego = document.getElementById("pantallaJuego");
const pantallaFinal = document.getElementById("pantallaFinal");

const btnComenzar = document.getElementById("btnComenzar");
const btnComprobar = document.getElementById("btnComprobar");
const btnReiniciar = document.getElementById("btnReiniciar");

const tituloJuego = document.getElementById("tituloJuego");

const grupo1 = document.getElementById("grupo1");
const grupo2 = document.getElementById("grupo2");

const operacionFrutas = document.getElementById("operacionFrutas");
const operacionNumeros = document.getElementById("operacionNumeros");

const numero1 = document.getElementById("numero1");
const numero2 = document.getElementById("numero2");

const respuesta = document.getElementById("respuesta");
const mensaje = document.getElementById("mensaje");

const estrellasTexto = document.getElementById("estrellas");
const nivelTexto = document.getElementById("nivel");

const barra = document.getElementById("barra");
const resultado = document.getElementById("resultado");

let nivel = 1;
let estrellas = 0;

let n1 = 0;
let n2 = 0;
let correcta = 0;

pantallaJuego.style.display = "none";
pantallaFinal.style.display = "none";

/* ========================= */
/* VOZ */
/* ========================= */

function hablar(texto){

    speechSynthesis.cancel();

    const msg = new SpeechSynthesisUtterance(texto);
    msg.lang = "es-ES";
    msg.rate = 1;
    msg.pitch = 1.8;

    const voces = speechSynthesis.getVoices();

    const vozFemenina = voces.find(v =>
        v.name.includes("Helena") ||
        v.name.includes("Laura") ||
        v.name.includes("Monica") ||
        v.name.includes("Female") ||
        v.name.includes("Microsoft Sabina")
    );

    if(vozFemenina){
        msg.voice = vozFemenina;
    }

    speechSynthesis.speak(msg);
}

function aleatorio(min,max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function actualizarBarra(){
    const porcentaje = ((nivel - 1) / 4) * 100;
    barra.style.width = porcentaje + "%";
}

function crearFrutas(contenedor, cantidad, emoji){

    contenedor.innerHTML = "";

    for(let i = 1; i <= cantidad; i++){

        const fruta = document.createElement("span");
        fruta.className = "objeto"; // 👈 IMPORTANTE (antes no coincidía con CSS)
        fruta.textContent = emoji;

        fruta.addEventListener("click", () => {
            hablar(i);
        });

        contenedor.appendChild(fruta);
    }
}

function generarNivel(){

    mensaje.textContent = "";
    respuesta.value = "";
    actualizarBarra();

    if(nivel === 1){

        tituloJuego.textContent = "🍎 Cuenta y Suma";

        operacionFrutas.style.display = "flex";
        operacionNumeros.style.display = "none";

        n1 = aleatorio(3,8);
        n2 = aleatorio(2,7);

        correcta = n1 + n2;

        crearFrutas(grupo1, n1, "🍎");
        crearFrutas(grupo2, n2, "🍌");

        resultado.textContent = "= ?";

    }

    if(nivel === 2){

        tituloJuego.textContent = "🍓 Súper Suma";

        operacionFrutas.style.display = "flex"; // 👈 FIX importante
        operacionNumeros.style.display = "none";

        n1 = aleatorio(6,10);
        n2 = aleatorio(5,10);

        correcta = n1 + n2;

        crearFrutas(grupo1, n1, "🍓");
        crearFrutas(grupo2, n2, "🍇");

        resultado.textContent = "= ?";

    }

    if(nivel === 3){

        tituloJuego.textContent = "🧠 Suma Mental";

        operacionFrutas.style.display = "none";
        operacionNumeros.style.display = "flex";

        n1 = aleatorio(20,50);
        n2 = aleatorio(10,40);

        correcta = n1 + n2;

        numero1.textContent = n1;
        numero2.textContent = n2;

        resultado.textContent = "= ?";

    }

    if(nivel === 4){

        tituloJuego.textContent = "🏆 Desafío Final";

        operacionFrutas.style.display = "none";
        operacionNumeros.style.display = "flex";

        n1 = aleatorio(50,99);
        n2 = aleatorio(20,99);

        correcta = n1 + n2;

        numero1.textContent = n1;
        numero2.textContent = n2;

        resultado.textContent = "= ?";
    }
}

/* EVENTOS */

numero1.addEventListener("click", () => hablar(n1));
numero2.addEventListener("click", () => hablar(n2));

btnComenzar.addEventListener("click", () => {

    pantallaInicio.style.display = "none";
    pantallaJuego.style.display = "block";

    hablar("Bienvenida. Vamos a aprender matemáticas jugando.");

    generarNivel();
});

btnComprobar.addEventListener("click", () => {

    const valor = Number(respuesta.value);

    if(valor === correcta){

        mensaje.textContent = "🎉 ¡Correcto!";
        mensaje.className = "correcto";

        estrellas++;
        estrellasTexto.textContent = estrellas;

        hablar("Muy bien");

        setTimeout(() => {

            nivel++;
if(nivel > 4){

    hablar("Felicitaciones. Ahora vamos a aprender a restar.");

    setTimeout(() => {

        window.location.href = "actividad3.html";

    }, 2000);

    return;
}

            nivelTexto.textContent = nivel;
            generarNivel();

        }, 1200);

    } else {

        mensaje.textContent = "❌ Inténtalo otra vez";
        mensaje.className = "error";

        hablar("Intenta nuevamente");
    }

});

btnReiniciar.addEventListener("click", () => {

    nivel = 1;
    estrellas = 0;

    estrellasTexto.textContent = "0";
    nivelTexto.textContent = "1";

    barra.style.width = "0%";

    pantallaFinal.style.display = "none";
    pantallaInicio.style.display = "block";

    hablar("Vamos a empezar otra vez");
});