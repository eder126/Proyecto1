const app = require("express"),
	path = require("path"),
	club = require("../models/club"),
	router = app.Router();

const folder = path.join(__dirname, "../public");

router.get("/", (req, res) => {
	res.sendFile(`${folder}/buscarClub/index.html`);
});

router.post("/", (req, res) => {
	console.log(req.body);
	if (req.body.tipo == "club") {

		let nombre = req.body.query.split(" ").map((palabra) => {
			return mayuscula(palabra);
		}).join(" ");

		let objBuscar = {};

		if (nombre.length > 0) {
			objBuscar = {
				nombre: new RegExp(nombre, "i")
			};
		}

		let sort = {};
		if (req.body.sort == "NDESC") {
			sort = {
				nombre: -1
			};
		} else if (req.body.sort == "NASC") {
			sort = {
				nombre: 1
			};
		} else if (req.body.sort == "MPRESCENCIAL") {
			objBuscar["presencial"] = true;
		} else if (req.body.sort == "MVIRTUAL") {
			objBuscar["presencial"] = false;
		} else if (req.body.sort == "DDESC") {
			sort = {
				dia: -1
			};
		} else if (req.body.sort == "DASC") {
			sort = {
				dia: 1
			};
		}



		club.find(objBuscar).sort(sort).exec((err, clubesEncontrado) => {
			console.log(clubesEncontrado + " encontrados");
			if (err) return res.json([]);
			if (clubesEncontrado.length != 0) {
				res.json({
					encontrado: true,
					datos: clubesEncontrado
				});
			} else {
				res.json({
					encontrado: false,
					alerta: {
						btnCancelar: false,
						btnAceptar: true,
						mensaje: "No se ha podido encontrar ningún club con ese nombre.",
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
	return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = router;