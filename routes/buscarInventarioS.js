const app = require("express"),
	path = require("path"),
	sucursal = require("../models/sucursal"),
	inventario = require("../models/inventario"),
	router = app.Router();

const folder = path.join(__dirname, "../public");

router.get("/", (req, res) => {
	res.redirect("./buscarInventarioS/-1");
});

router.get("/:id", (req, res) => {
	res.sendFile(`${folder}/buscarInventarioS/index.html`);
});


router.post("/:id", (req, res) => {
	if (!isNaN(req.params.id)) {
		console.log("Hola");

		let nombre = mayuscula(req.body.query);
		let objBuscar = {
			id: req.params.id
		};

		inventario.find(objBuscar).exec((err, sucursalesEncontradas) => {
			if (err) return res.json([]);
			if (sucursalesEncontradas.length != 0) {
				sucursal.findOne(objBuscar, (err, sucursalEncontrada) => {
					let libros = sucursalesEncontradas;


					if (nombre.length >= 3) {
						var regex = new RegExp(nombre, "i");
						libros = libros.filter((libros) => {
							return regex.test(libros.nombre);
						});
					}


					if (req.body.sort == "NDESC") {
						libros.sort((a, b) => (a.nombre < b.nombre) ? 1 : ((b.nombre < a.nombre) ? -1 : 0));
					} else if (req.body.sort == "NASC") {
						libros.sort((a, b) => (a.nombre > b.nombre) ? 1 : ((b.nombre > a.nombre) ? -1 : 0));
					} else if (req.body.sort == "CDESC") {
						libros.sort((a, b) => (a.cantidad < b.cantidad) ? 1 : ((b.cantidad < a.cantidad) ? -1 : 0));
					} else if (req.body.sort == "CASC") {
						libros.sort((a, b) => (a.cantidad > b.cantidad) ? 1 : ((b.cantidad > a.cantidad) ? -1 : 0));
					}


					res.json({
						encontrado: true,
						datos: {
							sucursal: sucursalEncontrada.nombre,
							id: sucursalEncontrada.id,
							libreria: sucursalEncontrada.libreriaId,
							libros: libros
						}
					});



				});
			} else {
				res.json({
					encontrado: false,
					alerta: {
						btnCancelar: false,
						btnAceptar: true,
						mensaje: "No se ha podido encontrar la sucursal.",
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
				mensaje: "ID invalido.",
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