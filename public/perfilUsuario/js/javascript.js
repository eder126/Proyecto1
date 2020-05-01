function ensennar() {
	var linksn = document.getElementById("menu1");
	var linksn2 = document.getElementById("menu2");
	var linksn3 = document.getElementById("menu3");
	linksn.classList.toggle("notHidden");
	linksn2.classList.toggle("ocultar");
	linksn3.classList.toggle("notHidden");
}

function cancelar() {
	document.getElementById("caja").classList.remove("overlay");
	document.getElementById("advertencia").classList.add("ocultar");
	document.getElementById("calificarUsuario").classList.add("ocultar");
	document.getElementById("btnAceptar").classList.remove("ocultar");
	document.getElementById("btnAceptar2").classList.remove("ocultar");
	document.getElementById("btnCancelar").classList.remove("ocultar");
	document.getElementById("btnCancelar2").classList.remove("ocultar");
}
        
function aceptar(){
	if(document.getElementById("tituloAdv").innerHTML == `<i class="fas fa-check" style="color: #009688;" aria-hidden="true"></i>`){
		window.location.href = document.location.href;
	}else{
		cancelar();
	}
}
        
function error(titulo, msg, aceptar, cancelar){
	document.getElementById("caja").classList.add("overlay");
	document.getElementById("advertencia").classList.remove("ocultar");
	document.getElementById("tituloAdv").innerHTML = titulo;
	document.getElementById("mensaje").innerHTML = msg;
	if(!aceptar) document.getElementById("btnAceptar").classList.add("ocultar");
	if(!cancelar) document.getElementById("btnCancelar").classList.add("ocultar");
	window.scrollTo(0, 0);
}

function mostrarMapa(){
	document.getElementById("caja").classList.add("overlay");
	document.getElementById("calificarUsuario").classList.remove("ocultar");
	window.scrollTo(0, 0);
}

//FETCH CONSIGUE Y ASIGNA LOS VALORES
//fetch('./listar')
fetch(document.location.href+"/listar")
	.then(function(response) {
		//console.log(response.url);
		if (response.status != 200)
			console.log("Ocurrió un error con el servicio: " + response.status);
		else return response.json();
	}).then(function(json) {
		if(json.libros){
			document.getElementById("imagenPerfil").classList.add("final");
			document.getElementById("datosExtra").classList.remove("noMostrar");

			var Calificacion = Number(json.calificacion);
			calificacion(Calificacion);

			document.getElementById("visitarLibreria").classList.remove("noMostrar");
			var enlaceLibros = document.createElement("a");
			enlaceLibros.setAttribute("href", "/librosUsuario/"+document.location.href.split("/")[document.location.href.split("/").length-1]);
			enlaceLibros.appendChild(document.getElementById("botonLibros"));
			document.getElementById("contenedorBotonLibros").appendChild(enlaceLibros);
		} else {
			document.getElementById("imagenPerfil").classList.add("noFinal");
			document.getElementById("datosExtra").classList.add("noMostrar");
			document.getElementById("visitarLibreria").classList.add("noMostrar");
			//contenedorInfo
		}
		//Se asignan los valores a variables con nombres descriptivos
		if(json.url != "" && json.url != " " && json.url != null && json.url != undefined){
			document.getElementById("portada").src = json.url;
		}
		var Nombre = json.nombre;
		var Apellido = json.apellido;
		var Apellido2 = json.apellido2;
		//******Se realizan los cambios en el sitio web**********
		var parrafoNombre = document.createElement("p");
		var NombreNode = document.createTextNode(Nombre + " " + Apellido + " " + Apellido2);
		parrafoNombre.appendChild(NombreNode);
		document.getElementById("nombrePerfil").appendChild(parrafoNombre);
	}).catch(function(err) {
		console.log("Ocurrió un error con el fetch del usuario.json: ", err);
		error("Error", "No se ha encontrado el usuario con el id dado.", true, false);		
	});

