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
	document.getElementById("btnAceptar").classList.remove("ocultar");
	document.getElementById("btnCancelar").classList.remove("ocultar");
}
        
function aceptar(){
	if(document.getElementById("tituloAdv").innerHTML == `<i class="fas fa-check" style="color: #009688;" aria-hidden="true"></i>`){
		window.location.href = "http://localhost:8080/";
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

//FETCH CONSIGUE Y ASIGNA LOS VALORES
//fetch('./listar')
fetch(document.location.href+"/listar")
.then(
	function(response) {
		//console.log(response.url);
		if (response.status != 200)
			console.log("Ocurrió un error con el servicio: " + response.status);
		else
			return response.json();
	})
.then(function(json) {
	console.log(json);
	//Se asignan los valores a variables con nombres descriptivos
	var Nombre = "";

	if(json.alias != ""){
		Nombre = json.alias;
	} else {
		Nombre = json.nombre;
	}
	var Descripcion = json.descripcion;
	var ImagenURL = json.imagenPerfil;
	if(ImagenURL == " "){
		ImagenURL = "/perfilAutor/img/user.png";
	}

	//******Se realizan los cambios en el sitio web**********
	//Se crear el elemento P del NOMBRE del AUTOR
	var parrafoNombre = document.createElement("p");
	//Se concatena el nombre y los apellidos en un TextNode
	var NombreNode = document.createTextNode(Nombre);
	//Se le asigna el TextNode al elemento P
	parrafoNombre.appendChild(NombreNode);
	//Se asigna al div "nombrePerfil" el hijo "parrafoNombre" que contiene los datos anteriores
	document.getElementById("nombrePerfil").appendChild(parrafoNombre);

	var fecha = new Date(json.nacimiento);
	var dia = fecha.getDate();
    var mes = fecha.getMonth();
    var anno = fecha.getFullYear();
    var mesString = "";
    mes == 0 ? mesString="enero": mes;
    mes == 1 ? mesString="febrero":mes;
    mes == 2 ? mesString="marzo":mes;
    mes == 3 ? mesString="abril":mes;
    mes == 4 ? mesString="mayo":mes;
    mes == 5 ? mesString="junio":mes;
    mes == 6 ? mesString="julio":mes;
    mes == 7 ? mesString="agosto":mes;
    mes == 8 ? mesString="setiembre":mes;
    mes == 9 ? mesString="octubre":mes;
    mes == 10 ? mesString="noviembre":mes;
    mes == 11 ? mesString="diciembre":mes;
	var parrafoNacimiento = document.createElement("p");
	parrafoNacimiento.innerHTML = calculate_age(new Date(anno,mes,dia)) + " años ("+dia+"/"+mesString+"/"+anno+")";
	document.getElementById("nacimientoPerfil").appendChild(parrafoNacimiento);
	//console.log(calculate_age(new Date(anno,mes,dia)));

	//Se crear el elemento P de la DESCRIPCION del AUTOR
	var parrafoDescripcion = document.createElement("p");
	//Se concatena el nombre y los apellidos en un TextNode
	var DescripcionNode = document.createTextNode(Descripcion);
	//Se le asigna el TextNode al elemento P
	parrafoDescripcion.appendChild(DescripcionNode);
	//Se asigna al div "descripcionPerfil" el hijo "parrafoDescripcion" que contiene los datos anteriores
	document.getElementById("descripcionPerfil").appendChild(parrafoDescripcion);

	//IMAGEN DE PERFIL del AUTOR
	if(ImagenURL != "" && ImagenURL != undefined && ImagenURL != null){
		document.getElementById("portada").src = ImagenURL;
	}

	//FETCH DE LOS LIBROS DEL USUARIO
	//Recorre uno a uno los libros que el usuario compro
	//console.log(Libros);
	fetch(document.location.href+"/libros")
		.then(function(response) {
			//console.log(response.url);
			if (response.status != 200)
				console.log("Ocurrió un error con el servicio: " + response.status);
			else return response.json();
		}).then(function(jsonLibro) {
			console.log(jsonLibro);
			if(jsonLibro != null && jsonLibro != [] && jsonLibro != undefined && jsonLibro.length != 0){
				for(var i = 0; i < jsonLibro.length; i++){
					//console.log(jsonLibro);
					//DIV que contiene el div de imagen y el boton
					var divContenedor = document.createElement("div");
					divContenedor.className = "contenedorLibrosPerfil";//Se asigna la clase al DIV
					//DIV que contiene la imagen del libro
					var divLibroCont = document.createElement("div");
					divLibroCont.className = "libroContenedor";//Se asigna la clase al DIV
					//IMAGEN
					var imgLibro = document.createElement("img");
					imgLibro.setAttribute("src",jsonLibro[i].img);//Se asigna el atributo src a la imagen
					imgLibro.setAttribute("alt","Imagen no disponible");//Se asigna el atributo alt a la imagen
					imgLibro.className = "libro";//Se asigna la clase al DIV

					var enlaceLibro = document.createElement("a");
					enlaceLibro.setAttribute("href","../perfilLibro/"+jsonLibro[i].ISBN);
					enlaceLibro.appendChild(imgLibro);

					var LibrosPerfil = document.getElementById("librosPerfil");//DIV padre/wrapper que contiene que contenedor de libro

					divLibroCont.appendChild(enlaceLibro);//La imagen es hijo del contenedor de libro

					divContenedor.appendChild(divLibroCont);//El contenedor de libro es hijo del contenedor

					LibrosPerfil.appendChild(divContenedor);//El contenedor es hijo del contenedor padre/wrapper
				}
			} else {
				document.getElementById("noLibros").classList.toggle("NOLIBROS");
			}
		})
		.catch(function(err) {
			console.log("Ocurrió un error con el fetch", err);
		});
}).catch(function(err) {
	console.log("Ocurrió un error con el fetch del usuario.json: ", err);
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

function calculate_age(dob) { 
	var diff_ms = Date.now() - dob.getTime();
	var age_dt = new Date(diff_ms); 
	
	return Math.abs(age_dt.getUTCFullYear() - 1970);
}