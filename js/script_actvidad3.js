
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
/* VOZ (FEMENINA + ESPERA) */
/* ========================= */

function hablar(texto){

    return new Promise((resolve)=>{

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

        instruccion.classList.add("leyendo");

        msg.onend = () => {
            instruccion.classList.remove("leyendo");
            resolve();
        };

        speechSynthesis.speak(msg);
    });
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

            fruta.addEventListener("click", ()=>{

                hablar(String(i + 1));

            });

            frutas.appendChild(fruta);
        }

        operacion1.textContent =
        `${total} - ${quitar} = ?`;

        instruccion.textContent =
        "Observa las frutas y responde cuántas quedan.";

        await hablar("Observa las frutas y responde cuántas quedan.");
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

            fruta.addEventListener("click", ()=>{

                hablar(String(i + 1));

            });

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
/* CANASTA (ARRASTRE) */
/* ========================= */

canasta.addEventListener("dragover", (e) => {
    e.preventDefault();
});

canasta.addEventListener("drop", (e) => {

    e.preventDefault();

    const fruta =
    document.querySelector(".fruta.dragging");

    if(!fruta) return;

    fruta.remove();

    frutasQuitadas++;

    hablar(String(frutasQuitadas));

    const meta = Number(canasta.dataset.meta);

    if(frutasQuitadas === meta){

        operacion2.textContent =
        "¿Cuántas frutas quedaron?";

        instruccion.textContent =
        "Escribe la respuesta.";

        hablar("Escribe la respuesta.");
    }
});
/* ========================= */
/* COMPROBAR RESPUESTA */
/* ========================= */

btnComprobar.addEventListener("click", async ()=>{

    const valor = Number(respuesta.value);

    if(valor === correcta){

        mensaje.textContent = "🎉 ¡Muy bien!";
        mensaje.className = "correcto";

        estrellas++;
        estrellasTexto.textContent = estrellas;

        if(typeof confetti === "function"){

            confetti({
                particleCount: 150,
                spread: 90,
                origin: { y: 0.6 }
            });

        }

        await hablar("Muy bien");

        nivel++;

if(nivel > 4){

    barra.style.width = "100%";

    mensaje.textContent =
    "🏁 ¡Terminaste las restas!";

    mensaje.className = "correcto";

    await hablar(
    "Felicitaciones. Terminaste las restas. Ahora resta con nosotros en multiplicación."
    );

    setTimeout(()=>{

        window.location.href =
        "actividad4.html";

    }, 1500);

    return;
}
        generarNivel();

    } else {

        mensaje.textContent = "❌ Intenta otra vez";
        mensaje.className = "error";

        await hablar("Intenta otra vez");
    }
});

/* ========================= */
/* INICIAR CON BOTÓN */
/* ========================= */

btnComenzar.addEventListener("click", async ()=>{

    pantallaInicio.style.display = "none";
    pantallaJuego.style.display = "block";

    speechSynthesis.resume();

    await hablar("Bienvenida. Resta con nosotros.");

    generarNivel();
});

/* ========================= */
/* ACTIVAR VOZ EN PRIMER CLICK */
/* ========================= */

document.addEventListener("click", ()=>{
    speechSynthesis.resume();
}, { once: true });

/* ========================= */
/* INICIALIZACIÓN SEGURA */
/* ========================= */

function iniciarJuego(){

    nivel = 1;
    estrellas = 0;

    estrellasTexto.textContent = "0";
    nivelTexto.textContent = "1";

    barra.style.width = "0%";

    pantallaJuego.style.display = "none";
    pantallaInicio.style.display = "block";

    mensaje.textContent = "";
}

/* ========================= */
/* PROTECCIÓN DE VOZ */
/* ========================= */

window.addEventListener("load", ()=>{

    if (speechSynthesis.getVoices().length === 0) {
        speechSynthesis.onvoiceschanged = () => {
            speechSynthesis.getVoices();
        };
    }

});

/* ========================= */
/* REINICIO POR ERROR (opcional útil) */
/* ========================= */

function resetJuego(){

    nivel = 1;
    estrellas = 0;
    correcta = 0;
    frutasQuitadas = 0;

    respuesta.value = "";

    generarNivel();
}