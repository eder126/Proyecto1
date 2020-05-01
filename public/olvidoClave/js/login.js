function send(event) {
	const email = document.getElementById("email");


	if (email.value != "") {
		fetch("/olvidoClave", {
			method: "POST",
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email: email.value
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


			}).catch(function (error) {
				console.log(error);
				error("Error", "Favor intentar luego", true, false);
			});


		event.preventDefault();
	} else {
		error("Error", "Favor llenar los campos", true, false);
		event.preventDefault();
		return false;
	}
}