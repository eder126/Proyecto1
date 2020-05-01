function send(event) {
	const isbn = document.getElementsByName("isbn")[0],
		tipoDesc = document.getElementsByName("tipoDesc")[0],
		montoDesc = document.getElementsByName("montoDesc")[0],
		fechaFin = document.getElementsByName("fechaFin")[0],
		sucursal = document.getElementsByName("sucursal")[0];

	var json = JSON.stringify({
		isbn: isbn.value,
		tipoDesc: tipoDesc.value,
		montoDesc: montoDesc.value,
		fechaFin: fechaFin.value,
		sucursal: sucursal.value
	});

	isbn.classList.remove("inputError");
	tipoDesc.classList.remove("inputError");
	montoDesc.classList.remove("inputError");
	fechaFin.classList.remove("inputError");
	sucursal.classList.remove("inputError");

	if (isbn.value != "" && tipoDesc.value != "" && montoDesc.value != "" && fechaFin.value != "" && sucursal.value != "") {
		var resultado;
		if (tipoDesc.value == "0") {
			if (montoDesc.value > 0 && montoDesc.value <= 100) {
				BuscarLibro(sucursal.value, isbn.value, function (resultado) {
					if (resultado) {
						BuscarPromocion(sucursal.value, isbn.value, function (promocion) {
							//console.log("Promocion BuscarPromocion: "+promocion);
							if (promocion == [] || promocion.length == 0) {
								//console.log("No existe la promocion");
								if (new Date() <= new Date(fechaFin.value)) {
									fetch("/registrarPromocionAdmin", {
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
								isbn.classList.remove("inputError");
								error("Error", "Ya existe una promoción activa para este libro", true, false);
								event.preventDefault();
								return false;
							}
						});
					} else {
						isbn.classList.remove("inputError");
						error("Error", "El ISBN no esta registrado en esta libreria", true, false);
						event.preventDefault();
						return false;
					}
				});
			} else {
				montoDesc.classList.remove("inputError");
				error("Error", "El porcentaje de descuento debe ser entre el 0% y el 100%", true, false);
				event.preventDefault();
				return false;
			}
		} else if (tipoDesc.value == "1") {
			if (montoDesc.value > 0) {
				BuscarLibro(sucursal.value, isbn.value, function (indexLibro) {
					resultado = indexLibro;
					//console.log("Resultado de BuscarLibro("+sucursal.value+"): "+indexLibro);
					if (resultado >= 0) {
						BuscarPromocion(sucursal.value, isbn.value, function (promocion) {
							//console.log("Promocion BuscarPromocion: "+promocion);
							if (promocion == [] || promocion.length == 0) {
								//console.log("No existe la promocion");
								if (new Date() <= new Date(fechaFin.value)) {
									fetch("/registrarPromocionAdmin", {
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
								isbn.classList.remove("inputError");
								error("Error", "Ya existe una promoción activa para este libro", true, false);
								event.preventDefault();
								return false;
							}
						});
					} else {
						isbn.classList.remove("inputError");
						error("Error", "El ISBN no esta registrado en esta libreria", true, false);
						event.preventDefault();
						return false;
					}
				});
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

function BuscarLibro(Sucursal, ISBN, callback) {
	fetch("./registrarPromocionAdmin/libro/"+Sucursal + "/" + ISBN)
		.then(
			function (response) {
				if (response.status != 200)
					console.log("Ocurrió un error con el servicio: " + response.status);
				else
					return response.json();
			})
		.then(function (jsonSucursal) {
			if(jsonSucursal) {
				callback(true);
			} else {
				callback(false);
			}
		})
		.catch(function (err) {
			console.log("Ocurrió un error con el fetch DE SUCURSAL: ", err);
			error("Error", "Ha ocurrido un error con el fetch de sucursal.", true, false);
		});
}

function BuscarPromocion(Sucursal, ISBN, callback) {
	fetch("./registrarPromocionAdmin/"+ Sucursal + "/" + ISBN + "/promocion")
		.then(
			function (response) {
				if (response.status != 200)
					console.log("Ocurrió un error con el servicio: " + response.status);
				else
					return response.json();
			})
		.then(function (jsonPromo) {
			//console.log(jsonPromo);
			function conseguirPromo() {
				return jsonPromo.filter(
					function (jsonPromo) {
						return new Date(jsonPromo.fechaFin) >= new Date();
					}
				);
			}
			var encontrado = conseguirPromo();
			//console.log(encontrado);
			callback(encontrado);
		})
		.catch(function (err) {
			console.log("Ocurrió un error con el fetch DE SUCURSAL: ", err);
			error("Error", "Ha ocurrido un error con el fetch de sucursal.", true, false);
		});
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
	fetch("/registrarPromocionAdmin/libros/"+value)
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
					nuevaOpcion.setAttribute("value", jsonLibros[i].isbn);
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

function errorInput(that) {
	error("Error", "Favor llenar los campos.", true, false);
	that.classList.add("inputError");
}
