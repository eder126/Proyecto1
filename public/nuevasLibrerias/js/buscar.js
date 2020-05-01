send({
	preventDefault: function () {}
});

function send(event) {
	const nombre = document.getElementsByName("nombre")[0];


	var json = JSON.stringify({
		nombre: nombre.value
	});

	fetch("/nuevasLibrerias", {
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
			error(titulo, mensaje, btnAceptar, btnCancelar);
		}
		if (json.datos) {
			document.getElementById("lista").innerHTML = "";
			calcular(json.datos);
		} else {
			document.getElementById("lista").innerHTML = "No se han encontrado resultados";
		}
	});
	event.preventDefault();
	return false;
}

function llenar(datos) {
	document.getElementById("lista").innerHTML = "";
	datos.forEach((dato) => {
		let nuevo = document.createElement("li");
		nuevo.innerHTML = `<li><span id="${dato.libreriaId}" class="nombreSpan">${dato.nombreComercial}</span>
		<button name="${dato.libreriaId}" type="button" class="btnAzul btnPequenno" onclick="ver(this);">Ver Información</button>
		<button name="${dato.libreriaId}" type="button" class="btnVerde btnPequenno" onclick="aceptarS(this);">Aceptar</button>
		<button name="${dato.libreriaId}" type="button" class="btnActivo btnPequenno" onclick="rechazar(this);">Rechazar</button>
	</li>`; //name="dato.id" a los botones
		document.getElementById("lista").appendChild(nuevo);
	});
	let nuevo = document.createElement("li");
	if (datosArr.length > 3) nuevo.innerHTML = "<li><span id='arrowAtras' onclick='pagAtras();' class='arrow'>«</span><span id='arrowAdelante' onclick='pagAdelante();' class='arrow'>»</span></li>";
	document.getElementById("lista").appendChild(nuevo);
}

let datosArr = [];
let pos = undefined,
	increment = undefined;

function calcular(datos) {
	datosArr = datos;
	pos = 0;
	increment = datosArr.length / 3;
	if (datosArr.length > 3) {
		llenar(datosArr.slice(pos, pos + increment));
		pos += increment;
		document.getElementById("arrowAtras").classList.add("ocultar");
		console.log(datosArr);
	} else {
		llenar(datosArr);
	}
}

function pagAtras() {
	console.log("hola");
	console.log(pos, increment, (pos - increment * 2), (pos - increment) > 0);
	console.log(datosArr.slice((pos - increment * 2), pos));
	if ((pos - increment) >= 0) {
		console.log(pos, increment);
		llenar(datosArr.slice(pos - increment * 2, pos - increment));
		pos -= increment;
	}
	if ((pos - increment) - 1 < 0) {
		document.getElementById("arrowAtras").classList.add("ocultar");
	} else {
		document.getElementById("arrowAtras").classList.remove("ocultar");
	}
}

function pagAdelante() {
	console.log(datosArr.slice(pos, pos + increment));
	if (pos + 1 <= datosArr.length - 1) {
		llenar(datosArr.slice(pos, pos + increment));
		pos += increment;
	}
	if (pos + 1 > datosArr.length - 1) {
		document.getElementById("arrowAdelante").classList.add("ocultar");
	} else {
		document.getElementById("arrowAdelante").classList.remove("ocultar");
	}
}


function aceptarS(id) {
	fetch(document.location.href + "/aceptar/" + id.name).then(function (response) {
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
		send({
			preventDefault: function () {}
		});
	});
}

function rechazar(id) {
	fetch(document.location.href + "/rechazar/" + id.name).then(function (response) {
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
		send({
			preventDefault: function () {}
		});
	});
}

function ver(id) {
	fetch(document.location.href + "/id/" + id.name).then(function (response) {
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
		error(`Librería ${json.datos.nombreFantasia}`, `<div class="detallesModal">
	<span class="detallesTitulo">Nombre Comercial</span>
	<span class="detallesDesc">- ${json.datos.nombreComercial}</span>
	<br>
	<span class="detallesTitulo">Teléfono</span>
	<span class="detallesDesc">- ${json.datos.tel}</span>
	<br>
	<span class="detallesTitulo">Dirección</span>
	<span class="detallesDesc">- ${json.datos.direccion.provincia}, ${json.datos.direccion.distrito}, ${json.datos.direccion.canton}</span>
	<br>
	<span class="detallesTitulo">Solicitud enviada</span>
	<span class="detallesDesc">- ${foramtoFecha(new Date(json.datos.creado))} </span>
	<br>
	<hr class="hrDeSector">
	<span class="detallesTitulo">Nombre Administrador Librería</span>
	<span class="detallesDesc">- ${json.datos.nombre}</span>
	<br>
	<span class="detallesTitulo">Apellidos Administrador Librería</span>
	<span class="detallesDesc">- ${json.datos.apellido} ${json.datos.apellido2} </span>
	<br>
	<span class="detallesTitulo">Email Administrador Librería</span>
	<span class="detallesDesc">- ${json.datos.email} </span>
	<br>
  </div>`, false, true);
	});
}

function foramtoFecha(date) {
	var meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  
	var dia = date.getDate();
	var mesIndex = date.getMonth();
	var anno = date.getFullYear();
  
	return dia + " " + meses[mesIndex] + " " + anno;
}