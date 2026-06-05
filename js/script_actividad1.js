const tituloReto =
document.getElementById("tituloReto");

const zonaJuego =
document.getElementById("zonaJuego");

const mensaje =
document.getElementById("mensaje");

const progreso =
document.getElementById("progreso");

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
    voz.pitch = 1.1;

    speechSynthesis.speak(voz);
}

// ======================
// RETOS
// ======================

let retoActual = 0;

const retos = [

{
tipo:"ordenar",
titulo:"🐻 Ordena de menor a mayor",
numeros:[3560,8900,4210]
},

{
tipo:"ordenar",
titulo:"⭐ Ordena de menor a mayor",
numeros:[7500,1200,9800]
},

{
tipo:"leer",
titulo:"📖 Escucha y escribe el número",
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
// BARRA DE PROGRESO
// ======================

function actualizarBarra(){

    const porcentaje =
    (retoActual / retos.length) * 100;

    progreso.style.width =
    porcentaje + "%";
}

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

    actualizarBarra();

    mensaje.textContent = "";

    if(retoActual >= retos.length){

        finalizar();
        return;
    }

    const reto = retos[retoActual];

    tituloReto.textContent =
    reto.titulo;

    zonaJuego.innerHTML = "";

    if(reto.tipo === "ordenar"){

        hablar(
        "Ordena los números de menor a mayor"
        );

        zonaJuego.innerHTML =
        `<div class="tarjetas"></div>`;

        const contenedor =
        document.querySelector(".tarjetas");

        mezclar(reto.numeros)
        .forEach(numero=>{

            const tarjeta =
            document.createElement("div");

            tarjeta.className =
            "tarjeta";

            tarjeta.draggable = true;

            tarjeta.textContent =
            numero;

tarjeta.addEventListener("click", () => {
    hablar(tarjeta.textContent);
});

            contenedor.appendChild(
            tarjeta
            );

        });

        activarDrag();

    }else{


    if(reto.tipo === "leer"){

        zonaJuego.innerHTML =

        `
        <button id="btnAudio" class="btnAudio">
            🔊 Escuchar número
        </button>

        <h3 id="textoReto">
            ${reto.texto}
        </h3>

        <input
        type="text"
        id="respuesta"
        placeholder="Escribe tu respuesta">
        `;

        const btnAudio =
        document.getElementById("btnAudio");

        btnAudio.onclick = function(){

            const texto =
            document.getElementById("textoReto");

            texto.classList.add("hablando");

            const voz =
            new SpeechSynthesisUtterance(
            reto.texto
            );

            voz.lang = "es-ES";

            voz.onend = function(){

                texto.classList.remove(
                "hablando"
                );

                hablar(
                "Ahora escribe el número"
                );
            };

            speechSynthesis.speak(
            voz
            );
        };

        setTimeout(()=>{
            btnAudio.click();
        },1000);

    }else{

        zonaJuego.innerHTML =

        `
        <h3 id="textoReto">
            ${reto.texto}
        </h3>

        <input
        type="text"
        id="respuesta"
        placeholder="Escribe tu respuesta">
        `
    }
    }
}
// ======================
// DRAG & DROP
// ======================

let arrastrado = null;

function activarDrag(){

    const tarjetas =
    document.querySelectorAll(
    ".tarjeta"
    );

    tarjetas.forEach(t=>{

        t.addEventListener(
        "dragstart",
        function(){

            arrastrado = t;

        });

        t.addEventListener(
        "dragover",
        function(e){

            e.preventDefault();

        });

        t.addEventListener(
        "drop",
        function(){

            const temp =
            t.textContent;

            t.textContent =
            arrastrado.textContent;

            arrastrado.textContent =
            temp;

        });

    });
}

// ======================
// VALIDAR
// ======================

document
.getElementById("btnValidar")
.addEventListener(
"click",
validar
);

function validar(){

    const reto =
    retos[retoActual];

    if(reto.tipo === "ordenar"){

        const respuesta = [];

        document
        .querySelectorAll(".tarjeta")
        .forEach(t=>{

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
// RESPUESTA CORRECTA
// ======================

function correcto(){

    audioCorrecto.play();

    hablar("Muy bien");

    mensaje.innerHTML =
    "✅ ¡Correcto!";

    retoActual++;

    actualizarBarra();

    setTimeout(
    cargarReto,
    1500
    );
}

// ======================
// RESPUESTA INCORRECTA
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

    progreso.style.width =
    "100%";

    audioAplausos.play();

    confetti({
        particleCount:300,
        spread:180
    });

    tituloReto.innerHTML =
    "🏆 ¡FELICITACIONES!";

    zonaJuego.innerHTML = "";

    mensaje.innerHTML =
    "Has completado la actividad.";

    hablar(
    "Felicitaciones. Has completado la actividad."
    );
}

// ======================
// INICIAR
// ======================

cargarReto();

setTimeout(function(){

    hablar(
    "Hola. Bienvenido a la aventura de los números. Escucha atentamente cada desafío. Arrastra las tarjetas para ordenar los números de menor a mayor. También deberás escuchar números y escribir respuestas. Cuando termines cada desafío presiona validar respuesta. Mucha suerte."
    );

},500);