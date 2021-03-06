function errorInput(that) {
	error("Error", "Favor llenar los campos.", true, false);
	that.classList.add("inputError");
}

var loadFile = function (event) {
	var image = document.getElementById("imagen");
	image.src = URL.createObjectURL(event.target.files[0]);
};

function send(event) {
	const nombre = document.getElementsByName("nombre")[0],
		alias = document.getElementsByName("alias")[0],
		descripcion = document.getElementsByName("descripcion")[0],
		nacimiento = document.getElementsByName("nacimiento")[0],
		fotoPerfil = document.getElementById("fotoPerfil");

	nombre.classList.remove("inputError");
	descripcion.classList.remove("inputError");
	nacimiento.classList.remove("inputError");

	if (nombre.value != "" && descripcion.value != "" && descripcion.value.length <= 500 && new Date(nacimiento.value) instanceof Date) {
		if (new Date(nacimiento.value) < new Date()) {
			enviar();
		} else {
			nacimiento.classList.add("inputError");
			error("Error", "Fecha de nacimiento es mayor a hoy", true, false);
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

	fetch(document.location.href, options).then(
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


fetch(document.location.href + "/info").then(
	function (response) {
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
	document.getElementsByName("nombre")[0].value = json.nombre;
	document.getElementsByName("alias")[0].value = json.alias;
	document.getElementsByName("descripcion")[0].value = json.descripcion;
	document.getElementsByName("nacimiento")[0].valueAsDate = new Date(json.nacimiento); 
	if(json.imagenPerfil != " ") {
		document.getElementById("imagen").src = json.imagenPerfil;
	}

});