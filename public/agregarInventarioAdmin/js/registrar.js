function send(event) {
	const isbn = document.getElementById("isbn"),
		cantidad = document.getElementsByName("cantidad")[0],
		precio = document.getElementsByName("precio")[0],
		sucursal = document.getElementById("sucursal");

	if (isbn.value != "" && cantidad.value != "" && cantidad.value > 0 && !isNaN(cantidad.value) && sucursal.value != "" && precio.value > 0 && !isNaN(precio.value) && precio.value != "") {
		var json = JSON.stringify({
			isbn: isbn.value,
			cantidad: cantidad.value,
			sucursal: sucursal.value,
			precio: precio.value
		});

		console.log(json);



		fetch("/agregarInventarioAdmin", {
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


fetch("/registrarPromocionAdmin/librerias")
	.then(function (response) {
		//console.log(response.url);
		if (response.status != 200)
			console.log("Ocurrió un error con el servicio: " + response.status);
		else return response.json();
	}).then(function (jsonLibrerias) {
		if (jsonLibrerias && jsonLibrerias.length > 0) {
			console.log(jsonLibrerias);
			for (var i = 0; i < jsonLibrerias.length; i++) {
				sucursalesDeLibreria(jsonLibrerias[i].nombreFantasia, jsonLibrerias[i].libreriaId, (arr, nombre) => {
					document.getElementById("sucursal").innerHTML += `<option disabled>${nombre}</option>`;
					arr.forEach((item)=>{
						document.getElementById("sucursal").innerHTML += `<option value="${item.id}">${item.nombre}</option>`;
					});
				});
			}
		} else {
			document.getElementById("sucursal").innerHTML = "<option value=\"\" selected disabled>No existen sucursales.</option>";
		}
	})
	.catch(function (err) {
		console.log("Ocurrió un error con el fetch", err);
	});


function sucursalesDeLibreria(nombre, libreriaId, callback){
	fetch("/registrarPromocionAdmin/sucursales/"+libreriaId)
		.then(function (response) {
		//console.log(response.url);
			if (response.status != 200)
				console.log("Ocurrió un error con el servicio: " + response.status);
			else return response.json();
		}).then(function (jsonSucursales) {
			if (jsonSucursales && jsonSucursales.length > 0) {
				callback(jsonSucursales, nombre);
			} else {
				callback([], "");
			}
		})
		.catch(function (err) {
			console.log("Ocurrió un error con el fetch", err);
		});
}

function libros(value) {
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
}