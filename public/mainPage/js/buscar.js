let librosArr = [];

function agregar(datos) {
	console.log(datos);
	let libros = document.getElementById("libros");
	//
	libros.innerHTML = `${libros.innerHTML} <div class="cajaLibro">
	<div class="fotoLibro">
		<img src="${datos.img}">
	</div>
	<div class="datosPerfil">
	<a href="../perfilLibro/${datos.ISBN}"><span class="tituloLibro">${datos.nombre}</span></a>
	</div>
</div></a>`;

}


function calculos(datos) {
	librosArr = datos;
	for (let i = 0; i < librosArr.length; i++) {
		agregar(librosArr[i]);
	}
}

fetch("/libro")
	.then(
		function (response) {
			//console.log(response.url);
			if (response.status != 200)
				console.log("Ocurrió un error con el servicio: " + response.status);
			else
				return response.json();
		})
	.then(function (json) {
		console.log(json);
		calculos(json);

	})
	.catch(function (err) {
		console.log("Ocurrió un error con el fetch del usuario.json: ", err);
	});


fetch("/clubMasPersonas")
	.then(
		function (response) {
			//console.log(response.url);
			if (response.status != 200)
				console.log("Ocurrió un error con el servicio: " + response.status);
			else
				return response.json();
		})
	.then(function (json) {
		document.getElementById("imgClubLectura").src = json.club.url;
		document.getElementById("cantClubLectura").innerHTML = json.club.miembros;
		document.getElementById("anchorClubLectura").href = "/perfilClub/" + json.club.id;
		document.getElementById("nombreClubLectura").innerHTML = json.club.nombre;

	})
	.catch(function (err) {
		console.log("Ocurrió un error con el fetch del usuario.json: ", err);
	});


fetch("/librosDestacado")
	.then(
		function (response) {
			//console.log(response.url);
			if (response.status != 200)
				console.log("Ocurrió un error con el servicio: " + response.status);
			else
				return response.json();
		})
	.then(function (json) {
		document.getElementById("libroDestacado0").src = json[0].img;
		document.getElementById("libroDestacadoAnchor0").href = "/perfilLibro/"+json[0].ISBN;
		document.getElementById("libroDestacado1").src = json[1].img;
		document.getElementById("libroDestacadoAnchor1").href = "/perfilLibro/"+json[1].ISBN;
		document.getElementById("libroDestacado2").src = json[2].img;
		document.getElementById("libroDestacadoAnchor2").href = "/perfilLibro/"+json[2].ISBN;

	})
	.catch(function (err) {
		console.log("Ocurrió un error con el fetch del usuario.json: ", err);
	});