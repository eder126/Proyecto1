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
				enlaceSucursal.setAttribute("href", "../buscarInventario/" + jsonSucursal[i].id);
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