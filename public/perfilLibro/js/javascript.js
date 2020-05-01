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

function aceptar() {
	if (document.getElementById("tituloAdv").innerHTML == `<i class="fas fa-check" style="color: #009688;" aria-hidden="true"></i>`) {
		window.location.href = document.location.href;
	} else {
		cancelar();
	}
}

function error(titulo, msg, aceptar, cancelar) {
	document.getElementById("caja").classList.add("overlay");
	document.getElementById("advertencia").classList.remove("ocultar");
	document.getElementById("tituloAdv").innerHTML = titulo;
	document.getElementById("mensaje").innerHTML = msg;
	if (!aceptar) document.getElementById("btnAceptar").classList.add("ocultar");
	if (!cancelar) document.getElementById("btnCancelar").classList.add("ocultar");
	//if (!aceptar) document.getElementById("btnAceptar2").classList.add("ocultar");
	//if (!cancelar) document.getElementById("btnCancelar2").classList.add("ocultar");
	window.scrollTo(0, 0);
}

//FETCH CONSIGUE Y ASIGNA LOS VALORES
fetch(document.location.href + "/listar")
.then(function (response) {
		//console.log(response.url);
		if (response.status != 200)
			console.log("Ocurrió un error con el servicio: " + response.status);
		else
			return response.json();
	}).then(function (json) {
	//console.log(json);
	//Se asignan los valores a variables con nombres descriptivos

	var Portada = json.img;
	var Nombre = json.nombre;
	var ISBN = json.ISBN;
	var Descripcion = json.descripcion;
	var Formato = json.formato;
	var Calificacion = json.rating;

	document.getElementById("portada").src = Portada;
	document.getElementById("titulo").innerHTML += Nombre;
	document.getElementById("isbn").innerHTML += ISBN;
	document.getElementById("descripcion").innerHTML += Descripcion;
	calificacion(Calificacion);
	if (!Formato) {
		document.getElementById("formato").innerHTML += "Físico";
	} else {
		document.getElementById("formato").innerHTML += "Digital";
	}

	fetch(json.genero + "/generos")
	.then(function (response) {
			//console.log(response.url);
			if (response.status != 200)
				console.log("Ocurrió un error con el servicio: " + response.status);
			else
				return response.json();
		}).then(function (json) {
		//console.log(json);
		if (json != undefined && json != null) {
			document.getElementById("genero").innerHTML += json.nombre;
		} else {
			document.getElementById("genero").innerHTML += "No se encontró el género";
		}
	}).catch(function (err) {
		console.log("Ocurrió un error con el fetch del usuario.json: ", err);
		error("Error", "No se ha encontrado el género con dicho id.", true, false);
	});

	fetch(json.autor + "/autores")
	.then(
		function (response) {
			//console.log(response.url);
			if (response.status != 200)
				console.log("Ocurrió un error con el servicio: " + response.status);
			else
				return response.json();
		}).then(function (json) {
		//console.log(json);
		if (json != undefined && json != null) {
			if (json.alias != null && json.alias != undefined && json.alias != "") {
				document.getElementById("autor").innerHTML += json.alias;
				document.getElementById("autor").href = "../perfilAutor/" + json.identificador;
			} else {
				document.getElementById("autor").innerHTML += json.nombre;
				document.getElementById("autor").href = "../perfilAutor/" + json.identificador;
			}
		} else {
			document.getElementById("genero").innerHTML += "No se encontró el autor";
		}
	}).catch(function (err) {
		console.log("Ocurrió un error con el fetch del usuario.json: ", err);
		error("Error", "No se ha encontrado el autor con dicho id.", true, false);
	});

	fetch(json.ISBN + "/sucursales")
	.then(function (response) {
			//console.log(response.url);
			if (response.status != 200)
				console.log("Ocurrió un error con el servicio: " + response.status);
			else
				return response.json();
		}).then(function (jsonSuc) {
		//console.log(jsonSuc);
		if (jsonSuc != undefined && jsonSuc != null && jsonSuc.length != 0 && jsonSuc != []) {
			for (var i = 0; i < jsonSuc.length; i++) {
				var nuevaOpcion = document.createElement("option");
				nuevaOpcion.setAttribute("value", jsonSuc[i].id);
				var precio = jsonSuc[i].libros.find(libro => libro.isbn ===  json.ISBN);
				var texto = document.createTextNode(jsonSuc[i].nombre+" - ₡"+precio.precio);
				nuevaOpcion.appendChild(texto);
				document.getElementById("sucursales").appendChild(nuevaOpcion);
			}
		} else {
			var nuevaOpcion = document.createElement("option");
			nuevaOpcion.setAttribute("value", "");
			var texto = document.createTextNode("No hay sucursales que vendan este libro");
			nuevaOpcion.appendChild(texto);
			document.getElementById("sucursales").appendChild(nuevaOpcion);
		}
	}).catch(function (err) {
		console.log("Ocurrió un error con el fetch del jsonSuc: ", err);
		error("Error", "No se ha encontrado la sucursal con dicha id.", true, false);
	});
}).catch(function (err) {
	console.log("Ocurrió un error con el fetch del usuario.json: ", err);
	error("Error", "No se ha encontrado el libro con dicho id.", true, false);
});


