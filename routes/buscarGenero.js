const app = require("express"),
	path = require("path"),
	mongoose = require("mongoose"),
	generoModel = require("../models/genero"),
	middleware = require("../middleware"),
	utils = require("../utils"),
	router = app.Router();

const folder = path.join(__dirname, "../public");

router.get("/", middleware.esAdmin, (req, res) => {
	res.sendFile(`${folder}/buscarGeneros/index.html`);
});

router.post("/", middleware.esAdmin, (req, res) => {
	let genero = req.body.nombre;

	let objBuscar = {};
	if (genero.length > 0) {
		objBuscar = {
			nombre: new RegExp(genero, "i")
		};
	}

	generoModel.find(objBuscar).sort({nombre: 1}).exec((err, generosEncontradas) => {
		if (err) return res.json([]);
		if (generosEncontradas.length != 0) {
			res.json({
				encontrado: true,
				datos: generosEncontradas
			});
		} else {
			res.json({
				encontrado: false,
				alerta: {
					btnCancelar: false,
					btnAceptar: true,
					mensaje: "No se han podido encontrar géneros con ese nombre.",
					titulo: "Error"
				}
			});
		}
	});

});


router.post("/agregar", middleware.esAdmin, (req, res) => {
	let genero = req.body.nombre;

	let objBuscar = {};
	if (genero.length > 0) {
		objBuscar = {
			nombre: new RegExp(genero, "i")
		};


		generoModel.find(objBuscar, (err, generosEncontradas) => {
			if (err) return res.json([]);
			if (generosEncontradas.length != 0) {
				res.json({
					creado: false,
					alerta: {
						btnCancelar: false,
						btnAceptar: true,
						mensaje: "Ya existe este genero.",
						titulo: "Error"
					}
				});
			} else {
				generoModel.find({}, (err, total) => {
					generoModel.create({
						_id: mongoose.Types.ObjectId(),
						nombre: req.body.nombre.split(" ").map((palabra) => {
							return mayuscula(palabra);
						}).join(" "),
						id: total.length,
						desactivado: false
					}, (err, nuevo) => {
						if (err) return res.json([]);
						console.log("Creado: " + nuevo);
						res.json({
							creado: true,
							alerta: {
								btnCancelar: false,
								btnAceptar: true,
								mensaje: "Genero creado.",
								titulo: `<i class="fas fa-check" style="color: #009688;"></i>`
							}
						});
						utils("registroGenero", req.user, nuevo, "Nuevo género");
					});
				});


			}
		});
	} else {
		res.json({
			creado: false,
			alerta: {
				btnCancelar: false,
				btnAceptar: true,
				mensaje: "Favor llenar los datos.",
				titulo: "Error"
			}
		});
	}

});

router.post("/modificar", middleware.esAdmin, (req, res) => {
	//console.log(req.body.id);
	if(req.body.id != ""){
		generoModel.findOne({
			id: Number(req.body.id)
		}, (err, encontradoFinal) => {
			if(err) return console.log(err)
			if(encontradoFinal) {
				console.log(encontradoFinal);
				//console.log(encontradoFinal.desactivado);
				//console.log(!encontradoFinal.desactivado);
				encontradoFinal.desactivado = !encontradoFinal.desactivado;

				encontradoFinal.save(function (err) {
					if (!err) {
						console.log("Género actualizado");
						utils("modificadoGenero", req.user, encontradoFinal, "Género modificado.");
						res.json({
							creado: true,
							alerta: {
								btnCancelar: false,
								btnAceptar: true,
								mensaje: "Actualizado con éxito",
								titulo: `<i class="fas fa-check" style="color: #009688;"></i>`
							}
						});
					} else {
						console.log("Error: could not save contact ");
						res.json({
							creado: false,
							alerta: {
								btnCancelar: false,
								btnAceptar: true,
								mensaje: "Favor intente más tarde",
								titulo: "Error"
							}
						});
					}
				});
			} else {
				res.json({
					creado: false,
					alerta: {
						btnCancelar: false,
						btnAceptar: true,
						mensaje: "No se ha encontrado el género",
						titulo: "Error"
					}
				});
			}
		});
	} else {
		res.json({
			creado: false,
			alerta: {
				btnCancelar: false,
				btnAceptar: true,
				mensaje: "No se puede modificar un género vacio",
				titulo: "Error"
			}
		});
	}
});

router.post("/editar", middleware.esAdmin, (req, res) => {
	console.log("LLEGO A BACKEND");
	console.log(req.body.id);
	console.log(req.body.nombre);
	if(req.body.id != ""){
		if(req.body.nombre != ""){
			generoModel.findOne({
				id: req.body.id
			}, (err, encontradoFinal) => {
				if(err) return console.log(err)
				if(encontradoFinal) {
					console.log(encontradoFinal);
	
					encontradoFinal.nombre = req.body.nombre;
					encontradoFinal.save(function (err) {
						if (!err) {
							console.log("Género actualizado");
							utils("modificadoGenero", req.user, encontradoFinal, "Género modificado.");
							res.json({
								creado: true,
								alerta: {
									btnCancelar: false,
									btnAceptar: true,
									mensaje: "Actualizado con éxito",
									titulo: `<i class="fas fa-check" style="color: #009688;"></i>`
								}
							});
						} else {
							console.log("Error: could not save contact ");
							res.json({
								creado: false,
								alerta: {
									btnCancelar: false,
									btnAceptar: true,
									mensaje: "Favor intente más tarde",
									titulo: "Error"
								}
							});
						}
					});
				} else {
					res.json({
						creado: false,
						alerta: {
							btnCancelar: false,
							btnAceptar: true,
							mensaje: "No se ha encontrado el género",
							titulo: "Error"
						}
					});
				}
			});
		} else {
			error("Error", "El nombre de este género no puede estar vacio", true, false);
			event.preventDefault();
			return false;
		}
	} else {
		res.json({
			creado: false,
			alerta: {
				btnCancelar: false,
				btnAceptar: true,
				mensaje: "No se puede modificar un género vacio",
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