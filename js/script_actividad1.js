// =======================
// AVATAR
// =======================

const avatar = localStorage.getItem("avatar");

if(avatar){
    document.getElementById("avatarUsuario").src = avatar;
}else{
    document.getElementById("avatarUsuario").src =
    "img/avatar1.png";
}

// =======================
// ELEMENTOS
// =======================

const pregunta =
document.getElementById("pregunta");

const opciones =
document.getElementById("opciones");

const mensaje =
document.getElementById("mensaje");

const audioCorrecto =
document.getElementById("audioCorrecto");

const audioError =
document.getElementById("audioError");

// =======================
// VOZ
// =======================

function hablar(texto){

    speechSynthesis.cancel();

    const mensajeVoz =
    new SpeechSynthesisUtterance(texto);

    mensajeVoz.lang = "es-ES";
    mensajeVoz.rate = 0.9;
    mensajeVoz.pitch = 1.2;

    speechSynthesis.speak(mensajeVoz);
}

// =======================
// ACTIVIDADES
// =======================

let etapa = 0;

const actividades = [

{
tipo:"mayor",
pregunta:"¿Cuál es el número mayor entre 3560, 8900 y 4210?",
opciones:[3560,8900,4210],
correcta:8900
},

{
tipo:"menor",
pregunta:"¿Cuál es el número menor entre 4500, 2100 y 9800?",
opciones:[4500,2100,9800],
correcta:2100
},

{
tipo:"ordenar",
pregunta:"Ordena los números de menor a mayor",
numeros:"5600 - 1200 - 8900 - 3000",
correcta:"1200,3000,5600,8900"
}

];

// =======================
// MOSTRAR PREGUNTA
// =======================

mostrarPregunta();

function mostrarPregunta(){

    mensaje.textContent = "";

    if(etapa >= actividades.length){

        hablar(
        "Excelente. Has completado la actividad."
        );

        localStorage.setItem(
        "actividad1",
        "completada"
        );

        mensaje.innerHTML =
        "🏆 ¡Actividad completada!";

        setTimeout(function(){

            window.location.href =
            "basico4.html";

        },3000);

        return;
    }

    const act = actividades[etapa];

    pregunta.textContent =
    act.pregunta;

    hablar(act.pregunta);

    if(act.tipo === "ordenar"){

        opciones.innerHTML = `
        <h3>${act.numeros}</h3>

        <input
        type="text"
        id="respuesta"
        placeholder="1200,3000,5600,8900">

        <br><br>

        <button onclick="verificarOrden()">
        Comprobar
        </button>
        `;

    }else{

        opciones.innerHTML = "";

        act.opciones.forEach(numero=>{

            const boton =
            document.createElement("button");

            boton.textContent =
            numero;

            boton.onclick =
            ()=> verificar(numero);

            opciones.appendChild(boton);

        });
    }
}

// =======================
// VERIFICAR MAYOR O MENOR
// =======================

function verificar(numero){

    const correcta =
    actividades[etapa].correcta;

    if(numero === correcta){

        audioCorrecto.play();

        mensaje.textContent =
        "✅ ¡Correcto!";

        etapa++;

        setTimeout(function(){

            mostrarPregunta();

        },1500);

    }else{

        audioError.play();

        mensaje.textContent =
        "❌ Intenta nuevamente";
    }
}

// =======================
// VERIFICAR ORDEN
// =======================

function verificarOrden(){

    const respuesta =
    document
    .getElementById("respuesta")
    .value
    .replace(/\s/g,'');

    const correcta =
    actividades[etapa].correcta;

    if(respuesta === correcta){

        audioCorrecto.play();

        mensaje.textContent =
        "✅ ¡Correcto!";

        etapa++;

        setTimeout(function(){

            mostrarPregunta();

        },1500);

    }else{

        audioError.play();

        mensaje.textContent =
        "❌ Revisa el orden";
    }
}