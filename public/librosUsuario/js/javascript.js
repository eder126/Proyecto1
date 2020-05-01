function ensennar() {
	var linksn = document.getElementById("menu1");
	var linksn2 = document.getElementById("menu2");
	var linksn3 = document.getElementById("menu3");
	linksn.classList.toggle("notHidden");
	linksn2.classList.toggle("ocultar");
	linksn3.classList.toggle("notHidden");
}

function cancelar() {
	document.getElementById("caja").classList.remove("overlay");
    document.getElementById("advertencia").classList.add("ocultar");
    document.getElementById("advertencia2").classList.add("ocultar");
	document.getElementById("btnAceptar").classList.remove("ocultar");
	document.getElementById("btnCancelar").classList.remove("ocultar");
}

function aceptar() {
	if (document.getElementById("tituloAdv").innerHTML == `<i class="fas fa-check" style="color: #009688;" aria-hidden="true"></i>`) {
		window.location.href = document.location.href;
	} else {
		cancelar();
	}
}

function error(titulo, msg, aceptar, cancelar) {
	document.getElementById("caja").classList.add("overlay");
	document.getElementById("advertencia").classList.remove("ocultar");
	document.getElementById("tituloAdv").innerHTML = titulo;
	document.getElementById("mensaje").innerHTML = msg;
	if (!aceptar) document.getElementById("btnAceptar").classList.add("ocultar");
	if (!cancelar) document.getElementById("btnCancelar").classList.add("ocultar");
	window.scrollTo(0, 0);
}

function solicitud(ISBN) {
    document.getElementsByName("libroPersonal")[0].selectedIndex = 0;
    document.getElementsByName("fechaIntercambio")[0].value = "";
    document.getElementsByName("horaIntercambio")[0].value = "";
    document.getElementsByName("sucursal")[0].selectedIndex = 0;
    document.getElementById("aceptar2").value = ISBN;
    cancelar2();
    document.getElementById("caja").classList.add("overlay");
    document.getElementById("advertencia2").classList.remove("ocultar");
    window.scrollTo(0, 0);
}

function send(event) {
    var libroReceptor = document.getElementById("aceptar2");
    var libroPersonal = document.getElementsByName("libroPersonal")[0];
    var fecha = document.getElementsByName("fechaIntercambio")[0];
    var hora = document.getElementsByName("horaIntercambio")[0];
    var sucursal = document.getElementsByName("sucursal")[0];

    if(libroPersonal.value != "none" && libroReceptor.value != "" && sucursal.value != "none" && fecha.value != "" && hora.value != "") {
        if(libroPersonal.value != "none" && libroReceptor.value != ""){
            if(fecha.value != "" && hora.value != ""){
                if(new Date(fecha.value) > new Date()) {
                    if(dentro(Number(hora.value.replace(":", "")), 0, 2400)) {
                        if(sucursal.value != "none"){
                            var json = JSON.stringify({
                                receptorId: document.location.href.split("/")[document.location.href.split("/").length-1],
                                emisorISBN: libroPersonal.value,
                                receptorISBN: libroReceptor.value,
                                sucursal: sucursal.value,
                                dia: fecha.value,
                                hora: hora.value
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
                            });
                        } else {
                            cancelar2();
                            error("Error", "Debe seleccionar una sucursal en donde realizar el intercambio", true, false);
                            event.preventDefault();
                            return false;
                        }
                    } else {
                        cancelar2();
                        error("Error", "La hora de intercambio es invalida", true, false);
                        event.preventDefault();
                        return false;
                    }
                } else {
                    cancelar2();
                    error("Error", "La fecha de intercambio debe ser posterior a hoy", true, false);
                    event.preventDefault();
                    return false;
                }
            } else {
                cancelar2();
                error("Error", "Debe seleccionar una fecha y hora para realizar el intercambio", true, false);
                event.preventDefault();
                return false;
            }
        } else {
            cancelar2();
            error("Error", "Debe seleccionar un libro para ser intercambiado", true, false);
            event.preventDefault();
            return false;
        }
    } else {
        cancelar2();
        error("Error", "Favor llene todos los campos", true, false);
        event.preventDefault();
        return false;
    }
    cancelar2();
    event.preventDefault();
    return false;
}

