const app = require("express"),
	path = require("path"),
	usuarioBloqueado = require("../models/usuario"),
	middleware = require("../middleware"),
	router = app.Router();

const folder = path.join(__dirname, "../public");

router.get("/", middleware.esAdmin, (req, res) => {
	res.sendFile(`${folder}/buscarUsuariosBloqueados/index.html`);
});

router.post("/", middleware.esAdmin, (req, res) => {
	if (req.body.tipo == "usuarioBloqueado") {

		let nombre = mayuscula(req.body.query);
		let objBuscar = {
			bloqueado: true
		};
		if (nombre.length > 0) {
			objBuscar["nombre"] = new RegExp(nombre, "i");
		}

		usuarioBloqueado.find(objBuscar, "url usuarioId nombre apellido razon").sort({nombre: 1}).exec((err, usuariosEncontrado) => {
			if (err) return res.json([]);
			if (usuariosEncontrado.length != 0) {
				res.json({
					encontrado: true,
					datos: usuariosEncontrado
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

function mayuscula(string) {
	if (typeof string !== "string") return "";
	return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = router;