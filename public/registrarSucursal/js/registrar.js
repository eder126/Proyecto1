function send(event) {
	const nombre = document.getElementsByName("nombre")[0],
		telefono = document.getElementsByName("telefono")[0],
		costoEnvio = document.getElementsByName("costoEnvio")[0],
		provincia = document.getElementById("provincias"),
		canton = document.getElementById("cantones"),
		distrito = document.getElementById("distritos"),
		coordenadas = document.getElementById("coordenadas"),
		fotoPerfil = document.getElementById("fotoPerfil");

	nombre.classList.remove("inputError");
	telefono.classList.remove("inputError");
	costoEnvio.classList.remove("inputError");
	provincia.classList.remove("inputError");
	canton.classList.remove("inputError");
	distrito.classList.remove("inputError");
	coordenadas.classList.remove("inputError");

	if (nombre.value != "" && provincia.value != "" &&
		canton.value != "" && distrito.value != "" &&
		coordenadas.value != "" && telefono.value != "" && costoEnvio.value != "" &&
		coordenadas.value.split(", ")[0] && coordenadas.value.split(", ")[1]) {
		if (!isNaN(costoEnvio.value)) {
			if (!isNaN(telefono.value)) {
				if (fotoPerfil.value != "") {
					enviar();
				} else {
					error("Advertencia", "¿Quieres crear la sucursal sin imagen de perfil?", true, true);
				}
			} else {
				telefono.classList.add("inputError");
				error("Error", "El teléfono debe ser numérico únicamente", true, false);
				event.preventDefault();
				return false;
			}
		} else {
			costoEnvio.classList.add("inputError");
			error("Error", "El costo de envio debe ser numérico únicamente", true, false);
			event.preventDefault();
			return false;
		}
	} else {
		error("Error", "Favor llenar los campos", true, false);
		event.preventDefault();
		return false;
	}
	event.preventDefault();
	return false;
}

function enviar() {
	let data = new FormData(document.getElementById("form"));
	let options = {
		method: "POST",
		body: data
	};

	fetch("/registrarSucursal", options).then(
		function (response) {
			if (response.status != 200) {
				console.log("Ocurrió un error con el servicio: " + response.status);
				error("Error", "Favor intentar luego", true, false);
			} else {
				return response.json();
			}
		}).then(function (json) {
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
}

var loadFile = function (event) {
	var image = document.getElementById("imagen");
	image.src = URL.createObjectURL(event.target.files[0]);
};

function errorInput(that) {
	error("Error", "Favor llenar los campos.", true, false);
	that.classList.add("inputError");
}