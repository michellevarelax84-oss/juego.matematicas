    /* ==========================================
       1. EFECTOS DE SONIDO (Web Audio API)
       ========================================== */
    class SoundEngine {
      constructor() {
        this.ctx = null;
        this.muted = false;
      }
      init() {
        if (!this.ctx) {
          this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
      }
      toggleMute() {
        this.muted = !this.muted;
        return this.muted;
      }
      playDrag() {
        if (this.muted) return;
        this.init();
        if (this.ctx.state === 'suspended') this.ctx.resume();
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.frequency.setValueAtTime(140, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 0.08);
        
        gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
        
        osc.start();
        osc.stop(this.ctx.currentTime + 0.08);
      }
      playCorrect() {
        if (this.muted) return;
        this.init();
        if (this.ctx.state === 'suspended') this.ctx.resume();
        // Acorde arpegiado alegre (Do mayor: Do5, Mi5, Sol5, Do6)
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.05);
          
          gain.gain.setValueAtTime(0, this.ctx.currentTime + idx * 0.05);
          gain.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + idx * 0.05 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.05 + 0.25);
          
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(this.ctx.currentTime + idx * 0.05);
          osc.stop(this.ctx.currentTime + idx * 0.05 + 0.3);
        });
      }
      playError() {
        if (this.muted) return;
        this.init();
        if (this.ctx.state === 'suspended') this.ctx.resume();
        const osc = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sawtooth';
        osc2.type = 'triangle';
        
        osc.frequency.setValueAtTime(110, this.ctx.currentTime);
        osc2.frequency.setValueAtTime(113, this.ctx.currentTime); // Desafinado ligeramente para tensión
        
        gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.22);
        
        osc.connect(gain);
        osc2.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start();
        osc2.start();
        osc.stop(this.ctx.currentTime + 0.22);
        osc2.stop(this.ctx.currentTime + 0.22);
      }
      playLevelComplete() {
        if (this.muted) return;
        this.init();
        if (this.ctx.state === 'suspended') this.ctx.resume();
        // Pequeña escala ascendente rápida en onda triángulo (retro-style)
        const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 1046.50];
        notes.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.07);
          
          gain.gain.setValueAtTime(0, this.ctx.currentTime + idx * 0.07);
          gain.gain.linearRampToValueAtTime(0.1, this.ctx.currentTime + idx * 0.07 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.07 + 0.35);
          
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(this.ctx.currentTime + idx * 0.07);
          osc.stop(this.ctx.currentTime + idx * 0.07 + 0.4);
        });
      }
      playVictory() {
        if (this.muted) return;
        this.init();
        if (this.ctx.state === 'suspended') this.ctx.resume();
        // Fanfarria triunfal final
        const melody = [
          { f: 523.25, d: 0.12 }, // C5
          { f: 587.33, d: 0.12 }, // D5
          { f: 659.25, d: 0.12 }, // E5
          { f: 783.99, d: 0.12 }, // G5
          { f: 659.25, d: 0.12 }, // E5
          { f: 783.99, d: 0.24 }, // G5
          { f: 880.00, d: 0.12 }, // A5
          { f: 987.77, d: 0.12 }, // B5
          { f: 1046.50, d: 0.6 }  // C6
        ];
        
        let current = this.ctx.currentTime;
        melody.forEach((note) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(note.f, current);
          
          gain.gain.setValueAtTime(0, current);
          gain.gain.linearRampToValueAtTime(0.12, current + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, current + note.d - 0.02);
          
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(current);
          osc.stop(current + note.d);
          current += note.d;
        });
      }
    }
    const sound = new SoundEngine();
    /* ==========================================
       2. CELEBRACIÓN CON CONFETI (HTML5 Canvas)
       ========================================== */
    class ConfettiEffect {
      constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.active = false;
        
        window.addEventListener('resize', () => this.resize());
        this.resize();
      }
      resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
      }
      start() {
        this.active = true;
        this.particles = [];
        for (let i = 0; i < 150; i++) {
          this.particles.push(this.createParticle());
        }
        this.animate();
      }
      stop() {
        this.active = false;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
      createParticle() {
        const colors = [
          '#f43f5e', '#ec4899', '#d946ef', '#a855f7', 
          '#8b5cf6', '#6366f1', '#3b82f6', '#0ea5e9', 
          '#06b6d4', '#14b8a6', '#10b981', '#22c55e', 
          '#84cc16', '#eab308', '#f97316', '#ef4444'
        ];
        return {
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height - this.canvas.height - 20,
          size: Math.random() * 8 + 6,
          color: colors[Math.floor(Math.random() * colors.length)],
          speedX: Math.random() * 4 - 2,
          speedY: Math.random() * 4 + 4,
          rotation: Math.random() * 360,
          rotationSpeed: Math.random() * 4 - 2
        };
      }
      animate() {
        if (!this.active) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(p => {
          p.y += p.speedY;
          p.x += p.speedX;
          p.rotation += p.rotationSpeed;
          
          if (p.y > this.canvas.height) {
            p.y = -20;
            p.x = Math.random() * this.canvas.width;
          }
          
          this.ctx.save();
          this.ctx.translate(p.x, p.y);
          this.ctx.rotate(p.rotation * Math.PI / 180);
          this.ctx.fillStyle = p.color;
          this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          this.ctx.restore();
        });
        
        requestAnimationFrame(() => this.animate());
      }
    }
    const confetti = new ConfettiEffect('confetti-canvas');
    /* ==========================================
       3. DATOS Y ESTRUCTURA DE OBSTÁCULOS
       ========================================== */
    const OBSTACLES = [
      {
        id: 1,
        title: "Obstáculo 1: Multiplicaciones Básicas",
        icon: "⚡",
        desc: "¡Bienvenido al desafío! En este nivel debes completar los productos correctos de las multiplicaciones encadenadas en la cuadrícula de 10x10. Arrastra las tarjetas de opciones de la parte inferior a las celdas punteadas.",
        options: ["12", "20", "30", "42", "56"],
        // Celdas del crucigrama (Fila, Columna) -> { tipo, valor, idZonaDrop, correct }
        gridCells: {
          // Eq 1: 3 x 4 = [12]
          "2,1": { type: "static", val: "3" },
          "2,2": { type: "operator", val: "x" },
          "2,3": { type: "static", val: "4" },
          "2,4": { type: "operator", val: "=" },
          "2,5": { type: "dropzone", correct: "12" },
          // Eq 2: 4 x 5 = [20]
          "3,3": { type: "operator", val: "x" },
          "4,3": { type: "static", val: "5" },
          "5,3": { type: "operator", val: "=" },
          "6,3": { type: "dropzone", correct: "20" },
          // Eq 3: 5 x 6 = [30]
          "4,4": { type: "operator", val: "x" },
          "4,5": { type: "static", val: "6" },
          "4,6": { type: "operator", val: "=" },
          "4,7": { type: "dropzone", correct: "30" },
          // Eq 4: 6 x 7 = [42]
          "5,5": { type: "operator", val: "x" },
          "6,5": { type: "static", val: "7" },
          "7,5": { type: "operator", val: "=" },
          "8,5": { type: "dropzone", correct: "42" },
          // Eq 5: 7 x 8 = [56]
          "6,6": { type: "operator", val: "x" },
          "6,7": { type: "static", val: "8" },
          "6,8": { type: "operator", val: "=" },
          "6,9": { type: "dropzone", correct: "56" }
        }
      },
      {
        id: 2,
        title: "Obstáculo 2: El Factor Perdido",
        icon: "🔍",
        desc: "¡Excelente! En este obstáculo, el reto cambia: debes encontrar el factor de un solo dígito que falta para que la ecuación dé el resultado indicado. ¡Analiza bien las intersecciones!",
        options: ["3", "4", "5", "7", "8"],
        gridCells: {
          // Eq 1: [7] x 6 = 42
          "1,1": { type: "dropzone", correct: "7" },
          "1,2": { type: "operator", val: "x" },
          "1,3": { type: "static", val: "6" },
          "1,4": { type: "operator", val: "=" },
          "1,5": { type: "static", val: "42" },
          // Eq 2: 6 x [8] = 48
          "2,3": { type: "operator", val: "x" },
          "3,3": { type: "dropzone", correct: "8" },
          "4,3": { type: "operator", val: "=" },
          "5,3": { type: "static", val: "48" },
          // Eq 3: [8] x 9 = 72 (Se inicia desde el Dropzone 3,3)
          "3,4": { type: "operator", val: "x" },
          "3,5": { type: "static", val: "9" },
          "3,6": { type: "operator", val: "=" },
          "3,7": { type: "static", val: "72" },
          // Eq 4: 9 x [5] = 45
          "4,5": { type: "operator", val: "x" },
          "5,5": { type: "dropzone", correct: "5" },
          "6,5": { type: "operator", val: "=" },
          "7,5": { type: "static", val: "45" },
          // Eq 5: [5] x [3] = 15 (Se inicia desde el Dropzone 5,5)
          "5,6": { type: "operator", val: "x" },
          "5,7": { type: "dropzone", correct: "3" },
          "5,8": { type: "operator", val: "=" },
          "5,9": { type: "static", val: "15" },
          // Eq 6: 9 x [4] = 36 (Aislada para el 5to dropzone)
          "8,2": { type: "static", val: "9" },
          "8,3": { type: "operator", val: "x" },
          "8,4": { type: "dropzone", correct: "4" },
          "8,5": { type: "operator", val: "=" },
          "8,6": { type: "static", val: "36" }
        }
      },
      {
        id: 3,
        title: "Obstáculo 3: Crucigrama Mixto",
        icon: "🔮",
        desc: "¡Estás progresando rápido! En este tercer obstáculo te enfrentarás a un desafío mixto. Algunas casillas vacías requieren un factor (dígito simple) y otras requieren el producto final. ¡Mucha atención!",
        options: ["4", "6", "9", "32", "81"],
        gridCells: {
          // Eq 1: [6] x 7 = 42
          "2,1": { type: "dropzone", correct: "6" },
          "2,2": { type: "operator", val: "x" },
          "2,3": { type: "static", val: "7" },
          "2,4": { type: "operator", val: "=" },
          "2,5": { type: "static", val: "42" },
          // Eq 2: 7 x [4] = 28
          "3,3": { type: "operator", val: "x" },
          "4,3": { type: "dropzone", correct: "4" },
          "5,3": { type: "operator", val: "=" },
          "6,3": { type: "static", val: "28" },
          // Eq 3: [4] x 8 = [32] (Se inicia en el Dropzone 4,3)
          "4,4": { type: "operator", val: "x" },
          "4,5": { type: "static", val: "8" },
          "4,6": { type: "operator", val: "=" },
          "4,7": { type: "dropzone", correct: "32" },
          // Eq 4: 8 x [9] = 72
          "5,5": { type: "operator", val: "x" },
          "6,5": { type: "dropzone", correct: "9" },
          "7,5": { type: "operator", val: "=" },
          "8,5": { type: "static", val: "72" },
          // Eq 5: [9] x 9 = [81] (Se inicia en el Dropzone 6,5)
          "6,6": { type: "operator", val: "x" },
          "6,7": { type: "static", val: "9" },
          "6,8": { type: "operator", val: "=" },
          "6,9": { type: "dropzone", correct: "81" }
        }
      },
      {
        id: 4,
        title: "Obstáculo 4: El Gran Reto Final",
        icon: "🏆",
        desc: "¡Increíble, has llegado al último obstáculo! Resuelve este gran crucigrama mixto de alta dificultad con factores y productos de un dígito. Si lo logras, ¡celebrarás a lo grande con música y confeti!",
        options: ["5", "6", "7", "54", "72"],
        gridCells: {
          // Eq 1: 9 x 8 = [72]
          "2,1": { type: "static", val: "9" },
          "2,2": { type: "operator", val: "x" },
          "2,3": { type: "static", val: "8" },
          "2,4": { type: "operator", val: "=" },
          "2,5": { type: "dropzone", correct: "72" },
          // Eq 2: 8 x [7] = 56
          "3,3": { type: "operator", val: "x" },
          "4,3": { type: "dropzone", correct: "7" },
          "5,3": { type: "operator", val: "=" },
          "6,3": { type: "static", val: "56" },
          // Eq 3: [7] x [6] = 42 (Se inicia en el Dropzone 4,3)
          "4,4": { type: "operator", val: "x" },
          "4,5": { type: "dropzone", correct: "6" },
          "4,6": { type: "operator", val: "=" },
          "4,7": { type: "static", val: "42" },
          // Eq 4: [6] x 9 = [54] (Se inicia en el Dropzone 4,5)
          "5,5": { type: "operator", val: "x" },
          "6,5": { type: "static", val: "9" },
          "7,5": { type: "operator", val: "=" },
          "8,5": { type: "dropzone", correct: "54" },
          // Eq 5: 9 x [5] = 45
          "6,6": { type: "operator", val: "x" },
          "6,7": { type: "dropzone", correct: "5" },
          "6,8": { type: "operator", val: "=" },
          "6,9": { type: "static", val: "45" }
        }
      }
    ];
    /* ==========================================
       4. CONTROLADORES Y LÓGICA DEL JUEGO
       ========================================== */
    let currentLevelIdx = 0;
    let correctCount = 0;
    const totalDropsNeeded = 5;
    // Elementos del DOM
    const crosswordGrid = document.getElementById('crossword-grid');
    const optionsContainer = document.getElementById('options-container');
    const progressFill = document.getElementById('progress-fill');
    
    // Modal Elements
    const instructionModal = document.getElementById('instruction-modal');
    const modalIcon = document.getElementById('modal-icon');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalStartBtn = document.getElementById('modal-start-btn');
    const soundToggleBtn = document.getElementById('sound-toggle-btn');
    // Inicialización del juego al cargar
    window.addEventListener('DOMContentLoaded', () => {
      showInstructionModal(currentLevelIdx);
      
      // Control de Sonido
      soundToggleBtn.addEventListener('click', () => {
        const isMuted = sound.toggleMute();
        soundToggleBtn.innerText = isMuted ? "🔇" : "🔊";
      });
    });
    // Mostrar modal con instrucciones del obstáculo
    function showInstructionModal(levelIdx) {
      const level = OBSTACLES[levelIdx];
      modalIcon.innerText = level.icon;
      modalTitle.innerText = level.title;
      modalDesc.innerText = level.desc;
      modalStartBtn.innerText = "Comenzar Obstáculo";
      instructionModal.classList.remove('hidden');
      // Remover cualquier listener previo del botón de inicio
      const newBtn = modalStartBtn.cloneNode(true);
      modalStartBtn.parentNode.replaceChild(newBtn, modalStartBtn);
      
      newBtn.addEventListener('click', () => {
        instructionModal.classList.add('hidden');
        sound.init(); // Inicializar contexto de sonido tras interacción del usuario
        loadObstacle(levelIdx);
      });
    }
    // Cargar la configuración de un obstáculo en particular
    function loadObstacle(levelIdx) {
      correctCount = 0;
      updateProgressBar(levelIdx);
      
      // Limpiar tablero y opciones
      crosswordGrid.innerHTML = '';
      optionsContainer.innerHTML = '';
      
      const levelData = OBSTACLES[levelIdx];
      // 1. Construir la cuadrícula 10x10
      for (let r = 0; r < 10; r++) {
        for (let c = 0; c < 10; c++) {
          const key = `${r},${c}`;
          const cellElement = document.createElement('div');
          cellElement.classList.add('cell');
          cellElement.dataset.row = r;
          cellElement.dataset.col = c;
          
          if (levelData.gridCells[key]) {
            const data = levelData.gridCells[key];
            cellElement.classList.add(data.type);
            
            if (data.type === 'static' || data.type === 'operator') {
              cellElement.innerText = data.val;
            } else if (data.type === 'dropzone') {
              cellElement.dataset.correct = data.correct;
              cellElement.innerText = '?';
            }
          } else {
            cellElement.classList.add('empty');
          }
          
          crosswordGrid.appendChild(cellElement);
        }
      }
      // 2. Cargar las 5 tarjetas de opciones
      // Barajamos un poco las opciones para no darlas en orden
      const shuffledOptions = [...levelData.options].sort(() => Math.random() - 0.5);
      
      shuffledOptions.forEach(optVal => {
        const card = document.createElement('div');
        card.classList.add('drag-card');
        card.innerText = optVal;
        card.dataset.val = optVal;
        optionsContainer.appendChild(card);
        
        // Asignar el controlador de arrastre táctil / ratón unificado
        setupPointerDrag(card);
      });
    }
    // Actualizar la línea de tiempo de progreso superior
    function updateProgressBar(levelIdx) {
      // Relleno de la barra
      const percent = (levelIdx / (OBSTACLES.length - 1)) * 100;
      progressFill.style.width = `${percent}%`;
      
      // Estados de los nodos (1, 2, 3, 4)
      for (let i = 0; i < OBSTACLES.length; i++) {
        const stepNode = document.getElementById(`step-${i + 1}`);
        stepNode.className = 'progress-step';
        if (i < levelIdx) {
          stepNode.classList.add('completed');
          stepNode.innerText = '✓';
        } else if (i === levelIdx) {
          stepNode.classList.add('active');
          stepNode.innerText = `${i + 1}`;
        } else {
          stepNode.innerText = `${i + 1}`;
        }
      }
    }
    /* ==========================================
       5. SISTEMA DE ARRASTRE Y SOLTAR UNIFICADO (Pointer Events)
       ========================================== */
    function setupPointerDrag(element) {
      element.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        
        // Sonido de inicio de arrastre
        sound.playDrag();
        // Guardar valores del elemento arrastrado
        const value = element.dataset.val;
        
        // Ocultar temporalmente la tarjeta original
        element.classList.add('dragging-active');
        // Crear una tarjeta visual flotante que sigue al cursor
        const floatingEl = document.createElement('div');
        floatingEl.classList.add('floating-drag-element');
        floatingEl.innerText = value;
        document.body.appendChild(floatingEl);
        // Posicionar el elemento flotante al instante
        updateFloatingPosition(floatingEl, e.clientX, e.clientY);
        // Obtener la posición de todas las celdas Dropzone activas
        const dropZones = Array.from(document.querySelectorAll('.cell.dropzone:not(.correct)'));
        let hoveredZone = null;
        // Manejar el movimiento
        function onPointerMove(moveEvent) {
          updateFloatingPosition(floatingEl, moveEvent.clientX, moveEvent.clientY);
          // Buscar si el puntero está sobre alguna Dropzone
          let activeZone = null;
          for (let zone of dropZones) {
            const rect = zone.getBoundingClientRect();
            if (
              moveEvent.clientX >= rect.left &&
              moveEvent.clientX <= rect.right &&
              moveEvent.clientY >= rect.top &&
              moveEvent.clientY <= rect.bottom
            ) {
              activeZone = zone;
              break;
            }
          }
          // Gestionar estados de hover visual
          if (activeZone !== hoveredZone) {
            if (hoveredZone) hoveredZone.classList.remove('active-hover');
            hoveredZone = activeZone;
            if (hoveredZone) hoveredZone.classList.add('active-hover');
          }
        }
        // Manejar la liberación (Drop)
        function onPointerUp(upEvent) {
          // Limpiar eventos globales
          window.removeEventListener('pointermove', onPointerMove);
          window.removeEventListener('pointerup', onPointerUp);
          
          // Eliminar el clon flotante
          floatingEl.remove();
          element.classList.remove('dragging-active');
          if (hoveredZone) {
            hoveredZone.classList.remove('active-hover');
            
            const expectedVal = hoveredZone.dataset.correct;
            
            // Validar si el valor es correcto
            if (value === expectedVal) {
              // ACIERTO
              sound.playCorrect();
              hoveredZone.innerText = value;
              hoveredZone.classList.add('correct');
              
              // Eliminar la tarjeta usada de las opciones
              element.remove();
              
              correctCount++;
              checkLevelCompletion();
            } else {
              // ERROR
              sound.playError();
              
              // Animación de sacudida (Shake) en la zona de soltar incorrecta
              hoveredZone.classList.add('shake-error');
              setTimeout(() => {
                hoveredZone.classList.remove('shake-error');
              }, 400);
            }
          }
        }
        // Registrar eventos de rastreo global
        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
      });
    }
    // Actualiza la posición de la tarjeta flotante de forma fluida
    function updateFloatingPosition(el, x, y) {
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
    }
    // Comprobar si todas las dropzones del nivel han sido resueltas
    function checkLevelCompletion() {
      if (correctCount === totalDropsNeeded) {
        setTimeout(() => {
          if (currentLevelIdx < OBSTACLES.length - 1) {
            // Pasó al siguiente obstáculo
            sound.playLevelComplete();
            currentLevelIdx++;
            showInstructionModal(currentLevelIdx);
          } else {
            // Completó todo el juego
            triggerFinalVictory();
          }
        }, 600);
      }
    }
    // Celebración de la Victoria Final
    function triggerFinalVictory() {
      sound.playVictory();
      confetti.start();
      // Configurar Modal de Victoria
      modalIcon.innerText = "🏆🎉";
      modalTitle.innerText = "¡Felicidades, Campeón!";
      modalDesc.innerText = "Has superado con éxito los 4 obstáculos del crucigrama matemático de multiplicaciones de un dígito de manera impecable.";
      modalStartBtn.innerText = "Volver a jugar";
      instructionModal.classList.remove('hidden');
      // Reemplazar listener para reiniciar el juego completo
      const newBtn = modalStartBtn.cloneNode(true);
      modalStartBtn.parentNode.replaceChild(newBtn, modalStartBtn);
      
      newBtn.addEventListener('click', () => {
        instructionModal.classList.add('hidden');
        confetti.stop();
        currentLevelIdx = 0;
        showInstructionModal(currentLevelIdx);
      });
    }