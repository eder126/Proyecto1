function send(event) {
	const cantidad = document.getElementsByName("cantidad")[0],
		precio = document.getElementsByName("precio")[0];

	if (cantidad.value != "" && cantidad.value > 0 && !isNaN(cantidad.value) && precio.value > 0 && !isNaN(precio.value) && precio.value != "") {
		var json = JSON.stringify({
			cantidad: cantidad.value,
			precio: precio.value
		});

		console.log(json);



		fetch(document.location.href, {
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
let arrHref = document.location.href.split("/");
fetch("/libros/")
	.then(function (response) {
		//console.log(response.url);
		if (response.status != 200)
			console.log("Ocurrió un error con el servicio: " + response.status);
		else return response.json();
	}).then(function (jsonLibros) {
		if (jsonLibros && jsonLibros.length > 0) {
			for (var i = 0; i < jsonLibros.length; i++) {
				if(jsonLibros[i].ISBN == arrHref[arrHref.length-1]){
					document.getElementById("isbn").innerHTML = `<option value=\"\" selected disabled>${jsonLibros[i].nombre}</option>`;
					fetch("/buscarInventario/"+arrHref[arrHref.length-3], {
						method: "POST",
						headers: {
							"Accept": "application/json",
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							query: jsonLibros[i].nombre
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
								console.log(json.datos.libros[0]);
								document.getElementsByName("cantidad")[0].value = json.datos.libros[0].cantidad;
								document.getElementsByName("precio")[0].value = json.datos.libros[0].precio;
							}
					
						}).catch(function (error) {
							console.log(error);
							error("Error", "Favor intentar luego", true, false);
						});
					
				} 
			}
		} else {
			document.getElementById("isbn").innerHTML = "<option value=\"\" selected disabled>No se encontro este libro dentro del inventario de esta sucursal.</option>";
		}
	})
	.catch(function (err) {
		console.log("Ocurrió un error con el fetch", err);
	});

