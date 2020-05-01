document.getElementById("switch").addEventListener("click", () => {
	document.getElementById("inputsMapa").classList.toggle("ocultar");
});

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
		switchT = document.getElementById("switch"),
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
		if (switchT.value.checked && sucursal.value != "") {
			error("Error", "Favor llenar los campos", true, false);
			event.preventDefault();
			return false;
		} else {
			if(fotoPerfilImagen.value != ""){
				enviar();
			}else{
				error("Advertencia", "¿Quieres crear el club sin imagen de perfil (Luego se puede cambiar)?", true, true);
			}
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

	fetch("/registrarClubDeLectura", options).then(
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


		});

}

function errorInput(that) {
	error("Error", "Favor llenar los campos.", true, false);
	that.classList.add("inputError");
}
	
var GenerosArr = [];
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