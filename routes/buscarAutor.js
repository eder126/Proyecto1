const app = require("express"),
	path = require("path"),
	Autor = require("../models/autor"),
	router = app.Router();

const folder = path.join(__dirname, "../public");

router.get("/", (req, res) => {
	res.sendFile(`${folder}/buscarAutor/index.html`);
});


router.post("/", (req, res) => {
	console.log(req.body);
	if (req.body.tipo == "autor") {

		let nombre = mayuscula(req.body.query);

		let objBuscar = {};
		if (nombre.length > 0) {
			objBuscar = {
				nombre: new RegExp(nombre, "i")
			};
		}
		let sort = {};
		if (req.body.sort == "alfa") {
			sort.nombre = "asc";
		} else if (req.body.sort == "alfd") {
			sort.nombre = "desc";
		}
		Autor.find(objBuscar).sort(sort).exec((err, autoresEncontrado) => {
			if (err) return res.json([]);
			if (autoresEncontrado.length != 0) {
				res.json({
					encontrado: true,
					datos: autoresEncontrado
				});
			} else {
				res.json({
					encontrado: false,
					alerta: {
						btnCancelar: false,
						btnAceptar: true,
						mensaje: "No se ha podido encontrar el autor con ese nombre.",
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
				mensaje: "Favor escribir más de 3 letras para la busqueda.",
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