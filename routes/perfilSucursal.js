const app = require("express"),
	path = require("path"),
	sucursal = require("../models/sucursal"),
	inventario = require("../models/inventario"),
	libro = require("../models/libro"),
	router = app.Router();

const folder = path.join(__dirname, "../public");

router.get("/", (req, res) => {
	res.redirect("/perfilSucursal/-1");
});

router.get("/:sucursal", (req, res) => {
	res.sendFile(`${folder}/perfilSucursal/index.html`);
});

router.get("/:sucursal/listar", (req, res) => {
	sucursal.findOne({
		id: Number(req.params.sucursal)
	}, (err, sucursalEncontrada) => {
		//console.log(sucursalEncontrada);
		if (err) return console.log(err);
		inventario.find({
			id: Number(req.params.sucursal)
		}, (err, sucursalesEncontradas) => {
			//console.log(sucursalesEncontradas);
			if (err) return res.json([]);
			if(sucursalEncontrada && sucursalesEncontradas){
				sucursalesEncontradas = sucursalesEncontradas == null ? [] : [sucursalesEncontradas];
				res.json({
					"imgPerfil": sucursalEncontrada.imgPerfil,
					"libros": sucursalesEncontradas,
					"_id": sucursalEncontrada._id,
					"nombre": sucursalEncontrada.nombre,
					"telefono": sucursalEncontrada.telefono,
					"direccion": sucursalEncontrada.direccion,
					"costoEnvio": sucursalEncontrada.costoEnvio,
					"id": sucursalEncontrada.id,
					"libreriaId": sucursalEncontrada.libreriaId
				});
			} else {
				res.json({
					encontrado: false,
					alerta: {
						btnCancelar: false,
						btnAceptar: true,
						mensaje: "No se ha encontrado la sucursal con el id dado.",
						titulo: "Error"
					}
				});
			}
		});
	});
});

router.get("/:sucursal/:libro/listar/libros", (req, res) => {
	console.log(req.params.libro);
	libro.findOne({
		ISBN: Number(req.params.libro)
	}, (err, libroEncontrado) => {
		if (err) return console.log(err);
		inventario.findOne({
			id: req.params.sucursal,
			isbn: Number(libroEncontrado.ISBN)
		}, (err, sucursalEncontrada) => {
			if (err) return console.log(err);
			if(sucursalEncontrada){
				res.json({
					"cantidad": sucursalEncontrada.cantidad,
					"nombre": libroEncontrado.nombre,
					"precio": sucursalEncontrada.precio,
					"isbn": libroEncontrado.ISBN,
					"url": libroEncontrado.img
				});
			} else {
				res.json({
					encontrado: false,
					alerta: {
						btnCancelar: false,
						btnAceptar: true,
						mensaje: "No se ha encontrado la sucursal.",
						titulo: "Error"
					}
				});
			}
		});
	});
});

module.exports = router;