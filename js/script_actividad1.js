const tituloReto = document.getElementById("tituloReto");
const zonaJuego = document.getElementById("zonaJuego");
const mensaje = document.getElementById("mensaje");

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

const progressFill = document.getElementById("progress-fill");

let audioCtx = null;
function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx && audioCtx.state === "suspended") {
        audioCtx.resume();
    }
}

// ======================
// VOZ
// ======================
function hablar(texto, elemento = null){
    speechSynthesis.cancel();

    if(elemento){
        elemento.classList.add("hablando");
    }

    const voz = new SpeechSynthesisUtterance(texto);
    voz.lang = "es-ES";
    voz.rate = 0.9;
    voz.pitch = 1.1;

    voz.onend = function(){
        if(elemento){
            elemento.classList.remove("hablando");
        }
    };

    // Guardar referencia global para evitar que sea eliminado por el recolector de basura (GC Bug)
    window.currentUtterance = voz;

    speechSynthesis.speak(voz);
}

// ======================
// RETOS
// ======================
let retoActual = 0;
let selectedTarjeta = null;

const retos = [
    {
        tipo:"ordenar",
        titulo:"🐻 Ordena de menor a mayor",
        numeros:[3560,8900,4210]
    },
    {
        tipo:"ordenar",
        titulo:"⭐ Ordena de menor a mayor",
        numeros:[7500,1200,9800]
    },
    {
        tipo:"leer",
        titulo:"📖 Escucha y escribe el número",
        texto:"Ocho mil quinientos",
        correcta:"8500"
    },
    {
        tipo:"escribir",
        titulo:"✏️ Escribe en números",
        texto:"Siete mil doscientos treinta y cuatro",
        correcta:"7234"
    },
    {
        tipo:"recta",
        titulo:"📏 Completa la recta numérica",
        texto:"1000 - 2000 - ____ - 4000 - 5000",
        correcta:"3000"
    },
    {
        tipo:"tabla",
        titulo:"🧮 Tabla posicional",
        texto:"UM = 4   C = 5   D = 2   U = 8",
        audio:"Unidad de mil cuatro, centena cinco, decena dos y unidad ocho",
        correcta:"4528"
    }
];

const INFO_OBSTACULOS = {
    1: {
        titulo: "Obstáculo 1: Ordena números (Oso)",
        desc: "Arrastra o toca las tarjetas numéricas para ordenarlas de menor a mayor.",
        icon: "🐻",
        speakText: "Arrastra o toca las tarjetas numéricas para ordenarlas de menor a mayor."
    },
    2: {
        titulo: "Obstáculo 2: Ordena números (Estrella)",
        desc: "Arrastra o toca las tarjetas numéricas para ordenarlas de menor a mayor.",
        icon: "⭐",
        speakText: "Arrastra o toca las tarjetas numéricas para ordenarlas de menor a mayor."
    },
    3: {
        titulo: "Obstáculo 3: Escucha y Escribe",
        desc: "Presiona el botón de audio para escuchar el número y escríbelo en la casilla.",
        icon: "📖",
        speakText: "Presiona el botón de audio para escuchar el número y escríbelo en la casilla."
    },
    4: {
        titulo: "Obstáculo 4: Escribe en números",
        desc: "Lee el número escrito en palabras y escríbelo usando dígitos.",
        icon: "✏️",
        speakText: "Lee el número escrito en palabras y escríbelo usando dígitos."
    },
    5: {
        titulo: "Obstáculo 5: Recta Numérica",
        desc: "Completa el número que falta en la secuencia de la recta numérica.",
        icon: "📏",
        speakText: "Completa el número que falta en la secuencia de la recta numérica."
    },
    6: {
        titulo: "Obstáculo 6: Tabla Posicional",
        desc: "Escucha el valor de posición de cada dígito y escribe el número correspondiente.",
        icon: "🧮",
        speakText: "Escucha el valor de posición de cada dígito y escribe el número correspondiente."
    }
};

