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
		window.location.href = "http://localhost:8080/librosPersonales";
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


fetch(document.location.href + "/listarLibros")
.then(function (response) {
    //console.log(response.url);
    if (response.status != 200)
        console.log("Ocurrió un error con el servicio: " + response.status);
    else return response.json();
}).then(function (json) {
    if(json.usuario){
        if (json.libros.length == 0) {
            document.getElementById("librosPerfil").innerHTML = 
            `<div>
                <p>¡Usted no ha comprado libros aún!</p>
            </div>`;
        } else {
            const libros =  getUnique(json.libros,'isbn');
            calculos(libros);
        }
    } else {
        document.getElementById("librosPerfil").innerHTML = 
        `<div>
            <p>¡Su cuenta no tiene permitido comprar libros!</p>
        </div>`;
    }
}).catch(function (err) {
    console.log("Ocurrió un error con el fetch del usuario.json: ", err);
});

function getUnique(arr,comp){
	//store the comparison  values in array
const unique =  arr.map(e=> e[comp]). 
  // store the keys of the unique objects
  map((e,i,final) =>final.indexOf(e) === i && i) 
  // eliminate the dead keys & return unique objects
 .filter((e)=> arr[e]).map(e=>arr[e]);
return unique;
}

function agregar(datos) {
    fetch(document.location.href+"/"+datos.isbn + "/libro")
    .then(function (response) {
        //console.log(response.url);
        if (response.status != 200)
            console.log("Ocurrió un error con el servicio: " + response.status);
        else
            return response.json();
    }).then(function (jsonLibro) {
        let libros = document.getElementById("librosSeccion");
        let tempImg = jsonLibro.img.split("/");
        tempImg[tempImg.length - 2] = "w_200,h_300,c_scale";
        jsonLibro.img = tempImg.join("/");

        var libro = "";
        if(jsonLibro.formato) {
            libro = `<button title="Digital" class="btnNoDisponible" disabled>Intercambio no disponible</button>`;
        } else {
            if(datos.intercambio){
                libro = `<button title="Físico" type="button" value="${jsonLibro.ISBN}" class="btnDeshabilitar" onclick="intercambioCambio(this.value);">Deshabilitar Intercambio</button>`;
            } else {
                libro = `<button title="Físico" type="button" value="${jsonLibro.ISBN}" class="btnHabilitar" onclick="intercambioCambio(this.value);">Habilitar Intercambio</button>`;
            }
        }

        var nuevaPalabra = "";
        var titulo = jsonLibro.nombre;
        if(jsonLibro.nombre.length > 17){
            nuevaPalabra = jsonLibro.nombre.substring(0, 16) + "...";
        } else {
            nuevaPalabra = jsonLibro.nombre;
        }

        libros.innerHTML = 
        `${libros.innerHTML} <div class="contenedorLibro">
            <div class="fotoLibro">
                <img src="${jsonLibro.img}"/>
            </div>
            <div class="Condatos">
                <a href="../perfilLibro/${jsonLibro.ISBN}" title="${titulo}">${nuevaPalabra}</a>
            </div>
            <div class="intercambio">
                ${libro}
            </div>
        </div>`;
    }).catch(function (err) {
        console.log("Ocurrió un error con el fetch", err);
    });
}

let librosArr = [];
function calculos(datos) {
	librosArr = datos;
	let cantidad = librosArr.length;
	if (cantidad >= 4) {
		for (let i = 0; i < 4; i++) {
			agregar(librosArr[0]);
			librosArr.shift();
		}
	} else {
		for (let i = 0; i < cantidad; i++) {
			agregar(librosArr[0]);
			librosArr.shift();
		}
	}
	if (librosArr.length >= 1) {
		document.getElementById("mas").classList.remove("ocultar");
	}else{
		document.getElementById("mas").classList.add("ocultar");
	}
}

function intercambioCambio(ISBN) {
    console.log(ISBN);

    var json = JSON.stringify({
        isbn: Number(ISBN)
    });
    fetch("/librosPersonales", {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: json
    }).then(function (response) {
        if (response.status != 200) {
            console.log("Ocurrió un error con el servicio: " + response.status);
            error("Error", "Favor intentar luego", true, false);
        } else {
            return response.json();
        }
    }).then(function (json) {
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
    }).catch(function (err) {
        console.log("Ocurrió un error con el fetch del usuario.json: ", err);
        error("Error", "Ha ocurrido un error.", true, false);
        event.preventDefault();
        return false;
    });
    event.preventDefault();
    return false;
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