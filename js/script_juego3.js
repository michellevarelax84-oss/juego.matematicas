/* ========================= */
/* CARGAR PAGINA */
/* ========================= */

window.onload = function(){

    /* reproducir audio final */

    document.getElementById(
        "audioFinal"
    ).play();

    /* confeti */

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