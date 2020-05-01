buscar();
function buscar() {
	fetch("/promociones/getPromos").then(function (response) {
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
		if (json.encontrado) {
			document.getElementById("lista").innerHTML = "";
			calcular(json.datos);
		} else {
			document.getElementById("lista").innerHTML = "No se han encontrado resultados";
		}


	});
}
async function llenar(datos) {
	document.getElementById("lista").innerHTML = "";
	datos.forEach((dato) => {
		dato.promo.forEach((item) => {
			console.log(item.idPromo);
			let nuevo = document.createElement("li");
			getName(item).then(devuelta =>
				nuevo.innerHTML = `<li><span id="${item.id}" class="nombreSpan">${devuelta.nombre} (${dato.sucursal})</span><button name="${devuelta.id}" type="button" class="btnAzul btnPequenno" onclick="redirect(this)">Editar</button>
				<button name="${devuelta.id}" type="button" class="btnRojo btnPequenno" onclick="eliminarPromo(this);">Eliminar</button>
				</li>`).catch(err => console.log(err));

			document.getElementById("lista").appendChild(nuevo);
		});
	});
	let nuevo = document.createElement("li");
	if (datosArr.length > 3) nuevo.innerHTML = "<li><span id='arrowAtras' onclick='pagAtras();' class='arrow'>«</span><span id='arrowAdelante' onclick='pagAdelante();' class='arrow'>»</span></li>";
	document.getElementById("lista").appendChild(nuevo);
}

function redirect(id) {
	document.location.href += "/editar/" + id.name;
}

function eliminarPromo(id) {
	fetch("/promociones/eliminar/" + id.name).then(function (response) {
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
		buscar();

	});
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






function getName(dato) {
	return new Promise((resolve, reject) => {
		fetch("/libro/" + dato.isbn).then(
			function (response) {
				if (response.status != 200) {
					console.log("Ocurrió un error con el servicio: " + response.status);
					error("Error", "Favor intentar luego", true, false);
					reject("Favor intentar luego");
				} else {
					return response.json();
				}
			}
		)
			.then(function (json) {
				console.log(json);
				resolve({
					nombre: json.nombre,
					id: dato.idPromo
				});
			}).catch(function (error) {
				console.log(error);
				error("Error", "Favor intentar luego", true, false);
				reject("Favor intentar luego");
			});
	});
}