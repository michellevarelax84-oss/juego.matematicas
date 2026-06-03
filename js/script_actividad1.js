const tituloReto =
document.getElementById("tituloReto");

const zonaJuego =
document.getElementById("zonaJuego");

const mensaje =
document.getElementById("mensaje");

const audioCorrecto =
document.getElementById("audioCorrecto");

const audioError =
document.getElementById("audioError");

const audioAplausos =
document.getElementById("audioAplausos");

// ======================
// VOZ
// ======================

function hablar(texto){

    speechSynthesis.cancel();

    const voz =
    new SpeechSynthesisUtterance(texto);

    voz.lang = "es-ES";
    voz.rate = 0.9;
    voz.pitch = 1.2;

    speechSynthesis.speak(voz);
}

// ======================
// RETOS
// ======================

let retoActual = 0;

const retos = [

{
tipo:"ordenar",
titulo:"🐻 Ordena los números de menor a mayor",
numeros:[3560,8900,4210]
},

{
tipo:"ordenar",
titulo:"⭐ Ordena los números de menor a mayor",
numeros:[7500,1200,9800]
},

{
tipo:"ordenar",
titulo:"🚂 Ordena los números de menor a mayor",
numeros:[5600,1200,8900,3000]
},

{
tipo:"leer",
titulo:"📖 ¿Qué número representa?",
texto:"Ocho mil quinientos",
correcta:"8500"
},

{
tipo:"escribir",
titulo:"✏️ Escribe en números",
texto:"Siete mil doscientos treinta y cuatro",
correcta:"7234"
},

{
tipo:"recta",
titulo:"📏 Completa la recta numérica",
texto:"1000 - 2000 - ____ - 4000 - 5000",
correcta:"3000"
},

{
tipo:"tabla",
titulo:"🧮 Tabla posicional",
texto:"UM = 4   C = 5   D = 2   U = 8",
correcta:"4528"
}

];

// ======================
// MEZCLAR
// ======================

function mezclar(array){

    return [...array]
    .sort(() => Math.random() - 0.5);
}

// ======================
// CARGAR RETO
// ======================

function cargarReto(){

    mensaje.textContent = "";

    if(retoActual >= retos.length){

        finalizar();

        return;
    }

    const reto = retos[retoActual];

    tituloReto.textContent =
    reto.titulo;

    if(reto.tipo === "ordenar"){

        hablar(
        "Ordena los números de menor a mayor"
        );

    }else if(reto.tipo === "leer"){

        hablar(
        "Lee el número y responde"
        );

    }else if(reto.tipo === "escribir"){

        hablar(
        "Escribe el número correctamente"
        );

    }else if(reto.tipo === "recta"){

        hablar(
        "Completa la recta numérica"
        );

    }else if(reto.tipo === "tabla"){

        hablar(
        "Observa la tabla posicional y responde"
        );
    }

    zonaJuego.innerHTML = "";

    // --------------------
    // ORDENAR
    // --------------------

    if(reto.tipo === "ordenar"){

        zonaJuego.innerHTML =
        `<div class="tarjetas"></div>`;

        const contenedor =
        document.querySelector(".tarjetas");

        const mezclados =
        mezclar(reto.numeros);

        mezclados.forEach(numero => {

            const tarjeta =
            document.createElement("div");

            tarjeta.className =
            "tarjeta";

            tarjeta.draggable =
            true;

            tarjeta.textContent =
            numero;

            contenedor.appendChild(
            tarjeta
            );

        });

        activarDrag();

    }else{

        zonaJuego.innerHTML =

        `
        <h3>${reto.texto}</h3>

        <input
        type="text"
        id="respuesta"
        placeholder="Escribe tu respuesta">
        `;
    }
}

// ======================
// DRAG & DROP
// ======================

let arrastrado = null;

function activarDrag(){

    const tarjetas =
    document.querySelectorAll(".tarjeta");

    tarjetas.forEach(tarjeta => {

        tarjeta.addEventListener(
        "dragstart",
        () => {

            arrastrado =
            tarjeta;

        });

        tarjeta.addEventListener(
        "dragover",
        (e) => {

            e.preventDefault();

        });

        tarjeta.addEventListener(
        "drop",
        () => {

            const temporal =
            tarjeta.textContent;

            tarjeta.textContent =
            arrastrado.textContent;

            arrastrado.textContent =
            temporal;

        });

    });
}

// ======================
// BOTON VALIDAR
// ======================

document
.getElementById("btnValidar")
.addEventListener(
"click",
validar
);

// ======================
// VALIDAR
// ======================

function validar(){

    const reto =
    retos[retoActual];

    if(reto.tipo === "ordenar"){

        const respuesta = [];

        document
        .querySelectorAll(".tarjeta")
        .forEach(t => {

            respuesta.push(
            Number(t.textContent)
            );

        });

        const correcta =
        [...reto.numeros]
        .sort((a,b)=>a-b);

        if(
        JSON.stringify(respuesta)
        ===
        JSON.stringify(correcta)
        ){

            correcto();

        }else{

            incorrecto();
        }

    }else{

        const respuesta =
        document
        .getElementById("respuesta")
        .value
        .trim();

        if(
        respuesta === reto.correcta
        ){

            correcto();

        }else{

            incorrecto();
        }
    }
}

// ======================
// CORRECTO
// ======================

function correcto(){

    audioCorrecto.play();

    hablar(
    "Muy bien"
    );

    mensaje.innerHTML =
    "✅ ¡Correcto!";

    retoActual++;

    setTimeout(() => {

        cargarReto();

    },1500);
}

// ======================
// INCORRECTO
// ======================

function incorrecto(){

    audioError.play();

    hablar(
    "Inténtalo nuevamente"
    );

    mensaje.innerHTML =
    "❌ Respuesta incorrecta";
}

// ======================
// FINALIZAR
// ======================

function finalizar(){

    localStorage.setItem(
    "actividad1",
    "completada"
    );

    audioAplausos.play();

    confetti({
        particleCount:300,
        spread:180
    });

    tituloReto.innerHTML =
    "🏆 ¡FELICITACIONES!";

    zonaJuego.innerHTML = "";

    mensaje.innerHTML =
    "Has completado la aventura de los números.";

    hablar(
    "Felicitaciones. Has completado la actividad."
    );

    setTimeout(() => {

        window.location.href =
        "basico4.html";

    },5000);
}

// ======================
// INICIAR
// ======================

cargarReto();