const pantallaInicio =
document.getElementById("pantallaInicio");

const pantallaJuego =
document.getElementById("pantallaJuego");

const btnComenzar =
document.getElementById("btnComenzar");

const instruccion =
document.getElementById("instruccion");

const nivel1 = document.getElementById("nivel1");
const nivel2 = document.getElementById("nivel2");
const nivel3 = document.getElementById("nivel3");
const nivel4 = document.getElementById("nivel4");

const frutas = document.getElementById("frutas");
const frutasArrastre = document.getElementById("frutasArrastre");

const canasta = document.getElementById("canasta");

const operacion1 = document.getElementById("operacion1");
const operacion2 = document.getElementById("operacion2");
const operacion3 = document.getElementById("operacion3");
const operacion4 = document.getElementById("operacion4");

const respuesta = document.getElementById("respuesta");
const btnComprobar = document.getElementById("btnComprobar");

const mensaje = document.getElementById("mensaje");

const estrellasTexto =
document.getElementById("estrellas");

const nivelTexto =
document.getElementById("nivel");

const barra =
document.getElementById("barra");

let nivel = 1;
let estrellas = 0;

let correcta = 0;

let totalFrutas = 0;
let frutasQuitadas = 0;

/* ========================= */
/* OCULTAR INICIO */
/* ========================= */

pantallaJuego.style.display = "none";

/* ========================= */
/* VOZ */
/* ========================= */

function hablar(texto){

    speechSynthesis.cancel();

    const msg =
    new SpeechSynthesisUtterance(texto);

    msg.lang = "es-ES";
    msg.rate = 1;
    msg.pitch = 1.8;

    const voces =
    speechSynthesis.getVoices();

    const voz =
    voces.find(v =>
        v.name.includes("Helena") ||
        v.name.includes("Laura") ||
        v.name.includes("Paulina") ||
        v.name.includes("Sabina") ||
        v.name.includes("Female")
    );

    if(voz){
        msg.voice = voz;
    }

    speechSynthesis.speak(msg);
}

/* ========================= */
/* ALEATORIOS */
/* ========================= */

function aleatorio(min,max){
    return Math.floor(
        Math.random() * (max - min + 1)
    ) + min;
}

/* ========================= */
/* BARRA PROGRESO */
/* ========================= */

function actualizarBarra(){
    barra.style.width =
    ((nivel - 1) / 4) * 100 + "%";
}

/* ========================= */
/* OCULTAR NIVELES */
/* ========================= */

function ocultarTodo(){
    nivel1.style.display = "none";
    nivel2.style.display = "none";
    nivel3.style.display = "none";
    nivel4.style.display = "none";
}

/* ========================= */
/* GENERAR NIVEL */
/* ========================= */

async function generarNivel(){

    ocultarTodo();

    mensaje.textContent = "";
    respuesta.value = "";

    actualizarBarra();

    /* ========================= */
    /* NIVEL 1 */
    /* ========================= */

    if(nivel === 1){

        nivel1.style.display = "block";

        const total = aleatorio(8,15);
        const quitar = aleatorio(2,5);

        correcta = total - quitar;

        frutas.innerHTML = "";

        for(let i = 0; i < total; i++){

            const fruta = document.createElement("div");
            fruta.className = "fruta";
            fruta.textContent = "🍎";

            /* 🍎 MEJOR QUITAR (ANIMADO) */
            fruta.addEventListener("click", ()=>{

                fruta.style.transform = "scale(0)";
                fruta.style.transition = "0.2s ease";

                setTimeout(()=>{
                    fruta.remove();
                }, 200);

                frutasQuitadas++;

                hablar("quitada");
            });

            frutas.appendChild(fruta);
        }

        operacion1.textContent =
        `${total} - ${quitar} = ?`;

        instruccion.textContent =
        "Toca las frutas para quitarlas y aprender la resta.";

        await hablar("Toca las frutas para quitarlas y aprender la resta.");
    }

    /* ========================= */
    /* NIVEL 2 */
    /* ========================= */

    if(nivel === 2){

        nivel2.style.display = "block";

        frutasQuitadas = 0;

        totalFrutas = aleatorio(10,15);
        const quitar = aleatorio(3,6);

        correcta = totalFrutas - quitar;

        frutasArrastre.innerHTML = "";

        for(let i = 0; i < totalFrutas; i++){

            const fruta = document.createElement("div");
            fruta.className = "fruta";
            fruta.textContent = "🍓";

            fruta.draggable = true;

            fruta.addEventListener("dragstart", ()=>{
                fruta.classList.add("dragging");
            });

            fruta.addEventListener("dragend", ()=>{
                fruta.classList.remove("dragging");
            });

            frutasArrastre.appendChild(fruta);
        }

        canasta.dataset.meta = quitar;

        operacion2.textContent =
        `${totalFrutas} - ${quitar}`;

        instruccion.textContent =
        `Arrastra ${quitar} frutas a la canasta.`;

        await hablar(`Arrastra ${quitar} frutas a la canasta.`);
    }

    /* ========================= */
    /* NIVEL 3 */
    /* ========================= */

    if(nivel === 3){

        nivel3.style.display = "block";

        const n1 = aleatorio(40,80);
        const n2 = aleatorio(10,35);

        correcta = n1 - n2;

        operacion3.textContent =
        `${n1} - ${n2} = ?`;

        instruccion.textContent =
        "Resuelve la resta mental.";

        await hablar("Resuelve la resta mental.");
    }

    /* ========================= */
    /* NIVEL 4 */
    /* ========================= */

    if(nivel === 4){

        nivel4.style.display = "block";

        const resultado = aleatorio(25,60);
        const resta = aleatorio(10,25);

        const numero = resultado + resta;

        correcta = numero;

        operacion4.textContent =
        `__ - ${resta} = ${resultado}`;

        instruccion.textContent =
        "Encuentra el número que falta.";

        await hablar("Encuentra el número que falta.");
    }

    nivelTexto.textContent = nivel;
}

/* ========================= */
/* RESTO IGUAL (NO CAMBIADO) */
/* ========================= */

btnComenzar.addEventListener("click", async ()=>{
    pantallaInicio.style.display = "none";
    pantallaJuego.style.display = "block";

    await hablar("Bienvenida. Resta con nosotros.");
    generarNivel();
});