function cambioSucursal() {
	var Sucursal = document.getElementById("sucursales").value;
	let isbnRef = document.location.href.split("/");
	fetch(document.location.href + "/" + Sucursal + "/sucursales")
	.then(function (response) {
			//console.log(response.url);
			if (response.status != 200)
				console.log("Ocurrió un error con el servicio: " + response.status);
			else
				return response.json();
		}).then(function (json) {
		//console.log(json);
		if (json != undefined && json != null && json != "") {
			document.getElementById("precio").innerHTML = "₡" + json;
			document.getElementById("carritoCompras").innerHTML = `<i onclick="carritoAdd('/carrito/agregar/${isbnRef[isbnRef.length-1]}/${Sucursal}');" class="fas fa-shopping-cart" aria-hidden="true"></i>`;
			//₡
		} else {
			document.getElementById("precio").innerHTML = "₡";
			document.getElementById("carritoCompras").innerHTML = "<i class=\"fas fa-shopping-cart\" aria-hidden=\"true\"></i>";
		}
	}).catch(function (err) {
		console.log("Ocurrió un error con el fetch del usuario.json: ", err);
		error("Error", "No se ha encontrado la sucursal con dicho id.", true, false);
	});
}

function carritoAdd(href) {
	fetch(href).then(function (response) {
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
	}).catch(function (error) {
		console.log(error);
		error("Error", "Favor intentar luego", true, false);
	});
}

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
			document.getElementById("menu3").innerHTML += "<a href=\"/logout\">Cerrar sesión</a>";

		} else {
			document.getElementById("menu3").innerHTML = "<a class='registrarLogin' href='./registrar'>Registrar</a> <a class='registrarLogin' href='./login'>Iniciar Sesión</a>";
		}



	}).catch(function (error) {
		console.log(error);
		error("Error", "Favor intentar luego", true, false);
	});

function calificarLibro () {
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
		error("Error", "No puede calificar este libro sin marcar una opcion primero", true, false);
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
				const libro = json.user.libros.find(lib => lib.isbn === Number(document.location.href.split("/")[document.location.href.split("/").length-1]));
				//console.log(libro);
				if(libro){
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
						if(!jsonLib.encontrado){ 
							//console.log("PUEDE CALIFICAR");
							document.getElementById("caja").classList.add("overlay");
							document.getElementById("calificarUsuario").classList.remove("ocultar");
							window.scrollTo(0, 0);
						} else {
							cancelar();
							error("Error", "Este libro solo puede ser calificado una vez", true, false);
						}
					}).catch(function (error) {
						console.log(error);
						error("Error", "Favor intentar luego", true, false);
					});
				} else {
					cancelar();
					error("Error", "Para calificar este libro, debe realizar una compra por él primero", true, false);
				}
			} else {
				cancelar();
				error("Error", "Usted no puede calificar un libro", true, false);
			}
		} else {
			cancelar();
			error("Error", "Debe registrarse para calificar un libro", true, false);
		}
	}).catch(function (error) {
		console.log(error);
		error("Error", "Favor intentar luego", true, false);
	});
}