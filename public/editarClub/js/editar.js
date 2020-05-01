function loadFile(event) {
	var image = document.getElementById("perfilImg");
	image.src = URL.createObjectURL(event.target.files[0]);
}

function send(event) {
	const nombre = document.getElementsByName("nombre")[0],
		descripcion = document.getElementsByName("descripcion")[0],
		diaReunion = document.getElementsByName("diaReunion")[0],
		hora = document.getElementsByName("hora")[0],
		genero = document.getElementsByName("genero")[0],
		libro = document.getElementsByName("libro")[0],
		fotoPerfilImagen = document.getElementById("fotoPerfilImagen"),
		sucursal = document.getElementById("sucursales");

	nombre.classList.remove("inputError");
	descripcion.classList.remove("inputError");
	diaReunion.classList.remove("inputError");
	hora.classList.remove("inputError");
	sucursal.classList.remove("inputError");
	genero.classList.remove("inputError");
	libro.classList.remove("inputError");

	if (nombre.value != "" && descripcion.value != "" && diaReunion.value != "" && hora.value != "" &&
    genero.value != "" && libro.value != "") {
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

function errorInput(that) {
	error("Error", "Favor llenar los campos.", true, false);
	that.classList.add("inputError");
}

function agregar(datos) {
	let datosPerfil = document.getElementById("wrapper");
	datosPerfil.innerHTML = datosPerfil.innerHTML +
    `<div class="imagenClub">
        <div id="output" class="imagenEdit">
            <img name="perfilImg" id="perfilImg" class="perfilClub" src="${datos.url}">
        </div>
        <label for="fotoPerfilImagen" class="editarPortada">
            <span><i class="fas fa-feather"></i>Editar foto del club</span>
        </label>
        <input id="fotoPerfilImagen" type="file" name="fotoPerfilImagen" onchange="loadFile(event)" />
    </div>
    <div class="formularioDerecha">
        <input value="${datos.nombre}" name="nombre" title="Nombre del Club" type="text" class="inputLogin" placeholder="Nombre" required oninvalid="errorInput(this);" >
        <textarea name="descripcion" title="Descripción del club" maxlength="250" type="text" class="inputLogin" placeholder="Descripción" required oninvalid="errorInput(this);">${datos.descripcion}</textarea>
        <select id="dia" title="Día de reunión" class="inputLogin select" name="diaReunion" required oninvalid="errorInput(this);">
            <option value="" disabled>
                Días disponibles
            </option>
            <option ${datos.dia == 0 ? "selected":""} value="0">Lunes</option>
            <option ${datos.dia == 1 ? "selected":""} value="1">Martes</option>
            <option ${datos.dia == 2 ? "selected":""} value="2">Miércoles</option>
            <option ${datos.dia == 3 ? "selected":""} value="3">Jueves</option>
            <option ${datos.dia == 4 ? "selected":""} value="4">Viernes</option>
            <option ${datos.dia == 5 ? "selected":""} value="5">Sabado</option>
            <option ${datos.dia == 6 ? "selected":""} value="6">Domingo</option>
        </select>
        <input value="${datos.hora}" name="hora" title="Hora de reunión" type="time" class="inputLogin" placeholder="Hora" required oninvalid="errorInput(this);" >
        <select id="genero" title="Género literario" class="inputLogin select" name="genero" onchange="conseguirLibros(this.value);" oninvalid="errorInput(this);">
            <option value="" disabled>
                Género literario
            </option>
        </select>
        <select id="libro" title="Lectura" class="inputLogin select" name="libro" oninvalid="errorInput(this);">
            <option value="" disabled>
                Libros disponibles
            </option>
        </select>
    </div>`;
	if(!datos.presencial){
		console.log("DURANTE MAPA");
		document.getElementById("inputsMapa").classList.add("ocultar");
	}
	conseguirGeneros(datos.genero);
	conseguirLibrosInicial(datos.genero, datos.libro);
}

//FETCH CONSIGUE Y ASIGNA LOS VALORES
//fetch('./listar')
var sucursalesArr = [];
fetch(document.location.href+"/listar")
	.then(function (response) {
		//console.log(response.url);
		if (response.status != 200)
			console.log("Ocurrió un error con el servicio: " + response.status);
		else return response.json();
	}).then(function (json) {
		//console.log(json);
		if(json.presencial){
			fetch(document.location.href+"/sucursales", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				}
			}).then(function (response) {
				if (response.status != 200) {
					console.log("Ocurrió un error con el servicio: " + response.status);
					error("Error", "Favor intentar luego", true, false);
				} else {
					return response.json();
				}
			}).then(function (jsonSuc) {
				jsonSuc.sucursales.forEach((item, i) => {
					sucursalesArr.push(item);
					let nuevo = document.createElement("option");
					nuevo.value = item.id;
					nuevo.innerText = item.nombre;
					document.getElementById("sucursales").appendChild(nuevo);
					if(json.sucursal == item.id) {
						nuevo.selected = "true";
					}
				});
			});
		}
		agregar(json);
	}).catch(function (err) {
		console.log("Ocurrió un error con el fetch del usuario.json: ", err);
		error("Error", "Favor regrese más tarde", true, false);
	});

