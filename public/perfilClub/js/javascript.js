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
	document.getElementById("mapaSucursal").classList.add("ocultar");
	document.getElementById("btnAceptar").classList.remove("ocultar");
	document.getElementById("btnCancelar").classList.remove("ocultar");
}

function aceptar() {
	if (document.getElementById("tituloAdv").innerHTML == `<i class="fas fa-check" style="color: #009688;" aria-hidden="true"></i>`) {
		const club = document.location.href.split("/");
		window.location.href = club[0]+"//"+club[2]+"/"+club[3]+"/"+club[4];
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
	window.scrollTo(0, 0);
}

function mostrarMapa() {
	document.getElementById("caja").classList.add("overlay");
	document.getElementById("mapaSucursal").classList.remove("ocultar");
	window.scrollTo(0, 0);
}

var map;
var geocoder;
var marker;

function initMap(lat, long) {
	geocoder = new google.maps.Geocoder();
	map = new google.maps.Map(document.getElementById("map"), {
		center: {
			lat: lat,
			lng: long
		},
		zoom: 18,
		mapTypeId: google.maps.MapTypeId.HYBRID
	});
	marker = new google.maps.Marker({
		map: map,
		draggable: false,
		animation: google.maps.Animation.DROP,
		position: {
			lat: lat,
			lng: long
		}
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


fetch("/user/datos").then( 
	function(response){
		if(response.status != 200){
			console.log("Ocurrió un error con el servicio: " + response.status);
			error("Error", "Favor intentar luego", true, false);
		} else {
			return response.json();
		}
	}).then(function(json){
		//console.log(json);
		//FETCH CONSIGUE Y ASIGNA LOS VALORES
		//fetch('./listar')
		fetch(document.location.href + "/listar")
		.then(function (response) {
			//console.log(response.url);
			if (response.status != 200)
				console.log("Ocurrió un error con el servicio: " + response.status);
			else
				return response.json();
		}).then(function (jsonClub) {
			//console.log(jsonClub);
			//Se asignan los valores a variables con nombres descriptivos

			var URLPerfil = jsonClub.url;
			var Nombre = jsonClub.nombre;
			var Descripcion = jsonClub.descripcion;

			var Modalidad = jsonClub.presencial;

			if (URLPerfil != " " && URLPerfil) {
				document.getElementById("imagen").src = URLPerfil;
			}
			document.getElementById("nombre").innerHTML = Nombre;
			
			/*FALTA VALIDAR AL ADMIN Y LIBRERIAS CON ROL*/
			if(json.loggeado){
				if(Number(json.user.usuarioId) === Number(jsonClub.creadorId) || Number(json.user.rol) === 2){
					document.getElementById("botonUnirse").innerHTML = "Editar";
					document.getElementById("botonUnirse").classList.add("editar");
				} else if(Number(json.user.rol) === 1){
					document.getElementById("botonUnirse").classList.add("noBoton");
				} else {
					var botonUnir = jsonClub.miembros.find(TEMP => TEMP.usuarioId ===  Number(json.user.usuarioId));
					if(botonUnir){
						document.getElementById("botonUnirse").innerHTML = "Salir";
						document.getElementById("botonUnirse").classList.add("miembro");
						document.getElementById("botonUnirse").setAttribute("onClick","retirarseClub(event);");
					} else {
						document.getElementById("botonUnirse").innerHTML = "Unirse";
						document.getElementById("botonUnirse").classList.add("noMiembro");
						document.getElementById("botonUnirse").setAttribute("onClick","unirseClub(event);");
					}
				}
			} else {
				console.log("llego aqui" + json.loggeado);
				document.getElementById("botonUnirse").innerHTML = "Inicia Sesión";
				document.getElementById("botonUnirse").classList.add("noMiembro");
				document.getElementById("botonUnirse").setAttribute("onClick","window.location='localhost:8080/login';");
				//onclick="window.location='http://www.example.com';"
			}

			document.getElementById("descripcion").innerHTML = Descripcion;

			var Dia = jsonClub.dia;
			var Hora = jsonClub.hora;

			if(Dia == "0"){
				Dia = "Lunes";
			} else if(Dia == "1"){
				Dia = "Martes";
			} else if(Dia == "2"){
				Dia = "Miércoles";
			} else if(Dia == "3"){
				Dia = "Jueves";
			} else if(Dia == "4"){
				Dia = "Viernes";
			} else if(Dia == "5"){
				Dia = "Sabado";''
			} else if(Dia == "6"){
				Dia = "Domingo";
			}

			document.getElementById("reuniones").innerHTML += Dia + " - " + Hora;


			console.log(jsonClub.miembros);
			if(Modalidad){
				//console.log("Presencial");
				document.getElementById("modalidad").innerHTML += "Presencial";
				/*document.getElementById("botonModalidad").innerHTML = "Ver ubicación";
				document.getElementById("botonModalidad").onclick = mostrarMapa;*/
				document.getElementById("botonModalidad").classList.add("noMostrar");

				fetch(jsonClub.sucursal + "/sucursal")
				.then(function (response) {
				//console.log(response.url);
					if (response.status != 200)
						console.log("Ocurrió un error con el servicio: " + response.status);
					else
						return response.json();
				}).then(function (jsonSucursal) {
					//console.log(jsonSucursal);
					initMap(Number(jsonSucursal.direccion.coordenadas.lat),Number(jsonSucursal.direccion.coordenadas.long));
					document.getElementById("sucursal").innerHTML = jsonSucursal.nombre;
				}).catch(function (err) {
					console.log("Ocurrió un error con el fetch del sucursal.jsonClub: ", err);
					error("Error", "No se ha encontrado la sucursal con el id dado.", true, false);
				});
			} else {
				//console.log("Virtual");
				document.getElementById("modalidad").innerHTML += "Virtual";
				document.getElementById("botonModalidad").innerHTML = "Chat";
				document.getElementById("contenedorNombre").classList.add("noMostrar");
				document.getElementById("contenedorMapa").classList.add("noMostrar");


				fetch(jsonClub.id + "/chat")
				.then(function (response) {
				//console.log(response.url);
					if (response.status != 200)
						console.log("Ocurrió un error con el servicio: " + response.status);
					else
						return response.json();
				}).then(function (jsonChat) {
					if(jsonChat.encontrado){
						//document.getElementById("botonModalidad");//jsonChat.idChat;
						document.getElementById("botonModalidad").setAttribute("onClick",`redireccionar(${jsonChat.idChat});`);
					}
					//document.getElementById("botonModalidad")
				}).catch(function (err) {
					console.log("Ocurrió un error con el fetch del sucursal.jsonClub: ", err);
					error("Error", "No se ha encontrado el club con el id dado.", true, false);
				});
			}

			fetch(jsonClub.genero + "/genero")
			.then(function (response) {
			//console.log(response.url);
				if (response.status != 200)
					console.log("Ocurrió un error con el servicio: " + response.status);
				else
					return response.json();
			}).then(function (jsonGenero) {
				if(jsonGenero){
					document.getElementById("genero").innerHTML += jsonGenero.nombre;
				} else {
					error("Error", "El género de este club ya no esta disponible", true, false);
				}
			}).catch(function (err) {
				console.log("Ocurrió un error con el fetch del GENERO: ", err);
				error("Error", "El género de este club ya no esta disponible", true, false);
			});

			fetch(jsonClub.libro + "/libro")
			.then(function (response) {
			//console.log(response.url);
				if (response.status != 200)
					console.log("Ocurrió un error con el servicio: " + response.status);
				else
					return response.json();
			}).then(function (jsonLibro) {
				if(jsonLibro){
					document.getElementById("libro").innerHTML = jsonLibro.nombre;
					document.getElementById("libro").href = "/perfilLibro/"+jsonClub.libro;
				} else {
					error("Error", "El género de este club ya no esta disponible", true, false);
				}
			}).catch(function (err) {
				console.log("Ocurrió un error con el fetch del GENERO: ", err);
				error("Error", "El género de este club ya no esta disponible", true, false);
			});
		}).catch(function (err) {
			console.log("Ocurrió un error con el fetch del club.jsonClub: ", err);
			error("Error", "No se ha encontrado el club con el id dado", true, false);
		});
	}).catch(function (error){
		console.log(error);
		error("Error","Favor intentar luego", true, false);
	});

	function redireccionar(idChat){
		window.location=`http://localhost:8080/chatG/${idChat}`;
	}

function unirseClub (event){
	fetch("/user/datos").then( 
	function(response){
		if(response.status != 200){
			console.log("Ocurrió un error con el servicio: " + response.status);
			error("Error", "Favor intentar luego", true, false);
		} else {
			return response.json();
		}
	}).then(function(jsonUsuario){
		if(jsonUsuario.loggeado){
			fetch(document.location.href + "/miembros")
			.then(function (response) {
			//console.log(response.url);
				if (response.status != 200)
					console.log("Ocurrió un error con el servicio: " + response.status);
				else
					return response.json();
			}).then(function (jsonMiembros) {
				console.log(jsonMiembros);
				if(!jsonMiembros.encontrado){
					fetch(document.location.href + "/clubes")
					.then(function (response) {
						//console.log(response.url);
						if (response.status != 200)
							console.log("Ocurrió un error con el servicio: " + response.status);
						else return response.json();
					}).then(function (jsonClubes) {
						if(!jsonClubes.encontrado){
							fetch(document.location.href+"/unirse")
							.then(function (response) {
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
							}).catch(function (error) {
								console.log("Ocurrió un error con el fetch del UNIRSE", error);
								error("Error", "Favor intentar mas tarde", true, false);
								event.preventDefault();
								return false;
							});
						} else {
							error("Error", "Usted ya es miembro de otro Club de Lectura", true, false);
							event.preventDefault();
							return false;
						}
					}).catch(function (error) {
						console.log("Ocurrió un error con el fetch del CLUBES", error);
						error("Error", "Favor intentar mas tarde", true, false);
						event.preventDefault();
						return false;
					});
				} else {
					error("Error", "Usted ya forma parte de este club", true, false);
					event.preventDefault();
					return false;
				}
			}).catch(function (error) {
				error("Error", "No se ha encontrado el Club", true, false);
				event.preventDefault();
				return false;
			});
		} else {
			error("Error", "Debe iniciar sesión para formar parte del Club", true, false);
			event.preventDefault();
			return false;
		}
	}).catch(function (error){
		error("Error","Favor intentar luego", true, false);
		event.preventDefault();
		return false;
	});
	event.preventDefault();
	return false;
}

function retirarseClub(event){
	fetch("/user/datos").then( 
		function(response){
			if(response.status != 200){
				console.log("Ocurrió un error con el servicio: " + response.status);
				error("Error", "Favor intentar luego", true, false);
			} else {
				return response.json();
			}
		}).then(function(jsonUsuario){
			if(jsonUsuario.loggeado){
				fetch(document.location.href + "/miembros")
				.then(function (response) {
				//console.log(response.url);
					if (response.status != 200)
						console.log("Ocurrió un error con el servicio: " + response.status);
					else
						return response.json();
				}).then(function (jsonMiembros) {
					if(jsonMiembros.encontrado){
						fetch(document.location.href+"/retirarse")
						.then(function (response) {
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
						}).catch(function (error) {
							console.log("Ocurrió un error con el fetch del UNIRSE", error);
							error("Error", "Favor intentar mas tarde", true, false);
							event.preventDefault();
							return false;
						});
					} else {
						error("Error", "Usted no forma parte de este club", true, false);
						event.preventDefault();
						return false;
					}
				}).catch(function (error) {
					error("Error", "No se ha encontrado el Club", true, false);
					event.preventDefault();
					return false;
				});
			} else {
				error("Error", "Debe iniciar sesión para formar parte del Club", true, false);
				event.preventDefault();
				return false;
			}
		}).catch(function (error){
			error("Error","Favor intentar luego", true, false);
			event.preventDefault();
			return false;
		});
	event.preventDefault();
	return false;
}