function cancelar2() {
    cancelar();
	document.getElementById("caja").classList.remove("overlay");
    document.getElementById("advertencia").classList.add("ocultar");
    document.getElementById("advertencia2").classList.add("ocultar");
}

fetch(document.location.href + "/listarLibros")
.then(function (response) {
    //console.log(response.url);
    if (response.status != 200)
        console.log("Ocurrió un error con el servicio: " + response.status);
    else return response.json();
}).then(function (json) {
    console.log(json);
    if(json.usuario){
        document.getElementById("nombreUsuario").innerHTML = json.nombre;
        if (json.libros.length == 0) {
            document.getElementById("librosPerfil").innerHTML = 
            `<div>
                <p>${json.nombre} no ha comprado libros aún!</p>
            </div>`;
        } else {
            const libros =  getUnique(json.libros,'isbn');
            calculos(libros);
        }
    } else {
        document.getElementById("nombreUsuario").innerHTML = json.nombre;
        document.getElementById("librosPerfil").innerHTML = 
        `<div>
            <p>¡Esta cuenta no tiene permitido comprar libros!</p>
        </div>`;
    }
}).catch(function (err) {
    console.log("Ocurrió un error con el fetch del usuario.json: ", err);
});

fetch(document.location.href + "/listarLibros/personales")
.then(function (response) {
    //console.log(response.url);
    if (response.status != 200)
        console.log("Ocurrió un error con el servicio: " + response.status);
    else return response.json();
}).then(function (json) {
    //console.log(json);
    if(json.usuario){
        if (json.libros.length == 0) {
            var nuevaOpcion =  document.createElement("option");
            nuevaOpcion.value = "";
            nuevaOpcion.innerHTML = "Sin libros disponibles";
            document.getElementById("librosPersonales").appendChild(nuevaOpcion);
        } else {
            for(var i=0;i<json.libros.length;i++){
                if(json.libros[i].intercambio && !json.libros[i].intercambiado){
                    fetch(document.location.href+"/"+json.libros[i].isbn+"/libro")
                    .then(function (response) {
                        //console.log(response.url);
                        if (response.status != 200)
                            console.log("Ocurrió un error con el servicio: " + response.status);
                        else return response.json();
                    }).then(function (jsonLibro) {
                        //console.log(jsonLibro);
                        var nuevaOpcion =  document.createElement("option");
                        nuevaOpcion.value = jsonLibro.ISBN;
                        nuevaOpcion.innerHTML = jsonLibro.nombre;
                        document.getElementById("librosPersonales").appendChild(nuevaOpcion);
                    }).catch(function (err) {
                        console.log("Ocurrió un error con el fetch del usuario.json: ", err);
                    });
                }
            }
        }
    } else {
        var nuevaOpcion =  document.createElement("option");
        nuevaOpcion.value = "";
        nuevaOpcion.innerHTML = "¡Esta cuenta no tiene permitido intercambiar libros!";
        document.getElementById("librosPersonales").appendChild(nuevaOpcion);
    }
}).catch(function (err) {
    console.log("Ocurrió un error con el fetch del usuario.json: ", err);
});

function getUnique(arr,comp){
	//store the comparison  values in array
const unique =  arr.map(e=> e[comp]). 
  // store the keys of the unique objects
  map((e,i,final) =>final.indexOf(e) === i && i) 
  // eliminate the dead keys & return unique objects
 .filter((e)=> arr[e]).map(e=>arr[e]);
return unique;
}