var map;
var geocoder;
var marker;
var crLat = 9.6301892;
var crLng = -84.2541843;

function initMap() {
	geocoder = new google.maps.Geocoder();
	map = new google.maps.Map(document.getElementById("map"), {
		center: {
			lat: crLat,
			lng: crLng
		},
		zoom: 7,
		mapTypeId: google.maps.MapTypeId.HYBRID
	});
	marker = new google.maps.Marker({
		map: map,
		draggable: false,
		animation: google.maps.Animation.DROP,
		position: {
			lat: crLat,
			lng: crLng
		}
	});
}

function mostrar(valor) {
	let val = sucursalesArr[valor],
		lat = Number(val.lat),
		lng = Number(val.long);
	document.getElementsByName("sucursalId")[0].value = Number(val.id);
	map.setCenter({
		lat: lat,
		lng: lng
	});
	map.zoom = 20;
	marker.setPosition({
		lat: lat,
		lng: lng
	});
}

var GenerosArr = [];
function conseguirGeneros(generoID){
	fetch(document.location.href+"/generos")
		.then(function (response) {
			//console.log(response.url);
			if (response.status != 200)
				console.log("Ocurrió un error con el servicio: " + response.status);
			else return response.json();
		}).then(function (json) {
			if(json.encontrado){
				json.datos.forEach((item, i) => {
					GenerosArr.push(item);
					let nuevo = document.createElement("option");
					nuevo.value = item.id;
					nuevo.innerText = item.nombre;
					document.getElementById("genero").appendChild(nuevo);
					if(generoID == item.id) {
						nuevo.selected = "true";
					}
				});
			} else {
				const {
					titulo,
					mensaje,
					btnAceptar,
					btnCancelar
				} = json.alerta;
				error(titulo, mensaje, btnAceptar, btnCancelar);
			}
		}).catch(function (err) {
			console.log("Ocurrió un error con el fetch del usuario.json: ", err);
			error("Error", "Favor regrese más tarde", true, false);
		});
}

function conseguirLibrosInicial(generoID, isbn){
	fetch(document.location.href+"/libros/"+generoID)
		.then(function (response) {
			//console.log(response.url);
			if (response.status != 200)
				console.log("Ocurrió un error con el servicio: " + response.status);
			else return response.json();
		}).then(function (json) {
			if(json.encontrado){
				json.datos.forEach((item, i) => {
					GenerosArr.push(item);
					let nuevo = document.createElement("option");
					nuevo.value = item.ISBN;
					nuevo.innerText = item.nombre;
					document.getElementById("libro").appendChild(nuevo);
					if(isbn == item.ISBN) {
						nuevo.selected = "true";
					}
				});
			} else {
				const {
					titulo,
					mensaje,
					btnAceptar,
					btnCancelar
				} = json.alerta;
				error(titulo, mensaje, btnAceptar, btnCancelar);
			}
		}).catch(function (err) {
			console.log("Ocurrió un error con el fetch del usuario.json: ", err);
			error("Error", "Favor regrese más tarde", true, false);
		});
}

function conseguirLibros(generoID){
	var selectobject = document.getElementById("libro");
	selectobject.selectedIndex = 0;
	do {
		selectobject.remove(1);
	} while(selectobject.options.length > 1);
	fetch(document.location.href+"/libros/"+generoID)
		.then(function (response) {
			//console.log(response.url);
			if (response.status != 200)
				console.log("Ocurrió un error con el servicio: " + response.status);
			else return response.json();
		}).then(function (json) {
			if(json.encontrado){
				json.datos.forEach((item, i) => {
					GenerosArr.push(item);
					let nuevo = document.createElement("option");
					nuevo.value = item.ISBN;
					nuevo.innerText = item.nombre;
					document.getElementById("libro").appendChild(nuevo);
				});
			} else {
				const {
					titulo,
					mensaje,
					btnAceptar,
					btnCancelar
				} = json.alerta;
				error(titulo, mensaje, btnAceptar, btnCancelar);
			}
		}).catch(function (err) {
			console.log("Ocurrió un error con el fetch del usuario.json: ", err);
			error("Error", "Favor regrese más tarde", true, false);
		});
}