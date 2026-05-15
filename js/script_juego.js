let numerosAprendidos = [];

/* audios */
const sonidoClick = new Audio("sonidos/click.mp3");
const sonidoError = new Audio("sonidos/error.mp3");
const sonidoConfeti = new Audio("sonidos/confite.mp3");

/* ========================= */
/* FUNCIÓN HABLAR */
/* ========================= */

function hablar(texto, callback = null) {
    const loader = document.getElementById("loader");

    speechSynthesis.cancel();
    loader.style.display = "block";

    const mensaje = new SpeechSynthesisUtterance(texto);
    mensaje.lang = "es-ES";
    mensaje.rate = 0.9;

    mensaje.onend = () => {
        loader.style.display = "none";

        if (callback) {
            callback();
        }
    };

    speechSynthesis.speak(mensaje);
}

/* ========================= */
/* NÚMERO GRANDE CON TRANSICIÓN */
/* ========================= */

function mostrarNumeroGrande(numero) {
    let anterior = document.getElementById("numeroGrande");

    if (anterior) {
        anterior.remove();
    }

    let numeroVisual = document.createElement("div");
    numeroVisual.id = "numeroGrande";
    numeroVisual.innerText = numero;

    document.getElementById("game").appendChild(numeroVisual);

    setTimeout(() => {
        numeroVisual.style.opacity = "0";
        numeroVisual.style.transform =
            "translateY(-20px) scale(1.2)";

        setTimeout(() => {
            numeroVisual.remove();
        }, 800);

    }, 1200);
}

/* ========================= */
/* ETAPA 1: NÚMEROS */
/* ========================= */

function startNumbers() {
    const container = document.getElementById("numbers");
    const zonaManzanas = document.getElementById("zonaManzanas");
    const message = document.getElementById("message");

    container.innerHTML = "";
    zonaManzanas.innerHTML = "";
    message.innerHTML = "";

    hablar(
        "Bienvenido. Aprende con nosotros. Vamos a aprender los números."
    );

    /* crear números del 1 al 10 */
    for (let i = 1; i <= 10; i++) {
        let box = document.createElement("div");
        box.className = "number-box";
        box.innerText = i;

        /* si ya fue tocado */
        if (numerosAprendidos.includes(i)) {
            box.style.background = "#d4ffd4";
            box.style.pointerEvents = "none";
        }

        box.onclick = () => {
            sonidoClick.play();

            /* guardar solo una vez */
            if (!numerosAprendidos.includes(i)) {
                numerosAprendidos.push(i);
            }

            /* bloquear después de tocar */
            box.style.background = "#d4ffd4";
            box.style.pointerEvents = "none";

            /* mostrar número grande */
            mostrarNumeroGrande(i);

            /* limpiar manzanas anteriores */
            zonaManzanas.innerHTML = "";

            /* mostrar manzanas abajo */
            for (let j = 1; j <= i; j++) {
                let item = document.createElement("div");
                item.className = "item";
                item.innerText = "🍎";

                item.onclick = () => {
                    sonidoClick.play();

                    if (j === 1) {
                        hablar("Una manzana");
                    } else {
                        hablar(j + " manzanas");
                    }
                };

                zonaManzanas.appendChild(item);
            }

            /* si aún no termina */
            if (numerosAprendidos.length < 10) {
                hablar(i.toString());
            }

            /* cuando llega al 10 */
            if (numerosAprendidos.length === 10) {
                hablar(
                    "10",
                    () => {
                        message.innerText =
                            "🎉 ¡Muy bien! Ya aprendiste los números del 1 al 10";

                        hablar(
                            "Muy bien. Ya aprendiste los números del uno al diez.",
                            () => {
                                sonidoConfeti.play();
                            }
                        );
                    }
                );
            }
        };

        container.appendChild(box);
    }
}

/* ========================= */
/* ERROR */
/* ========================= */

function mostrarError() {
    sonidoError.play();

    document.getElementById("message").innerText =
        "❌ Error, inténtalo otra vez";

    hablar("Error. Inténtalo otra vez.");
}

/* ========================= */
/* INICIAR */
/* ========================= */

window.onload = () => {
    startNumbers();
};