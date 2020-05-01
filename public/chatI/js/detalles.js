let usuarioIDOtro = -1;

function advertenciaFinal(){
	document.getElementById("caja").classList.add("overlay");
	document.getElementById("advertencia2").classList.remove("ocultar");
    document.getElementById("btnAceptar2");
	document.getElementById("btnCancelar2");
	window.scrollTo(0, 0);
}

function finalizar(idIntercambio){
    console.log(idIntercambio);
}

function cancelar2() {
	document.getElementById("caja").classList.remove("overlay");
    document.getElementById("advertencia2").classList.add("ocultar");
}
        
function aceptar2(){
    fetch(document.location.href+"/finalizar/"+document.getElementById("btnAceptar2").value)
    .then(function (response) {
        if (response.status != 200) {
            console.log("Ocurrió un error con el servicio: " + response.status);
            error("Error", "Favor intentar luego", true, false);
        } else {
            return response.json();
        }
    }).then(function (json) {
        console.log(json);
        if (json.alerta) {
            const {
                titulo,
                mensaje,
                btnAceptar,
                btnCancelar
            } = json.alerta;
            cancelar2();
            error(titulo, mensaje, btnAceptar, btnCancelar);
        }
    }).catch(function (error) {
        console.log("Ocurrió un error con el fetch del finalizar", error);
        error("Error", "Favor intentar mas tarde", true, false);
        event.preventDefault();
        return false;
    });
}

fetch(document.location.href+"/miembro")
.then(function (response) {
    if (response.status != 200) {
        console.log("Ocurrió un error con el servicio: " + response.status);
        error("Error", "Favor intentar luego", true, false);
    } else {
        return response.json();
    }
}).then(function (json) {
    if(json.encontrado){
        var imagen = "../chatI/img/user.png";
        if(json.url != undefined && json.url != null && json.url != "" && json.url != " "){
            imagen = json.url;
        }
        var boton = "";
        if(!json.finalizado){
            document.getElementById("btnAceptar2").value = json.idIntercambio;
            boton = 
            `<div class="btns2">
                <div class="cajaBtn">
                    <button type="button" class="btnAzul" onclick="advertenciaFinal();">Finalizar intercambio</button>
                </div>
            </div>`;
        }
        document.getElementById("sidebar").innerHTML =
        `<div class="imagenPerfil">
            <div class="imagenContenedor">
                <img src="${imagen}"/>
            </div>
            <p id="${json.usuarioId}" class="tituloAdv">
            <a href="../perfilUsuario/${json.usuarioId}" target="_blank">${json.nombre} ${json.apellido}</a>
            </p>
            ${boton}
        </div>`;
        usuarioIDOtro = json.usuarioId;
        Mensajes();
    } else {
        document.getElementById("sidebar").innerHTML =
        `<div class="imagenPerfil">
            <div class="imagenContenedor">
                <img src="${imagen}"/>
            </div>
            <p id="nombre" class="tituloAdv">Datos no disponibles</p>
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
                if(Number(element.idEmisor) === Number(usuarioIDOtro)){
                    document.getElementById("wrapperContenido").innerHTML += 
                    `<div class="contenedorOtro">
                        <div class="mensajeOtro">
                            <p class="msjOtro" name="mensajesMostrados" id="${element.idIndex}">${element.msj}</p>
                        </div>
                    </div>`;
                } else {
                    document.getElementById("wrapperContenido").innerHTML += 
                    `<div class="contenedorYo">
                        <div class="mensajeYo">
                            <p class="msjYo" name="mensajesMostrados" id="${element.idIndex}">${element.msj}</p>
                        </div>
                    </div>`;
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

/*setInterval(*/function Mensajes(){
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
                json.mensajes.forEach((element, index, arr) => {
                    if(Number(element.idEmisor) === Number(usuarioIDOtro)){
                        document.getElementById("wrapperContenido").innerHTML += 
                        `<div class="contenedorOtro">
                            <div class="mensajeOtro">
                                <p class="msjOtro" name="mensajesMostrados" id="${index}">${element.msj}</p>
                            </div>
                        </div>`;
                    } else {
                        document.getElementById("wrapperContenido").innerHTML += 
                        `<div class="contenedorYo">
                            <div class="mensajeYo">
                                <p class="msjYo" name="mensajesMostrados" id="${index}">${element.msj}</p>
                            </div>
                        </div>`;
                    }
                });
                document.getElementsByName("mensajePersonal")[0].value = "";
                document.getElementById("wrapperContenido").scrollTop = document.getElementById("wrapperContenido").scrollHeight;
            }
        } else {
            document.getElementById("wrapperContenido").innerHTML += 
            `<div class="contenedorOtro">
                <div class="mensajeOtro">
                    <p class="msjOtro">No hay mensajes disponibles</p>
                </div>
            </div>`;
        }
    }).catch(function (error) {
        console.log(error);
        error("Error", "Favor intentar luego", true, false);
    });
}//, 10000);

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
    if(nuevoMensaje != ""){
        var json = JSON.stringify({
            mensaje: nuevoMensaje
        });
        
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
                var nuevoId = document.getElementsByName("mensajesMostrados").length;

                document.getElementById("wrapperContenido").innerHTML +=
                `<div class="contenedorYo">
                    <div class="mensajeYo">
                        <p class="msjYo" name="mensajesMostrados" id="${nuevoId}">${json.mensaje}</p>
                    </div>
                </div>`;
                document.getElementsByName("mensajePersonal")[0].value = "";
                document.getElementById("wrapperContenido").scrollTop = document.getElementById("wrapperContenido").scrollHeight;
            } else {
                document.getElementById("wrapperContenido").innerHTML +=
                `<div class="contenedorYo">
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