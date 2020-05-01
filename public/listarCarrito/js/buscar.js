buscar();

function buscar() {
	fetch("/carrito/carrito").then(function (response) {
		if (response.status != 200) {
			console.log("Ocurrió un error con el servicio: " + response.status);
			error("Error", "Favor intentar luego", true, false);
		} else {
			return response.json();
		}
	}).then(function (json) {
		console.log(json);
		calculos(json);

	}).catch(function (err) {
		console.log("Ocurrió un error con el fetch del usuario.json: ", err);
		error("Error", "Ha ocurrido un error.", true, false);
		event.preventDefault();
		return false;
	});

}

let librosArr = [];
let precioTotal = 0;
var contador = 0;
async function agregar(datos) {
	await fetch("/carrito/libro/" + datos.isbn).then(
		await
		function (response) {
			if (response.status != 200) {
				console.log("Ocurrió un error con el servicio: " + response.status);
				error("Error", "Favor intentar luego", true, false);
			} else {
				return response.json();
			}
		}
	)
		.then(await
		function (json) {
			fetch("/carrito/sucursal/" + datos.sucursal).then(
				function (response) {
					if (response.status != 200) {
						console.log("Ocurrió un error con el servicio: " + response.status);
						error("Error", "Favor intentar luego", true, false);
					} else {
						return response.json();
					}
				}
			)
				.then(function (json2) {
					fetch(`/carrito/sucursal/${datos.sucursal}/${datos.isbn}/`).then(
						function (response) {
							if (response.status != 200) {
								console.log("Ocurrió un error con el servicio: " + response.status);
								error("Error", "Favor intentar luego", true, false);
							} else {
								return response.json();
							}
						}
					)
						.then(function (json3) {
							//Luego agregar impuesto de app y y y si quiere que se le envie o no.
							var envioSiONo = "";
							if (datos.envio && datos.envio > 0) {
								envioSiONo = "activoEnvio";
								precioTotal += datos.envio;
							}
							console.log("wow", json3);
							document.getElementById("lista").innerHTML += `<tr>
							<td><span class="nombreLibro">${json.nombre}</span></td>
							<td><input class="inputCant" type="number" min="1" step="1" max="${json3.cantidad}" value="${datos.cantidad}" onchange="editar(${datos.isbn}, this.value)" /></td> 
							<td class="numTd">${json3.precio.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
							<td class="sucursalNombre">${json2.nombre}</td>
							<td><i class="iconof fas fa-shipping-fast ${envioSiONo}" onclick='enviar(${datos.isbn});'></i></td>
							<td><i class="iconof fas fa-trash" onclick='eliminar(${datos.isbn});'></i></td>
							</tr>`;

							precioTotal += json3.precio * datos.cantidad;

							if (contador != librosArr.length) {
								next();
							} else {
								fetch("/impuesto/get").then(function (response) {
									if (response.status != 200) {
										console.log("Ocurrió un error con el servicio: " + response.status);
										error("Error", "Favor intentar luego", true, false);
									} else {
										return response.json();
									}
								}).then(function (impuesto) {
									precioTotal *= (impuesto.impuesto / 100) + 1;
									document.getElementById("lista").innerHTML += `
								<tr>
									<td><strong>Total a pagar (I.V.A):</strong></td> 
									<td></td>
									<td class="numTd"><strong>${Number(precioTotal).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</strong></td>
									<td></td>
									<td></td>
  								</tr>`;

								}).catch(function (err) {
									console.log("Ocurrió un error con el fetch del usuario.json: ", err);
									error("Error", "Ha ocurrido un error.", true, false);
									event.preventDefault();
									return false;
								});
							}

						}).catch(function (error) {
							console.log(error);
							error("Error", "Favor intentar luego", true, false);
						});
				}).catch(function (error) {
					console.log(error);
					error("Error", "Favor intentar luego", true, false);
				});

		}).catch(function (error) {
			console.log(error);
			error("Error", "Favor intentar luego", true, false);
		});


}

