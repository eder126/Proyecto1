buscar();

function buscar() {
	const tipo = document.getElementById("tipo"),
		sort = document.getElementById("sort"),
		query = document.getElementById("query");
	if (tipo.value != "") {

		fetch("/buscarPromociones", {
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
		}).then(function (response) {
			if (response.status != 200) {
				console.log("Ocurrió un error con el servicio: " + response.status);
				error("Error", "Favor intentar luego", true, false);
			} else {
				return response.json();
			}
		}).then(function (json) {
			document.getElementById("promociones").innerHTML = "";
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
				//console.log("if(json.datos): "+json.datos);
				//console.log("if(json.datos): "+json.encontrado);
				//calculos(json.datos);
				calculos(json);
			} else if (!json.alerta && !json.datos) {
				error("Error", "No se ha encontrado ninguna promoción activa.", true, false);
                event.preventDefault();
                return false;
			}
		}).catch(function (error) {
			console.log(error);
			error("Error", "Favor intentar luego", true, false);

			event.preventDefault();
			return false;
		});
	} else {
		error("Error", "Favor llenar los campos", true, false);
		event.preventDefault();
		return false;
	}
}

let promocionesArr = [];

function agregar(jsondatos) {
	var datos = jsondatos.datos[0];
	var titulo = jsondatos.libro;
	let promociones = document.getElementById("promociones");
	var Desc = "";
	if (datos.tipoDescuento) {
		Desc = `<p>Descuento: <span>₡ ${datos.rebaja}</span></p>`;
	} else {
		Desc = `<p>Descuento: <span>${datos.rebaja} %</span></p>`;
	}

	var Fecha = new Date(datos.fechaFin);
	var dia = Fecha.getDate();
	var mes = Fecha.getMonth();
	var anno = Fecha.getFullYear();
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
	
	var fechaOrdenada = `${dia} de ${mesString} del ${anno}`;
	console.log(jsondatos);
	promociones.innerHTML = promociones.innerHTML + `<div class="cajaPromocion">
            <div class="datosPerfil">
                <a href="http://localhost:8080/perfilLibro/${datos.isbn}"><p>${titulo}</p></a>
                <p><a href="/perfilSucursal/${datos.sucursal}">Sucursal</a></p>
                <div class="masDatos">
                    <p>Fecha final: <span>${fechaOrdenada}</span></p>
                    ${Desc}
                </div>
            </div>
        </div>`;
	//<p>Descuento: <span>${datos.rebaja}</span></p>
}

function calculos(jsonDatos) { //(datos)
	promocionesArr = jsonDatos.datos;
	//promocionesArr = datos;
	let cantidad = promocionesArr.length;
	if (cantidad >= 4) {
		for (let i = 0; i < 4; i++) {
			//agregar(promocionesArr[0]);
			agregar(jsonDatos);
			promocionesArr.shift();
		}

	} else {
		console.log("aca", cantidad);
		for (let i = 0; i < cantidad; i++) {
			//agregar(promocionesArr[0]);
			//agregar(jsonDatos);
			//promocionesArr.shift();
			agregar(jsonDatos);
			promocionesArr.shift();
		}
	}


	if (promocionesArr.length >= 1) {
		document.getElementById("mas").classList.remove("ocultar");
	} else {
		document.getElementById("mas").classList.add("ocultar");
	}
}