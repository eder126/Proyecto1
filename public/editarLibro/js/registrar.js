function send(event) {
	const nombre = document.getElementsByName("nombre")[0],
		isbn = document.getElementsByName("isbn")[0],
		autor = document.getElementsByName("autor")[0],
		formato = document.getElementsByName("formato")[0],
		descripcion = document.getElementsByName("descripcion")[0],
		genero = document.getElementsByName("genero")[0],
		categoria = document.getElementsByName("categoria")[0],
		fotoPerfil = document.getElementById("fotoPerfilImagen");

	nombre.classList.remove("inputError");
	isbn.classList.remove("inputError");
	autor.classList.remove("inputError");
	formato.classList.remove("inputError");
	descripcion.classList.remove("inputError");
	genero.classList.remove("inputError");
	categoria.classList.remove("inputError");
	fotoPerfil.classList.remove("inputError");

	if (nombre.value != "" && isbn.value != "" && autor.value != "" && formato.value != "" &&
		genero.value != "" && categoria.value != "") {
		enviar();
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

fetch("/registrarLibro/autores")
	.then(function (response) {
		//console.log(response.url);
		if (response.status != 200)
			console.log("Ocurrió un error con el servicio: " + response.status);
		else return response.json();
	}).then(function (jsonAutores) {
		if (jsonAutores) {
			for (var i = 0; i < jsonAutores.length; i++) {
				var nuevaOpcion = document.createElement("option");
				nuevaOpcion.setAttribute("value", jsonAutores[i].identificador);
				var texto = document.createTextNode(jsonAutores[i].nombre);
				nuevaOpcion.appendChild(texto);
				document.getElementById("autor").appendChild(nuevaOpcion);
			}
			datos();
		} else {
			var nuevaOpcion = document.createElement("option");
			nuevaOpcion.setAttribute("value", "");
			var texto = document.createTextNode("No hay autores disponibles");
			nuevaOpcion.appendChild(texto);
			document.getElementById("autor").appendChild(nuevaOpcion);
		}
	})
	.catch(function (err) {
		console.log("Ocurrió un error con el fetch", err);
	});

fetch("/generos")
	.then(function (response) {
		//console.log(response.url);
		if (response.status != 200)
			console.log("Ocurrió un error con el servicio: " + response.status);
		else return response.json();
	}).then(function (jsonGeneros) {
		console.log(jsonGeneros);
		if (jsonGeneros != null && jsonGeneros != [] && jsonGeneros != undefined && jsonGeneros.length != 0) {
			for (var i = 0; i < jsonGeneros.length; i++) {
				var nuevaOpcion = document.createElement("option");
				nuevaOpcion.setAttribute("value", jsonGeneros[i].id);
				var texto = document.createTextNode(jsonGeneros[i].nombre);
				nuevaOpcion.appendChild(texto);
				document.getElementById("genero").appendChild(nuevaOpcion);
			}
			datos();
		} else {
			var nuevaOpcion = document.createElement("option");
			nuevaOpcion.setAttribute("value", "");
			var texto = document.createTextNode("No hay géneros disponibles");
			nuevaOpcion.appendChild(texto);
			document.getElementById("genero").appendChild(nuevaOpcion);
		}
	})
	.catch(function (err) {
		console.log("Ocurrió un error con el fetch", err);
	});

fetch("/categorias")
	.then(function (response) {
		//console.log(response.url);
		if (response.status != 200)
			console.log("Ocurrió un error con el servicio: " + response.status);
		else return response.json();
	}).then(function (jsonCategorias) {
		console.log(jsonCategorias);
		if (jsonCategorias != null && jsonCategorias != [] && jsonCategorias != undefined && jsonCategorias.length != 0) {
			for (var i = 0; i < jsonCategorias.length; i++) {
				var nuevaOpcion = document.createElement("option");
				nuevaOpcion.setAttribute("value", jsonCategorias[i].id);
				var texto = document.createTextNode(jsonCategorias[i].nombre);
				nuevaOpcion.appendChild(texto);
				document.getElementById("categoria").appendChild(nuevaOpcion);
			}
			datos();
		} else {
			var nuevaOpcion = document.createElement("option");
			nuevaOpcion.setAttribute("value", "");
			var texto = document.createTextNode("No hay categorías disponibles");
			nuevaOpcion.appendChild(texto);
			document.getElementById("categoria").appendChild(nuevaOpcion);
		}
	})
	.catch(function (err) {
		console.log("Ocurrió un error con el fetch", err);
	});

function errorInput(that) {
	error("Error", "Favor llenar los campos.", true, false);
	that.classList.add("inputError");
}


function datos(){
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
		document.getElementsByName("isbn")[0].value = json.ISBN;
		document.getElementsByName("autor")[0].value = json.autor;
		document.getElementsByName("formato")[0].value = json.formato == false ? 0:1;
		document.getElementsByName("descripcion")[0].value = json.descripcion;
		document.getElementsByName("genero")[0].value = json.genero;
		document.getElementsByName("categoria")[0].value = json.categoria;
	});
}