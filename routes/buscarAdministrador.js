const app = require("express"),
	path = require("path"),
	usuarioAdministrador = require("../models/usuario"),
	utils = require("../utils"),
	middleware = require("../middleware"),
	router = app.Router();

const folder = path.join(__dirname, "../public");

router.get("/", middleware.esAdmin, (req, res) => {
	res.sendFile(`${folder}/buscarAdministrador/index.html`);
});

router.post("/", middleware.esAdmin, (req, res) => {
	if (req.body.tipo == "usuarioAdministrador") {

		let nombre = mayuscula(req.body.query);
		let objBuscar = {
			rol: 2
		};

		if (nombre.length > 0) {

			objBuscar["nombre"] = new RegExp(nombre, "i");

		}

		usuarioAdministrador.find(objBuscar, "url usuarioId nombre apellido").sort({
			nombre: 1
		}).exec((err, adminsEncontrado) => {
			if (err) return res.json([]);
			if (adminsEncontrado.length != 0) {
				res.json({
					encontrado: true,
					datos: adminsEncontrado
				});
			} else {
				res.json({
					encontrado: false
				});
			}
		});

	} else {
		res.json({
			encontrado: false,
			alerta: {
				btnCancelar: false,
				btnAceptar: true,
				mensaje: "No existe ese tipo de busqueda.",
				titulo: "Error"
			}
		});
	}
});



router.get("/eliminar/:id", middleware.esAdmin, (req, res) => {

	usuarioAdministrador.findOne({
		rol: 2,
		usuarioId: Number(req.params.id)
	}, (err, adminEncontrado) => {
		if (err) return res.json([]);
		if(adminEncontrado){
			usuarioAdministrador.find({
				rol: 2
			}, (err, adminsEncontrados) => {
				if (err) return res.json([]);
				if(adminsEncontrados.length > 1) {
					adminEncontrado.remove((err) => {
						if(err) return res.json({
							encontrado: false,
							alerta: {
								btnCancelar: false,
								btnAceptar: true,
								mensaje: "Error en la base de datos, favor intentar luego.",
								titulo: "Error"
							}
						});
						utils("cuentaEliminada", req.user, adminEncontrado, "Admin eliminado.");
						return res.json({
							eliminado: true,
							alerta: {
								btnCancelar: false,
								btnAceptar: true,
								mensaje: "Administrador eliminado.",
								titulo: `<i class="fas fa-check" style="color: #009688;"></i>`
							}
						});
					});
				} else {
					res.json({
						eliminado: false,
						alerta: {
							btnCancelar: false,
							btnAceptar: true,
							mensaje: "Mínimo se requiere que exista 1 administrador.",
							titulo: "Error"
						}
					});
				}
			});
		} else {
			res.json({
				encontrado: false,
				alerta: {
					btnCancelar: false,
					btnAceptar: true,
					mensaje: "No existe ese administrador.",
					titulo: "Error"
				}
			});
		}
	});

});





function mayuscula(string) {
	if (typeof string !== "string") return "";
	return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = router;