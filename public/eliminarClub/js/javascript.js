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
		window.location.href = "http://localhost:8080/perfilPersonalUsuario";
	}else{
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
	
function errorInput(that) {
	error("Error", "Favor llenar los campos.", true, false);
	that.classList.add("inputError");
}

function send(event) {
    const confirmarNombre = document.getElementsByName("nombre")[0];
    confirmarNombre.classList.remove("inputError");

    if(confirmarNombre.value != ""){
        var json = JSON.stringify({
            nombre: confirmarNombre.value
        });
        console.log(json);
        fetch(document.location.href, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
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
        });
    } else {
        error("Error", "Favor rellene todos los campos", true, false);
        event.preventDefault();
        return false;
    }
	event.preventDefault();
	return false;
}

function agregar() {
	let datosPerfil = document.getElementById("wrapper");
    datosPerfil.innerHTML = datosPerfil.innerHTML + 
    `<div class="derecha">
        <p class="textoDes">Confirme el nombre del Club a eliminar</p>
        <input title="Nombre del Club" name="nombre" type="text" class="inputLogin" placeholder="Nombre del Club" required
            oninvalid="errorInput(this);">
    </div>`;
}