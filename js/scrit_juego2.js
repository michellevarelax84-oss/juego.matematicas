/* ========================= */
/* VARIABLES */
/* ========================= */

let respuestas = {};

/* ========================= */
/* VOZ */
/* ========================= */

function hablar(texto){

    speechSynthesis.cancel();

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
        "text/plain",
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
        "text/plain"
    );

    const zona =
    event.currentTarget;

    /* obtener numero */

    const elemento =
    document.getElementById(
        numero
    );

    /* limpiar zona */

    zona.innerHTML = "";

    /* quitar posiciones */

    elemento.style.position =
    "static";

    elemento.style.left =
    "auto";

    elemento.style.top =
    "auto";

    elemento.style.transform =
    "none";

    elemento.style.margin =
    "0";

    /* tamaño dentro de zona */

    elemento.style.width =
    "90px";

    elemento.style.height =
    "90px";

    elemento.style.fontSize =
    "40px";

    /* agregar numero */

    zona.appendChild(
        elemento
    );

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
    document.querySelectorAll(
        ".zona"
    );

    zonas.forEach(zona => {

        const correcto =
        zona.dataset.numero;

        const respuesta =
        respuestas[correcto];

        /* limpiar clases */

        zona.classList.remove(
            "correcta"
        );

        zona.classList.remove(
            "error"
        );

        /* correcto */

        if(respuesta === correcto){

            zona.classList.add(
                "correcta"
            );

            correctas++;

        }

        /* incorrecto */

        else{

            zona.classList.add(
                "error"
            );

        }

    });

    /* ========================= */
    /* TODO CORRECTO */
    /* ========================= */

    if(correctas === 5){

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

    /* ========================= */
    /* HAY ERRORES */
    /* ========================= */

    else{

        document.getElementById(
            "mensaje"
        ).innerHTML =
        "❌ incorrectos";

        document.getElementById(
            "error"
        ).play();

        setTimeout(() => {

            hablar(
                " incorrecto . Vuelve a intentarlo"
            );

        },500);

        /* reiniciar */

        setTimeout(() => {

            location.reload();

        },6000);

    }

}

/* ========================= */
/* SIGUIENTE JUEGO */
/* ========================= */

function siguienteJuego(){

    window.location.href =
    "juego3.html";

}

/* ========================= */
/* VOZ INICIAL */
/* ========================= */

window.onload = function(){

    hablar(
        "Arrastra los números hacia las manzanas y luego presiona validar respuestas"
    );

};