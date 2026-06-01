const nombre = localStorage.getItem("nombre");
const avatar = localStorage.getItem("avatar");

if(nombre){
    document.getElementById("saludo").textContent =
    "👋 Bienvenido " + nombre;
}else{
    document.getElementById("saludo").textContent =
    "👋 Bienvenido estudiante";
}

if(avatar){
    document.getElementById("avatarUsuario").src = avatar;
}else{
    document.getElementById("avatarUsuario").src = "img/avatar1.png";
}