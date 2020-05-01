const app = require("express"),
	path = require("path"),
	global = require("../models/global"),
	mongoose = require("mongoose"),
	utils = require("../utils"),
	middleware = require("../middleware"),
	router = app.Router();

const folder = path.join(__dirname, "../public");

router.get("/", middleware.esAdmin, (req, res) => {
	res.sendFile(`${folder}/impuesto/index.html`);
});

router.get("/get", (req, res) => {
	global.findOne({
		"impuestoVentas": {
			$exists: true
		}
	}, (err, encontrado) => {
		if(err) res.json({impuesto: 0});
		if(encontrado){
			res.json({impuesto: encontrado.impuestoVentas});
		}else{
			res.json({impuesto: 0});
		}
	});
});

router.post("/", middleware.esAdmin, (req, res) => {


	if (req.body.impuestoVentas != "") {

		if (!isNaN(Number(req.body.impuestoVentas)) && dentro(req.body.impuestoVentas, 0, 100)) {
			console.log("todo valido");


			global.find({
				"impuestoVentas": {
					$exists: true
				}
			}, (err, encontrado) => {
				if (err) return res.json([]);
				console.log("Encontrado: " + typeof encontrado);
				console.log(encontrado);
				if (encontrado.length == 0) {


					global.create({
						_id: mongoose.Types.ObjectId(),
						impuestoVentas: req.body.impuestoVentas
					}, (err, nuevo) => {
						if (err) return res.json([]);
						console.log("Creado impuesto ventas: " + nuevo);
						res.json({
							creado: true,
							alerta: {
								btnCancelar: false,
								btnAceptar: true,
								mensaje: "Se registró el impuesto de ventas correctamente.",
								titulo: `<i class="fas fa-check" style="color: #009688;"></i>`
							}
						});
						utils("registroVariableGlobal", req.user, nuevo, "Nuevo impuesto global");
					});

				} else {
					encontrado[0].impuestoVentas = req.body.impuestoVentas;
					encontrado[0].save(err => {
						if(err){
							return res.json({
								eliminado: false,
								alerta: {
									btnCancelar: false,
									btnAceptar: true,
									mensaje: "Error de la base de datos, favor intentar luego.",
									titulo: "Error"
								}
							});
						} else {
							utils("cambioVariableGlobal", req.user, encontrado[0], "Se ha actualizado el impuesto global");
							return res.json({
								actualizado: true,
								alerta: {
									btnCancelar: false,
									btnAceptar: true,
									mensaje: "Se ha actualizado el impuesto de ventas",
									titulo: `<i class="fas fa-check" style="color: #009688;"></i>`
								}
							});
						}
					});
				}
			});

		} else {
			res.json({
				creado: false,
				alerta: {
					btnCancelar: false,
					btnAceptar: true,
					mensaje: "Favor ingresar un número",
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

function dentro(x, min, max) {
	return x >= min && x <= max;
}


module.exports = router;