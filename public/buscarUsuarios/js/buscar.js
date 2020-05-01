buscar();

function buscar() {
	const tipo = document.getElementById("tipo"),
		sort = document.getElementById("sort"),
		query = document.getElementById("query");
	if (tipo.value != "") {

		fetch("/buscarUsuarios", {
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
				document.getElementById("usuarios").innerHTML = "";
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



	} else {
		error("Error", "Favor llenar los campos", true, false);
		event.preventDefault();
		return false;
	}
}

let usuariosArr = [];

function agregar(datos) {


	let arr = datos.libros;
	let libros = [];
	arr.forEach(element => {
		libros.push(element.isbn);
	});
	libros = [...new Set(libros)];

	let usuarios = document.getElementById("usuarios");
	usuarios.innerHTML = usuarios.innerHTML + `<div class="cajaUsuario">
			<div class="fotoPerfil">
				<img src="${(datos.url)? datos.url : "buscarUsuarios/img/user.png"}">
			</div>
			<div class="datosPerfil">
				<a href="http://localhost:8080/perfilUsuario/${datos.usuarioId}"><span>${datos.nombre}</span>
				<span>${datos.apellido}</span></a>
				<br>
                <div class="masDatos">
                    <p>Calificación: <span>${datos.calificacion}</span></p>
                    <p>Libros: <span>${libros.length}</span></p>
                </div>
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
	} else {
		document.getElementById("mas").classList.add("ocultar");
	}
}