buscar();

function buscar() {
	const query = document.getElementById("query"),
		sort = document.getElementById("sort"),
		id = document.location.href.split("/")[document.location.href.split("/").length - 1];

	fetch("/buscarInventario/" + id, {
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
async function agregar(datos) {
	console.log("d", datos);
	let libros = document.getElementById("libros");
	await fetch("/libro/" + datos.isbn).then(
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
			libros.innerHTML += `<div class="libro">
					<div class="fotoLibro">
						<img src="${json.img}">
					</div>
					<div class="datosLibro">
						<p class="tituloLibro"><a href="/perfilLibro/${datos.isbn}">${datos.nombre}</a></p>
						<span class="left">x${datos.cantidad}</span>
						<span class="right"><a href="${document.location.href}/editar/${datos.isbn}/"><i class="far fa-edit"></i></a></span>
						<span class="right"><a onclick="eliminar('${document.location.href}/eliminar/${datos.isbn}/')"><i class="fas fa-trash"></i></a></span>
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
	
function calculos(datos) {
	document.getElementById("nombreSucursal").innerText = datos.sucursal;
	librosArr = datos.libros;
	contador = 0;
	console.log(datos.libros);
	next();
}
	
function next(){
	agregar(librosArr[contador]);
	contador++;
}


function eliminar(href) {
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