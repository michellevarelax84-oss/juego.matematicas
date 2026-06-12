const pantallaJuego = document.getElementById("pantallaJuego");

const btnComprobar = document.getElementById("btnComprobar");

const tituloJuego = document.getElementById("tituloJuego");

const numero1 = document.getElementById("numero1");
const numero2 = document.getElementById("numero2");
const operador = document.getElementById("operador");

const respuesta = document.getElementById("respuesta");
const mensaje = document.getElementById("mensaje");

const estrellasTexto = document.getElementById("estrellas");
const nivelTexto = document.getElementById("nivel");
const resultado = document.getElementById("resultado");

// Nuevos selectores del Modal y Barra de Obstáculos
const instructionModal = document.getElementById("instruction-modal");
const modalIcon = document.getElementById("modal-icon");
const modalTitle = document.getElementById("modal-title");
const modalDesc = document.getElementById("modal-desc");
const modalSpeakBtn = document.getElementById("modal-speak-btn");
const modalStartBtn = document.getElementById("modal-start-btn");

const gameplayText = document.getElementById("gameplay-text");
const gameplayIcon = document.getElementById("gameplay-icon");
const gameplaySpeakBtn = document.getElementById("gameplay-speak-btn");

const progressFill = document.getElementById("progress-fill");

const audioCorrecto = document.getElementById("audioCorrecto");
const audioError = document.getElementById("audioError");
const audioAplausos = document.getElementById("audioAplausos");

let nivel = 1;
let estrellas = 0;

let n1 = 0;
let n2 = 0;
let opStr = "";
let correcta = 0;
let ecuacionesSesion = [];

let audioCtx = null;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx && audioCtx.state === "suspended") {
        audioCtx.resume();
    }
}

/* ========================= */
/* VOZ (TEXT-TO-SPEECH) */
/* ========================= */

function hablar(texto) {
    speechSynthesis.cancel();

    const msg = new SpeechSynthesisUtterance(texto);
    msg.lang = "es-ES";
    msg.rate = 0.95;
    msg.pitch = 1.6;

    const voces = speechSynthesis.getVoices();
    const voz = voces.find(v =>
        v.name.includes("Helena") ||
        v.name.includes("Laura") ||
        v.name.includes("Paulina") ||
        v.name.includes("Sabina") ||
        v.name.includes("Female")
    );

    if (voz) {
        msg.voice = voz;
    }

    // Guardar referencia global para evitar que sea eliminado por el recolector de basura (GC Bug)
    window.currentUtterance = msg;

    speechSynthesis.speak(msg);
}

/* ========================= */
/* GENERAR ECUACIONES */
/* ========================= */

function generarEcuacionesSesion() {
    const sumas = [
        { a: 5, b: 3, op: "+", correct: 8, name: "Suma" },
        { a: 4, b: 5, op: "+", correct: 9, name: "Suma" },
        { a: 6, b: 2, op: "+", correct: 8, name: "Suma" },
        { a: 7, b: 1, op: "+", correct: 8, name: "Suma" }
    ];
    const restas = [
        { a: 9, b: 4, op: "-", correct: 5, name: "Resta" },
        { a: 8, b: 3, op: "-", correct: 5, name: "Resta" },
        { a: 7, b: 5, op: "-", correct: 2, name: "Resta" },
        { a: 6, b: 2, op: "-", correct: 4, name: "Resta" }
    ];
    const multis = [
        { a: 6, b: 7, op: "x", correct: 42, name: "Multiplicación" },
        { a: 8, b: 4, op: "x", correct: 32, name: "Multiplicación" },
        { a: 7, b: 9, op: "x", correct: 63, name: "Multiplicación" },
        { a: 9, b: 6, op: "x", correct: 54, name: "Multiplicación" }
    ];
    const divs = [
        { a: 8, b: 2, op: "÷", correct: 4, name: "División" },
        { a: 9, b: 3, op: "÷", correct: 3, name: "División" },
        { a: 6, b: 2, op: "÷", correct: 3, name: "División" },
        { a: 8, b: 4, op: "÷", correct: 2, name: "División" }
    ];
    
    const s = sumas[Math.floor(Math.random() * sumas.length)];
    const r = restas[Math.floor(Math.random() * restas.length)];
    const m = multis[Math.floor(Math.random() * multis.length)];
    const d = divs[Math.floor(Math.random() * divs.length)];
    
    ecuacionesSesion = [s, r, m, d];
}

generarEcuacionesSesion();

/* ========================= */
/* BARRA Y PASOS DE PROGRESO (OBSTÁCULOS) */
/* ========================= */

function updateProgress(stepNumber) {
    const fillPercent = ((stepNumber - 1) / 3) * 100;
    const progressFill = document.getElementById("progress-fill");
    if (progressFill) progressFill.style.width = fillPercent + "%";
    
    for (let i = 1; i <= 4; i++) {
        const stepEl = document.getElementById("step-" + i);
        if (stepEl) {
            if (i < stepNumber) {
                stepEl.className = "progress-step completed";
                stepEl.innerText = "✓";
            } else if (i === stepNumber) {
                stepEl.className = "progress-step active";
                stepEl.innerText = i;
            } else {
                stepEl.className = "progress-step";
                stepEl.innerText = i;
            }
        }
    }
}

/* ========================= */
/* CONFIGURACIONES DE OBSTÁCULOS */
/* ========================= */