async function calculos(datos) {
	if (datos.libros.length > 0) {
		document.getElementById("lista").innerHTML = `
	<tr>
				  <th>Libro</th>
				  <th>Cantidad</th>
				  <th>Precio unitario</th>
				  <th class="sucursalNombre">Sucursal</th> 
				  <th>Envío</th> 
	  </tr>`;
		precioTotal = 0;
		librosArr = datos.libros;
		contador = 0;
		console.log(datos.libros);
		await next();
	} else {
		error("Carrito sin libros", "Tu carrito está vacío", true, false);
	}
}

function next() {
	agregar(librosArr[contador]);
	contador++;
}


function eliminar(isbn) {
	fetch("/carrito/eliminar/" + isbn).then(
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
			buscar();

		}).catch(function (error) {
			console.log(error);
			error("Error", "Favor intentar luego", true, false);
		});
}

function editar(isbn, cantidad) {

	fetch("/carrito/editar/" + isbn, {
		method: "POST",
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			cantidad: Number(cantidad)
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
			buscar();

		}).catch(function (error) {
			console.log(error);
			error("Error", "Favor intentar luego", true, false);
		});
}

function enviar(isbn) {

	fetch("/carrito/envio/" + isbn, {
		method: "POST",
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify({})
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
			buscar();

		}).catch(function (error) {
			console.log(error);
			error("Error", "Favor intentar luego", true, false);
		});
}














function cancelarCompra() {
	error("Cancelar compra", "¿Seugro que quiere cancelar la compra?", true, true);
}

function eliminarCarrito() {
	fetch("/carrito/eliminarCompleto/").then(
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
			buscar();
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
}

function aceptarCompra() {
	error("Escoge un método de pago", `<select id="listaTarjetas" title="Tarjeta" name="tarjeta" class="inputLogin select" required oninvalid="errorInput(this);" >
	<option value="" selected disabled>Escoge una tarjeta</option>
</select>`, true, true);
	fetch("/listarMetodoDePago/me").then(function (response) {
		if (response.status != 200) {
			console.log("Ocurrió un error con el servicio: " + response.status);
			error("Error", "Favor intentar luego", true, false);
		} else {
			return response.json();
		}
	}).then(function (json) {
		console.log(json);
		document.getElementById("listaTarjetas").innerHTML = "<option value=\"\" selected disabled>Escoge una tarjeta</option>";
		if (json) {
			let arr = json;
			arr.forEach(item => {
				let nuevo = document.createElement("option");
				nuevo.innerHTML = `${item.n_tarjeta} ${devolverFecha(item.vencimiento)} ${item.tipo}`;
				nuevo.value = item.id;
				document.getElementById("listaTarjetas").appendChild(nuevo);
			});
		} else {
			let nuevaOpcion = document.createElement("option");
			nuevaOpcion.setAttribute("value", "");
			nuevaOpcion.setAttribute("disabled", true);
			nuevaOpcion.appendChild(document.createTextNode("No hay tarjetas registradas"));
			document.getElementById("listaTarjetas").appendChild(nuevaOpcion);
		}

	}).catch(function (err) {
		console.log("Ocurrió un error con el fetch del usuario.json: ", err);
		error("Error", "Ha ocurrido un error.", true, false);
		event.preventDefault();
		return false;
	});
}

function devolverFecha(fecha) {
	let f = new Date(fecha);
	return f.getMonth() + "/" + f.getFullYear();
}

function acceptoFinalizarPago(){
	if(document.getElementById("listaTarjetas").value != ""){
		fetch("/carrito/comprar/", {
			method: "POST",
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				tarjeta: document.getElementById("listaTarjetas").value
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
			}).catch(function (error) {
				console.log(error);
				error("Error", "Favor intentar luego", true, false);
			});
	} else {
		error("Error", "Favor escoger una tarjeta", true, false);
	}
}