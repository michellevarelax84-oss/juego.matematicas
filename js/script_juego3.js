window.onload = function(){

    document.getElementById("audioFinal").play();

    confetti({

        particleCount:300,
        spread:200,
        origin:{ y:0.6 }

    });

};


/* SIGUIENTE JUEGO */

function siguienteJuego(){

    window.location.href = "juego4.html";

}