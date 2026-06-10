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
/* VOZ FEMENINA */
/* ========================= */

speechSynthesis.onvoiceschanged = () => {
    speechSynthesis.getVoices();
};

function hablar(texto){

    speechSynthesis.cancel();

    const mensajeVoz =
    new SpeechSynthesisUtterance(texto);

    mensajeVoz.lang = "es-ES";
    mensajeVoz.rate = 1;
    mensajeVoz.pitch = 1.8;

    const voces =
    speechSynthesis.getVoices();

    const vozFemenina =
    voces.find(v =>
        v.name.includes("Helena") ||
        v.name.includes("Paulina") ||
        v.name.includes("Monica") ||
        v.name.includes("Laura") ||
        v.name.includes("Female") ||
        v.name.includes("Microsoft Sabina")
    );

    if(vozFemenina){
        mensajeVoz.voice =
        vozFemenina;
    }

    speechSynthesis.speak(
    mensajeVoz
    );
}

function aleatorio(min,max){

    return Math.floor(
        Math.random() *
        (max - min + 1)
    ) + min;
}

function actualizarBarra(){

    const porcentaje =
    ((nivel - 1) / 4) * 100;

    barra.style.width =
    porcentaje + "%";
}

function crearFrutas(
contenedor,
cantidad,
emoji
){

    contenedor.innerHTML = "";

    for(let i=1;i<=cantidad;i++){

        const fruta =
        document.createElement("span");

        fruta.className =
        "objeto";

        fruta.textContent =
        emoji;

        fruta.addEventListener(
        "click",
        ()=>{

            hablar(i);

        });

        contenedor.appendChild(
        fruta
        );
    }
}
function generarNivel(){

    mensaje.textContent = "";

    respuesta.value = "";

    actualizarBarra();

    /* ========================= */
    /* NIVEL 1 */
    /* ========================= */

    if(nivel === 1){

        tituloJuego.textContent =
        "🍎 Cuenta y Suma";

        operacionFrutas.style.display =
        "flex";

        operacionNumeros.style.display =
        "none";

        n1 = aleatorio(3,8);
        n2 = aleatorio(2,7);

        correcta = n1 + n2;

        crearFrutas(
        grupo1,
        n1,
        "🍎"
        );

        crearFrutas(
        grupo2,
        n2,
        "🍌"
        );

        resultado.textContent =
        "= ?";
    }

    /* ========================= */
    /* NIVEL 2 */
    /* ========================= */

    if(nivel === 2){

        tituloJuego.textContent =
        "🍓 Súper Suma";

        operacionFrutas.style.display =
        "flex";

        operacionNumeros.style.display =
        "none";

        n1 = aleatorio(6,10);
        n2 = aleatorio(5,10);

        correcta = n1 + n2;

        crearFrutas(
        grupo1,
        n1,
        "🍓"
        );

        crearFrutas(
        grupo2,
        n2,
        "🍇"
        );

        resultado.textContent =
        "= ?";
    }

    /* ========================= */
    /* NIVEL 3 */
    /* ========================= */

    if(nivel === 3){

        tituloJuego.textContent =
        "🧠 Suma Mental";

        operacionFrutas.style.display =
        "none";

        operacionNumeros.style.display =
        "flex";

        n1 = aleatorio(20,50);
        n2 = aleatorio(10,40);

        correcta = n1 + n2;

        numero1.textContent =
        n1;

        numero2.textContent =
        n2;

        resultado.textContent =
        "= ?";
    }

    /* ========================= */
    /* NIVEL 4 */
    /* ========================= */

    if(nivel === 4){

        tituloJuego.textContent =
        "🏆 Desafío Final";

        operacionFrutas.style.display =
        "none";

        operacionNumeros.style.display =
        "flex";

        n1 = aleatorio(50,99);
        n2 = aleatorio(20,99);

        correcta = n1 + n2;

        numero1.textContent =
        n1;

        numero2.textContent =
        n2;

        resultado.textContent =
        "= ?";
    }
}

/* ========================= */
/* NÚMEROS TOCABLES */
/* ========================= */

numero1.addEventListener(
"click",
()=>{

    hablar(n1);

});

numero2.addEventListener(
"click",
()=>{

    hablar(n2);

});

/* ========================= */
/* COMENZAR */
/* ========================= */

btnComenzar.addEventListener(
"click",
()=>{

    pantallaInicio.style.display =
    "none";

    pantallaJuego.style.display =
    "block";

    hablar(
    "Bienvenida. Suma con nosotros. Vamos a divertirnos aprendiendo matemáticas."
    );

    generarNivel();

});

/* ========================= */
/* COMPROBAR */
/* ========================= */

btnComprobar.addEventListener(
"click",
()=>{

    const valor =
    Number(
    respuesta.value
    );

    if(valor === correcta){

        mensaje.textContent =
        "🎉 ¡Muy bien!";

        mensaje.className =
        "correcto";

        estrellas++;

        estrellasTexto.textContent =
        estrellas;

        if(typeof confetti === "function"){

            confetti({

                particleCount:150,
                spread:90,
                origin:{y:0.6}

            });

        }

        hablar(
        "Excelente trabajo"
        );

        setTimeout(()=>{

            nivel++;

if(nivel > 4){

    hablar(
    "Felicitaciones. Has completado las sumas. Ahora resta con nosotros."
    );

    barra.style.width =
    "100%";

    setTimeout(()=>{

        window.location.href =
        "actividad3.html";

    },4000);

    return;
}
            nivelTexto.textContent =
            nivel;

            generarNivel();

        },1500);

    }else{

        mensaje.textContent =
        "❌ Inténtalo nuevamente";

        mensaje.className =
        "error";

        hablar(
        "No te preocupes. Inténtalo otra vez."
        );

    }

});

/* ========================= */
/* REINICIAR */
/* ========================= */

btnReiniciar.addEventListener(
"click",
()=>{

    nivel = 1;

    estrellas = 0;

    n1 = 0;
    n2 = 0;
    correcta = 0;

    estrellasTexto.textContent =
    "0";

    nivelTexto.textContent =
    "1";

    barra.style.width =
    "0%";

    mensaje.textContent =
    "";

    respuesta.value =
    "";

    pantallaFinal.style.display =
    "none";

    pantallaJuego.style.display =
    "block";

    generarNivel();

});

/* ========================= */
/* INICIO */
/* ========================= */

actualizarBarra();