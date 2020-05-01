function errorInput(that) {
	error("Error", "Favor llenar los campos.", true, false);
	that.classList.add("inputError");
}

function send(event) {
	const nombre = document.getElementsByName("nombre")[0],
		apellido = document.getElementsByName("apellido")[0],
		apellido2 = document.getElementsByName("apellido2")[0],
		sexo = document.getElementsByName("sexo")[0],
		provincia = document.getElementById("provincias"),
		canton = document.getElementById("cantones"),
		distrito = document.getElementById("distritos"),
		coordenadas = document.getElementById("coordenadas"),
		tid = document.getElementsByName("tid")[0],
		id = document.getElementsByName("id")[0],
		email = document.getElementsByName("email")[0],
		tel = document.getElementsByName("tel")[0];

	nombre.classList.remove("inputError");
	apellido.classList.remove("inputError");
	apellido2.classList.remove("inputError");
	sexo.classList.remove("inputError");
	id.classList.remove("inputError");
	email.classList.remove("inputError");
	tel.classList.remove("inputError");
	coordenadas.classList.remove("inputError");


	if (nombre.value != "" && apellido.value != "" && apellido2.value != "" && sexo.value != "" &&
		tid.value != "" && id.value != "" && email.value != "" &&
		tel.value != "" && provincia.value != "" && canton.value != "" && distrito.value != "" && coordenadas.value != "" &&
		coordenadas.value.split(", ")[0] && coordenadas.value.split(", ")[1]) {


		var json = JSON.stringify({
			nombre: nombre.value,
			apellido: apellido.value,
			apellido2: apellido2.value,
			sexo: sexo.value,
			direccion: {
				provincia: provincia.options[provincia.selectedIndex].innerText,
				canton: canton.options[canton.selectedIndex].innerText,
				distrito: distrito.options[distrito.selectedIndex].innerText,
				coordenadas: {
					lat: coordenadas.value.split(", ")[0],
					long: coordenadas.value.split(", ")[1]
				}
			},
			tid: tid.value,
			id: id.value,
			email: email.value,
			tel: tel.value
		});

		console.log(json);
		fetch("/registrarAdmin", {
			method: "POST",
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json",
			},
			body: json
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


			});


	} else {
		error("Error", "Favor llenar los campos", true, false);
		event.preventDefault();
		return false;
	}
	event.preventDefault();
	return false;
}