// ======================
// BARRA DE PROGRESO
// ======================
function updateProgress(stepNumber) {
    const fillPercent = ((stepNumber - 1) / 5) * 100;
    if (progressFill) progressFill.style.width = fillPercent + "%";
    
    for (let i = 1; i <= 6; i++) {
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

// ======================
// MEZCLAR
// ======================
function mezclar(array){
    return [...array].sort(() => Math.random() - 0.5);
}

// ======================
// ABRIR MODAL EXPLICACIÓN
// ======================
function abrirModalExplicacion() {
    initAudio();
    const info = INFO_OBSTACULOS[retoActual + 1];
    if (!info) return;

    modalIcon.textContent = info.icon;
    modalTitle.textContent = info.titulo;
    modalDesc.textContent = info.desc;
    
    if (gameplayIcon) gameplayIcon.textContent = info.icon;
    if (gameplayText) gameplayText.textContent = info.desc;

    // Restaurar botones y voz para el modo de juego
    const speakBtnInModal = document.getElementById("modal-speak-btn");
    if (speakBtnInModal) speakBtnInModal.style.display = "flex";

    const buttonsContainer = document.querySelector(".modal-buttons-container");
    if (buttonsContainer) {
        buttonsContainer.innerHTML = `<button class="btn-action" id="modal-start-btn">Comenzar</button>`;
        const newStartBtn = document.getElementById("modal-start-btn");
        newStartBtn.onclick = () => {
            instructionModal.classList.add("hidden");
            speechSynthesis.cancel();
            initAudio();
            
            // Ejecución automática de audio al cerrar el modal si corresponde
            const reto = retos[retoActual];
            if (reto.tipo === "leer" || reto.tipo === "tabla") {
                const btnAudio = document.getElementById("btnAudio");
                if (btnAudio) {
                    setTimeout(() => {
                        btnAudio.click();
                    }, 500);
                }
            }
        };
    }

    instructionModal.classList.remove("hidden");

    hablar(info.speakText);

    modalSpeakBtn.onclick = () => hablar(info.speakText);
    gameplaySpeakBtn.onclick = () => hablar(info.desc);
}

// ======================
// CARGAR RETO
// ======================
function cargarReto(){
    selectedTarjeta = null;
    mensaje.textContent = "";

    if(retoActual >= retos.length){
        finalizar();
        return;
    }

    updateProgress(retoActual + 1);

    const reto = retos[retoActual];
    tituloReto.textContent = reto.titulo;
    zonaJuego.innerHTML = "";

    if(reto.tipo === "ordenar"){
        zonaJuego.innerHTML = `<div class="tarjetas"></div>`;
        const contenedor = document.querySelector(".tarjetas");

        mezclar(reto.numeros).forEach(numero=>{
            const tarjeta = document.createElement("div");
            tarjeta.className = "tarjeta";
            tarjeta.draggable = true;
            tarjeta.textContent = numero;

            // Selección / Tap-to-swap
            tarjeta.addEventListener("click", () => {
                hablar(tarjeta.textContent, tarjeta);

                if (selectedTarjeta) {
                    if (selectedTarjeta !== tarjeta) {
                        const temp = tarjeta.textContent;
                        tarjeta.textContent = selectedTarjeta.textContent;
                        selectedTarjeta.textContent = temp;

                        selectedTarjeta.classList.remove("selected");
                        selectedTarjeta = null;
                    } else {
                        tarjeta.classList.remove("selected");
                        selectedTarjeta = null;
                    }
                } else {
                    selectedTarjeta = tarjeta;
                    tarjeta.classList.add("selected");
                }
            });

            contenedor.appendChild(tarjeta);
        });

        activarDrag();
    } else {
        if(reto.tipo === "leer"){
            zonaJuego.innerHTML = `
            <button id="btnAudio" class="btnAudio">
                🔊 Escuchar
            </button>
            <h3 id="textoReto">
                ${reto.texto}
            </h3>
            <input type="text" id="respuesta" placeholder="Escribe tu respuesta">
            `;
            const btnAudio = document.getElementById("btnAudio");
            const textoReto = document.getElementById("textoReto");

            btnAudio.onclick = function(){
                hablar(reto.texto, textoReto);
            };
        } else if(reto.tipo === "escribir"){
            zonaJuego.innerHTML = `
            <button id="btnAudio" class="btnAudio">
                🔊 Escuchar
            </button>
            <h3 id="textoReto">
                ${reto.texto}
            </h3>
            <input type="text" id="respuesta" placeholder="Escribe tu respuesta">
            `;
            const btnAudio = document.getElementById("btnAudio");
            const textoReto = document.getElementById("textoReto");

            btnAudio.onclick = function(){
                hablar(reto.texto, textoReto);
            };
        } else if(reto.tipo === "recta"){
            zonaJuego.innerHTML = `
            <h3 id="textoReto">
                ${reto.texto}
            </h3>
            <input type="text" id="respuesta" placeholder="Escribe tu respuesta">
            `;
        } else if(reto.tipo === "tabla"){
            zonaJuego.innerHTML = `
            <button id="btnAudio" class="btnAudio">
                🔊 Escuchar
            </button>
            <h3 id="textoReto">
                ${reto.texto}
            </h3>
            <input type="text" id="respuesta" placeholder="Escribe tu respuesta">
            `;
            const btnAudio = document.getElementById("btnAudio");
            const textoReto = document.getElementById("textoReto");

            btnAudio.onclick = function(){
                hablar(reto.audio, textoReto);
            };
        }
    }

    abrirModalExplicacion();
}

// ======================
// DRAG & DROP
// ======================
let arrastrado = null;

function activarDrag(){
    const tarjetas = document.querySelectorAll(".tarjeta");

    tarjetas.forEach(t=>{
        t.addEventListener("dragstart", function(){
            arrastrado = t;
        });

        t.addEventListener("dragover", function(e){
            e.preventDefault();
        });

        t.addEventListener("drop", function(){
            const temp = t.textContent;
            t.textContent = arrastrado.textContent;
            arrastrado.textContent = temp;
        });
    });
}

// ======================
// VALIDAR
// ======================
document.getElementById("btnValidar").addEventListener("click", validar);

function validar(){
    initAudio();
    const reto = retos[retoActual];

    if(reto.tipo === "ordenar"){
        const respuesta = [];
        document.querySelectorAll(".tarjeta").forEach(t=>{
            respuesta.push(Number(t.textContent));
        });

        const correcta = [...reto.numeros].sort((a,b)=>a-b);

        if(JSON.stringify(respuesta) === JSON.stringify(correcta)){
            correcto();
        }else{
            incorrecto();
        }
    }else{
        const respuestaEl = document.getElementById("respuesta");
        const respuestaVal = respuestaEl ? respuestaEl.value.trim() : "";

        if(respuestaVal === reto.correcta){
            correcto();
        }else{
            incorrecto();
        }
    }
}

// ======================
// RESPUESTA CORRECTA
// ======================
function correcto(){
    if (audioCorrecto) audioCorrecto.play();
    hablar("Muy bien");

    mensaje.innerHTML = "✅ ¡Correcto!";
    mensaje.className = "correcto";

    retoActual++;

    setTimeout(cargarReto, 1500);
}

// ======================
// RESPUESTA INCORRECTA
// ======================
function incorrecto(){
    if (audioError) audioError.play();
    hablar("Inténtalo nuevamente");

    mensaje.innerHTML = "❌ Respuesta incorrecta";
    mensaje.className = "error";
}

// ======================
// FINALIZAR
// ======================
function finalizar(){
    localStorage.setItem("actividad1", "completada");

    if (progressFill) progressFill.style.width = "100%";
    for (let i = 1; i <= 6; i++) {
        const stepEl = document.getElementById("step-" + i);
        if (stepEl) {
            stepEl.className = "progress-step completed";
            stepEl.innerText = "✓";
        }
    }

    if (audioAplausos) audioAplausos.play();

    confetti({
        particleCount:300,
        spread:180
    });

    // Configurar Modal de Victoria
    modalIcon.textContent = "🏆🎉";
    modalTitle.textContent = "¡Felicidades, Campeón!";
    modalDesc.textContent = "Has completado con éxito los 6 obstáculos de números y comparación.";
    
    const speakBtnInModal = document.getElementById("modal-speak-btn");
    if (speakBtnInModal) speakBtnInModal.style.display = "none";

    const buttonsContainer = document.querySelector(".modal-buttons-container");
    if (buttonsContainer) {
        buttonsContainer.innerHTML = `
            <button class="btn-action" onclick="window.location.href='basico4.html'" style="background: linear-gradient(135deg, #38bdf8, #0ea5e9); box-shadow: 0 6px 0 #0284c7, 0 10px 15px rgba(14, 165, 233, 0.25);">
                🏠 Volver al Menú
            </button>
            <button class="btn-action" onclick="window.location.href='actividad2.html'">
                ➡️ Siguiente Actividad
            </button>
        `;
    }

    instructionModal.classList.remove("hidden");
    hablar("Felicitaciones. Has completado la actividad.");
}

// ======================
// INICIAR
// ======================
window.onload = () => {
    document.body.addEventListener("click", () => {
        initAudio();
    }, { once: true });

    cargarReto();
};
