const app = require("express"),
	path = require("path"),
	promocionModel = require("../models/promocion"),
	libreriaModel = require("../models/usuario"),
	sucursalModel = require("../models/sucursal"),
	mongoose = require("mongoose"),
	utils = require("../utils"),
	middleware = require("../middleware"),
	inventario = require("../models/inventario"),
	router = app.Router();

const folder = path.join(__dirname, "../public/registrarPromocionAdmin");

router.get("/", middleware.esAdmin, (req, res) => {
	res.sendFile(`${folder}/index.html`);
});

router.post("/", middleware.esAdmin, (req, res) => {
	if (req.body.isbn != "" && req.body.tipoDesc != "" && req.body.montoDesc != "" && req.body.fechaFin != "" && req.body.sucursal != "" && !isNaN(req.body.sucursal)) {
		if (new Date(req.body.fechaFin) > new Date()) {
			if ((req.body.tipoDesc == 0 && req.body.montoDesc > 0 && req.body.montoDesc <= 100) ||
				(req.body.tipoDesc == 1 && req.body.montoDesc > 0)) {

				libreriaModel.find({}, function (err, encontrado) {
					if (err) return res.json([]);
					if (encontrado.length != 0) {

						inventario.findOne({
							id: req.body.sucursal,
							isbn: Number(req.body.isbn)
						}, (err, encontrado) => {
							if (err) return res.json([]);
							if (encontrado) {

								promocionModel.find({}, (err, promos) => {
									//console.log(promos);
									if (err) return res.json([]);

									var idPromocion = undefined;
									let ids = [];
									console.log(promos);
									for (let ii = 0; ii < promos.length; ii++) {
										ids.push(promos[ii].idPromo);
									}
									for (let iii = 0; iii < promos.length; iii++) {
										if (ids.indexOf(iii) == -1) {
											idPromocion = iii;
											break;
										} else {
											idPromocion = promos.length;
										}
									}
									//console.log(promoExiste);
									if (err) return res.json([]);
									promocionModel.create({
										_id: mongoose.Types.ObjectId(),
										idPromo: idPromocion,
										isbn: req.body.isbn,
										tipoDescuento: req.body.tipoDesc,
										rebaja: req.body.montoDesc,
										fechaFin: new Date(req.body.fechaFin),
										sucursal: req.body.sucursal
									}, (err, nuevo) => {
										if (err) return res.json([]);
										console.log("Creado: " + nuevo);
										res.json({
											creado: true,
											alerta: {
												btnCancelar: false,
												btnAceptar: true,
												mensaje: "Promoción creada.",
												titulo: `<i class="fas fa-check" style="color: #009688;"></i>`
											}
										});
										utils("registroPromocion", req.user, nuevo, "Nueva promoción");
									});
								});
							} else {
								res.json({
									creado: false,
									alerta: {
										btnCancelar: false,
										btnAceptar: true,
										mensaje: "Libro no está en inventario.",
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
								mensaje: "No existe una librería con ese Id.",
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
			creado: false,
			alerta: {
				btnCancelar: false,
				btnAceptar: true,
				mensaje: "Favor llenar los campos",
				titulo: "Error"
			}
		});
	}
});

router.get("/libreria", middleware.esAdmin, (req, res) => {
	libreriaModel.findOne({}, (err, libreriaEncontrada) => {
		if (err) return res.json([]);
		res.json(libreriaEncontrada);
	});
});

router.get("/sucursales", middleware.esAdmin, (req, res) => {
	sucursalModel.find({}, (err, sucursalEncontrada) => {
		//console.log(sucursalEncontrada);
		if (err) return res.json([]);
		res.json(sucursalEncontrada);
	});
});

router.get("/:sucursal/sucursal", middleware.esAdmin, (req, res) => {
	if (isNaN(req.params.sucursal)) {
		return res.json([]);
	}
	sucursalModel.findOne({
		id: req.params.sucursal
	}, (err, sucursalEncontrada) => {
		console.log(sucursalEncontrada);
		if (err) return res.json([]);
		res.json(sucursalEncontrada);
	});
});

router.get("/:sucursal/:isbn/promocion", middleware.esAdmin, (req, res) => {
	if (isNaN(req.params.sucursal)) {
		return res.json([]);
	}
	promocionModel.find({
		isbn: req.params.isbn,
		sucursal: req.params.sucursal
	}, (err, promocionEncontrada) => {
		if (err) return res.json([]);
		res.json(promocionEncontrada);
	});
});

router.get("/libro/:sucursal/:isbn", middleware.esAdmin, (req, res) => {
	inventario.findOne({
		id: req.params.sucursal,
		isbn: Number(req.params.isbn)
	}, "nombre id", (err, isbnEncontrado) => {
		if (err) return res.json({});
		res.json(isbnEncontrado);
	});
});



router.get("/libros/:sucursal", middleware.esAdmin, (req, res) => {
	inventario.find({
		id: req.params.sucursal
	}, (err, inventarioEncontrado) => {
		if (err) return res.json([]);
		if (inventarioEncontrado.length > 0) {
			res.json(inventarioEncontrado.sort((a, b) => {
				if (a.nombre < b.nombre) {
					return -1;
				}
				if (a.nombre > b.nombre) {
					return 1;
				}
				return 0;
			}));
		} else {
			res.json({});
		}
	});
});

router.get("/sucursales/:libreriaId", middleware.esAdmin, (req, res) => {
	sucursalModel.find({
		libreriaId: req.params.libreriaId
	}, "nombre id").sort({
		nombre: 1
	}).exec((err, sucursalEncontrada) => {
		if (err) return res.json([]);
		if (sucursalEncontrada) {
			res.json(sucursalEncontrada);
		} else {
			res.json({});
		}
	});
});

router.get("/librerias", middleware.esAdmin, (req, res) => {
	libreriaModel.find({
		rol: 1
	}, "libreriaId nombreFantasia").sort({
		nombreFantasia: 1
	}).exec((err, sucursalEncontrada) => {
		if (err) return res.json([]);
		if (sucursalEncontrada) {
			res.json(sucursalEncontrada);
		} else {
			res.json({});
		}
	});
});

module.exports = router;