function errorInput(that) {
	error("Error", "Favor llenar los campos.", true, false);
	that.classList.add("inputError");
}

function send(event) {
    const nombre = document.getElementsByName("nombre")[0];
    nombre.classList.remove("inputError");

    if(nuevacontrasenna.value != "" && confirmar.value != "" && viejacontrasenna.value != ""){
        if(nuevacontrasenna.value === confirmar.value){
            var json = JSON.stringify({
                nombre: nombre.value
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
        <input title="Nombre del Club" name="nombre" type="text" class="inputLogin" placeholder="Nombre del Club" required
            oninvalid="errorInput(this);">
    </div>`;
}