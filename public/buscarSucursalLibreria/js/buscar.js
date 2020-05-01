send({preventDefault: function(){}});

function send(event) {
	const nombre = document.getElementsByName("nombre")[0];


	var json = JSON.stringify({
		query: nombre.value,
		tipo: "sucursal",
		sort: "NASC"
	});

	fetch("/buscarSucursalLibreria", {
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
		nuevo.innerHTML = `<li><span id="${dato.id}" class="nombreSpan">${dato.sucursal}</span>
		<a href="/editarSucursal/${dato.id}"><button name="${dato.id}" type="button" class="btnAzul btnPequenno">Editar</button></a>
		<button onclick="eliminar(${dato.id});" type="button" class="btnActivo btnPequenno">Eliminar</button>
		<a href="/buscarInventario/${dato.id}"><button name="${dato.id}" type="button" class="btnAzul btnColorVerde btnPequenno">Inventario</button></a>
	</li>`;
		document.getElementById("lista").appendChild(nuevo);
	});
	let nuevo = document.createElement("li");
	if(datosArr.length > 3) nuevo.innerHTML = "<li><span id='arrowAtras' onclick='pagAtras();' class='arrow'>«</span><span id='arrowAdelante' onclick='pagAdelante();' class='arrow'>»</span></li>";
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





function eliminar(id) {

	fetch("/buscarSucursalLibreria/eliminar/" + id).then(function (response) {
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
			send({preventDefault: function(){}});
		}

	});
	return false;
}











