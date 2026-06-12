const pantallaJuego = document.getElementById("pantallaJuego");
const pantallaFinal = document.getElementById("pantallaFinal");

const btnComprobar = document.getElementById("btnComprobar");

const nivel1 = document.getElementById("nivel1");
const nivel2 = document.getElementById("nivel2");
const nivel3 = document.getElementById("nivel3");
const nivel4 = document.getElementById("nivel4");

const frutas = document.getElementById("frutas");
const frutasArrastre = document.getElementById("frutasArrastre");
const canasta = document.getElementById("canasta");

const operacion1 = document.getElementById("operacion1");
const operacion2 = document.getElementById("operacion2");
const operacion3 = document.getElementById("operacion3");
const operacion4 = document.getElementById("operacion4");

const respuesta = document.getElementById("respuesta");
const mensaje = document.getElementById("mensaje");

const estrellasTexto = document.getElementById("estrellas");
const nivelTexto = document.getElementById("nivel");

const audioCorrecto = document.getElementById("audioCorrecto");
const audioError = document.getElementById("audioError");
const audioAplausos = document.getElementById("audioAplausos");

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

let nivel = 1;
let estrellas = 0;
let correcta = 0;

let totalFrutas = 0;
let frutasQuitadas = 0;
let dragCount = 0;
let ecuacionesSesion = [];

let audioCtx = null;

// Inicialización de Web Audio API
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
/* MEZCLA DE ECUACIONES */
/* ========================= */

function generarEcuacionesSesion() {
    const listaPosibles = [
        { a: 9, b: 3 },
        { a: 8, b: 5 },
        { a: 7, b: 4 },
        { a: 6, b: 2 },
        { a: 9, b: 5 },
        { a: 8, b: 2 },
        { a: 7, b: 2 },
        { a: 6, b: 3 },
        { a: 5, b: 2 },
        { a: 9, b: 4 },
        { a: 8, b: 3 },
        { a: 7, b: 5 }
    ];
    
    // Shuffle
    for (let i = listaPosibles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = listaPosibles[i];
        listaPosibles[i] = listaPosibles[j];
        listaPosibles[j] = temp;
    }
    
    ecuacionesSesion = listaPosibles.slice(0, 4);
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
            } else if (i === stepNumber) {
                stepEl.className = "progress-step active";
            } else {
                stepEl.className = "progress-step";
            }
        }
    }
}

/* ========================= */
/* OCULTAR NIVELES */
/* ========================= */

function ocultarTodo() {
    nivel1.style.display = "none";
    nivel2.style.display = "none";
    nivel3.style.display = "none";
    nivel4.style.display = "none";
}

/* ========================= */
/* CONFIGURACIONES DE OBSTÁCULOS */
/* ========================= */

