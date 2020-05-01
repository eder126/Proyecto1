function send(event) {
	const n_tarjeta = document.getElementsByName("n_tarjeta")[0],
		vencimiento = document.getElementsByName("vencimiento")[0],
		cardholder = document.getElementsByName("cardholder")[0],
		CVC = document.getElementsByName("CVC")[0];


	var json = JSON.stringify({
		n_tarjeta: n_tarjeta.value,
		vencimiento: vencimiento.value,
		cardholder: cardholder.value,
		CVC: CVC.value
	});

	console.log(json);

	if (n_tarjeta.value != "" && vencimiento.value != "" && cardholder.value != "" && CVC.value != "") {
		if(!isNaN(n_tarjeta.value) && esFecha(new Date(vencimiento.value)) && new Date(vencimiento.value) && !isNaN(CVC.value)){
			if(cardnumber(n_tarjeta)){
				if(new Date(vencimiento.value) > new Date()){
					fetch(document.location.href, {
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
				} else {
					error("Error", "Tarjeta vencida.", true, false);
					event.preventDefault();
					return false;
				}
			} else {
				error("Error", "No es un método de pago valido o no es un método de pago aceptado por la aplicación", true, false);
				event.preventDefault();
				return false;
			}
			
						
		} else {
			error("Error", "Favor llenar bien los campos de Número de tarjeta, Fecha vencimiento y CVC.", true, false);
			event.preventDefault();
			return false;
		}
			
	} else {
		error("Error", "Favor llenar los campos", true, false);
		event.preventDefault();
		return false;
	}
			
	event.preventDefault();
	return false;
}




function esFecha(date) {
	return date && Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date);
}

function cardnumber(inputtxt) {
	var cardno1 = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
	var cardno2 = /^(?:5[1-5][0-9]{14})$/;
	if (inputtxt.value.match(cardno1)) {
		return true;
	} else if (inputtxt.value.match(cardno2)) {
		return true;
	} else {
		return false;
	}
}

function onSwitch() {
	const number = document.getElementById("n_tarjeta").value;
	let resultado = GetCardType(number),
		visa = document.getElementById("visa"),
		mastercard = document.getElementById("mastercard"),
		amex = document.getElementById("amex"),
		discovery = document.getElementById("discovery");
		
	visa.classList.remove("tarjetaActiva");
	mastercard.classList.remove("tarjetaActiva");
	amex.classList.remove("tarjetaActiva");
	discovery.classList.remove("tarjetaActiva");
	if(resultado == 1) {
		mastercard.classList.add("tarjetaActiva");
		amex.classList.add("tarjetaActiva");
		discovery.classList.add("tarjetaActiva");
	} else if(resultado == 2) {
		visa.classList.add("tarjetaActiva");
		amex.classList.add("tarjetaActiva");
		discovery.classList.add("tarjetaActiva");
	}else if(resultado == 3) {
		mastercard.classList.add("tarjetaActiva");
		visa.classList.add("tarjetaActiva");
		discovery.classList.add("tarjetaActiva");
	}else if(resultado == 4) {
		mastercard.classList.add("tarjetaActiva");
		visa.classList.add("tarjetaActiva");
		amex.classList.add("tarjetaActiva");
	}
}




var GetCardType = function(val) {
	if(!val || !val.length) return undefined;
	switch(val.charAt(0)) {
	case "4": return 1;
	case "5": return 2;
	case "3": return 3;
	case "6": return 4;
	}
	return undefined;
};


fetch(document.location.href+"/info").then(function (response) {
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

	document.getElementsByName("n_tarjeta")[0].value = json.n_tarjeta;
	document.getElementsByName("CVC")[0].value = json.CVC;
	document.getElementsByName("cardholder")[0].value = json.cardholder;
	document.getElementsByName("vencimiento")[0].valueAsDate = new Date(json.vencimiento);
	onSwitch();

}).catch(function (err) {
	console.log("Ocurrió un error con el fetch del usuario.json: ", err);
	error("Error", "Ha ocurrido un error.", true, false);
	return false;
});