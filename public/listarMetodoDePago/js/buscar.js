listar();
function listar(){
	fetch("/listarMetodoDePago/me").then(function (response) {
		if (response.status != 200) {
			console.log("Ocurrió un error con el servicio: " + response.status);
			error("Error", "Favor intentar luego", true, false);
		} else {
			return response.json();
		}
	}).then(function (json) {
		console.log(json);
		document.getElementById("lista").innerHTML = "";
		let arr = json;
		arr.forEach(item => {
			let nuevo = document.createElement("li");
			nuevo.innerHTML = `${item.n_tarjeta} ${devolverFecha(item.vencimiento)}  <img class="imgCentradaTipo" src="listarMetodoDePago/img/${img(item.tipo)}.png" id="${item.tipo}">
			<a href="/editarMetodoDePago/${item.id}"><button type="button" class="btnAzul btnPequenno">Editar</button></a>
			<a href=""><button type="button" onclick="eliminar('${item.id}');" class="btnRojo btnPequenno">Eliminar</button></a>`;
			document.getElementById("lista").appendChild(nuevo);
		});
	
	}).catch(function (err) {
		console.log("Ocurrió un error con el fetch del usuario.json: ", err);
		error("Error", "Ha ocurrido un error.", true, false);
		event.preventDefault();
		return false;
	});
}


function img(tipo) {
	if(tipo == "Visa"){
		return "visa30";
	} else if(tipo == "MasterCard"){
		return "mastercard30";
	} else if(tipo == "Amex"){
		return "amex30";
	} else if(tipo == "Discover"){
		return "discover30";
	}
}

function devolverFecha(fecha){
	let f = new Date(fecha);
	return f.getMonth()+"/"+f.getFullYear();
}


function eliminar(id) {

	fetch("/editarMetodoDePago/eliminar/" + id).then(
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
			if (json.eliminado) {
				listar();
			}


		});


	event.preventDefault();
	return false;
}