const app = require("express"),
	path = require("path"),
	libroModel = require("../models/libro"),
	generoModel = require("../models/genero"),
	autorModel = require("../models/autor"),
	inventario = require("../models/inventario"),
	utils = require("../utils"),
	promocion = require("../models/promocion"),
	sucursalModel = require("../models/sucursal"),
	router = app.Router();

const folder = path.join(__dirname, "../public");

router.get("/", (req, res) => {
	res.redirect("./perfilLibro/-1");
});

router.get("/:libro", (req, res) => {
	res.sendFile(`${folder}/perfilLibro/index.html`);
});

router.get("/:libro/listar", (req, res) => {
	//console.log(req.params.libro);
	libroModel.findOne({
		ISBN: req.params.libro
	}, (err, libroEncontrado) => {
		//console.log(libroEncontrado);
		if (err) return res.json([]);
		res.json(libroEncontrado);
	});
});

router.get("/:libro/calificado", (req, res) => {
	//console.log(req.params.libro);
	libroModel.findOne({
		ISBN: req.params.libro,
		'calificado.usuarioId': req.user.usuarioId
	}, (err, libroEncontrado) => {
		//console.log(libroEncontrado);
		if (err) return res.json([]);
		if (libroEncontrado != null) {
			res.json({
				encontrado: true
			});
		} else {
			res.json({
				encontrado: false
			});
		}
	});
});

router.get("/:genero/generos", (req, res) => {
	generoModel.findOne({
		id: req.params.genero
	}, (err, generoEncontrado) => {
		//console.log(generoEncontrado);
		if (err) return res.json([]);
		res.json(generoEncontrado);
	});
});

router.get("/:autor/autores", (req, res) => {
	autorModel.findOne({
		identificador: req.params.autor
	}, (err, autorEncontrado) => {
		//console.log(autorEncontrado);
		if (err) return res.json([]);
		res.json(autorEncontrado);
	});
});

router.get("/:isbn/sucursales3", (req, res) => {
	//console.log(req.params)
	sucursalModel.find({
		libros: {
			$elemMatch: {
				isbn: Number(req.params.isbn)
			}
		}
	}, "nombre id libros", (err, sucursalesEncontradas) => {
		//console.log(sucursalesEncontradas);
		if (err) return res.json([]);
		res.json(sucursalesEncontradas);
	});
});

router.get("/:isbn/sucursales", (req, res) => {
	//console.log(req.params)
	inventario.find({
		isbn: Number(req.params.isbn)
	}, "id isbn cantidad precio", (err, sucursalesEncontradas) => {
		console.log(sucursalesEncontradas);
		//console.log(sucursalesEncontradas);
		if (err) {
			console.log(err);
			return res.json([]);
		} else {
			let arr = [];
			sucursalesEncontradas.forEach((item, index, arrCompleto) => {
				sucursalModel.findOne({
					id: Number(item.id)
				}, "nombre id", (err, sucursalEncontrada) => {
					//console.log(sucursalesEncontradas);
					if (err) {
						console.log(err);
						return res.json([]);
					} else {
						arr.push({
							libros: [item],
							_id: sucursalEncontrada._id,
							nombre: sucursalEncontrada.nombre,
							id: sucursalEncontrada.id
						});
						if (arrCompleto.length == arr.length) {
							return res.json(arr);
						}
					}
				});
			});
		}
	});
});


//Viejo código de Ed.
/*router.get("/:id/sucursales", (req, res) => {
	//console.log(req.params)
	sucursalModel.findOne({
		id: Number(req.params.id)
	}, "nombre id", (err, sucursalEncontrada) => {
		//console.log(sucursalesEncontradas);
		if (err) return res.json([]);
		res.json(sucursalEncontrada);
	});
});*/

router.get("/:isbn/:sucursal/sucursales", (req, res) => {
	inventario.findOne({
		id: Number(req.params.sucursal),
		isbn: Number(req.params.isbn)
	}, (err, sucursalesEncontradas) => {
		//console.log(sucursalesEncontradas);
		if (err) return res.json([]);
		if (sucursalesEncontradas) {
			promocion.findOne({
				sucursal: Number(req.params.sucursal),
				isbn: Number(req.params.isbn)
			}, (err, promoEncontrada) => {
				if (err) return res.json([]);
				if (promoEncontrada) {
					console.log(promoEncontrada.rebaja, promoEncontrada.tipoDescuento);
					if (promoEncontrada.tipoDescuento) {
						res.json(
							Number(sucursalesEncontradas.precio - promoEncontrada.rebaja).toFixed(2)
						);
					} else {
						let descuento = Number((100 - Number(promoEncontrada.rebaja))/100);
						console.log(descuento);
						res.json(
							Number(sucursalesEncontradas.precio * descuento).toFixed(2)
						);
					}
				} else {
					res.json(
						sucursalesEncontradas.precio
					);
				}
			});
		} else {
			res.json({});
		}
		//res.json(sucursalesEncontradas);
	});
});

router.post("/:isbn/calificar", (req, res) => {
	console.log(req.body.calificacion);
	console.log(req.body.resenna);
	console.log(req.params.isbn);
	if (req.body.calificacion > 0 && req.body.calificacion != "") {
		libroModel.findOne({
			ISBN: req.params.isbn
		}, (err, libroEncontrado) => {
			if (err) return res.json([]);
			if (libroEncontrado) {
				const resultado = libroEncontrado.calificado.find(usua => usua.usuarioId === Number(req.user.usuarioId));
				console.log(resultado);
				console.log(resultado);
				if (!resultado) {
					libroModel.updateOne({
						ISBN: Number(req.params.isbn)
					}, {
						$push: {
							calificado: {
								usuarioId: Number(req.user.usuarioId),
								calificacion: Number(req.body.calificacion),
								resenna: req.body.resenna
							}
						}
					}, (err, libroActualizado) => {
						if (err) return res.json([]);
						console.log(libroActualizado);
						libroModel.findOne({
							ISBN: req.params.isbn
						}, 'calificado', (err, libroEncontradoFinal) => {
							if (err) return res.json([]);
							if (libroEncontradoFinal) {
								var cantidad = libroEncontradoFinal.calificado.length;
								console.log(cantidad);
								var suma = 0;
								for (var i = 0; i < cantidad; i++) {
									suma += libroEncontradoFinal.calificado[i].calificacion;
								}
								console.log(suma);
								libroEncontradoFinal.rating = Math.round(Number(suma / cantidad));
								libroEncontradoFinal.calificadoN = Number(cantidad);

								libroEncontradoFinal.save(function (err) {
									if (!err) {
										utils("calificacion", req.user, libroEncontradoFinal, "Libro calificado.");
										//console.log("Usuario actualizado");
										res.json({
											creado: true,
											alerta: {
												btnCancelar: false,
												btnAceptar: true,
												mensaje: "Calificación exitosa",
												titulo: `<i class="fas fa-check" style="color: #009688;"></i>`
											}
										});
									} else {
										//console.log("Error: could not save contact ");
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
							}
						});
					});
				} else {
					res.json({
						creado: false,
						alerta: {
							btnCancelar: false,
							btnAceptar: true,
							mensaje: "Solo puede calificar este libro una vez",
							titulo: "Error"
						}
					});
				}
			} else {
				res.json({
					creado: false,
					alerta: {
						btnCancelar: false,
						btnAceptar: true,
						mensaje: "No ha encontrado el libro",
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
				mensaje: "No puede calificar este libro sin marcar la calificación primero",
				titulo: "Error"
			}
		});
	}
});

module.exports = router;