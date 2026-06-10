
const inicio = document.getElementById("inicio");
const juego = document.getElementById("juego");

const btnStart = document.getElementById("btnStart");
const btnCheck = document.getElementById("btnCheck");
const btnValidate = document.getElementById("btnValidate");

const operacion = document.getElementById("operacion");
const frutas = document.getElementById("frutas");
const respuesta = document.getElementById("respuesta");
const mensaje = document.getElementById("mensaje");

let correcta = 0;
let nivel = 1;

/* 🔵 NIVEL 3 */
let respuestasUsuario = [];
let paresCorrectos = [];

/* 🔊 VOZ */
function hablar(texto){
    speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(texto);
    msg.lang = "es-ES";
    msg.rate = 1;
    speechSynthesis.speak(msg);
}

/* 🔢 RANDOM */
function rand(min,max){
    return Math.floor(Math.random()*(max-min+1))+min;
}

/* 🔢 NÚMEROS EN PALABRAS */
function numeroEnPalabras(num){

    const palabras = [
        "uno","dos","tres","cuatro","cinco",
        "seis","siete","ocho","nueve","diez",
        "once","doce","trece","catorce","quince"
    ];

    return palabras[num - 1] || num;
}

/* 🧠 TÍTULO GLOBAL */
function mostrarTitulo(texto){

    operacion.innerHTML = "";

    let titulo = document.createElement("h2");
    titulo.textContent = texto;
    titulo.style.color = "#f59e0b";
    titulo.style.marginBottom = "10px";

    operacion.appendChild(titulo);

    hablar(texto);
}

/* ========================= */
/* 🎮 GENERAR NIVELES */
/* ========================= */

function generar(){

    frutas.innerHTML = "";
    respuesta.value = "";
    mensaje.textContent = "";

    /* ========================= */
    /* 🟢 NIVEL 1 */
    /* ========================= */

    if(nivel === 1){

        let a = rand(2,5);
        let b = rand(2,5);

        correcta = a * b;

        mostrarTitulo("Nivel 1: Contemos las manzanas");

        let expr = document.createElement("p");
        expr.textContent = `${a} × ${b} = ?`;
        operacion.appendChild(expr);

        for(let i = 0; i < a; i++){

            let grupo = document.createElement("div");
            grupo.className = "grupo";

            for(let j = 0; j < b; j++){

                let fruta = document.createElement("span");
                fruta.className = "fruta";
                fruta.textContent = "🍎";

                /* 🍎 CORRECCIÓN IMPORTANTE */
                fruta.addEventListener("click", ()=>{

                    hablar(numeroEnPalabras(j + 1));
                });

                grupo.appendChild(fruta);
            }

            frutas.appendChild(grupo);
        }
    }

    /* ========================= */
    /* 🟡 NIVEL 2 */
    /* ========================= */

    if(nivel === 2){

        let a = rand(10,20);
        let b = rand(2,9);

        correcta = a * b;

        mostrarTitulo("Nivel 2: Multiplicación mental");

        let expr = document.createElement("p");
        expr.textContent = `${a} × ${b} = ?`;
        operacion.appendChild(expr);
    }

    /* ========================= */
    /* 🔵 NIVEL 3 */
    /* ========================= */

    if(nivel === 3){

        frutas.innerHTML = "";
        operacion.innerHTML = "";

        respuestasUsuario = [];
        paresCorrectos = [];

        mostrarTitulo("Nivel 3: Sumas repetidas");

        /* ✔ pares correctos */
        for(let i = 0; i < 3; i++){

            let a = rand(2,5);
            let b = rand(2,5);

            let mult = `${a} × ${b}`;

            let suma = "";
            for(let j = 0; j < b; j++){
                suma += a;
                if(j < b - 1) suma += " + ";
            }

            paresCorrectos.push({
                mult,
                suma,
                valor: a * b
            });
        }

        /* 🔼 multiplicaciones */
        let zonaMult = document.createElement("div");

        paresCorrectos.forEach((p, index)=>{

            let caja = document.createElement("div");
            caja.className = "grupo";
            caja.textContent = p.mult;

            caja.addEventListener("dragover", (e)=>{
                e.preventDefault();
            });

            caja.addEventListener("drop", (e)=>{
                e.preventDefault();

                let id = e.dataTransfer.getData("text");
                let item = document.getElementById(id);

                if(item){

                    caja.textContent = `${p.mult} = ${item.textContent}`;

                    respuestasUsuario[index] = {
                        elegido: Number(item.dataset.valor),
                        correcto: p.valor
                    };
                }
            });

            zonaMult.appendChild(caja);
        });

        frutas.appendChild(zonaMult);

        /* 🔽 opciones */
        let opciones = [];

        paresCorrectos.forEach(p=>{
            opciones.push({texto:p.suma, valor:p.valor});
        });

        for(let i = 0; i < 4; i++){

            let a = rand(2,5);
            let b = rand(2,5);

            let suma = "";
            for(let j = 0; j < b; j++){
                suma += a;
                if(j < b - 1) suma += " + ";
            }

            opciones.push({
                texto: suma,
                valor: a * b
            });
        }

        opciones.sort(()=>Math.random()-0.5);

        let zonaSumas = document.createElement("div");

        zonaSumas.style.display = "flex";
        zonaSumas.style.flexWrap = "wrap";
        zonaSumas.style.justifyContent = "center";
        zonaSumas.style.gap = "10px";

        opciones.forEach((op,i)=>{

            let item = document.createElement("div");
            item.className = "grupo";
            item.draggable = true;
            item.id = "op" + i;
            item.dataset.valor = op.valor;
            item.textContent = op.texto;

            item.addEventListener("dragstart", (e)=>{
                e.dataTransfer.setData("text", item.id);
            });

            zonaSumas.appendChild(item);
        });

        frutas.appendChild(zonaSumas);
    }

    /* ========================= */
    /* 🔴 NIVEL 4 */
    /* ========================= */

    if(nivel === 4){

        let a = rand(2,9);
        let b = rand(2,9);

        correcta = a * b;

        mostrarTitulo("Nivel 4: Número faltante");

        let expr = document.createElement("p");
        expr.textContent = `__ × ${b} = ${correcta}`;
        operacion.appendChild(expr);
    }
}

