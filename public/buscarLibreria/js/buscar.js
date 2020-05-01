buscar();

function buscar() {
	const tipo = document.getElementById("tipo"),
		query = document.getElementById("query"),
		sort = document.getElementById("sort");

	fetch("/buscarLibreria", {
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
			document.getElementById("librerias").innerHTML = "";
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

let usuariosArr = [];

function agregar(datos) {

	let usuarios = document.getElementById("librerias");
	usuarios.innerHTML = usuarios.innerHTML + `<div class="cajaUsuario">
			<div class="fotoPerfil">
				<img src="${(datos.url)? datos.url : "buscarLibreria/img/user.png"}">
			</div>
			<div class="datosPerfil">
				<a href="http://localhost:8080/perfilLibreria/${datos.libreriaId}"><span>${datos.nombreFantasia}</span></a>
			</div>
		</div>`;

}

function calculos(datos) {
	usuariosArr = datos;
	let cantidad = usuariosArr.length;
	if (cantidad >= 4) {

		for (let i = 0; i < 4; i++) {
			agregar(usuariosArr[0]);
			usuariosArr.shift();
		}

	} else {
		console.log("aca", cantidad);
		for (let i = 0; i < cantidad; i++) {
			agregar(usuariosArr[0]);
			usuariosArr.shift();
		}
	}

	if (usuariosArr.length >= 1) {
		document.getElementById("mas").classList.remove("ocultar");
	}else{
		document.getElementById("mas").classList.add("ocultar");
	}
}