const INFO_OBSTACULOS = {
    1: {
        titulo: "Desafío de Suma",
        desc: "Resuelve la suma de un dígito mentalmente y escribe la respuesta.",
        icon: "➕",
        speakText: "Resuelve la suma de un dígito mentalmente y escribe la respuesta."
    },
    2: {
        titulo: "Desafío de Resta",
        desc: "Resuelve la resta de un dígito mentalmente y escribe la respuesta.",
        icon: "➖",
        speakText: "Resuelve la resta de un dígito mentalmente y escribe la respuesta."
    },
    3: {
        titulo: "Desafío de Multiplicación",
        desc: "Resuelve la multiplicación mentalmente y escribe la respuesta.",
        icon: "✖️",
        speakText: "Resuelve la multiplicación mentalmente y escribe la respuesta."
    },
    4: {
        titulo: "Desafío de División",
        desc: "Resuelve la división mentalmente y escribe la respuesta.",
        icon: "➗",
        speakText: "Resuelve la división mentalmente y escribe la respuesta."
    }
};

/* ========================= */
/* ABRIR MODAL EXPLICACIÓN */
/* ========================= */

function abrirModalExplicacion() {
    initAudio();
    const info = INFO_OBSTACULOS[nivel];
    if (!info) return;

    modalIcon.textContent = info.icon;
    modalTitle.textContent = info.titulo;
    modalDesc.textContent = info.desc;
    
    if (gameplayIcon) gameplayIcon.textContent = info.icon;
    if (gameplayText) gameplayText.textContent = info.desc;

    // Restaurar botones y voz para el modo de juego
    const speakBtnInModal = document.getElementById("modal-speak-btn");
    if (speakBtnInModal) speakBtnInModal.style.display = "block";

    const buttonsContainer = document.querySelector(".modal-buttons-container");
    if (buttonsContainer) {
        buttonsContainer.innerHTML = `<button class="btn-action" id="modal-start-btn">Comenzar</button>`;
        const newStartBtn = document.getElementById("modal-start-btn");
        newStartBtn.onclick = () => {
            instructionModal.classList.add("hidden");
            speechSynthesis.cancel();
            initAudio();
        };
    }

    instructionModal.classList.remove("hidden");

    hablar(info.speakText);

    modalSpeakBtn.onclick = () => hablar(info.speakText);
    gameplaySpeakBtn.onclick = () => hablar(info.desc);
}

/* ========================= */
/* GENERAR NIVEL */
/* ========================= */

function generarNivel() {
    pantallaJuego.style.display = "block";
    mensaje.textContent = "";
    respuesta.value = "";
    updateProgress(nivel);

    const ec = ecuacionesSesion[nivel - 1];
    n1 = ec.a;
    n2 = ec.b;
    opStr = ec.op;
    correcta = ec.correct;

    tituloJuego.textContent = `🌀 Desafío de ${ec.name}`;
    numero1.textContent = n1;
    numero2.textContent = n2;
    operador.textContent = opStr;
    resultado.textContent = "= ?";

    nivelTexto.textContent = nivel;
    abrirModalExplicacion();
}

/* EVENTOS */
numero1.addEventListener("click", () => hablar(n1));
numero2.addEventListener("click", () => hablar(n2));

btnComprobar.addEventListener("click", () => {
    initAudio();
    const valor = Number(respuesta.value);

    if (valor === correcta) {
        mensaje.textContent = "🎉 ¡Correcto!";
        mensaje.className = "correcto";

        estrellas++;
        estrellasTexto.textContent = estrellas;

        if (audioCorrecto) audioCorrecto.play();
        hablar("Muy bien");

        setTimeout(() => {
            nivel++;
            if (nivel > 4) {
                localStorage.setItem("actividad6", "completada");

                if (audioAplausos) audioAplausos.play();
                hablar("¡Felicitaciones! Has completado con éxito todo el desafío mixto.");

                confetti({
                    particleCount: 250,
                    spread: 150,
                    origin: { y: 0.6 }
                });

                // Configurar Modal de Victoria
                modalIcon.textContent = "🏆🎉";
                modalTitle.textContent = "¡Felicidades, Campeón!";
                modalDesc.textContent = "Has superado con éxito el Desafío Mixto final de Matemática de 4° Básico.";
                
                const speakBtnInModal = document.getElementById("modal-speak-btn");
                if (speakBtnInModal) speakBtnInModal.style.display = "none";

                const buttonsContainer = document.querySelector(".modal-buttons-container");
                if (buttonsContainer) {
                    buttonsContainer.innerHTML = `
                        <button class="btn-action" onclick="window.location.href='basico4.html'" style="background: linear-gradient(135deg, #38bdf8, #0ea5e9); box-shadow: 0 6px 0 #0284c7, 0 10px 15px rgba(14, 165, 233, 0.25);">
                            🏠 Volver al Menú
                        </button>
                    `;
                }

                instructionModal.classList.remove("hidden");
            } else {
                generarNivel();
            }
        }, 1200);
    } else {
        mensaje.textContent = "❌ Inténtalo otra vez";
        mensaje.className = "error";

        if (audioError) audioError.play();
        hablar("Intenta nuevamente");
    }
});

window.onload = () => {
    document.body.addEventListener("click", () => {
        initAudio();
    }, { once: true });

    generarNivel();
};
