salientes();

function mostrarMapa(id){
    console.log(id);
    fetch(document.location.href+"/intercambio/"+id)
    .then(function (response) {
        if (response.status != 200) {
            console.log("Ocurrió un error con el servicio: " + response.status);
            error("Error", "Favor intentar luego", true, false);
        } else {
            return response.json();
        }
    }).then(function (json) {
        if(json.encontrado){
            
            initMap(parseFloat(json.lat), parseFloat(json.long));

            var dia = new Date(json.dia).getDate();
            var mes = new Date(json.dia).getMonth();
            var anno = new Date(json.dia).getFullYear();
            var mesString = "";
            mes == 0 ? mesString="Enero": mes;
            mes == 1 ? mesString="Febrero":mes;
            mes == 2 ? mesString="Marzo":mes;
            mes == 3 ? mesString="Abril":mes;
            mes == 4 ? mesString="Mayo":mes;
            mes == 5 ? mesString="Junio":mes;
            mes == 6 ? mesString="Julio":mes;
            mes == 7 ? mesString="Agosto":mes;
            mes == 8 ? mesString="Setiembre":mes;
            mes == 9 ? mesString="Octubre":mes;
            mes == 10 ? mesString="Noviembre":mes;
            mes == 11 ? mesString="Diciembre":mes;
            
            var fecha = `${dia} de ${mesString} del ${anno}`;

            document.getElementById("localidadLibreria").innerHTML =
            `<h3 class="titulo" id="sucursal"><a href="perfilSucursal/${json.idSucursal}">${json.sucursalNombre}</a></h3>
            <h3 class="titulo" id="fecha">${fecha}</h3>
            <h3 class="titulo">Hora: <span id="hora">${json.hora}</span></h3>`;
        } else {
            document.getElementById("localidadLibreria").innerHTML = 
            `<h3 class="compraInfoNada">Los detalles de este intercambio no se encuentran disponiblnes</h3>`;
        }
    }).catch(function (error) {
        console.log(error);
        error("Error", "Favor intentar luego", true, false);
    });

    document.getElementById("caja").classList.add("overlay");
	document.getElementById("mapaSucursal").classList.remove("ocultar");
    window.scrollTo(0, 0);
}

function aceptarOferta(id){
    console.log(id);

    fetch(document.location.href+"/aceptar/"+id, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		}
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
            error(titulo, mensaje, btnAceptar, btnCancelar);
        }
	});
}

function rechazarOferta(id){
    console.log(id);

    fetch(document.location.href+"/rechazar/"+id, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		}
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
            error(titulo, mensaje, btnAceptar, btnCancelar);
        }
	});
}

function salientes(){
    fetch(document.location.href+"/solicitudesSalientes")
    .then(function (response) {
        if (response.status != 200) {
            console.log("Ocurrió un error con el servicio: " + response.status);
            error("Error", "Favor intentar luego", true, false);
        } else {
            return response.json();
        }
    }).then(function (json) {
        document.getElementById("titulo").innerHTML = "Solicitudes de intercambio enviadas";
        document.getElementById("wrapperTitulos").innerHTML = 
        `<h3 class="compraInfoColum">Receptor</h3>
        <h3 class="compraInfoColum">Pedido</h3>
        <h3 class="compraInfoColum">Tu libro</h3>
        <h3 class="compraInfoColum">Ubicación</h3>
        <h3 class="compraInfoColum">Respuesta</h3>`;
        if(json.encontrado){
            document.getElementById("wrapperContenido").innerHTML = "";
            calculos(json);
        } else {
            document.getElementById("wrapperContenido").innerHTML = 
            `<h3 class="compraInfoNada">No hay solicitudes enviadas</h3>`;
        }
    }).catch(function (error) {
        console.log(error);
        error("Error", "Favor intentar luego", true, false);
    });
}

