function buscar() {
	const tipo = document.getElementById("tipo"),
		queryExtra = document.getElementById("queryExtra"),
		sort = document.getElementById("sort"),
		query = document.getElementById("query");
	if (tipo.value != "") {

		fetch("/buscarBitacora", {
			method: "POST",
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				tipo: tipo.value,
				query: query.value,
				queryExtra: queryExtra.value,
				sort: sort.value
			})
		}).then(
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
				document.getElementById("resultadosTabla").innerHTML = `<tr>
				<th>Movimiento</th>
				<th>Hora</th>
				<th>Comentario</th>
				<th></th>
			</tr>`;
				console.log(json);
				document.getElementById("resultadosDiv").classList.add("ocultar");
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
					document.getElementById("resultadosDiv").classList.remove("ocultar");
					calculos(json.datos);
				} else if (!json.alerta && !json.datos) {
					error("Error", "No se ha encontrado ningún resultado.", true, false);
				}

			}).catch(function (error) {
				console.log(error);
				error("Error", "Favor intentar luego", true, false);
			});



	} else {
		error("Error", "Favor llenar los campos", true, false);
		event.preventDefault();
		return false;
	}
}

var logsArr = [];

function agregar(datos, i) {

	let resultadosTabla = document.getElementById("resultadosTabla");
	resultadosTabla.innerHTML = resultadosTabla.innerHTML + `
				<tr>
					<td>${datos.movimiento}</td>
					<td>${new Date(datos.hora).toLocaleDateString("es-CR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</td>
					<td>${datos.comentario}</td>
					<td><span class="verMas" onclick="modal(${i})">Ver más</span></td>
				</tr>
				`;

}

function calculos(datos) {
	logsArr = datos;
	let cantidad = logsArr.length;
	for (let i = 0; i < cantidad; i++) {
		agregar(logsArr[i], i);
	}
}

function modal(i) {
	error(`Info del movimiento #${i+1}`, `<div class="detallesModal">
	<span class="detallesTitulo">Movimiento</span>
	<span class="detallesDesc">- ${logsArr[i]["movimiento"]}</span>
	<br>
	<span class="detallesTitulo">Hora</span>
	<span class="detallesDesc">- ${logsArr[i]["hora"]}</span>
	<br>
	<span class="detallesTitulo">Comentario</span>
	<span class="detallesDesc">- ${logsArr[i]["comentario"]}</span>
	<br>
	<hr class="hrDeSector">
	${Object.keys(logsArr[i].registrado).map((item) => `
	${devolverDatos(item, logsArr[i].registrado[item], i, "registrado")}
  `).join("")}

	<hr class="hrDeSector">
	${Object.keys(logsArr[i].usuario).map((item) => `
	${devolverDatos(item, logsArr[i].usuario[item], i, "usuario")}
  `).join("")}
  </div>`, true, false);
}


function devolverDatos(nombre, item, i, tipo) {
	let string = "";
	if (typeof item == typeof new Object()) {
		Object.keys(item).map((actual) => {
			console.log(typeof logsArr[i][tipo][nombre][actual], logsArr[i][tipo][nombre][actual]);
			if (typeof logsArr[i][tipo][nombre][actual] != typeof new Object()) {
				string += `<span class="detallesTitulo">Dato registrado: (${nombre})(${actual})</span>
		<span class="detallesDesc">- ${item[actual]} </span>
		<br>`;
			} else {
				string += devolverDatosExtra(actual, nombre, logsArr[i][tipo][nombre][actual], i, tipo);
			}
		});
	} else {
		string += `
		<span class="detallesTitulo">Dato registrado: (${nombre})</span>
		<span class="detallesDesc">- ${logsArr[i][tipo][nombre]} </span>
		<br>`;
	}
	return string;
}

function devolverDatosExtra(nombre, obj, item, i, tipo) {
	let string = "";
	if (typeof item == typeof new Object()) {
		Object.keys(item).map((actual) => {
			console.log(typeof logsArr[i][tipo][obj][nombre][actual], logsArr[i][tipo][obj][nombre][actual]);
			string += `<span class="detallesTitulo">Dato registrado: (${nombre})(${actual})</span>
		<span class="detallesDesc">- ${item[actual]} </span>
		<br>`;
		});
	} else {
		string += `
		<span class="detallesTitulo">Dato registrado: (${nombre})</span>
		<span class="detallesDesc">- ${logsArr[i][tipo][obj][nombre]} </span>
		<br>`;
	}
	return string;
}