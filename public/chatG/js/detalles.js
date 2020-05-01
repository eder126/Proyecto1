let yo = -1;

fetch(document.location.href+"/miembros")
.then(function (response) {
    if (response.status != 200) {
        console.log("Ocurrió un error con el servicio: " + response.status);
        error("Error", "Favor intentar luego", true, false);
    } else {
        return response.json();
    }
}).then(function (json) {
    console.log(json);
    if(json.encontrado){
        for(var i=0; i < json.miembros.length; i++){
            document.getElementById("miembrosChat").innerHTML +=
            `<div class="miembroContenedor">
                <a id="${json.miembros[i].usuarioId}" class="titulo" target="_blank" href="../perfilUsuario/${json.miembros[i].usuarioId}">${json.miembros[i].nombre} ${json.miembros[i].apellido}</a>
            </div>`;
        }
        Mensajes();
    } else {
        document.getElementById("miembrosChat").innerHTML =
        `<div class="miembroContenedor">
            <p class="titulo">No hay usuarios que sean parte de este club</p>
        </div>`;
    }
}).catch(function (error) {
    console.log(error);
    error("Error", "Favor intentar luego", true, false);
});

//clearInterval(refreshIntervalId);

setInterval(function MensajesNuevos(){
    var CantMensajes = document.getElementsByName("mensajesMostrados").length - 1;
    fetch(document.location.href+"/mensajesNuevos/"+CantMensajes)
    .then(function (response) {
        if (response.status != 200) {
            console.log("Ocurrió un error con el servicio: " + response.status);
            error("Error", "Favor intentar luego", true, false);
        } else {
            return response.json();
        }
    }).then(function (json) {
        if(json.mensajes.length != 0){
            console.log(json);
            console.log("NUEVOS MENSAJES");
            json.mensajes.forEach((element, index, arr) => {

                if(Number(element.idEmisor) === Number(yo)){
                    var nombre = document.getElementById(element.idEmisor).innerHTML;
                    document.getElementById("wrapperContenido").innerHTML += 
                    `<div class="contenedorYo">
                        <p class="msjYo">${nombre}</p>
                        <div class="mensajeYo">
                            <p class="msjYo" name="mensajesMostrados">${element.msj}</p>
                        </div>
                    </div>`;
                } else {
                    var nombre = "";
                    if(document.getElementById(element.idEmisor) == null){
                        nombre = "Ya no es miembro"
                        document.getElementById("wrapperContenido").innerHTML += 
                        `<div class="contenedorOtro">
                            <p class="msjOtro">${nombre}</p>
                            <div class="mensajeEx">
                                <p class="msjOtro" name="mensajesMostrados">${element.msj}</p>
                            </div>
                        </div>`;
                    } else {
                        nombre = document.getElementById(element.idEmisor).innerHTML;
                        document.getElementById("wrapperContenido").innerHTML += 
                        `<div class="contenedorOtro">
                            <p class="msjOtro">${nombre}</p>
                            <div class="mensajeOtro">
                                <p class="msjOtro" name="mensajesMostrados">${element.msj}</p>
                            </div>
                        </div>`;
                    }
                }
            });
            document.getElementsByName("mensajePersonal")[0].value = "";
            document.getElementById("wrapperContenido").scrollTop = document.getElementById("wrapperContenido").scrollHeight;
        } else {
            console.log("NO HAY NUEVOS MENSAJES");
        }
    }).catch(function (error) {
        console.log(error);
        error("Error", "Favor intentar luego", true, false);
    });
}, 5000);

