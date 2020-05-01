const app = require("express"),
	path = require("path"),
	sucursal = require("../models/sucursal"),
	libro = require("../models/libro"),
	inventario = require("../models/inventario"),
	middleware = require("../middleware"),
	mongoose = require("mongoose"),
	utils = require("../utils"),
	router = app.Router();

const folder = path.join(__dirname, "../public");

router.get("/", middleware.esAdmin, (req, res) => {
	res.sendFile(`${folder}/agregarInventarioAdmin/index.html`);
});

router.post("/", middleware.esAdmin, (req, res) => {

	if (req.body.isbn != "" && !isNaN(req.body.isbn) && req.body.cantidad != "" && req.body.cantidad > 0 && !isNaN(req.body.cantidad) && req.body.sucursal != "" && !isNaN(req.body.sucursal) &&
		req.body.precio != "" && req.body.precio > 0 && !isNaN(req.body.precio)) {

		sucursal.find({
			id: Number(req.body.sucursal)
		}, (err, encontrado) => {
			if (err) {
				console.log(err);
				return res.json([]);
			}
			console.log("Encontrado: " + typeof encontrado);
			console.log(encontrado);
			if (encontrado.length != 0) {
				libro.findOne({
					ISBN: Number(req.body.isbn)
				}, (err, libroEncontrado) => {
					if (err) {
						console.log(err);
						return res.json([]);
					}
					console.log("Encontrado: " + typeof libroEncontrado);
					console.log(libroEncontrado);
					if (libroEncontrado) {


						inventario.findOne({
							id: Number(req.body.sucursal),
							isbn: libroEncontrado.ISBN
						}, (err, inventarioEncontrado) => {
							if (err) {
								console.log(err);
								return res.json([]);
							}
							if (inventarioEncontrado) {
								console.log("Encontrado testest");
								//obj.cantidad += req.body.cantidad;
								//obj.precio = req.body.precio; //Actualizar acá
								return res.json({
									creado: false,
									alerta: {
										btnCancelar: false,
										btnAceptar: true,
										mensaje: "Ya existe este libro en su inventario.",
										titulo: "Error"
									}
								});
							} else {


								inventario.create({
									_id: mongoose.Types.ObjectId(),
									id: Number(req.body.sucursal),
									nombre: libroEncontrado.nombre,
									precio: Number(req.body.precio),
									cantidad: Number(req.body.cantidad),
									isbn: libroEncontrado.ISBN,
									formato: libroEncontrado.formato
								}, (err, nuevo) => {
									if (err) {
										console.log(err);
										return res.json([]);
									}
									console.log("Creado: " + nuevo);
									res.json({
										creado: true,
										alerta: {
											btnCancelar: false,
											btnAceptar: true,
											mensaje: "Agregado con éxito",
											titulo: `<i class="fas fa-check" style="color: #009688;"></i>`
										}
									});
									utils("nuevoInventario", req.user, nuevo, "Libro añadido a inventario.");
								});

							}



						});

					} else {
						res.json({
							creado: false,
							alerta: {
								btnCancelar: false,
								btnAceptar: true,
								mensaje: "ISBN no encontrado.",
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
						mensaje: "No se han encontrado resultados con el id de librería.",
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
				mensaje: "Favor llenar los campos",
				titulo: "Error"
			}
		});
	}
});



router.get("/sucursales", middleware.esAdmin, (req, res) => {

	console.log(req.body);

	sucursal.find({}).sort({
		nombre: 1
	}).exec((err, encontrado) => {
		if (err) {
			console.log(err);
			return res.json([]);
		}
		console.log("Encontrado: " + typeof encontrado);
		console.log(encontrado);

		var arr = [];
		if (encontrado.length != 0) {

			encontrado.forEach(item => arr.push({
				id: item.id,
				nombre: item.nombre
			}));

			res.json({
				sucursales: arr
			});

		} else {
			res.json({
				sucursales: arr
			});
		}
	});


});




module.exports = router;