send({preventDefault: function(){}});

function send(event) {
	const nombre = document.getElementsByName("nombre")[0];


	var json = JSON.stringify({
		nombre: nombre.value
	});

	fetch("/buscarGenero", {
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
		var estado = "";
		if(dato.desactivado){
			estado = `<button name="${dato.id}" type="button" class="btnInactivo btnPequenno" onclick="modificarEstado(this);">Añadir</button>`;
		} else {
			estado = `<button name="${dato.id}" type="button" class="btnActivo btnPequenno" onclick="modificarEstado(this);">Eliminar</button>`;
		}
		let nuevo = document.createElement("li");
		nuevo.innerHTML = `<li><span id="g${dato.id}" class="nombreSpan">${dato.nombre}</span>
		<button name="${dato.id}" type="button" class="btnAzul btnPequenno" onclick="editarGenero(this);">Editar</button>
		${estado}
	</li>`;//name="dato.id" a los botones
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



function send2(event) {
	const nombre = document.getElementsByName("agregar")[0];
	var json = JSON.stringify({
		nombre: nombre.value
	});
	if (nombre.value != "") {
		fetch("/buscarGenero/agregar", {
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
				llenar(json.datos);
			} else {
				document.getElementById("lista").innerHTML = "No se han encontrado resultados";
			}
		});
	} else {
		error("Error", "Favor llenar los campos.", true, false);
		event.preventDefault();
		return false;
	}
	event.preventDefault();
	return false;
}

function modificarEstado(genero) {
	var json = JSON.stringify({
		id: genero.name
	});
	if(genero.name != ""){
		fetch("/buscarGenero/modificar", {
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
				llenar(json.datos);
			} else {
				document.getElementById("lista").innerHTML = "No se han encontrado resultados";
			}
		});
	} else {
		error("Error", "No se puede modificar un género vacio", true, false);
		event.preventDefault();
		return false;
	}
	event.preventDefault();
	return false;
}

function editarGenero(generoBoton) {
	if(document.getElementsByName("nombreGenero").length > 0){
		var idBOTON = document.getElementsByName("nombreGenero")[0].parentNode.id.split("g")[1];
		document.getElementsByName(idBOTON)[0].classList.remove("btnInactivo");
		document.getElementsByName(idBOTON)[0].classList.add("btnAzul");
		document.getElementsByName(idBOTON)[0].innerHTML = "Editar";
		document.getElementsByName(idBOTON)[0].setAttribute( "onClick", "editarGenero(this);");
		document.getElementsByName("nombreGenero")[0].parentNode.innerHTML = document.getElementsByName("nombreGenero")[0].value;

		var gene = document.getElementById("g"+generoBoton.name);
		gene.innerHTML = `<input name="nombreGenero" type="text" class="inputEditar" value="${gene.innerHTML}">`;
		generoBoton.classList.remove("btnAzul");
		generoBoton.classList.add("btnInactivo");
		generoBoton.innerHTML = "Guardar";
		generoBoton.setAttribute( "onClick", "guardarCambio(this);");
	} else {
		var gene = document.getElementById("g"+generoBoton.name);
		gene.innerHTML = `<input name="nombreGenero" type="text" class="inputEditar" value="${gene.innerHTML}">`;
		generoBoton.classList.remove("btnAzul");
		generoBoton.classList.add("btnInactivo");
		generoBoton.innerHTML = "Guardar";
		generoBoton.setAttribute( "onClick", "guardarCambio(this);");
	}
}

function guardarCambio(generoBoton) {
	var genero = document.getElementsByName("nombreGenero")[0];
	console.log(generoBoton.name);
	console.log(genero.value);
	if(generoBoton.name != "") {
		if(genero.value != "") {
			var json = JSON.stringify({
				id: Number(generoBoton.name),
				nombre: genero.value
			});
			console.log(json);
			fetch("/buscarGenero/editar", {
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
			});
		} else {
			error("Error", "El nombre de este género no puede estar vacio", true, false);
			event.preventDefault();
			return false;
		}
	} else {
		error("Error", "No se puede modificar un género vacio", true, false);
		event.preventDefault();
		return false;
	}
	event.preventDefault();
	return false;
}