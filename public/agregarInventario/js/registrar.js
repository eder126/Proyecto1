fetch("/agregarInventario/sucursales", {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		}
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


		json.sucursales.forEach((item) => {
			let nuevo = document.createElement("option");
			nuevo.value = item.id;
			nuevo.innerText = item.nombre;
			document.getElementById("selectSucursal").appendChild(nuevo);
		});


	});


function send(event) {
	const isbn = document.getElementsByName("ISBN")[0],
		cantidad = document.getElementsByName("cantidad")[0],
		precio = document.getElementsByName("precio")[0],
		sucursal = document.getElementsByName("sucursal")[0];

	if (isbn.value != "" && cantidad.value != "" && cantidad.value > 0 && !isNaN(cantidad.value) && sucursal.value != "" && precio.value > 0 && !isNaN(precio.value) && precio.value != "") {
		var json = JSON.stringify({
			isbn: isbn.value,
			cantidad: cantidad.value,
			sucursal: sucursal.value,
			precio: precio.value
		});

		console.log(json);



		fetch("/agregarInventario", {
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

fetch("/libros/")
	.then(function (response) {
		//console.log(response.url);
		if (response.status != 200)
			console.log("Ocurrió un error con el servicio: " + response.status);
		else return response.json();
	}).then(function (jsonLibros) {
		document.getElementById("isbn").innerHTML = "<option value=\"\" selected disabled>Libro</option>";
		if (jsonLibros && jsonLibros.length > 0) {
			for (var i = 0; i < jsonLibros.length; i++) {
				var nuevaOpcion = document.createElement("option");
				nuevaOpcion.setAttribute("value", jsonLibros[i].ISBN);
				var texto = document.createTextNode(jsonLibros[i].nombre);
				nuevaOpcion.appendChild(texto);
				document.getElementById("isbn").appendChild(nuevaOpcion);
			}
		} else {
			document.getElementById("isbn").innerHTML = "<option value=\"\" selected disabled>Esta sucursal no tiene libros.</option>";
		}
	})
	.catch(function (err) {
		console.log("Ocurrió un error con el fetch", err);
	});