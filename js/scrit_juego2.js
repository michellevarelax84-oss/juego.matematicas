/* ========================= */
/* VARIABLES */
/* ========================= */

let respuestas = {};

/* ========================= */
/* VOZ */
/* ========================= */

function hablar(texto){

    const voz =
    new SpeechSynthesisUtterance(
        texto
    );

    voz.lang = "es-ES";

    voz.rate = 1;

    voz.pitch = 1;

    speechSynthesis.speak(voz);

}

/* ========================= */
/* ARRASTRAR */
/* ========================= */

function arrastrar(event){

    event.dataTransfer.setData(
        "text",
        event.target.id
    );

}

/* ========================= */
/* PERMITIR DROP */
/* ========================= */

function permitir(event){

    event.preventDefault();

}

/* ========================= */
/* SOLTAR */
/* ========================= */

function soltar(event){

    event.preventDefault();

    const numero =
    event.dataTransfer.getData(
        "text"
    );

    const zona =
    event.target;

    /* limpiar zona */

    zona.innerHTML = "";

    /* mover numero */

    const elemento =
    document.getElementById(numero);

    zona.appendChild(elemento);

    /* guardar respuesta */

    respuestas[
        zona.dataset.numero
    ] = numero;

}

/* ========================= */
/* VALIDAR */
/* ========================= */

function validar(){

    let correctas = 0;

    const zonas =
    document.querySelectorAll(".zona");

    zonas.forEach(zona => {

        const correcto =
        zona.dataset.numero;

        const respuesta =
        respuestas[correcto];

        /* CORRECTO */

        if(respuesta === correcto){

            zona.classList.remove(
                "error"
            );

            zona.classList.add(
                "correcta"
            );

            correctas++;

        }

        /* INCORRECTO */

        else{

            zona.classList.remove(
                "correcta"
            );

            zona.classList.add(
                "error"
            );

        }

    });

    /* TODO CORRECTO */

    if(correctas === 3){

        document.getElementById(
            "mensaje"
        ).innerHTML =
        "🎉 ¡Felicitaciones! Todo está correcto";

        document.getElementById(
            "correcto"
        ).play();

        hablar(
            "Felicitaciones. Todo está correcto."
        );

        confetti({
            particleCount:300,
            spread:180
        });

        document.getElementById(
            "btnSiguiente"
        ).style.display =
        "inline-block";

    }
/* HAY ERRORES */

else{

    document.getElementById(
        "mensaje"
    ).innerHTML =
    "❌ Algunos números están incorrectos.";

    document.getElementById(
        "error"
    ).play();

    hablar(
        "Algunos números están incorrectos. Vuelve a intentarlo"
    );

    /* ESPERAR MÁS TIEMPO */

    setTimeout(() => {

        location.reload();

    },6000);

}

}

/* ========================= */
/* REINICIAR */
/* ========================= */

function reiniciar(){

    location.reload();

}




/* ========================= */
/* VOZ INICIAL */
/* ========================= */

window.onload = function(){

    hablar(
        "Arrastra los números hacia las manzanas y luego presiona validar respuestas"
    );

};
/* ========================= */
/* SIGUIENTE JUEGO */
/* ========================= */

function siguienteJuego(){


    window.location.href =
    "juego3.html";

}