const INFO_OBSTACULOS = {
    1: {
        titulo: "Obstáculo 1: Quitar Frutas",
        desc: "Toca las manzanas para tacharlas con una cruz ❌ y restar. Cuenta las manzanas que quedan limpias para encontrar el resultado.",
        icon: "🍎",
        speakText: "Toca las manzanas para tacharlas con una cruz y restar. Cuenta las manzanas que quedan limpias para encontrar el resultado."
    },
    2: {
        titulo: "Obstáculo 2: La Canasta",
        desc: "Arrastra las frutillas a la canasta. Luego, cuenta cuántas frutillas quedaron en el árbol y escribe la respuesta.",
        icon: "🧺",
        speakText: "Arrastra las frutillas a la canasta. Luego, cuenta cuántas frutillas quedaron en el árbol y escribe la respuesta."
    },
    3: {
        titulo: "Obstáculo 3: Resta Mental",
        desc: "Usa tu mente para resolver la resta de un solo dígito y escribe el resultado correcto.",
        icon: "🧠",
        speakText: "Usa tu mente para resolver la resta de un solo dígito y escribe el resultado correcto."
    },
    4: {
        titulo: "Obstáculo 4: El Término Faltante",
        desc: "Descubre qué número falta al inicio de la resta para completar la operación. ¡Puedes hacerlo!",
        icon: "🏆",
        speakText: "Descubre qué número falta al inicio de la resta para completar la operación. ¡Puedes hacerlo!"
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
    
    // Actualizar panel flotante en pantalla también
    gameplayIcon.textContent = info.icon;
    gameplayText.textContent = info.desc;

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

    // Mostrar modal
    instructionModal.classList.remove("hidden");

    // Hablar automáticamente
    hablar(info.speakText);

    // Eventos de botones
    modalSpeakBtn.onclick = () => hablar(info.speakText);
    gameplaySpeakBtn.onclick = () => hablar(info.desc);
}

/* ========================= */
/* GENERAR NIVEL */
/* ========================= */

function generarNivel() {
    ocultarTodo();
    mensaje.textContent = "";
    respuesta.value = "";
    updateProgress(nivel);

    const ec = ecuacionesSesion[nivel - 1];
    const n1_val = ec.a;
    const n2_val = ec.b;

    /* ========================= */
    /* NIVEL 1 */
    /* ========================= */
    if (nivel === 1) {
        nivel1.style.display = "block";
        correcta = n1_val - n2_val;
        frutasQuitadas = 0;

        frutas.innerHTML = "";
        for (let i = 0; i < n1_val; i++) {
            const fruta = document.createElement("div");
            fruta.className = "fruta";
            fruta.textContent = "🍎";

            fruta.addEventListener("click", () => {
                if (!fruta.classList.contains("counted")) {
                    fruta.classList.add("counted");
                    frutasQuitadas++;
                    hablar(frutasQuitadas);
                } else {
                    fruta.classList.remove("counted");
                    frutasQuitadas--;
                    if (frutasQuitadas < 0) frutasQuitadas = 0;
                    hablar(frutasQuitadas === 0 ? "cero" : frutasQuitadas);
                }
            });

            frutas.appendChild(fruta);
        }

        operacion1.textContent = `${n1_val} - ${n2_val} = ?`;
    }

    /* ========================= */
    /* NIVEL 2 */
    /* ========================= */
    if (nivel === 2) {
        nivel2.style.display = "block";
        dragCount = 0;
        correcta = n1_val - n2_val;

        frutasArrastre.innerHTML = "";
        canasta.innerHTML = "🧺";

        for (let i = 0; i < n1_val; i++) {
            const fruta = document.createElement("div");
            fruta.className = "fruta";
            fruta.textContent = "🍓";
            fruta.draggable = true;
            fruta.id = "fruta-" + i;

            fruta.addEventListener("dragstart", (e) => {
                e.dataTransfer.setData("text/plain", fruta.id);
                fruta.classList.add("dragging");
            });

            fruta.addEventListener("dragend", () => {
                fruta.classList.remove("dragging");
            });

            frutasArrastre.appendChild(fruta);
        }

        operacion2.textContent = `${n1_val} - ${n2_val}`;
    }

    /* ========================= */
    /* NIVEL 3 */
    /* ========================= */
    if (nivel === 3) {
        nivel3.style.display = "block";
        correcta = n1_val - n2_val;

        operacion3.textContent = `${n1_val} - ${n2_val} = ?`;

        const frutas3 = document.getElementById("frutasNivel3");
        if (frutas3) {
            frutas3.innerHTML = "";
            for (let i = 0; i < n1_val; i++) {
                const fruta = document.createElement("div");
                fruta.className = "fruta";
                fruta.textContent = "🍊";
                // Las primeras n2_val frutas se muestran ya restadas (tachadas)
                if (i < n2_val) {
                    fruta.classList.add("counted");
                } else {
                    fruta.addEventListener("click", () => {
                        fruta.style.transform = "scale(1.2)";
                        setTimeout(() => fruta.style.transform = "scale(1)", 150);
                    });
                }
                frutas3.appendChild(fruta);
            }
        }
    }

    /* ========================= */
    /* NIVEL 4 */
    /* ========================= */
    if (nivel === 4) {
        nivel4.style.display = "block";
        correcta = n1_val; 

        operacion4.textContent = `__ - ${n2_val} = ${n1_val - n2_val}`;

        const frutas4 = document.getElementById("frutasNivel4");
        if (frutas4) {
            frutas4.innerHTML = "";
            for (let i = 0; i < n1_val; i++) {
                const fruta = document.createElement("div");
                fruta.className = "fruta";
                fruta.textContent = "🍐";
                // Las primeras n2_val frutas se muestran ya restadas (tachadas)
                if (i < n2_val) {
                    fruta.classList.add("counted");
                } else {
                    fruta.addEventListener("click", () => {
                        fruta.style.transform = "scale(1.2)";
                        setTimeout(() => fruta.style.transform = "scale(1)", 150);
                    });
                }
                frutas4.appendChild(fruta);
            }
        }
    }

    nivelTexto.textContent = nivel;
    
    // Abrir ventana explicativa inicial
    abrirModalExplicacion();
}

/* ========================= */
/* EVENTOS DRAG & DROP CANASTA */
/* ========================= */

canasta.addEventListener("dragover", (e) => {
    e.preventDefault();
});

canasta.addEventListener("drop", (e) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    const fruta = document.getElementById(id);
    if (fruta && fruta.parentNode === frutasArrastre) {
        fruta.style.opacity = "0.5";
        fruta.style.margin = "2px";
        fruta.draggable = false;
        canasta.appendChild(fruta);

        dragCount++;
        hablar(dragCount);
    }
});

