        // =========================
        // CARGAR AVATAR
        // =========================

let avatarGuardado = localStorage.getItem("avatarSeleccionado");

document.getElementById("avatar").src = avatarGuardado;

        if(avatarGuardado){

            avatar.src = avatarGuardado;

        }else{

            avatar.src = "img/avatar1.png";

        }

        // =========================
        // SALUDO
        // =========================

        let saludo = document.getElementById("saludol");

        saludo.innerHTML = "¡Bienvenido!";

        // =========================
        // IR AL JUEGO
        // =========================

// =========================
// IR AL SIGUIENTE JUEGO
// =========================

function irJuego1(){

    window.location.href = "juego1.html";

}
