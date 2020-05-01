buscar();

function buscar() {

	let fechaInicio = document.getElementById("fechaInicio").value,
		fechaFin = document.getElementById("fechaFin").value;



	var path = "";
	if (document.getElementById("sucursal").value == "todo") {
		path = "libreria/" + fechaInicio + "/" + fechaFin;
	} else {
		path = "sucursal/" + document.getElementById("sucursal").value + "/" + fechaInicio + "/" + fechaFin;
	}

	fetch("/ganancias/" + path).then(function (response) {
		if (response.status != 200) {
			console.log("Ocurrió un error con el servicio: " + response.status);
			error("Error", "Favor intentar luego", true, false);
		} else {
			return response.json();
		}
	}).then(function (json) {
		console.log(json);
		document.getElementById("lista").innerHTML = `<thead>
		<tr>
		  <th>Libro</th>
		  <th>Cantidad</th>
		  <th>Ganancia</th>
		</tr>
	</thead>`;
		if(json[0]){
			if (document.getElementById("sucursal").value == "todo") {
				llenarLibreria(json);
			} else {
				llenarSucursal(json);
			}
		} else {
			document.getElementById("totalGanancias").innerHTML = `₡ ${Number(0).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
			document.getElementById("cantidadVendidos").innerHTML = Number(0);
		}

	}).catch(function (err) {
		console.log("Ocurrió un error con el fetch del usuario.json: ", err);
		error("Error", "Ha ocurrido un error.", true, false);
		return false;
	});

}

var topReal = [],
	gananciaTotal = 0,
	cantidadGlobal = 0;

function llenarLibreria(datos) {
	var libros = [];
	topReal = [];
	gananciaTotal = 0;
	cantidadGlobal = 0;
	console.log(datos);
	datos.forEach(item => {
		console.log(item.ventas);

		item.ventas.forEach(venta => {
			let gananciaDeVenta = Number(venta.pagado).toFixed(2);
			gananciaTotal = Number(Number(gananciaDeVenta) + Number(gananciaTotal)).toFixed(2);
			libros.push(venta.isbn);
		});
	});

	quitarDuplicadosYCombinar(libros);


	console.log(Number(gananciaTotal));
}


function llenarSucursal(datos) {
	var libros = [];
	topReal = [];
	gananciaTotal = 0;
	cantidadGlobal = 0;

	datos.forEach(venta => {
		let gananciaDeVenta = Number(venta.pagado).toFixed(2);
		console.log(gananciaDeVenta);
		gananciaTotal = Number(Number(gananciaDeVenta) + Number(gananciaTotal)).toFixed(2);
		libros.push(venta.isbn);
	});

	quitarDuplicadosYCombinar(libros);


	console.log(Number(gananciaTotal));
}


function quitarDuplicadosYCombinar(libros) {
	console.log(libros);
	libros = [...new Set(libros)];
	console.log(libros);
	libros.forEach(isbn => {
		let fechaInicio = document.getElementById("fechaInicio").value,
			fechaFin = document.getElementById("fechaFin").value;

		var path = "";
		if (document.getElementById("sucursal").value == "todo") {
			path = "libreria/isbn/" + isbn + "/" + fechaInicio + "/" + fechaFin;
		} else {
			path = "sucursal/" + document.getElementById("sucursal").value + "/isbn/" + isbn + "/" + fechaInicio + "/" + fechaFin;
		}
		fetch("/ganancias/" + path).then(
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

				fetch("/libro/" + isbn).then(
					function (response) {
						if (response.status != 200) {
							console.log("Ocurrió un error con el servicio: " + response.status);
							error("Error", "Favor intentar luego", true, false);
						} else {
							return response.json();
						}
					}
				)
					.then(function (libro) {
						console.log(libro);
						let cantidad = 0,
							ganancia = 0;
						json.ventas.forEach(i => {
							ganancia = Number(i.pagado).toFixed(2);
							cantidad += i.cantidad;
							cantidadGlobal += i.cantidad;
						});


						topReal.push({
							isbn: isbn,
							nombre: libro.nombre,
							cantidad: Number(cantidad),
							ganancia: Number(ganancia)
						});


						if (topReal.length == libros.length) {
							topReal.sort((a, b) => {
								if (a.cantidad > b.cantidad) {
									return -1;
								}
								if (a.cantidad < b.cantidad) {
									return 1;
								}
								return 0;
							});
							console.log(topReal);
							calcular(topReal);
						}
					}).catch(function (error) {
						console.log(error);
						error("Error", "Favor intentar luego", true, false);
					});

			}).catch(function (error) {
				console.log(error);
				error("Error", "Favor intentar luego", true, false);
			});
	});
}


function calcular(datos) {
	let num = 5;
	if (datos.length < num) num = datos.length;
	for (let i = 0; i < num; i++) {
		document.getElementById("lista").innerHTML += `<tr>
<td><span class="nombreLibro">${datos[i].nombre}</span></td>
<td class="numTd">${Number(datos[i].cantidad).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td> 
<td class="numTd">${Number(datos[i].ganancia).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
</tr>`;
	}

	document.getElementById("totalGanancias").innerHTML = `₡ ${Number(gananciaTotal).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
	document.getElementById("cantidadVendidos").innerHTML = Number(cantidadGlobal);
}


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
			document.getElementById("sucursal").appendChild(nuevo);
		});


	});