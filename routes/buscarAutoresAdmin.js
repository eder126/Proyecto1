const app = require("express"),
	path = require("path"),
	autor = require("../models/autor"),
	libro = require("../models/libro"),
	middleware = require("../middleware"),
	utils = require("../utils"),
	router = app.Router();

const folder = path.join(__dirname, "../public");

router.get("/", middleware.esAdmin, (req, res) => {
	res.sendFile(`${folder}/buscarAutoresAdmin/index.html`);
});

router.get("/nuevo", middleware.esAdmin, (req, res) => {
	res.sendFile(`${folder}/registrarAutorAdmin/index.html`);
});



router.post("/", middleware.esAdmin, (req, res) => {

	let nombre = req.body.nombre;

	let objBuscar = {};

	if (nombre) {
		objBuscar["nombre"] = new RegExp(nombre, "i");
	}
	autor.find(objBuscar).sort({
		nombre: 1
	}).exec((err, autoresEncontrados) => {
		console.log(autoresEncontrados + " encontrados");
		if (err) return res.json([]);
		if (autoresEncontrados.length != 0) {
			res.json({
				encontrado: true,
				datos: autoresEncontrados
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


router.get("/eliminarAutor/:identificador", middleware.esAdmin, (req, res) => {

	if(req.params.identificador){
		autor.findOne({
			identificador: Number(req.params.identificador)
		}, (err, autorEncotrado) => {
			//console.log(sucursalesEncontradas);
			if (err) return res.json([]);
			if(autorEncotrado){
				libro.find({
					autor: Number(req.params.identificador)
				}, (err, autorEncontrado) => {
					//console.log(sucursalesEncontradas);
					if (err) return res.json([]);
					if(autorEncontrado.length != 0){
						res.json({
							actualizado: false,
							alerta: {
								btnCancelar: false,
								btnAceptar: true,
								mensaje: "Favor eliminar los libros del autor.",
								titulo: "Error"
							}
						});
					} else {
						// Hablar con el equipo si utilizar remove o update ... Sigo pensando
						// cúal será mejor.
						autorEncotrado.remove((err) => {
							if(!err){
								utils("autorEliminado", req.user, autorEncotrado, "Autor eliminado.");
								res.json({
									actualizado: true,
									alerta: {
										btnCancelar: false,
										btnAceptar: true,
										mensaje: "Se ha elimiado el autor con éxito",
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
				mensaje: "Favor digitar un id.",
				titulo: "Error"
			}
		});
	}





});

module.exports = router;