function Mensajes(){
    fetch(document.location.href+"/mensajes")
    .then(function (response) {
        if (response.status != 200) {
            console.log("Ocurrió un error con el servicio: " + response.status);
            error("Error", "Favor intentar luego", true, false);
        } else {
            return response.json();
        }
    }).then(function (json) {
        if(json.encontrado){
            if(json.mensajes.length != 0){
                json.mensajes.forEach(element => {
                    if(Number(element.idEmisor) === Number(yo)){
                        var nombre = document.getElementById(element.idEmisor).innerHTML;
                        document.getElementById("wrapperContenido").innerHTML += 
                        `<div class="contenedorYo">
                            <p class="msjYo">${nombre}</p>
                            <div class="mensajeYo">
                                <p class="msjYo" name="mensajesMostrados">${element.msj}</p>
                            </div>
                        </div>`;
                    } else {
                        var nombre = "";
                        if(document.getElementById(element.idEmisor) == null){
                            nombre = "Ya no es miembro"
                            document.getElementById("wrapperContenido").innerHTML += 
                            `<div class="contenedorOtro">
                                <p class="msjOtro">${nombre}</p>
                                <div class="mensajeEx">
                                    <p class="msjOtro" name="mensajesMostrados">${element.msj}</p>
                                </div>
                            </div>`;
                        } else {
                            nombre = document.getElementById(element.idEmisor).innerHTML;
                            document.getElementById("wrapperContenido").innerHTML += 
                            `<div class="contenedorOtro">
                                <p class="msjOtro">${nombre}</p>
                                <div class="mensajeOtro">
                                    <p class="msjOtro" name="mensajesMostrados">${element.msj}</p>
                                </div>
                            </div>`;
                        }
                    }
                });
                document.getElementsByName("mensajePersonal")[0].value = "";
                document.getElementById("wrapperContenido").scrollTop = document.getElementById("wrapperContenido").scrollHeight;
            } else {
                document.getElementById("wrapperContenido").innerHTML += 
                `<div class="contenedorOtro">
                    <div class="mensajeOtro">
                        <p class="msjOtro">No se han encontrado mensajes</p>
                    </div>
                </div>`;
            }
        } else {
            document.getElementById("wrapperContenido").innerHTML += 
            `<div class="contenedorOtro">
                <div class="mensajeOtro">
                    <p class="msjOtro">${json.mensajes}</p>
                </div>
            </div>`;
        }
    }).catch(function (error) {
        console.log(error);
        error("Error", "Favor intentar luego", true, false);
    });
}

function agregar(datos) {
    document.getElementById("wrapperContenido") += 
    `<div class="contenedorOtro">
        <div class="mensajeOtro">
            <p class="msjOtro">Mensaje de alguien mas</p>
        </div>
    </div>`;
}

function enviar(event){
    const nuevoMensaje = document.getElementsByName("mensajePersonal")[0].value;
    console.log(nuevoMensaje);
    if(nuevoMensaje != ""){
        var json = JSON.stringify({
            mensaje: nuevoMensaje
        });
        console.log(json);

        fetch(document.location.href, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: json
        }).then(function (response) {
            if (response.status != 200) {
                console.log("Ocurrió un error con el servicio: " + response.status);
                error("Error", "Favor intentar luego", true, false);
            } else {
                return response.json();
            }
        }).then(function (json) {
            console.log(json);
            if (json.enviado) {
                var nombre = document.getElementById(yo).innerHTML;
                document.getElementById("wrapperContenido").innerHTML += 
                `<div class="contenedorYo">
                    <p class="msjYo">${nombre}</p>
                    <div class="mensajeYo">
                        <p class="msjYo" name="mensajesMostrados">${json.mensaje}</p>
                    </div>
                </div>`;

                document.getElementsByName("mensajePersonal")[0].value = "";
                document.getElementById("wrapperContenido").scrollTop = document.getElementById("wrapperContenido").scrollHeight;
            } else {
                var nombre = document.getElementById(yo).innerHTML;
                document.getElementById("wrapperContenido").innerHTML +=
                `<div class="contenedorYo">
                    <p class="msjYo">${nombre}</p>
                    <div class="mensajeError">
                        <p class="msjYoError">"El mensaje no se ha enviado"</p>
                    </div>
                </div>`;
                document.getElementsByName("mensajePersonal")[0].value = "";
                document.getElementById("wrapperContenido").scrollTop = document.getElementById("wrapperContenido").scrollHeight;
                event.preventDefault();
	            return false;
            }
        });
    }
    event.preventDefault();
	return false;
}

fetch("/user/datos")
.then(function (response) {
    if (response.status != 200) {
        console.log("Ocurrió un error con el servicio: " + response.status);
        error("Error", "Favor intentar luego", true, false);
    } else {
        return response.json();
    }
}).then(function (json) {
    if (json.loggeado) {
        yo = json.user.usuarioId;
    }
}).catch(function (error) {
    console.log(error);
    error("Error", "Favor intentar luego", true, false);
});