/* ========================= */
/* VALIDACIÓN DE RESPUESTAS */
/* ========================= */

btnComprobar.addEventListener("click", () => {
    initAudio();
    const valor = Number(respuesta.value);

    if (valor === correcta) {
        mensaje.textContent = "🎉 ¡Correcto!";
        mensaje.className = "correcto";

        if (audioCorrecto) audioCorrecto.play();
        hablar("Muy bien");

        estrellas++;
        estrellasTexto.textContent = estrellas;

        setTimeout(() => {
            nivel++;
            if (nivel > 4) {
                localStorage.setItem("actividad3", "completada");
                if (audioAplausos) audioAplausos.play();
                hablar("¡Felicitaciones! Has completado todas las restas.");

                confetti({
                    particleCount: 250,
                    spread: 150,
                    origin: { y: 0.6 }
                });

                // Configurar Modal de Victoria
                modalIcon.textContent = "🏆🎉";
                modalTitle.textContent = "¡Felicidades, Campeón!";
                modalDesc.textContent = "Has completado con éxito los 4 obstáculos del bosque de las restas.";
                
                const speakBtnInModal = document.getElementById("modal-speak-btn");
                if (speakBtnInModal) speakBtnInModal.style.display = "none";

                const buttonsContainer = document.querySelector(".modal-buttons-container");
                if (buttonsContainer) {
                    buttonsContainer.innerHTML = `
                        <button class="btn-action" onclick="window.location.href='basico4.html'" style="background: linear-gradient(135deg, #38bdf8, #0ea5e9); box-shadow: 0 6px 0 #0284c7, 0 10px 15px rgba(14, 165, 233, 0.25);">
                            🏠 Volver al Menú
                        </button>
                        <button class="btn-action" onclick="window.location.href='actividad4.html'">
                            ➡️ Siguiente Actividad
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
        hablar("Inténtalo otra vez");
    }
});

/* ========================= */
/* INICIO DE PARTIDA AUTOMÁTICO */
/* ========================= */

window.onload = () => {
    // Escuchar primer click para habilitar sonido en navegadores restrictivos
    document.body.addEventListener("click", () => {
        initAudio();
    }, { once: true });

    generarNivel();
};