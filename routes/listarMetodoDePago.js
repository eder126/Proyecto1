const app = require("express"),
	path = require("path"),
	metodoPago = require("../models/metodoPago"),
	middleware = require("../middleware"),
	router = app.Router();

const folder = path.join(__dirname, "../public");

router.get("/", middleware.esUsuarioRegular, (req, res) => {
	res.sendFile(`${folder}/listarMetodoDePago/index.html`);
});

router.get("/me", middleware.esUsuarioRegular, (req, res) => {
	metodoPago.find({
		propietario: req.user.usuarioId
	}, (err, encontrado) => {
		let nuevo = [];
		encontrado.forEach((item) => {
			nuevo.push({		
				"n_tarjeta": "**** **** **** " + (item.n_tarjeta+"").slice((item.n_tarjeta+"").length - 4),
				"vencimiento": item.vencimiento,
				"propietario": item.propietario,
				"cardholder": item.cardholder,
				"CVC": item.CVC,
				"id": item._id,
				"tipo": item.tipo
			});
		});
		
		res.json(nuevo);
	});
});

module.exports = router;