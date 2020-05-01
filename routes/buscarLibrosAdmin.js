const app = require("express"),
	path = require("path"),
	libro = require("../models/libro"),
	utils = require("../utils"),
	inventario = require("../models/inventario"),
	middleware = require("../middleware"),
	router = app.Router();

const folder = path.join(__dirname, "../public");

router.get("/", middleware.esAdmin, (req, res) => {
	res.sendFile(`${folder}/buscarLibrosAdmin/index.html`);
});

router.get("/nuevo", middleware.esAdmin, (req, res) => {
	res.sendFile(`${folder}/registrarLibroAdmin/index.html`);
});


router.post("/", middleware.esAdmin, (req, res) => {

	let nombre = req.body.nombre;

	let objBuscar = {};

	if (nombre) {
		objBuscar["nombre"] = new RegExp(nombre, "i");
	}
	libro.find(objBuscar).sort({
		nombre: 1
	}).exec((err, librosEncontrado) => {
		console.log(librosEncontrado + " encontrados");
		if (err) return res.json([]);
		if (librosEncontrado.length != 0) {
			res.json({
				encontrado: true,
				datos: librosEncontrado
			});
		} else {
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

});


router.get("/eliminarLibro/:isbn", middleware.esAdmin, (req, res) => {

	if(req.params.isbn){
		libro.findOne({
			ISBN: Number(req.params.isbn)
		}, (err, libroEncontrado) => {
			//console.log(sucursalesEncontradas);
			if (err) return res.json([]);
			if(libroEncontrado){
				inventario.find({
					isbn: Number(req.params.isbn)
				}, (err, sucursalesEncontradas) => {
					//console.log(sucursalesEncontradas);
					if (err) return res.json([]);
					if(sucursalesEncontradas.length != 0){
						res.json({
							actualizado: false,
							alerta: {
								btnCancelar: false,
								btnAceptar: true,
								mensaje: "Favor eliminar el libro de las sucursales.",
								titulo: "Error"
							}
						});
					} else {
						// Hablar con el equipo si utilizar remove o update ... Sigo pensando
						// cúal será mejor.
						libroEncontrado.remove((err) => {
							if(!err){
								utils("libroEliminado", req.user, libroEncontrado, "Libro eliminado.");
								res.json({
									actualizado: true,
									alerta: {
										btnCancelar: false,
										btnAceptar: true,
										mensaje: "Se ha elimiado con éxito",
										titulo: `<i class="fas fa-check" style="color: #009688;"></i>`
									}
								});
							} else {
								console.log(err);
								res.json({
									actualizado: false,
									alerta: {
										btnCancelar: false,
										btnAceptar: true,
										mensaje: "Error, favor intentar luego.",
										titulo: "Error"
									}
								});
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
						mensaje: "No se ha podido encontrar ningún libro con ese isbn.",
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
				mensaje: "Favor digitar un isbn.",
				titulo: "Error"
			}
		});
	}





});

module.exports = router;