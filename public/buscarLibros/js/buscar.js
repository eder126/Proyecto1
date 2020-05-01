buscar();

function buscar() {
	const tipo = document.getElementById("tipo"),
		query = document.getElementById("query"),
		sort = document.getElementById("sort");

	fetch("/buscarLibros", {
		method: "POST",
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			tipo: tipo.value,
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
				error("Error", "No se ha encontrado ningún libro.", true, false);
			}

		}).catch(function (error) {
			console.log(error);
			error("Error", "Favor intentar luego", true, false);
		});



	
}

let librosArr = [];

function agregar(datos) {
	console.log(datos);
	let libros = document.getElementById("libros");
	let tempImg = datos.img.split("/");
	tempImg[tempImg.length - 2] = "w_200,h_300,c_scale";
	datos.img = tempImg.join("/");
	libros.innerHTML = `${libros.innerHTML} <div class="cajaLibro">
	<div class="fotoLibro">
		<img src="${datos.img}">
	</div>
	<div class="datosPerfil">
	<a href="../perfilLibro/${datos.ISBN}"><span class="tituloLibro">${datos.nombre}</span></a>
	</div>
</div></a>`;

}

function calculos(datos) {
	librosArr = datos;
	let cantidad = librosArr.length;
	if (cantidad >= 4) {

		for (let i = 0; i < 4; i++) {
			agregar(librosArr[0]);
			librosArr.shift();
		}

	} else {
		console.log("aca", cantidad);
		for (let i = 0; i < cantidad; i++) {
			agregar(librosArr[0]);
			librosArr.shift();
		}
		
	}

	if (librosArr.length >= 1) {
		document.getElementById("mas").classList.remove("ocultar");
	}else{
		document.getElementById("mas").classList.add("ocultar");
	}
}