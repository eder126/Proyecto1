function send(event) {
	const password1 = document.getElementById("password1"),
		password2 = document.getElementById("password2");


	if (password1.value != "" && password2.value != "") {
		if(password1.value != password2.value){
			error("Error", "Los campos de contraseñas deben de ser igual.", true, false);
			event.preventDefault();
			return true;
		}
		if(password1.value.length < 5){
			error("Error", "La contraseña debe de ser mayor a 5 carácteres.", true, false);
			event.preventDefault();
			return true;
		}
		fetch(document.location.href, {
			method: "POST",
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				password1: password1.value,
				password2: password2.value
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