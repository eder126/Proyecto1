const app = require("express"),
	path = require("path"),
	mongoose = require("mongoose"),
	categoriaModel = require("../models/categoria"),
	middleware = require("../middleware"),
	utils = require("../utils"),
	router = app.Router();

const folder = path.join(__dirname, "../public");

router.get("/", middleware.esAdmin, (req, res) => {
	res.sendFile(`${folder}/buscarCategorias/index.html`);
});

router.post("/", middleware.esAdmin,  (req, res) => {
	let categoria = req.body.nombre;

	let objBuscar = {};
	if (categoria.length > 0) {
		objBuscar = {
			nombre: new RegExp(categoria, "i")
		};
	}

	categoriaModel.find(objBuscar).sort({nombre: 1}).exec((err, categoriasEncontradas) => {
		if (err) return res.json([]);
		if (categoriasEncontradas.length != 0) {
			res.json({
				encontrado: true,
				datos: categoriasEncontradas
			});
		} else {
			res.json({
				encontrado: false,
				alerta: {
					btnCancelar: false,
					btnAceptar: true,
					mensaje: "No se han podido encontrar categorías con ese nombre.",
					titulo: "Error"
				}
			});
		}
	});
});

router.post("/agregar", middleware.esAdmin,  (req, res) => {
	let categoria = req.body.nombre;

	let objBuscar = {};
	if (categoria.length > 0) {
		objBuscar = {
			nombre: new RegExp(categoria, "i")
		};

		categoriaModel.find(objBuscar, (err, categoriasEncontradas) => {
			if (err) return res.json([]);
			if (categoriasEncontradas.length != 0) {
				res.json({
					creado: false,
					alerta: {
						btnCancelar: false,
						btnAceptar: true,
						mensaje: "Ya existe esa categoria.",
						titulo: "Error"
					}
				});
			} else {
				categoriaModel.find({}, (err, total) => {
					categoriaModel.create({
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
								mensaje: "Categoria creada.",
								titulo: `<i class="fas fa-check" style="color: #009688;"></i>`
							}
						});
						utils("registroCategoria", req.user, nuevo, "Nuevo categoría");
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
		categoriaModel.findOne({
			id: Number(req.body.id)
		}, (err, encontradoFinal) => {
			if(err) return console.log(err)
			if(encontradoFinal) {
				//console.log(encontradoFinal);
				//console.log(encontradoFinal.desactivado);
				//console.log(!encontradoFinal.desactivado);
				encontradoFinal.desactivado = !encontradoFinal.desactivado;

				encontradoFinal.save(function (err) {
					if (!err) {
						console.log("Categoría actualizada");
						utils("modificadoCategoria", req.user, encontradoFinal, "Categoría modificada.");
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
						mensaje: "No se ha encontrado la categoría",
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
				mensaje: "No se puede modificar una categoría vacia",
				titulo: "Error"
			}
		});
	}
});

router.post("/editar", middleware.esAdmin, (req, res) => {
	//console.log("LLEGO A BACKEND");
	//console.log(req.body.id);
	//console.log(req.body.nombre);
	if(req.body.id != ""){
		if(req.body.nombre != ""){
			categoriaModel.findOne({
				id: req.body.id
			}, (err, encontradoFinal) => {
				if(err) return console.log(err)
				if(encontradoFinal) {
					//console.log(encontradoFinal);
	
					encontradoFinal.nombre = req.body.nombre;
					encontradoFinal.save(function (err) {
						if (!err) {
							console.log("Categoría actualizada");
							utils("modificadoCategoria", req.user, encontradoFinal, "Categoría modificada.");
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
							mensaje: "No se ha encontrado la categoría",
							titulo: "Error"
						}
					});
				}
			});
		} else {
			error("Error", "El nombre de esta categoría no puede estar vacia", true, false);
			event.preventDefault();
			return false;
		}
	} else {
		res.json({
			creado: false,
			alerta: {
				btnCancelar: false,
				btnAceptar: true,
				mensaje: "No se puede modificar una categoría vacia",
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