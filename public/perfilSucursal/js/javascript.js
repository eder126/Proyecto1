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
	.then(function (response) {
		//console.log(response.url);
		if (response.status != 200)
			console.log("Ocurrió un error con el servicio: " + response.status);
		else
			return response.json();
	}).then(function (json) {
		//console.log(json);
		//Se asignan los valores a variables con nombres descriptivos

		var URLPerfil = json.imgPerfil;
		var Nombre = json.nombre;
		var Telefono = json.telefono;
		var Lat = json.direccion.coordenadas.lat;
		var Long = json.direccion.coordenadas.long;
		var CostoEnvio = json.costoEnvio;
		var Libros = json.libros[0];

		if(URLPerfil == " "){
			URLPerfil = "/perfilSucursal/img/user.png";
		}
		initMap(parseFloat(Lat), parseFloat(Long));

		document.getElementById("verInventario").setAttribute("href", "../buscarInventarioS/" + json.id);
		var pProSuc = document.createElement("p");
		pProSuc.appendChild(document.createTextNode("Provincia : " + json.direccion.provincia));
		var pCanSuc = document.createElement("p");
		pCanSuc.appendChild(document.createTextNode("Cantón: " + json.direccion.canton));
		var pDisSuc = document.createElement("p");
		pDisSuc.appendChild(document.createTextNode("Distrito: " + json.direccion.distrito));
		var pTelSuc = document.createElement("p");
		pTelSuc.appendChild(document.createTextNode("Teléfono +506 " + Telefono));
		var pCostoSuc = document.createElement("p");
		pCostoSuc.appendChild(document.createTextNode("Costo de envió ₡" + CostoEnvio + " / Km"));

		var LocalSucursal = document.getElementById("localidadSucursal");
		LocalSucursal.appendChild(pProSuc);
		LocalSucursal.appendChild(pCanSuc);
		LocalSucursal.appendChild(pDisSuc);
		LocalSucursal.appendChild(pTelSuc);
		LocalSucursal.appendChild(pCostoSuc);

		var labelNombre = document.getElementById("labelNombre");
		labelNombre.innerHTML = Nombre + labelNombre.innerHTML;

		//IMAGEN DE PERFIL del AUTOR
		if (URLPerfil != "" && URLPerfil) {
			document.getElementById("imagen").src = URLPerfil;
		}

		/*
    MEJOR LIBRO
    fetch(MejorLibro+"/listar/libros")
        .then(function(response) {
                //console.log(response.url);
                if (response.status != 200)
                console.log('Ocurrió un error con el servicio: ' + response.status);
                else
                return response.json();
        }).then(function(jsonLibroFav) {
            //console.log(jsonLibroFav);
            //IMAGEN
            var mejorLibroImg = document.createElement('img');
            mejorLibroImg.setAttribute('src',jsonLibroFav.url);//Se asigna el atributo src a la imagen
            mejorLibroImg.setAttribute('alt','Imagen no disponible');//Se asigna el atributo alt a la imagen
            var mejorLibroEnlace = document.createElement('a');
            mejorLibroEnlace.setAttribute("href", "../perfilLibro/"+jsonLibroFav.isbn);
            mejorLibroEnlace.appendChild(mejorLibroImg);
            document.getElementById('mejorVendidoLibro').appendChild(mejorLibroEnlace);//La imagen es hijo del contenedor de libro
        }).catch(function(err) {
            console.log('Ocurrió un error con el fetch', err);
        });*/

		//FETCH DE LOS LIBROS DE LA SUCURSAL
		if (Libros.length == 0 || Libros == []) {
			document.getElementById("noLibros").classList.toggle("NOLIBROS");
		} else {
			for (var i = 0; i < Libros.length; i++) {
				console.log("aca", Libros[i]);
				fetch(document.location.href + "/" + Libros[i].isbn + "/listar/libros")
					.then(function (response) {
						//console.log(response.url);
						if (response.status != 200)
							console.log("Ocurrió un error con el servicio: " + response.status);
						else
							return response.json();
					}).then(function (jsonLibro) {
						//console.log(jsonLibro);
						//DIV que contiene el div de imagen y el boton
						var divContenedor = document.createElement("div");
						divContenedor.className = "contenedorLibrosPerfil"; //Se asigna la clase al DIV
						//DIV que contiene la imagen del libro
						var divLibroCont = document.createElement("div");
						divLibroCont.className = "libroContenedor"; //Se asigna la clase al DIV
						//DIV que contiene precio y el boton de carrito
						var divinformacionCont = document.createElement("div");
						divinformacionCont.className = "informacionLibroContenedor"; //Se asigna la clase al DIV

						var precio = document.createElement("p");
						var anchor = document.createElement("a");
						var iframe = document.createElement("i");

						precio.appendChild(document.createTextNode("₡" + jsonLibro.precio));
						iframe.className = "fas fa-shopping-cart";
						anchor.appendChild(iframe);

						divinformacionCont.appendChild(precio);
						divinformacionCont.appendChild(anchor);

						//IMAGEN
						var imgLibro = document.createElement("img");
						console.log(jsonLibro);
						imgLibro.setAttribute("src", jsonLibro.url); //Se asigna el atributo src a la imagen
						imgLibro.setAttribute("alt", "Imagen no disponible"); //Se asigna el atributo alt a la imagen
						imgLibro.className = "libro"; //Se asigna la clase al DIV

						var libroEnlace = document.createElement("a");
						libroEnlace.setAttribute("href", "../perfilLibro/" + jsonLibro.isbn);
						libroEnlace.appendChild(imgLibro);

						var LibrosPerfil = document.getElementById("librosPerfil"); //DIV padre/wrapper que contiene que contenedor de libro


						divLibroCont.appendChild(libroEnlace); //La imagen es hijo del contenedor de libro
						divLibroCont.appendChild(divinformacionCont);

						divContenedor.appendChild(divLibroCont); //El contenedor de libro es hijo del contenedor
						//divContenedor.appendChild(divinformacionCont); //El contenedor de precio e icono es hijo del contenedor

						LibrosPerfil.appendChild(divContenedor); //El contenedor es hijo del contenedor padre/wrapper
					})
					.catch(function (err) {
						console.log("Ocurrió un error con el fetch de libros.json: ", err);
						error("Error", "No se han encontrado los libros de dicha sucursal.", true, false);
					});
			}
		}
	}).catch(function (err) {
		console.log("Ocurrió un error con el fetch del sucursal.json: ", err);
		error("Error", "No se ha encontrado la sucursal con el id dado.", true, false);
	});

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