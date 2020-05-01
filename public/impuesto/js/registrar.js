function send(event) {
	const impuesto = document.getElementsByName("impuesto")[0];

	if (impuesto.value != "" && !isNaN(impuesto.value) && dentro(impuesto.value, 0, 100)) {



		var json = JSON.stringify({
			impuestoVentas: impuesto.value
		});

		console.log(json);



		fetch("/impuesto", {
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

function dentro(x, min, max) {
	return x >= min && x <= max;
}


fetch("/impuesto/get").then(
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
		if(json.impuesto != 0){
			document.getElementById("impuesto").placeholder = json.impuesto+"%";
		}


	});
