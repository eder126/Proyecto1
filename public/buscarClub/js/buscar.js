buscar();

function buscar() {
	const tipo = document.getElementById("tipo"),
		query = document.getElementById("query"),
		sort = document.getElementById("sort");

	fetch("/buscarClub", {
		method: "POST",
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			tipo: tipo.value,
			query: query.value,
			sort: sort.value
		})
	}).then(
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
			document.getElementById("clubes").innerHTML = "";
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
			if (json.datos) {
				calculos(json.datos);
			} else if (!json.alerta && !json.datos) {
				error("Error", "No se ha encontrado ningún libro.", true, false);
			}

		}).catch(function (error) {
			console.log(error);
			error("Error", "Favor intentar luego", true, false);
		});



	
}

let clubesArr = [];

function agregar(datos) {
	console.log(datos);
	let clubes = document.getElementById("clubes");
	clubes.innerHTML = `${clubes.innerHTML} <div class="cajaUsuario">
	<div class="fotoPerfil">
		<img src="${(datos.url && datos.url != " " && datos.url != "_")? datos.url : "https://media.discordapp.net/attachments/584399100938682370/604004906243981322/libroabierto.png"}">
	</div>
	<div class="datosPerfil">
		<a href="http://localhost:8080/perfilClub/${datos.id}"><span>${datos.nombre}</span></a>
		<br>
		<div class="masDatos">
			<p>Modalidad: ${(datos.presencial == true)? "Presencial" : "Virtual"}</span></p>
			<p>Día: <span>${calcularDia(datos.dia)}</span></p>
			<p>Hora: <span>${datos.hora}</span></p>
		</div>
	</div>
	</div>`;

}

function calcularDia(num){
	let dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
	return dias[num];
}

function calculos(datos) {
	clubesArr = datos;
	let cantidad = clubesArr.length;
	if (cantidad >= 4) {

		for (let i = 0; i < 4; i++) {
			agregar(clubesArr[0]);
			clubesArr.shift();
		}

	} else {
		console.log("aca", cantidad);
		for (let i = 0; i < cantidad; i++) {
			agregar(clubesArr[0]);
			clubesArr.shift();
		}
		
	}

	if (clubesArr.length >= 1) {
		document.getElementById("mas").classList.remove("ocultar");
	}else{
		document.getElementById("mas").classList.add("ocultar");
	}
}