/* 🚀 INICIO */
btnStart.addEventListener("click", ()=>{

    inicio.style.display = "none";
    juego.style.display = "block";

    hablar("Bienvenida al juego de multiplicación");

    generar();
});

/* ✔ VALIDAR 1,2,4 */
btnCheck.addEventListener("click", ()=>{

    let r = Number(respuesta.value);

    if(r === correcta){

        mensaje.textContent = "🎉 Muy bien!";
        mensaje.style.color = "green";

        if(typeof confetti === "function"){
            confetti();
        }

        hablar("Muy bien");

        setTimeout(()=>{

            nivel++;

            if(nivel > 4){
                hablar("Felicitaciones. Pasas a división");

                setTimeout(()=>{
                    window.location.href = "division.html";
                },1500);
                return;
            }

            generar();

        },1000);

    } else {

        mensaje.textContent = "Intenta otra vez";
        mensaje.style.color = "red";

        hablar("Intenta otra vez");
    }
});

/* ✔ VALIDAR NIVEL 3 */
btnValidate.addEventListener("click", ()=>{

    if(nivel === 3){

        let correctos = 0;

        for(let i = 0; i < respuestasUsuario.length; i++){

            if(respuestasUsuario[i] &&
               respuestasUsuario[i].elegido === respuestasUsuario[i].correcto){
                correctos++;
            }
        }

        if(correctos === paresCorrectos.length){

            mensaje.textContent = "🎉 Todo correcto!";
            mensaje.style.color = "green";

            hablar("Excelente, todo correcto");

        } else {

            mensaje.textContent = "❌ Intenta otra vez";
            mensaje.style.color = "red";

            hablar("Intenta otra vez");
        }
    }
});