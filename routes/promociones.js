const app = require("express"),
	path = require("path"),
	mongoose = require("mongoose"),
	promociones = require("../models/promocion"),
	sucursal = require("../models/sucursal"),
	middleware = require("../middleware"),
	libro = require("../models/libro"),
	utils = require("../utils"),
	router = app.Router();

const folder = path.join(__dirname, "../public");

router.get("/", middleware.esAdminOUsuarioLibreria, (req, res) => {
	if (req.user.rol == 1) {
		res.sendFile(`${folder}/buscarPromocionesLibreria/index.html`);
	} else {
		res.sendFile(`${folder}/buscarPromocionesAdmin/index.html`);
	}
});

router.get("/editar/:id", middleware.esAdminOUsuarioLibreria, (req, res) => {
	promociones.findOne({
		idPromo: Number(req.params.id)
	}, (err, encontrada) => {
		if (err) {
			console.log(err);
			return res.json([]);
		}
		if (encontrada) {
			if (req.user.rol == 1) {
				res.sendFile(`${folder}/editarPromocion/index.html`);
			} else {
				res.sendFile(`${folder}/editarPromocionAdmin/index.html`);
			}
		} else {
			res.redirect("/");
		}
	});
});


router.get("/editar/:id/info", middleware.esAdminOUsuarioLibreria, (req, res) => {
	promociones.findOne({
		idPromo: Number(req.params.id)
	}, (err, encontrada) => {
		if (err) {
			console.log(err);
			return res.json({});
		}
		if (encontrada) {
			return res.json(encontrada);
		} else {
			return res.json({});
		}
	});
});


router.post("/editar/:id", middleware.esAdminOUsuarioLibreria, (req, res) => {
	promociones.findOne({
		idPromo: Number(req.params.id)
	}, (err, encontrada) => {
		if (err) {
			console.log(err);
			return res.json([]);
		}
		if (encontrada) {

			let objBuscar = {
				id: encontrada.sucursal
			};

			if (req.user.rol == 1) {
				objBuscar["libreriaId"] = req.user.libreriaId;
			}

			sucursal.findOne(objBuscar, (err, encontradaSucursal) => {
				if (err) {
					console.log(err);
					return res.json([]);
				}
				if (encontradaSucursal) {
					if (new Date(req.body.fechaFin) > new Date()) {
						if ((req.body.tipoDesc == 0 && req.body.montoDesc > 0 && req.body.montoDesc <= 100) ||
							(req.body.tipoDesc == 1 && req.body.montoDesc > 0)) {

							if (err) return res.json([]);
							encontrada.tipoDescuento = req.body.tipoDesc;
							encontrada.rebaja = req.body.montoDesc;
							encontrada.fechaFin = new Date(req.body.fechaFin);
							encontrada.save((err) => {
								if (err) return res.json([]);

								utils("promocionModificada", req.user, encontrada, "Promoción modificada.");
								res.json({
									actualizado: false,
									alerta: {
										btnCancelar: false,
										btnAceptar: true,
										mensaje: "Actualizado con éxito",
										titulo: `<i class="fas fa-check" style="color: #009688;"></i>`
									}
								});
							});


						} else {
							res.json({
								creado: false,
								alerta: {
									btnCancelar: false,
									btnAceptar: true,
									mensaje: "Monto/Porcentaje incorrecto",
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
								mensaje: "La fecha debe ser posterior a la fecha actual.",
								titulo: "Error"
							}
						});
					}
				} else {
					res.json({
						actualizado: false,
						alerta: {
							btnCancelar: false,
							btnAceptar: true,
							mensaje: "No se pudo encontrar la sucursal",
							titulo: "Error"
						}
					});
				}
			});
		} else {
			res.redirect("/");
		}
	});
});



router.get("/eliminar/:id", middleware.esAdminOUsuarioLibreria, (req, res) => {
	promociones.findOne({
		idPromo: Number(req.params.id)
	}, (err, encontrada) => {
		if (err) {
			console.log(err);
			return res.json([]);
		}
		if (encontrada) {

			let objBuscar = {
				id: encontrada.sucursal
			};

			if (req.user.rol == 1) {
				objBuscar["libreriaId"] = req.user.libreriaId;
			}

			sucursal.findOne(objBuscar, (err, encontradaSucursal) => {
				if (err) {
					console.log(err);
					return res.json([]);
				}
				if (encontradaSucursal) {

					if (err) return res.json([]);
					encontrada.remove((err) => {
						if (err) return res.json([]);

						utils("promocionModificada", req.user, encontrada, "Promoción eliminada.");
						res.json({
							actualizado: false,
							alerta: {
								btnCancelar: false,
								btnAceptar: true,
								mensaje: "Eliminada con éxito",
								titulo: `<i class="fas fa-check" style="color: #009688;"></i>`
							}
						});
					});


				} else {
					res.json({
						actualizado: false,
						alerta: {
							btnCancelar: false,
							btnAceptar: true,
							mensaje: "No se pudo encontrar la sucursal",
							titulo: "Error"
						}
					});
				}
			});
		} else {
			res.redirect("/");
		}
	});
});

router.get("/getPromos", middleware.esAdminOUsuarioLibreria, (req, res) => {
	let promosArr = [],
		contador = 0;
	let objBuscar = {};

	if (req.user.rol == 1) {
		objBuscar["libreriaId"] = Number(req.user.libreriaId);
	}

	sucursal.find(objBuscar).exec((err, sucursales) => {
		if (err) {
			console.log(err);
			return res.json([]);
		}
		if (sucursales.length != 0) {
			sucursales.forEach((element, index, arr) => {
				console.log(element.nombre);
				promociones.find({
					sucursal: element.id
				}).sort({
					fechaFin: 1
				}).exec((err, promosEncontradas) => {
					if (err) {
						console.log(err);
						return res.json([]);
					}
					contador++;
					if (promosEncontradas.length != 0) {
						promosArr.push({
							sucursal: element.nombre,
							promo: promosEncontradas
						});
					}
					console.log(contador, arr.length);
					if (contador == arr.length) {
						res.json({
							encontrado: true,
							datos: promosArr
						});
					}
				});





			});
		} else {
			res.json({
				encontrado: false
			});
		}
	});


});
module.exports = router;