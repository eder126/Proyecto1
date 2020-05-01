function errorInput(that) {
	error("Error", "Favor llenar los campos.", true, false);
	that.classList.add("inputError");
}

function send(event) {
	const nombre = document.getElementsByName("nombre")[0],
		apellido = document.getElementsByName("apellido")[0],
		apellido2 = document.getElementsByName("apellido2")[0],
		sexo = document.getElementsByName("sexo")[0],
		tid = document.getElementsByName("tid")[0],
		id = document.getElementsByName("id")[0],
		email = document.getElementsByName("email")[0],
		tel = document.getElementsByName("tel")[0],
		nombreComercial = "",
		nombreFantasia = "",
		provincia = document.getElementById("provincias"),
		canton = document.getElementById("cantones"),
		distrito = document.getElementById("distritos"),
		coordenadas = document.getElementById("coordenadas"),
		fotoPerfil = document.getElementById("fotoPerfilImagen");

	nombre.classList.remove("inputError");
	apellido.classList.remove("inputError");
	apellido2.classList.remove("inputError");
	sexo.classList.remove("inputError");
	id.classList.remove("inputError");
	email.classList.remove("inputError");
	tel.classList.remove("inputError");
	coordenadas.classList.remove("inputError");
	provincia.classList.remove("inputError");
	canton.classList.remove("inputError");
	distrito.classList.remove("inputError");

	if (nombre != "" && apellido != "" && apellido2 != "" && sexo != "" && tid != "" && id != "" &&
        email != "" && tel != "" && coordenadas != "") {
		if (document.getElementsByName("nombreComercial").length != 0) {
			nombreComercial = document.getElementsByName("nombreComercial")[0];
			nombreFantasia = document.getElementsByName("nombreFantasia")[0];
			nombreComercial.classList.remove("inputError");
			nombreFantasia.classList.remove("inputError");
			if (nombreComercial.value == "" || nombreFantasia.value == "") {
				error("Error", "Favor rellene todos los campos", true, false);
				event.preventDefault();
				return false;
			}
		}
		if (provincia.value != "") {
			if (canton.value == "" || distrito == "") {
				error("Error", "Favor rellene todos los campos", true, false);
				event.preventDefault();
				return false;
			}
		}
		enviar();
	} else {
		error("Error", "Favor rellene todos los campos", true, false);
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

	//console.log(options.body);
	fetch(document.location.href, options).then(
		function (response) {
			if (response.status != 200) {
				console.log("Ocurrió un error con el servicio: " + response.status);
				error("Error", "Favor intentar luego", true, false);
			} else {
				return response.json();
			}
		}).then(function (json) {
		//console.log(json);
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

function agregar(datos) {
	//document.getElementById("contrasenna").href = document.location.href+"/contrasenna/";
	var Lib = "";
	if (datos.rol === 1) {
		Lib += `<input title="Nombre comercial" name="nombreComercial" id="libreria1" type="text" class="inputLogin"
		placeholder="Nombre comercial" value="${datos.nombreComercial}">
		<input title="Nombre fantasía" name="nombreFantasia" id="libreria2" type="text" class="inputLogin"
        placeholder="Nombre fantasía" value="${datos.nombreFantasia}">
        <input name="fotoPerfilImagen" id="fotoPerfilImagen" title="Foto Perfil" class="inputLogin" type="file"/>`;
	} else {
		Lib += "<input name=\"fotoPerfilImagen\" id=\"fotoPerfilImagen\" title=\"Foto Perfil\" class=\"inputLogin\" type=\"file\"/>";
	}

	var Sexo = "";
	if (datos.sexo === 0) {
		Sexo += `<option disabled>Género</option>
        <option selected value="0">Hombre</option>
        <option value="1">Mujer</option>
        <option value="2">Otro</option>`;
	} else if (datos.sexo === 1) {
		Sexo += `<option disabled>Género</option>
        <option value="0">Hombre</option>
        <option selected value="1">Mujer</option>
        <option value="2">Otro</option>`;
	} else if (datos.sexo === 2) {
		Sexo += `<option disabled>Género</option>
        <option value="0">Hombre</option>
        <option value="1">Mujer</option>
        <option selected value="2">Otro</option>`;
	}

	var tipoID = "";
	if (datos.tid === 0) {
		tipoID += `<option disabled>Tipo ID</option>
        <option selected value="0">Cédula nacional</option>
        <option value="1">Dimex</option>
        <option value="2">Otro</option>`;
	} else if (datos.tid === 1) {
		tipoID += `<option disabled>Tipo ID</option>
        <option value="0">Cédula nacional</option>
        <option selected value="1">Dimex</option>
        <option value="2">Otro</option>`;
	} else if (datos.tid === 2) {
		tipoID += `<option disabled>Tipo ID</option>
        <option value="0">Cédula nacional</option>
        <option value="1">Dimex</option>
        <option selected value="2">Otro</option>`;
	}

	let datosPerfil = document.getElementById("wrapper");
	datosPerfil.innerHTML = datosPerfil.innerHTML +
        `<div class="izquierda">
        <input title="Nombre" name="nombre" type="text" class="inputLogin" placeholder="Nombre" required
            oninvalid="errorInput(this);" value="${datos.nombre}">
        <input title="Apellido" name="apellido" type="text" class="inputLogin" placeholder="Apellido" required
            oninvalid="errorInput(this);" value="${datos.apellido}">
        <input title="Segundo apellido" name="apellido2" type="text" class="inputLogin" placeholder="Segundo Apellido" required
            oninvalid="errorInput(this);" value="${datos.apellido2}">
        <select title="Tipo ID" name="tid" type="text" class="inputLogin select" required oninvalid="errorInput(this);">
            ${tipoID}
        </select>
        <input title="ID" name="id" type="text" class="inputLogin" placeholder="ID" required
            oninvalid="errorInput(this);" value="${datos.id}">
    </div>
    <div class="izquierda" id="normal">
        <input title="Email" name="email" type="email" class="inputLogin" placeholder="Email" required
            oninvalid="errorInput(this);" value="${datos.email}" readonly=true>
        <select title="Género" name="sexo" type="text" class="inputLogin select" required
            oninvalid="errorInput(this);">
            ${Sexo}
        </select>
        <input title="Teléfono" name="tel" type="text" class="inputLogin" placeholder="Teléfono" required
            oninvalid="errorInput(this);" value="${datos.tel}">
        ${Lib}
    </div>`;

	document.getElementById("coordenadas").value = datos.direccion.coordenadas.lat + ", " + datos.direccion.coordenadas.long;
	initMap(datos.direccion.coordenadas.lat, datos.direccion.coordenadas.long);
}

//FETCH CONSIGUE Y ASIGNA LOS VALORES
//fetch('./listar')
fetch(document.location.href + "/listar")
	.then(function (response) {
		//console.log(response.url);
		if (response.status != 200)
			console.log("Ocurrió un error con el servicio: " + response.status);
		else return response.json();
	}).then(function (json) {
		//console.log(json);
		agregar(json);
	}).catch(function (err) {
		console.log("Ocurrió un error con el fetch del usuario.json: ", err);
		error("Error", "Favor regrese más tarde", true, false);
	});

function initMap(Lat, Long) {
	var mapDiv = document.getElementById("map");
	var latlng = new google.maps.LatLng(Lat, Long);
	var uluru = {
		lat: Number(Lat),
		lng: Number(Long)
	};
	var mapOptions = {
		zoom: 10,
		center: latlng,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	var map = new google.maps.Map(mapDiv, mapOptions);
	var marker = new google.maps.Marker({
		position: uluru,
		map: mapDiv
	});
	marker.setMap(map);
}

function eliminar() {
	fetch("/eliminarUsuario").then(
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
			if (json.alerta) {
				const {
					titulo,
					mensaje,
					btnAceptar,
					btnCancelar
				} = json.alerta;
				error(titulo, mensaje, btnAceptar, btnCancelar);
			}
			if (json.eliminado) {
				document.location.href = "http://localhost:8080/logout";
			}


		});
}