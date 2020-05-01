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
		window.location.href = "http://localhost:8080/";
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

//FETCH CONSIGUE Y ASIGNA LOS VALORES
//fetch('./listar')
fetch(document.location.href + "/listar")
	.then(
		function (response) {
			console.log(response.url);
			if (response.status != 200)
				console.log("Ocurrió un error con el servicio: " + response.status);
			else
				return response.json();
		})
	.then(function (json) {
		//console.log(json);
		//Se asignan los valores a variables con nombres descriptivos

		var URLPerfil = json.imgPerfil;
		var NombreFantasia = json.nombreFantasia;
		var Lat = json.direccion.coordenadas.lat;
		var Long = json.direccion.coordenadas.long;

		if(URLPerfil == " "){
			URLPerfil = "/perfilLibreria/img/user.png";
		}
		initMap(parseFloat(Lat), parseFloat(Long));

		var pProLib = document.createElement("p");
		pProLib.appendChild(document.createTextNode("Provincia : " + json.direccion.provincia));
		var pCanLib = document.createElement("p");
		pCanLib.appendChild(document.createTextNode("Cantón: " + json.direccion.canton));
		var pDisLib = document.createElement("p");
		pDisLib.appendChild(document.createTextNode("Distrito: " + json.direccion.distrito));

		var LocalLibreria = document.getElementById("localidadLibreria");
		LocalLibreria.appendChild(pProLib);
		LocalLibreria.appendChild(pCanLib);
		LocalLibreria.appendChild(pDisLib);
		var labelNombre = document.getElementById("labelNombre");
		labelNombre.innerHTML = NombreFantasia + labelNombre.innerHTML;

		//IMAGEN DE PERFIL del AUTOR
		if (URLPerfil != "" && URLPerfil) {
			document.getElementById("imagen").src = URLPerfil;
		}

		
		//FETCH DE LAS SUCURSALES REGISTRADAS POR LA LIBRERIA
		//Recorre uno a uno las sucursales que el usuario registro
		fetch(document.location.href + "/sucursales")
			.then(function (response) {
				//console.log(response.url);
				if (response.status != 200)
					console.log("Ocurrió un error con el servicio: " + response.status);
				else return response.json();
			}).then(function (jsonSucursal) {
				console.log(jsonSucursal);
				if (jsonSucursal != null && jsonSucursal != [] && jsonSucursal != undefined && jsonSucursal.length != 0) {
					for (var i = 0; i < jsonSucursal.length; i++) {

						var SucursalesPerfil = document.getElementById("sucursalesPerfil"); //DIV padre/wrapper que contiene que contenedor de libro

						var divSucursalSeparador = document.createElement("div");
						divSucursalSeparador.className = "sucursalSeparador";

						var divSucursalContenedor = document.createElement("div");
						divSucursalContenedor.className = "sucursalContenedor";
						var parrafoSucursal = document.createElement("p");
						parrafoSucursal.appendChild(document.createTextNode(jsonSucursal[i].nombre));

						divSucursalContenedor.appendChild(parrafoSucursal);
						var enlaceSucursal = document.createElement("a");
						enlaceSucursal.setAttribute("href", "../perfilSucursal/" + jsonSucursal[i].id);
						enlaceSucursal.appendChild(divSucursalContenedor);
						divSucursalSeparador.appendChild(enlaceSucursal);

						SucursalesPerfil.appendChild(divSucursalSeparador); //El contenedor es hijo del contenedor padre/wrapper
					}
				} else {
					document.getElementById("noSucursales").classList.toggle("NOSUCURSALES");
				}
			})
			.catch(function (err) {
				console.log("Ocurrió un error con el fetch", err);
				error("Error", "No se ha encontrado la libreria con el id dado.", true, false);
			});
	})
	.catch(function (err) {
		console.log("Ocurrió un error con el fetch del usuario.json: ", err);
		error("Error", "No se ha encontrado la libreria con el id dado.", true, false);
	});

function buscar() {
	const query = document.getElementById("query");

	fetch(document.location.href+"/buscarSucursales", {
		method: "POST",
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			query: query.value
		})
	}).then(function (response) {
		if (response.status != 200) {
			console.log("Ocurrió un error con el servicio: " + response.status);
			error("Error", "Favor intentar luego", true, false);
		} else {
			return response.json();
		}
	}).then(function (json) {
		document.getElementById("sucursalesPerfil").innerHTML = "";
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
		if (json.datos) {
			calculos(json.datos);
		} else if (!json.alerta && !json.datos) {
			error("Error", "No se ha encontrado ningún usuario.", true, false);
		}
	}).catch(function (error) {
		console.log(error);
		error("Error", "Favor intentar luego", true, false);
	});
}

let sucursalesArr = [];

function agregar(datos) {
	let sucursales = document.getElementById("sucursalesPerfil");
	sucursales.innerHTML = sucursales.innerHTML + 
	`<div class="sucursalSeparador">
		<a href="../perfilSucursal/${datos.id}">
			<div class="sucursalContenedor">
				<p>${datos.nombre}</p>
			</div>
		</a>
	</div>`;
}

function calculos(datos) {
	sucursalesArr = datos;
	let cantidad = sucursalesArr.length;
	//console.log("aca", cantidad);
	for (let i = 0; i < cantidad; i++) {
		agregar(sucursalesArr[0]);
		sucursalesArr.shift();
	}
}

// Inicializa y annade el mapa

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