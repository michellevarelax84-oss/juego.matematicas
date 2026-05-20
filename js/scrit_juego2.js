let correctos = 0;

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
/* PERMITIR */
/* ========================= */

function permitirDrop(event){

    event.preventDefault();

}

/* ========================= */
/* SOLTAR */
/* ========================= */

function soltar(event){

    event.preventDefault();

    const numeroArrastrado =
    event.dataTransfer.getData(
        "text"
    );

    const numeroCorrecto =
    event.target.dataset.numero;

    /* CORRECTO */

    if(numeroArrastrado === numeroCorrecto){

        event.target.classList.add(
            "correcta"
        );

        event.target.innerHTML +=
        " ✅";

        document.getElementById(
            "mensaje"
        ).innerHTML =
        "⭐ ¡Muy bien!";

        document.getElementById(
            "audioCorrecto"
        ).play();

        confetti({
            particleCount:100,
            spread:90
        });

        /* ocultar número */

        document.getElementById(
            numeroArrastrado
        ).style.display =
        "none";

        correctos++;

        if(correctos === 3){

            document.getElementById(
                "mensaje"
            ).innerHTML =
            "🎉 ¡Felicitaciones, completaste el juego!";

            document.getElementById(
                "audioFinal"
            ).play();

            confetti({
                particleCount:300,
                spread:180
            });

            document.getElementById(
                "btnSiguiente"
            ).style.display =
            "inline-block";
        }

    }

    /* ERROR */

    else{

        event.target.classList.add(
            "error"
        );

        document.getElementById(
            "audioError"
        ).play();

        document.getElementById(
            "mensaje"
        ).innerHTML =
        "❌ Inténtalo nuevamente";

        setTimeout(() => {

            event.target.classList.remove(
                "error"
            );

        },1000);

    }

}