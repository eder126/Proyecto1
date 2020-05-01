function send(event) {
	const tipoDesc = document.getElementsByName("tipoDesc")[0],
		montoDesc = document.getElementsByName("montoDesc")[0],
		fechaFin = document.getElementsByName("fechaFin")[0];

	var json = JSON.stringify({
		tipoDesc: tipoDesc.value,
		montoDesc: montoDesc.value,
		fechaFin: fechaFin.value
	});

	tipoDesc.classList.remove("inputError");
	montoDesc.classList.remove("inputError");
	fechaFin.classList.remove("inputError");

	if (tipoDesc.value != "" && montoDesc.value != "" && fechaFin.value != "") {
		var resultado;
		if (tipoDesc.value == "0") {
			if (montoDesc.value > 0 && montoDesc.value <= 100) {
				
				if (new Date() <= new Date(fechaFin.value)) {
					fetch(document.location.href, {
						method: "POST",
						headers: {
							"Accept": "application/json",
							"Content-Type": "application/json"
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
					}).catch(function (err) {
						console.log("Ocurrió un error con el fetch del usuario.json: ", err);
						error("Error", "Ha ocurrido un error.", true, false);
						event.preventDefault();
						return false;
					});
				} else {
					fechaFin.classList.remove("inputError");
					error("Error", "La fecha debe ser posterior a la fecha actual", true, false);
					event.preventDefault();
					return false;
				}
							
			} else {
				montoDesc.classList.remove("inputError");
				error("Error", "El porcentaje de descuento debe ser entre el 0% y el 100%", true, false);
				event.preventDefault();
				return false;
			}
		} else if (tipoDesc.value == "1") {
			if (montoDesc.value > 0) {
				if (new Date() <= new Date(fechaFin.value)) {
					fetch(document.location.href, {
						method: "POST",
						headers: {
							"Accept": "application/json",
							"Content-Type": "application/json"
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
					}).catch(function (err) {
						console.log("Ocurrió un error con el fetch del usuario.json: ", err);
						error("Error", "Ocurrio un error.", true, false);
						event.preventDefault();
						return false;
					});
				} else {
					fechaFin.classList.remove("inputError");
					error("Error", "La fecha debe ser posterior a la fecha actual", true, false);
					event.preventDefault();
					return false;
				}
							
			} else {
				montoDesc.classList.remove("inputError");
				error("Error", "El monto de descuento debe ser mayor a 0", true, false);
				event.preventDefault();
				return false;
			}
		}
	} else {
		error("Error", "Favor llenar los campos", true, false);
		event.preventDefault();
		return false;
	}
	event.preventDefault();
	return false;
}




fetch(document.location.href + "/info")
	.then(function (response) {
		//console.log(response.url);
		if (response.status != 200)
			console.log("Ocurrió un error con el servicio: " + response.status);
		else return response.json();
	}).then(function (jsonPromo) {
		
		const tipoDesc = document.getElementsByName("tipoDesc")[0],
			montoDesc = document.getElementsByName("montoDesc")[0],
			fechaFin = document.getElementsByName("fechaFin")[0],
			isbn = document.getElementById("isbn");

		tipoDesc.value = jsonPromo.tipoDesc?1:0;
		montoDesc.value = jsonPromo.rebaja;
		fechaFin.valueAsDate = new Date(jsonPromo.fechaFin);
		isbn.value = jsonPromo.isbn;

		
	}).catch(function (err) {
		console.log("Ocurrió un error con el fetch", err);
		error("Error", "Ha ocurrido un error.", true, false);
	});