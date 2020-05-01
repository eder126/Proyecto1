buscar();
function buscar() {
	const query = document.getElementById("buscarAdmin");
	fetch("/buscarAdministrador", {
		method: "POST",
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			tipo: "usuarioAdministrador",
			query: query.value
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
				llenar(json.datos);
			} else {
				document.getElementById("lista").innerHTML = "No se han encontrado resultados";
			}

		}).catch(function (error) {
			console.log(error);
			error("Error", "Favor intentar luego", true, false);
		});

}

function llenar(datos) {
	datos.forEach((dato) => {
		let nuevo = document.createElement("li");
		nuevo.innerHTML = `<li><a class="nombreSpan" href="http://localhost:8080/perfilUsuario/${dato.usuarioId}">${dato.nombre} ${dato.apellido}</a>
		<a href=""><button type="button" onclick="eliminar('${dato.usuarioId}');" class="btnRojo btnPequenno">Eliminar</button></a>
	</li>`;
		document.getElementById("lista").appendChild(nuevo);
	});
}



function eliminar(id) {

	fetch("/buscarAdministrador/eliminar/" + id).then(
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
			if (json.alerta) {
				const {
					titulo,
					mensaje,
					btnAceptar,
					btnCancelar
				} = json.alerta;
				error(titulo, mensaje, btnAceptar, btnCancelar);
			}
			if (json.eliminado) {
				buscar();
			}


		});


	event.preventDefault();
	return false;
}