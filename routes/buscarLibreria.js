const app = require("express"),
	path = require("path"),
	usuario = require("../models/usuario"),
	router = app.Router();

const folder = path.join(__dirname, "../public");

router.get("/", (req, res) => {
	res.sendFile(`${folder}/buscarLibreria/index.html`);
});


router.post("/", (req, res) => {
	if (req.body.tipo == "libreria") {

		let nombre = mayuscula(req.body.query);
		let objBuscar = {
			rol: 1
		};
		if (nombre.length > 0) {
			objBuscar["nombreFantasia"] = new RegExp(nombre, "i");
		}

		let sort = {};
		if(req.body.sort == "NDESC"){
			sort = { nombre: -1};
		} else if(req.body.sort == "NASC"){
			sort = { nombre: 1};
		}

			
		//Pedir url de imagen... también pedir cant libros de un arreglo que tenga y tambien calificación...
		usuario.find(objBuscar, "url libreriaId nombreFantasia").sort(sort).exec((err, usuariosEncontrado) => {
			if (err) return res.json([]);
			if(usuariosEncontrado.length != 0){
				res.json({
					encontrado: true,
					datos: usuariosEncontrado
				});
			}else{
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