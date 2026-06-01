/* ========================= */
/* CARGAR PAGINA */
/* ========================= */

window.onload = function(){

    /* AUDIO */

    document.getElementById(
        "audioFinal"
    ).play();

    /* CONFETI */

    confetti({

        particleCount:300,

        spread:200,

        origin:{ y:0.6 }

    });

};

/* ========================= */
/* VOLVER A JUGAR */
/* ========================= */

function reiniciarJuego(){

    window.location.href =
    "index.html";

}