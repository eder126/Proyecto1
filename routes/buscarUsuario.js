const app = require("express"),
	path = require("path"),
	usuario = require("../models/usuario"),
	middleware = require("../middleware"),
	router = app.Router();

const folder = path.join(__dirname, "../public");

router.get("/", middleware.loggeado, (req, res) => {
	res.sendFile(`${folder}/buscarUsuarios/index.html`);
});

router.post("/", middleware.loggeado, (req, res) => {
	if (req.body.tipo == "usuario") {

		let nombre = mayuscula(req.body.query.split(", ")[0]),
			apellido = mayuscula(req.body.query.split(", ")[1]);

		let objBuscar = {};

		if (nombre.length > 0 && (apellido.length > 0 || apellido == "")) {

			objBuscar = {
				nombre: new RegExp(nombre, "i")
			};

			if (apellido) {
				objBuscar["apellido"] = new RegExp(apellido, "i");
			}
		} else {
			objBuscar = {
				nombre: new RegExp(nombre, "i")
			};
		}

		let sort = {};
		if (req.body.sort == "CDESC") {
			sort.calificacion = "desc";
		} else if (req.body.sort == "CASC") {
			sort.calificacion = "asc";
		} else {
			sort.nombre = "asc";
		}

		usuario.find(objBuscar, "nombre apellido email usuarioId libros calificacion").sort(sort).exec((err, usuariosEncontrados) => {
			if (err) return res.json([]);

			if (req.body.sort == "LDESC") {
				usuariosEncontrados.sort((a, b) => (a.libros.length < b.libros.length) ? 1 : ((b.libros.length < a.libros.length) ? -1 : 0));
			} else if (req.body.sort == "LASC") {
				usuariosEncontrados.sort((a, b) => (a.libros.length > b.libros.length) ? 1 : ((b.libros.length > a.libros.length) ? -1 : 0));
			}

			if (usuariosEncontrados.length != 0) {
				res.json({
					encontrado: true,
					datos: usuariosEncontrados
				});
			} else {
				res.json({
					encontrado: false,
					alerta: {
						btnCancelar: false,
						btnAceptar: true,
						mensaje: "No se ha podido encontrar la librería con ese nombre.",
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
				mensaje: "Tipo de busqueda no existente.",
				titulo: "Error"
			}
		});
	}
});

function mayuscula(string) {
	if (typeof string !== "string") return "";
	return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

module.exports = router;