function agregar(datos) {
    fetch(document.location.href+"/"+datos.isbn + "/libro")
    .then(function (response) {
        //console.log(response.url);
        if (response.status != 200)
            console.log("Ocurrió un error con el servicio: " + response.status);
        else
            return response.json();
    }).then(function (jsonLibro) {
        let libros = document.getElementById("librosSeccion");
        let tempImg = jsonLibro.img.split("/");
        tempImg[tempImg.length - 2] = "w_200,h_300,c_scale";
        jsonLibro.img = tempImg.join("/");

        var libro = "";
        if(jsonLibro.formato) {
            libro = `<button title="Digital" class="btnNoDisponible" disabled>Intercambio no disponible</button>`;
        } else {
            if(datos.intercambio){
                if(!datos.intercambiado){
                    libro = `<button tile="Físico" type="button" value="${jsonLibro.ISBN}" onclick="solicitud(this.value);" class="btnHabilitar">Solicitar Intercambio</button>`;
                } else {
                    libro = `<button title="Físico" type="button" class="btnNoDisponible">Intercambio no disponible</button>`;
                }
            } else {
                libro = `<button title="Físico" type="button" class="btnNoDisponible">Intercambio no disponible</button>`;
            }
        }
        var nuevaPalabra = "";
        var titulo = jsonLibro.nombre;
        if(jsonLibro.nombre.length > 17){
            nuevaPalabra = jsonLibro.nombre.substring(0, 16) + "...";
        } else {
            nuevaPalabra = jsonLibro.nombre;
        }

        libros.innerHTML = 
        `${libros.innerHTML} <div class="contenedorLibro">
            <div class="fotoLibro">
                <img src="${jsonLibro.img}"/>
            </div>
            <div class="Condatos">
                <a href="../perfilLibro/${jsonLibro.ISBN}" title="${titulo}">${nuevaPalabra}</a>
            </div>
            <div class="intercambio">
                ${libro}
            </div>
        </div>`;
    }).catch(function (err) {
        console.log("Ocurrió un error con el fetch", err);
    });
}

let librosArr = [];
function calculos(datos) {
	librosArr = datos;
    let cantidad = librosArr.length;
	if (cantidad >= 4) {
		for (let i = 0; i < 4; i++) {
            agregar(librosArr[0]);
            librosArr.shift();
		}
	} else {
		for (let i = 0; i < cantidad; i++) {
            agregar(librosArr[0]);
            librosArr.shift();
		}
	}
	if (librosArr.length >= 1) {
		document.getElementById("mas").classList.remove("ocultar");
	}else{
		document.getElementById("mas").classList.add("ocultar");
	}
}

fetch("/user").then(
	function (response) {
		if (response.status != 200) {
			console.log("Ocurrió un error con el servicio: " + response.status);
			error("Error", "Favor intentar luego", true, false);
		} else {
			return response.json();
		}
	}
)
	.then(function (json) {
		console.log(json);
		if (json.loggeado) {
			let arr = json.menu;
			arr.forEach(item => {
				let nuevo2 = document.createElement("a");
				nuevo2.href = `${item.href}`;
				nuevo2.innerText = `${item.opcion}`;
				document.getElementById("menu3").appendChild(nuevo2);
			});
			document.getElementById("menu3").innerHTML += `<a class=\"nombrePerfilArriba\" id=\"nombrePerfilArriba\" href="/perfil"></a><a href="/${json.iconoLink}"><i class=\"${json.icono}\"></i></a>`;
			document.getElementById("nombrePerfilArriba").innerText = json.nombre;
			document.getElementById("menu3").innerHTML += "<a href=\"/logout\">Cerrar sesión</a>";

		} else {
			document.getElementById("menu3").innerHTML = "<a class='registrarLogin' href='./registrar'>Registrar</a> <a class='registrarLogin' href='./login'>Iniciar Sesión</a>";
		}



	}).catch(function (error) {
		console.log(error);
		error("Error", "Favor intentar luego", true, false);
	});

function errorInput(that) {
	error("Error", "Favor llenar los campos.", true, false);
	that.classList.add("inputError");
}

function dentro(x, min, max) {
	return x >= min && x <= max;
}