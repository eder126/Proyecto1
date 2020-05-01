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

buscar();

function buscar() {
	let fechaInicio = document.getElementById("fechaInicio").value,
		fechaFin = document.getElementById("fechaFin").value;

	fetch(document.location.href + "/listar/" + fechaInicio + "/" + fechaFin)
		.then(function (response) {
			if (response.status != 200) {
				console.log("Ocurrió un error con el servicio: " + response.status);
				error("Error", "Favor intentar luego", true, false);
			} else {
				return response.json();
			}
		}).then(function (json) {
			if (json != 0) {
				document.getElementById("comprasWrapper").innerHTML = "";
				calculos(json);
			} else {
				document.getElementById("comprasWrapper").innerHTML = "";
				error("Error", "No se encontraron compras bajo este periodo de tiempo", true, false);
			}
		}).catch(function (error) {
			console.log(error);
			error("Error", "Favor intentar luego", true, false);
		});
}

function agregar(datos) {
	fetch(document.location.href + "/libro/" + datos.isbn)
		.then(function (response) {
			if (response.status != 200) {
				console.log("Ocurrió un error con el servicio: " + response.status);
				error("Error", "Favor intentar luego", true, false);
			} else {
				return response.json();
			}
		}).then(function (json) {
			var Tempfecha = new Date(datos.fecha);
			var dia = Tempfecha.getDate();
			var mes = Tempfecha.getMonth();
			var anno = Tempfecha.getFullYear();
			var mesString = "";
			mes == 0 ? mesString = "enero" : mes;
			mes == 1 ? mesString = "febrero" : mes;
			mes == 2 ? mesString = "marzo" : mes;
			mes == 3 ? mesString = "abril" : mes;
			mes == 4 ? mesString = "mayo" : mes;
			mes == 5 ? mesString = "junio" : mes;
			mes == 6 ? mesString = "julio" : mes;
			mes == 7 ? mesString = "agosto" : mes;
			mes == 8 ? mesString = "setiembre" : mes;
			mes == 9 ? mesString = "octubre" : mes;
			mes == 10 ? mesString = "noviembre" : mes;
			mes == 11 ? mesString = "diciembre" : mes;
			var fecha = dia + " de " + mesString + " del " + anno;

			let compras = document.getElementById("comprasWrapper");

			var pagado = decimales(datos.pagado, 2);
			pagado = conComa(pagado);

			var libro = "";
			if (json) {
				libro = `<h3 class="compraInfo"><a href="perfilLibro/${json.ISBN}">${json.nombre}</a></h3>`;
			} else {
				libro = "<h3 class=\"compraInfo\"><a>Libro no disponible</a></h3>";
			}

			compras.innerHTML = compras.innerHTML +
				`<div class="contenedorCompra">
            <h3 class="compraInfo">${fecha}</h3>
            ${libro}
            <h3 class="compraInfo">${datos.cantidad}</h3>
            <h3 class="compraInfo">₡${pagado}</h3>
            <h3 class="compraInfo">${datos.conEnvio == true ? "Incluido":"No incluido"}</h3>
        </div>
        `;
		}).catch(function (error) {
			console.log(error);
			error("Error", "Favor intentar luego", true, false);
		});
}

let comprasArr = [];

function calculos(datos) {
	comprasArr = datos;
	let cantidad = comprasArr.length;
	if (cantidad >= 4) {
		for (let i = 0; i < 4; i++) {
			agregar(comprasArr[0]);
			comprasArr.shift();
		}
	} else {
		console.log("aca", cantidad);
		for (let i = 0; i < cantidad; i++) {
			agregar(comprasArr[0]);
			comprasArr.shift();
		}
	}
	if (comprasArr.length >= 1) {
		document.getElementById("mas").classList.remove("ocultar");
	} else {
		document.getElementById("mas").classList.add("ocultar");
	}
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

function conComa(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function decimales(value, precision) {
	var precision = precision || 0,
		power = Math.pow(10, precision),
		absValue = Math.abs(Math.round(value * power)),
		result = (value < 0 ? "-" : "") + String(Math.floor(absValue / power));

	if (precision > 0) {
		var fraction = String(absValue % power),
			padding = new Array(Math.max(precision - fraction.length, 0) + 1).join("0");
		result += "." + padding + fraction;
	}
	return result;
}