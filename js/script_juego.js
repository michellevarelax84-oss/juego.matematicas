let totalItems = 0;

const objetos = ["🍎", "⚽", "⭐", "🧸", "🚗", "🐶", "🌈"];

const sonidoClick = new Audio("audio/click.mp3");
const sonidoError = new Audio("audio/error.mp3");
const sonidoCorrecto = new Audio("audio/confeti.mp3");

/* ⏳ SOLO BIENVENIDA */
function hablarBienvenida(texto, callback) {
    const loader = document.getElementById("loader");
    loader.style.display = "block";

    const msg = new SpeechSynthesisUtterance(texto);
    msg.lang = "es-ES";

    msg.onend = () => {
        loader.style.display = "none";
        if (callback) callback();
    };

    speechSynthesis.speak(msg);
}

/* hablar normal */
function hablar(texto) {
    const msg = new SpeechSynthesisUtterance(texto);
    msg.lang = "es-ES";
    speechSynthesis.speak(msg);
}

/* ETAPA 1 */
function startNumbers() {
    const container = document.getElementById("numbers");
    container.innerHTML = "";

    let numerosTocados = [];

    hablarBienvenida(
        "Bienvenido. Aprende con nosotros. Vamos a aprender los números.",
        () => {}
    );

    for (let i = 1; i <= 10; i++) {
        let box = document.createElement("div");
        box.className = "number-box";
        box.innerText = i;

        box.onclick = () => {
            if (!numerosTocados.includes(i)) {
                sonidoClick.play();
                numerosTocados.push(i);

                hablar(i);

                box.style.background = "#d4ffd4";
                box.style.pointerEvents = "none";
            }

            if (numerosTocados.length === 10) {
                document.getElementById("message").innerText =
                    "🎉 ¡Muy bien! Ahora vamos a contar objetos.";

                hablar("Muy bien. Ahora vamos a contar objetos.", startGuessGame);
            }
        };

        container.appendChild(box);
    }
}

/* ETAPA 2 */
function startGuessGame() {
    const container = document.getElementById("numbers");
    container.innerHTML = "";

    totalItems = Math.floor(Math.random() * 5) + 1;

    hablar("¿Cuántos objetos hay?");

    for (let i = 0; i < totalItems; i++) {
        let item = document.createElement("div");
        item.className = "item";
        item.innerText = "🍎";

        item.onclick = () => {
            sonidoClick.play();
            hablar(i + 1);
            item.onclick = null;
        };

        container.appendChild(item);
    }
}

/* iniciar */
startNumbers();