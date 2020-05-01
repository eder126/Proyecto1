const app = require("express"),
	path = require("path"),
	mongoose = require("mongoose"),
	metodoPago = require("../models/metodoPago"),
	utils = require("../utils"),
	middleware = require("../middleware"),
	router = app.Router();

const folder = path.join(__dirname, "../public");

router.get("/", middleware.esUsuarioRegular, (req, res) => {
	res.sendFile(`${folder}/registrarMetodoDePago/index.html`);
});

router.post("/", middleware.esUsuarioRegular, (req, res) => {

	if (req.body.n_tarjeta != "" && req.body.vencimiento != "" && req.body.cardholder != "" && req.body.CVC != "") {
		if(!isNaN(req.body.n_tarjeta) && esFecha(new Date(req.body.vencimiento)) && new Date(req.body.vencimiento) && !isNaN(req.body.CVC)){
			if(cardnumber(req.body.n_tarjeta)){
				if(new Date(req.body.vencimiento) > new Date()){
					metodoPago.create({
						_id: mongoose.Types.ObjectId(),
						n_tarjeta: req.body.n_tarjeta,
						vencimiento: req.body.vencimiento,
						propietario: req.user.usuarioId,
						cardholder: req.body.cardholder.split(" ").map((palabra) => {
							return mayuscula(palabra);
						}).join(" "),
						tipo: GetCardType(req.body.n_tarjeta),
						CVC: req.body.CVC
					}, (err, nuevo) => {
						if (err) return res.json([]);
						console.log("Creado: " + nuevo);
						res.json({
							creado: true,
							alerta: {
								btnCancelar: false,
								btnAceptar: true,
								mensaje: "Nuevo Método de Pago.",
								titulo: `<i class="fas fa-check" style="color: #009688;"></i>`
							}
						});
						nuevo.n_tarjeta = "****" + (nuevo.n_tarjeta+"").slice((nuevo.n_tarjeta+"") - 4);
						
						utils("registroMetodoPago", req.user, nuevo, "Nuevo Método de Pago.");
					});
				} else {
					res.json({
						creado: false,
						alerta: {
							btnCancelar: false,
							btnAceptar: true,
							mensaje: "Tarjeta vencida",
							titulo: "Error"
						}
					});
				}
			} else {
				res.json({
					creado: false,
					alerta: {
						btnCancelar: false,
						btnAceptar: true,
						mensaje: "No es un método de pago válido o no es un método de pago aceptado por la aplicación",
						titulo: "Error"
					}
				});
			}


		} else {
			res.json({
				creado: false,
				alerta: {
					btnCancelar: false,
					btnAceptar: true,
					mensaje: "Favor llenar bien los campos de Número de tarjeta, Fecha vencimiento y CVC",
					titulo: "Error"
				}
			});
		}

	} else {
		res.json({
			creado: false,
			alerta: {
				btnCancelar: false,
				btnAceptar: true,
				mensaje: "Favor llenar los campos",
				titulo: "Error"
			}
		});
	}
});

function cardnumber(inputtxt) {
	var cardno1 = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
	var cardno2 = /^(?:5[1-5][0-9]{14})$/;
	if (inputtxt.match(cardno1)) {
		return true;
	} else if (inputtxt.match(cardno2)) {
		return true;
	} else {
		return false;
	}
}

function GetCardType(val) {
	if(!val || !val.length) return undefined;
	switch(val.charAt(0)) {
	case "4": return "Visa";
	case "5": return "MasterCard";
	case "3": return "Amex";
	case "6": return "Discovery";
	}
	return undefined;
}

function esFecha(date) {
	return date && Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date);
}

function mayuscula(string) {
	if (typeof string !== "string") return "";
	return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

module.exports = router;