function entrantes(){
    fetch(document.location.href+"/solicitudesEntrantes")
    .then(function (response) {
        if (response.status != 200) {
            console.log("Ocurrió un error con el servicio: " + response.status);
            error("Error", "Favor intentar luego", true, false);
        } else {
            return response.json();
        }
    }).then(function (json) {
        document.getElementById("titulo").innerHTML = "Solicitudes de intercambio recibidas";
        document.getElementById("wrapperTitulos").innerHTML = 
        `<h3 class="compraInfoColum">Emisor</h3>
        <h3 class="compraInfoColum">Oferta</h3>
        <h3 class="compraInfoColum">Tu libro</h3>
        <h3 class="compraInfoColum">Ubicación</h3>
        <h3 class="compraInfoColum">Decisión</h3>`;
        if(json.encontrado){
            document.getElementById("wrapperContenido").innerHTML = "";
            calculos(json);
        } else {
            document.getElementById("wrapperContenido").innerHTML = 
            `<h3 class="compraInfoNada">No hay solicitudes recibidas</h3>`;
        }
    }).catch(function (error) {
        console.log(error);
        error("Error", "Favor intentar luego", true, false);
    });
}

function activas(){
    fetch(document.location.href+"/activas")
    .then(function (response) {
        if (response.status != 200) {
            console.log("Ocurrió un error con el servicio: " + response.status);
            error("Error", "Favor intentar luego", true, false);
        } else {
            return response.json();
        }
    }).then(function (json) {
        document.getElementById("titulo").innerHTML = "Intercambios aceptados";
        document.getElementById("wrapperTitulos").innerHTML = 
        `<h3 class="compraInfoColum">Usuario</h3>
        <h3 class="compraInfoColum">Libro a recibir</h3>
        <h3 class="compraInfoColum">Tu libro</h3>
        <h3 class="compraInfoColum">Ubicación</h3>
        <h3 class="compraInfoColum">Chat</h3>`;
        if(json.encontrado){
            document.getElementById("wrapperContenido").innerHTML = "";
            console.log(json);
            calculos(json);
        } else {
            document.getElementById("wrapperContenido").innerHTML = 
            `<h3 class="compraInfoNada">No hay intercambios activos</h3>`;
        }
    }).catch(function (error) {
        console.log(error);
        error("Error", "Favor intentar luego", true, false);
    });
}

function finalizadas(){
    fetch(document.location.href+"/finalizadas")
    .then(function (response) {
        if (response.status != 200) {
            console.log("Ocurrió un error con el servicio: " + response.status);
            error("Error", "Favor intentar luego", true, false);
        } else {
            return response.json();
        }
    }).then(function (json) {
        document.getElementById("titulo").innerHTML = "Intercambios finalizados";
        document.getElementById("wrapperTitulos").innerHTML = 
        `<h3 class="compraInfoColumF">Usuario</h3>
        <h3 class="compraInfoColumF">Libro a recibido</h3>
        <h3 class="compraInfoColumF">Tu libro</h3>
        <h3 class="compraInfoColumF">Ubicación</h3>`;
        if(json.encontrado){
            document.getElementById("wrapperContenido").innerHTML = "";
            console.log(json);
            calculos(json);
        } else {
            document.getElementById("wrapperContenido").innerHTML = 
            `<h3 class="compraInfoNada">No hay intercambios finalizados</h3>`;
        }
    }).catch(function (error) {
        console.log(error);
        error("Error", "Favor intentar luego", true, false);
    });
}

