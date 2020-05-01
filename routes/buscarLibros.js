const app = require("express"),
	path = require("path"),
	libro = require("../models/libro"),
	router = app.Router();

const folder = path.join(__dirname, "../public");

router.get("/", (req, res) => {
	res.sendFile(`${folder}/buscarLibros/index.html`);
});


router.post("/", (req, res) => {
	console.log(req.body);
	if (req.body.tipo == "libros") {

		let nombre = req.body.query;

		let objBuscar = {};

		if (nombre.length > 0) {
			objBuscar["nombre"] = new RegExp(nombre, "i");
		}

		let sort = {};
		if(req.body.sort == "VDESC") {
			sort = { ventas: -1 };
		} else if(req.body.sort == "VASC") {
			sort = { ventas: 1 };
		} else if(req.body.sort == "CNDESC") { //Calificado N DESC
			sort = { calificadoN: -1 };
		} else if(req.body.sort == "CNASC") { //Calificado N ASC
			sort = { calificadoN: 1 };
		} else if(req.body.sort == "CDESC") { //Calificado ASC
			sort = { rating: -1 };
		} else if(req.body.sort == "CASC") { //Calificado ASC
			sort = { rating: 1 };
		}

		console.log(sort);
		
		libro.find(objBuscar).sort(sort).exec((err, librosEncontrado) => {
			console.log(librosEncontrado + " encontrados");
			if (err) return res.json([]);
			if(librosEncontrado.length != 0){
				res.json({
					encontrado: true,
					datos: librosEncontrado
				});
			}else{
				res.json({
					encontrado: false,
					alerta: {
						btnCancelar: false,
						btnAceptar: true,
						mensaje: "No se ha podido encontrar ningún autor con ese nombre.",
						titulo: "Error"
					}
				});
			}
		});
	}else{
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

module.exports = router;