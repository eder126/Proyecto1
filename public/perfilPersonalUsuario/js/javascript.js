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
	document.getElementById("mostrarMapaUsuario").classList.add("ocultar");
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
	document.getElementById("mostrarMapaUsuario").classList.remove("ocultar");
	window.scrollTo(0, 0);
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
		console.log(json);
		//Se asignan los valores a variables con nombres descriptivos
		var Nombre = json.nombre;
		var Apellido = json.apellido;
		var Apellido2 = json.apellido2;
		var Libros = json.libros;
		var Correo = json.email;
		var ID = json.id;
		var Tel = json.tel;
		//var Unido = json.creado;
		var Unido = new Date(json.creado);
		var URLPerfil = json.url;
		var Lat = json.direccion.coordenadas.lat;
		var Long = json.direccion.coordenadas.long;

		if(URLPerfil == " "){
			URLPerfil = "/perfilPersonalUsuario/img/user.png";
		}
		//******Se realizan los cambios en el sitio web**********
		//Se crear el elemento P
		var parrafoNombre = document.createElement("p");
		//Se concatena el nombre y los apellidos en un TextNode
		var NombreNode = document.createTextNode(Nombre + " " + Apellido + " " + Apellido2);
		//Se le asigna el TextNode al elemento P
		parrafoNombre.appendChild(NombreNode);
		//Se asigna al div "nombrePerfil" el hijo "parrafoNombre" que contiene los datos anteriores
		document.getElementById("nombrePerfil").appendChild(parrafoNombre);

		document.getElementById("correo").innerHTML += Correo;
		document.getElementById("id").innerHTML += ID;
		document.getElementById("telefono").innerHTML += Tel;

		var dia = Unido.getDate();
		var mes = Unido.getMonth();
		var anno = Unido.getFullYear();
		var mesString = "";
		mes == 0 ? mesString="Enero": mes;
		mes == 1 ? mesString="Febrero":mes;
		mes == 2 ? mesString="Marzo":mes;
		mes == 3 ? mesString="Abril":mes;
		mes == 4 ? mesString="Mayo":mes;
		mes == 5 ? mesString="Junio":mes;
		mes == 6 ? mesString="Julio":mes;
		mes == 7 ? mesString="Agosto":mes;
		mes == 8 ? mesString="Setiembre":mes;
		mes == 9 ? mesString="Octubre":mes;
		mes == 10 ? mesString="Noviembre":mes;
		mes == 11 ? mesString="Diciembre":mes;
		
		//document.getElementById("creado").innerHTML += formatDate(Unido);
		document.getElementById("creado").innerHTML += dia+" de "+mesString+" del "+anno;

		//IMAGEN DE PERFIL del AUTOR
		if (URLPerfil != "" && URLPerfil != undefined && URLPerfil != null) {
			document.getElementById("imagen").src = URLPerfil;
		}

		//console.log("LAT: " + Lat);
		//console.log("LONG: " + Long);
		initMap(parseFloat(Lat), parseFloat(Long));


		var pProSuc = document.createElement("p");
		pProSuc.appendChild(document.createTextNode("Provincia : " + json.direccion.provincia));
		var pCanSuc = document.createElement("p");
		pCanSuc.appendChild(document.createTextNode("Cantón: " + json.direccion.canton));
		var pDisSuc = document.createElement("p");
		pDisSuc.appendChild(document.createTextNode("Distrito: " + json.direccion.distrito));
		var pLatSuc = document.createElement("p");
		pLatSuc.appendChild(document.createTextNode("Latitud: " + Lat));
		var pLongSuc = document.createElement("p");
		pLongSuc.appendChild(document.createTextNode("Longitud: " + Long));

		var LocalSucursal = document.getElementById("localidadUsuario");
		LocalSucursal.appendChild(pProSuc);
		LocalSucursal.appendChild(pCanSuc);
		LocalSucursal.appendChild(pDisSuc);
		LocalSucursal.appendChild(pLatSuc);
		LocalSucursal.appendChild(pLongSuc);

		//FETCH DE LOS LIBROS DEL USUARIO
		//Recorre uno a uno los libros que el usuario compro
		//console.log("Libros: "+Libros);
		var enlaceEditar = document.createElement("a");
		enlaceEditar.setAttribute("href", document.location.href+"/editarPerfilPersonalUsuario/");
		enlaceEditar.appendChild(document.getElementById("botonEditar"));
		document.getElementById("contenedorBotonEditar").appendChild(enlaceEditar);

		if (json.rol == 1) {
			//document.getElementById("visitarLibreria").classList.remove("noMostrar");
			document.getElementById("botonLibros").classList.add("noMostrar");
			document.getElementById("calificacionPerfil").classList.add("noMostrar");
			document.getElementById("botonLibreria").classList.remove("noMostrar");

			var enlaceLibreria = document.createElement("a");
			enlaceLibreria.setAttribute("href", "../perfilLibreriaPersonal/");
			enlaceLibreria.appendChild(document.getElementById("botonLibreria"));
			document.getElementById("contenedorBotonLibreria").appendChild(enlaceLibreria);
		} else if (json.rol == 0) {
			document.getElementById("botonLibreria").classList.add("noMostrar");
			document.getElementById("calificacionPerfil").classList.remove("noMostrar");
			document.getElementById("botonLibros").classList.remove("noMostrar");

			var enlaceLibros = document.createElement("a");
			enlaceLibros.setAttribute("href", "/librosPersonales");
			enlaceLibros.appendChild(document.getElementById("botonLibros"));
			document.getElementById("contenedorBotonLibros").appendChild(enlaceLibros);
			//La funcion calificacion se encuentra en el archivo "calificacion.js" en la carpeta js
			var Calificacion = json.calificacion;
			calificacion(Calificacion);
		} else if (json.rol == 2) {
			document.getElementById("calificacionPerfil").classList.add("noMostrar");
			document.getElementById("botonLibros").classList.add("noMostrar");
			//document.getElementById("visitarLibreria").classList.add("noMostrar");
			document.getElementById("botonLibreria").classList.add("noMostrar");
		}
	}).catch(function (err) {
		console.log("Ocurrió un error con el fetch del usuario.json: ", err);
	});

// Inicializa y annade el mapa
function initMap(Lat, Long) {
	var mapDiv = document.getElementById("map");
	var latlng = new google.maps.LatLng(Lat, Long);
	var uluru = {
		lat: Number(Lat),
		lng: Number(Long)
	};
	var mapOptions = {
		zoom: 15,
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

function formatDate(date) {
	var d = new Date(date),
		month = "" + (d.getMonth() + 1),
		day = "" + d.getDate(),
		year = d.getFullYear();

	if (month.length < 2) month = "0" + month;
	if (day.length < 2) day = "0" + day;

	return [year, month, day].join("-");
}

function getUnique(arr,comp){
	//store the comparison  values in array
const unique =  arr.map(e=> e[comp]). 
  // store the keys of the unique objects
  map((e,i,final) =>final.indexOf(e) === i && i) 
  // eliminate the dead keys & return unique objects
 .filter((e)=> arr[e]).map(e=>arr[e]);
return unique;
}