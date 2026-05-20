let numerosAprendidos = [];

/* ========================= */
/* AUDIOS */
/* ========================= */

const sonidoClick = new Audio("sonidos/click.mp3");
const sonidoError = new Audio("sonidos/error.mp3");
const sonidoConfeti = new Audio("sonidos/confeti.mp3");

/* ========================= */
/* FUNCIÓN HABLAR */
/* ========================= */

function hablar(texto, callback = null) {
    const loader = document.getElementById("loader");

    speechSynthesis.cancel();

    if (loader) {
        loader.style.display = "block";
    }

    const mensaje = new SpeechSynthesisUtterance(texto);
    mensaje.lang = "es-ES";
    mensaje.rate = 0.9;

    mensaje.onend = function () {
        if (loader) {
            loader.style.display = "none";
        }

        if (callback) {
            callback();
        }
    };

    speechSynthesis.speak(mensaje);
}

/* ========================= */
/* MOSTRAR NÚMERO GRANDE */
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

    setTimeout(function () {
        numeroVisual.style.opacity = "0";
        numeroVisual.style.transform =
            "translateY(-20px) scale(1.2)";

        setTimeout(function () {
            numeroVisual.remove();
        }, 800);

    }, 1200);
}

/* ========================= */
/* ETAPA 1: APRENDER NÚMEROS */
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

    for (let i = 1; i <= 10; i++) {
        let box = document.createElement("div");
        box.className = "number-box";
        box.innerText = i;

        if (numerosAprendidos.includes(i)) {
            box.style.background = "#d4ffd4";
            box.style.pointerEvents = "none";
        }

        box.onclick = function () {
            sonidoClick.play();

            if (!numerosAprendidos.includes(i)) {
                numerosAprendidos.push(i);
            }

            box.style.background = "#d4ffd4";
            box.style.pointerEvents = "none";

            mostrarNumeroGrande(i);

            zonaManzanas.innerHTML = "";

            for (let j = 1; j <= i; j++) {
                let item = document.createElement("div");
                item.className = "item";
                item.innerText = "🍎";

                item.onclick = function () {
                    sonidoClick.play();

                    if (j === 1) {
                        hablar("Una manzana");
                    } else {
                        hablar(j + " manzanas");
                    }
                };

                zonaManzanas.appendChild(item);
            }

            hablar(i.toString(), function () {

                if (numerosAprendidos.length === 10) {
                    message.innerText =
                        "🎉 ¡Muy bien! Ya aprendiste los números del 1 al 10";

                    hablar(
                        "Muy bien. Ya aprendiste los números del uno al diez.",
                        function () {
                            // sonido confeti
                            sonidoConfeti.play();

                            // confeti visual
                            confetti({
                                particleCount: 250,
                                spread: 150,
                                origin: { y: 0.6 }
                            });

                            // mostrar botón siguiente
                            document.getElementById("btnSiguiente").style.display = "inline-block";
                        }
                    );
                }
            });
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
/* IR AL SIGUIENTE JUEGO */
/* ========================= */

function irSiguienteJuego() {
    window.location.href = "juego2.html";
}

/* ========================= */
/* INICIAR JUEGO */
/* ========================= */

window.onload = function () {
    startNumbers();
};