function agregar(datos) {
    var solic = datos.solicitudes[0];
    if(datos.entrante){
        var nuevaEmisor = "";
        if(solic.emisorLibro.length > 17){
            nuevaEmisor = solic.emisorLibro.substring(0, 16) + "...";
        } else {
            nuevaEmisor = solic.emisorLibro;
        }
        var nuevaReceptor = "";
        if(solic.receptorLibro.length > 17){
            nuevaReceptor = solic.receptorLibro.substring(0, 16) + "...";
        } else {
            nuevaReceptor = solic.receptorLibro;
        }
        document.getElementById("wrapperContenido").innerHTML += 
        `<div class="contenedorSolicitud">
            <p class="compraInfoColum"><a href="perfilUsuario/${solic.emisorId}" id="emisorNombre">${solic.emisorNombre}</a></p>
            <p class="compraInfoColum"><a href="perfilLibro/${solic.emisorISBN}" id="emisorISBN">${nuevaEmisor}</a></p>
            <p class="compraInfoColum"><a href="perfilLibro/${solic.receptorISBN}" id="receptorISBN">${nuevaReceptor}</a></p>
            <p class="compraInfoColum"><i class="fas fa-info-circle ubicacion" onclick="mostrarMapa(this.id);" id="${solic.idIntercambio}"></i></p>
            <p class="compraInfoColum"><i class="fas fa-times cross" id="${solic.idIntercambio}" onclick="rechazarOferta(this.id);"></i><i class="fas fa-check check" id="${solic.idIntercambio}" onclick="aceptarOferta(this.id);"></i></p>
        </div>`;
    } else if(datos.saliente){
        var nuevaEmisor = "";
        if(solic.emisorLibro.length > 17){
            nuevaEmisor = solic.emisorLibro.substring(0, 16) + "...";
        } else {
            nuevaEmisor = solic.emisorLibro;
        }
        var nuevaReceptor = "";
        if(solic.receptorLibro.length > 17){
            nuevaReceptor = solic.receptorLibro.substring(0, 16) + "...";
        } else {
            nuevaReceptor = solic.receptorLibro;
        }
        document.getElementById("wrapperContenido").innerHTML += 
        `<div class="contenedorSolicitud">
            <p class="compraInfoColum"><a href="perfilUsuario/${solic.receptorId}" id="emisorNombre">${solic.receptorNombre}</a></p>
            <p class="compraInfoColum"><a href="perfilLibro/${solic.receptorISBN}" id="emisorISBN">${nuevaReceptor}</a></p>
            <p class="compraInfoColum"><a href="perfilLibro/${solic.emisorISBN}" id="receptorISBN">${nuevaEmisor}</a></p>
            <p class="compraInfoColum"><i class="fas fa-info-circle ubicacion" onclick="mostrarMapa(this.id);" id="${solic.idIntercambio}"></i></p>
            <p class="compraInfoColum">Pendiente</p>
        </div>`;
    } else if(datos.activa){
        var nuevaEmisor = "";
        if(solic.emisorLibro.length > 17){
            nuevaEmisor = solic.emisorLibro.substring(0, 16) + "...";
        } else {
            nuevaEmisor = solic.emisorLibro;
        }
        var nuevaReceptor = "";
        if(solic.receptorLibro.length > 17){
            nuevaReceptor = solic.receptorLibro.substring(0, 16) + "...";
        } else {
            nuevaReceptor = solic.receptorLibro;
        }

        if(solic.emisorYo){
            document.getElementById("wrapperContenido").innerHTML += 
            `<div class="contenedorSolicitud">
                <p class="compraInfoColum"><a href="perfilUsuario/${solic.receptorId}" id="emisorNombre">${solic.receptorNombre}</a></p>
                <p class="compraInfoColum"><a href="perfilLibro/${solic.receptorISBN}" id="emisorISBN">${nuevaReceptor}</a></p>
                <p class="compraInfoColum"><a href="perfilLibro/${solic.emisorISBN}" id="receptorISBN">${nuevaEmisor}</a></p>
                <p class="compraInfoColum"><i class="fas fa-info-circle ubicacion" onclick="mostrarMapa(this.id);" id="${solic.idIntercambio}"></i></p>
                <p class="compraInfoColum"><a href="chatI/${solic.idChat}">Chat</a></p>
            </div>`;
        } else {
            document.getElementById("wrapperContenido").innerHTML += 
            `<div class="contenedorSolicitud">
                <p class="compraInfoColum"><a href="perfilUsuario/${solic.emisorId}" id="emisorNombre">${solic.emisorNombre}</a></p>
                <p class="compraInfoColum"><a href="perfilLibro/${solic.emisorISBN}" id="emisorISBN">${nuevaEmisor}</a></p>
                <p class="compraInfoColum"><a href="perfilLibro/${solic.receptorISBN}" id="receptorISBN">${nuevaReceptor}</a></p>
                <p class="compraInfoColum"><i class="fas fa-info-circle ubicacion" onclick="mostrarMapa(this.id);" id="${solic.idIntercambio}"></i></p>
                <p class="compraInfoColum"><a href="chatI/${solic.idChat}">Chat</a></p>
            </div>`;
        }
    } else if(datos.finalizada){
        var nuevaEmisor = "";
        if(solic.emisorLibro.length > 19){
            nuevaEmisor = solic.emisorLibro.substring(0, 18) + "...";
        } else {
            nuevaEmisor = solic.emisorLibro;
        }
        var nuevaReceptor = "";
        if(solic.receptorLibro.length > 19){
            nuevaReceptor = solic.receptorLibro.substring(0, 18) + "...";
        } else {
            nuevaReceptor = solic.receptorLibro;
        }

        if(solic.emisorYo){
            document.getElementById("wrapperContenido").innerHTML += 
            `<div class="contenedorSolicitud">
                <p class="compraInfoColumF"><a href="perfilUsuario/${solic.receptorId}" id="emisorNombre">${solic.receptorNombre}</a></p>
                <p class="compraInfoColumF"><a href="perfilLibro/${solic.receptorISBN}" id="emisorISBN">${nuevaReceptor}</a></p>
                <p class="compraInfoColumF"><a href="perfilLibro/${solic.emisorISBN}" id="receptorISBN">${nuevaEmisor}</a></p>
                <p class="compraInfoColumF"><i class="fas fa-info-circle ubicacion" onclick="mostrarMapa(this.id);" id="${solic.idIntercambio}"></i></p>
            </div>`;
        } else {
            document.getElementById("wrapperContenido").innerHTML += 
            `<div class="contenedorSolicitud">
                <p class="compraInfoColumF"><a href="perfilUsuario/${solic.emisorId}" id="emisorNombre">${solic.emisorNombre}</a></p>
                <p class="compraInfoColumF"><a href="perfilLibro/${solic.emisorISBN}" id="emisorISBN">${nuevaEmisor}</a></p>
                <p class="compraInfoColumF"><a href="perfilLibro/${solic.receptorISBN}" id="receptorISBN">${nuevaReceptor}</a></p>
                <p class="compraInfoColumF"><i class="fas fa-info-circle ubicacion" onclick="mostrarMapa(this.id);" id="${solic.idIntercambio}"></i></p>
            </div>`;
        }
    }
}

let solicitudes = [];
function calculos(datos) {
	//solicitudes = datos.solicitudes;
	let cantidad = datos.solicitudes.length;
	if (cantidad >= 4) {
		for (let i = 0; i < 4; i++) {
			agregar(datos);
			datos.solicitudes.shift();
		}
	} else {
		console.log("aca", cantidad);
		for (let i = 0; i < cantidad; i++) {
			agregar(datos);
			datos.solicitudes.shift();
		}
	}
	if (datos.solicitudes.length >= 1) {
		document.getElementById("mas").classList.remove("ocultar");
	}else{
		document.getElementById("mas").classList.add("ocultar");
	}
}

var map;
var geocoder;
var marker;

function initMap(lat, long) {
	geocoder = new google.maps.Geocoder();
	map = new google.maps.Map(document.getElementById("map"), {
		center: {
			lat: lat,
			lng: long
		},
		zoom: 18,
		mapTypeId: google.maps.MapTypeId.HYBRID
	});
	marker = new google.maps.Marker({
		map: map,
		draggable: false,
		animation: google.maps.Animation.DROP,
		position: {
			lat: lat,
			lng: long
		}
	});
}