fetch("/user").then(
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
		if (json.loggeado) {
			let arr = json.menu;
			arr.forEach(item => {
				let nuevo2 = document.createElement("a");
				nuevo2.href = `${item.href}`;
				nuevo2.innerText = `${item.opcion}`;
				document.getElementById("menu3").appendChild(nuevo2);
			});
			document.getElementById("menu3").innerHTML += `<a class=\"nombrePerfilArriba\" id=\"nombrePerfilArriba\" href="/perfil"></a><a href="/${json.iconoLink}"><i class=\"${json.icono}\"></i></a>`;
			document.getElementById("nombrePerfilArriba").innerText = json.nombre;
	
		} else {
			document.getElementById("menu3").innerHTML = "<a class='registrarLogin' href='./registrar'>Registrar</a> <a class='registrarLogin' href='./login'>Iniciar Sesión</a>";
		}
	
	
	
	}).catch(function (error) {
		console.log(error);
		error("Error", "Favor intentar luego", true, false);
	});

function calificarLibro (event) {
	const calificacionArr = document.getElementsByName("calificacion"),
		resenna = document.getElementsByName("resenna")[0];
	var calificacion = 0;
	for(var i = 0; i < calificacionArr.length; i++){
		if(calificacionArr[i].checked){
			calificacion = (i+1);
			break;
		}
	}
	if(calificacion > 0 && calificacion != ""){
		var json = JSON.stringify({
			calificacion: calificacion,
			resenna: resenna.value
		});
		console.log(json);		
		fetch(document.location.href+"/calificar", {
			method: "POST",
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json",
			},
			body: json
		}).then(function (response) {
			if (response.status != 200) {
				console.log("Ocurrió un error con el servicio: " + response.status);
				cancelar();
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
				cancelar();
				error(titulo, mensaje, btnAceptar, btnCancelar);
			}
		});
	} else {
		cancelar();
		error("Error", "No puede calificar a este usuario sin marcar una calificación primero", true, false);
		event.preventDefault();
		return false;
	}
	event.preventDefault();
	return false;
}

function calificar () {
	fetch("/user/datos").then(
		function (response) {
			if (response.status != 200) {
				console.log("Ocurrió un error con el servicio: " + response.status);
				error("Error", "Favor intentar luego", true, false);
			} else {
				return response.json();
			}
		}).then(function (json) {
		if (json.loggeado) {
			if(json.user.rol === 0) {
				fetch(document.location.href+"/calificado")
					.then(function (response) {
						if (response.status != 200) {
							console.log("Ocurrió un error con el servicio: " + response.status);
							error("Error", "Favor intentar luego", true, false);
						} else {
							return response.json();
						}
					}).then(function (jsonLib) {
						//console.log(jsonLib);
						console.log(jsonLib);
						if(!jsonLib.creado){
							const {
								titulo,
								mensaje,
								btnAceptar,
								btnCancelar
							} = jsonLib.alerta;
							cancelar();
							error(titulo, mensaje, btnAceptar, btnCancelar);
						} else {
							if(!jsonLib.encontrado){ 
								//console.log("PUEDE CALIFICAR");
								document.getElementById("caja").classList.add("overlay");
								document.getElementById("calificarUsuario").classList.remove("ocultar");
								window.scrollTo(0, 0);
							} else {
								cancelar();
								error("Error", "Solo puede calificar al usuario una vez por intercambio", true, false);
							} 
						}
					}).catch(function (error) {
						console.log(error);
						error("Error", "Favor intentar luego", true, false);
					});
			} else {
				cancelar();
				error("Error", "Usted no puede calificar a un usuario", true, false);
			}
		} else {
			cancelar();
			error("Error", "Debe registrarse para calificar a un usuario", true, false);
		}
	}).catch(function (error) {
		console.log(error);
		error("Error", "Favor intentar luego", true, false);
	});
}