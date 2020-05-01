buscar();

function buscar() {
	const query = document.getElementById("query"),
		sort = document.getElementById("sort"),
		id = document.location.href.split("/")[document.location.href.split("/").length-1];

	fetch("/buscarInventarioS/"+id, {
		method: "POST",
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			query: query.value,
			sort: sort.value
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
			document.getElementById("libros").innerHTML = "";
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
			if (json.datos) {
				calculos(json.datos);
			} else if (!json.alerta && !json.datos) {
				error("Error", "No se ha encontrado ningún usuario.", true, false);
			}

		}).catch(function (error) {
			console.log(error);
			error("Error", "Favor intentar luego", true, false);
		});



	
}

let librosArr = [];
var contador = 0;
let path = document.location.href.split("/");
async function agregar(datos) {
	let libros = document.getElementById("libros");
	await fetch("/libro/" + datos.isbn).then(
		await function (response) {
			if (response.status != 200) {
				console.log("Ocurrió un error con el servicio: " + response.status);
				error("Error", "Favor intentar luego", true, false);
			} else {
				return response.json();
			}
		}
	)
		.then(await function (json) {
			console.log(json);
			libros.innerHTML += `<div class="libro">
					<div class="fotoLibro">
						<img src="${json.img}">
					</div>
					<div class="datosLibro">
						<p class="tituloLibro"><a href="/perfilLibro/${datos.isbn}">${datos.nombre}</a></p>
						<span class="left">₡${datos.precio}</span>
						<span class="right"><a onclick="carritoAdd('/carrito/agregar/${datos.isbn}/${path[path.length-1]}');"><i class="fas fa-cart-plus"></i></a></span>
					</div>
				</div>`;

			if(contador != librosArr.length){
				next();
			}

		}).catch(function (error) {
			console.log(error);
			error("Error", "Favor intentar luego", true, false);
		});


}

async function calculos(datos) {
	document.getElementById("nombreSucursal").innerText = datos.sucursal;
	librosArr = datos.libros;
	contador = 0;
	console.log(datos.libros);
	await next();
}

function next(){
	agregar(librosArr[contador]);
	contador++;
}


function carritoAdd(href) {
	fetch(href).then(
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
	
	
	
	
}