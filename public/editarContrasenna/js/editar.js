function errorInput(that) {
	error("Error", "Favor llenar los campos.", true, false);
	that.classList.add("inputError");
}

function send(event) {
    const viejacontrasenna = document.getElementsByName("viejacontrasenna")[0],
    nuevacontrasenna = document.getElementsByName("nuevacontrasenna")[0],
    confirmar = document.getElementsByName("confirmar")[0];
    viejacontrasenna.classList.remove("inputError");
    nuevacontrasenna.classList.remove("inputError");
    confirmar.classList.remove("inputError");

    if(nuevacontrasenna.value != "" && confirmar.value != "" && viejacontrasenna.value != ""){
        if(nuevacontrasenna.value === confirmar.value){
            var json = JSON.stringify({
                viejacontrasenna: viejacontrasenna.value,
                nuevacontrasenna: nuevacontrasenna.value,
                confirmar: confirmar.value
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
            error("Error", "Los campos de contraseña y confirmación deben ser idénticos", true, false);
            event.preventDefault();
            return false;
        }
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
        <p class="textoDes">Contraseña Vieja</p>
        <input title="Contraseña" name="viejacontrasenna" type="password" class="inputLogin" placeholder="Contraseña" required
            oninvalid="errorInput(this);">
    </div>
    <div class="izquierda">
        <p class="textoDes">Nueva Contraseña</p>
        <input title="Contraseña" name="nuevacontrasenna" type="password" class="inputLogin" placeholder="Contraseña" required
            oninvalid="errorInput(this);">
        <label for="mostrar1">
            <i title="Mostrar" class="fas fa-eye"></i>
        </label>
        <input type="checkbox" id="mostrar1">
    </div>
    <div class="izquierda">
        <p class="textoDes">Confirmar Contraseña</p>
        <input title="Confirmación" name="confirmar" type="password" class="inputLogin" placeholder="Confirmar Contraseña" required
                oninvalid="errorInput(this);">
        <label for="mostrar2">
            <i title="Mostrar" class="fas fa-eye"></i>
        </label>
        <input type="checkbox" id="mostrar2">
    </div>`;
    document.getElementsByTagName("label")[0].addEventListener("mouseover", mostrar1);
    document.getElementsByTagName("label")[0].addEventListener("mouseout", mostrar1);
    document.getElementsByTagName("label")[1].addEventListener("mouseover", mostrar2);
    document.getElementsByTagName("label")[1].addEventListener("mouseout", mostrar2);
}

function mostrar1() {
    var Input = document.getElementsByName("nuevacontrasenna")[0];
    if (Input.type === "password") {
        Input.type = "text";
    } else {
        Input.type = "password";
    }
}

function mostrar2() {
    var Input = document.getElementsByName("confirmar")[0];
    if (Input.type === "password") {
        Input.type = "text";
    } else {
        Input.type = "password";
    }
}