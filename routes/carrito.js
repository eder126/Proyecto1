const app = require("express"),
	path = require("path"),
	mongoose = require("mongoose"),
	mail = require("../mail"),
	mailCompraFormato = require("../mailCompraFormato"),
	carrito = require("../models/carrito"),
	sucursal = require("../models/sucursal"),
	inventario = require("../models/inventario"),
	libro = require("../models/libro"),
	global = require("../models/global"),
	usuario = require("../models/usuario"),
	utils = require("../utils"),
	promocion = require("../models/promocion"),
	metodoPago = require("../models/metodoPago"),
	middleware = require("../middleware"),
	comprasManager = require("../comprasManager"),
	router = app.Router();

const folder = path.join(__dirname, "../public");

router.get("/", middleware.esUsuarioRegular, (req, res) => {
	res.sendFile(`${folder}/listarCarrito/index.html`);
});

router.get("/agregar/:isbn/:id", (req, res) => {
	if (req.user.rol != 0) return res.json({
		agregado: false,
		alerta: {
			btnCancelar: false,
			btnAceptar: true,
			mensaje: "Usted no puede comprar libros.",
			titulo: "Error"
		}
	});
	console.log(req.params);
	inventario.findOne({
		id: Number(req.params.id),
		isbn: Number(req.params.isbn)
	}, (err, inventarioEncontrado) => {
		if (err) return res.json([]);
		if (inventarioEncontrado) {
			carrito.findOne({
				usuarioId: req.user.usuarioId
			}, (err, carritoEncontrado) => {
				if (carritoEncontrado) {
					let encontrado = false;
					for (let i = 0; i < carritoEncontrado.libros.length; i++) {
						if (carritoEncontrado.libros[i].isbn == req.params.isbn) encontrado = true;
					}

					if (!encontrado) {
						carritoEncontrado.libros.push({
							isbn: Number(req.params.isbn),
							cantidad: 1,
							sucursal: Number(req.params.id)
						});
						carritoEncontrado.save(function (err) {
							if (!err) {
								utils("libroCarrito", req.user, carritoEncontrado, "Libro añadido al carrito.");
								return res.json({
									agregado: true,
									alerta: {
										btnCancelar: false,
										btnAceptar: true,
										mensaje: "Se ha agregado el libro a tu carrito.",
										titulo: "Añadido con éxito"
									}
								});
							} else {
								console.log("Error: could not save contact ");
							}
						});
					} else {
						return res.json({
							agregado: false,
							alerta: {
								btnCancelar: false,
								btnAceptar: true,
								mensaje: "Ya tienes ese libro en tu carrito.",
								titulo: "Error"
							}
						});
					}


				} else {
					carrito.create({
						_id: mongoose.Types.ObjectId(),
						usuarioId: req.user.usuarioId,
						libros: [{
							isbn: Number(req.params.isbn),
							cantidad: 1,
							sucursal: Number(req.params.id)
						}]
					}, (err, nuevo) => {
						if (err) return res.json([]);
						console.log("Creado carrito: " + nuevo);
						utils("libroCarrito", req.user, nuevo, "Libro añadido al carrito.");
						return res.json({
							agregado: true,
							alerta: {
								btnCancelar: false,
								btnAceptar: true,
								mensaje: "Se ha agregado el libro a tu carrito.",
								titulo: "Añadido con éxito"
							}
						});
					});
				}
			});
		} else {
			return res.json({
				agregado: false,
				alerta: {
					btnCancelar: false,
					btnAceptar: true,
					mensaje: "No se ha encontrado ese libro en la sucursal dada.",
					titulo: "Error"
				}
			});
		}
	});

});

router.get("/carrito", middleware.esUsuarioRegular, (req, res) => {
	carrito.findOne({
		usuarioId: req.user.usuarioId
	}, (err, encontrado) => {
		if (err) return res.json({});
		if (encontrado) {
			res.json(encontrado);
		} else {
			res.json({});
		}
	});
});

router.get("/eliminar/:isbn/", middleware.esUsuarioRegular, (req, res) => {
	console.log(req.params);
	carrito.findOne({
		usuarioId: req.user.usuarioId,
		libros: {
			$elemMatch: {
				isbn: Number(req.params.isbn)
			}
		}
	}, (err, libroEncontrado) => {
		if (libroEncontrado) {
			let index = -1;
			for (let i = 0; i < libroEncontrado.libros.length; i++) {
				if (libroEncontrado.libros[i].isbn == Number(req.params.isbn)) index = i;
			}

			libroEncontrado.libros.splice(index, 1);
			libroEncontrado.save(function (err) {
				if (!err) {
					utils("libroCarrito", req.user, libroEncontrado, "Libro removido del carrito.");
					return res.json({
						eliminado: true,
						alerta: {
							btnCancelar: false,
							btnAceptar: true,
							mensaje: "Se ha eliminado el libro a tu carrito.",
							titulo: "Removido con éxito"
						}
					});
				} else {
					console.log("Error: could not save contact ");
				}
			});


		} else {
			return res.json({
				eliminado: false,
				alerta: {
					btnCancelar: false,
					btnAceptar: true,
					mensaje: "No se encontro ese libro en tu carrito.",
					titulo: "Error"
				}
			});
		}
	});

});

router.get("/sucursal/:id/:isbn/", middleware.esUsuarioRegular, (req, res) => {
	console.log(req.params);
	inventario.findOne({
		id: req.params.id,
		isbn: Number(req.params.isbn)
	}, (err, inventarioEncontrado) => {
		if (inventarioEncontrado) {

			promocion.findOne({
				sucursal: Number(req.params.id),
				isbn: Number(req.params.isbn)
			}, (err, promoEncontrada) => {
				if (err) return res.json([]);
				if (promoEncontrada && new Date(promoEncontrada.fechaFin) > new Date()) {
					let precio = 0;
					console.log(promoEncontrada.rebaja, promoEncontrada.tipoDescuento);
					if (promoEncontrada.tipoDescuento) {
						precio = Number(inventarioEncontrado.precio - promoEncontrada.rebaja);
					} else {
						let descuento = Number((100 - Number(promoEncontrada.rebaja)) / 100);
						console.log(descuento);
						precio = Number(inventarioEncontrado.precio * descuento);
					}
					
					res.json({
						encontrado: true,
						precio: precio,
						cantidad: inventarioEncontrado.cantidad
					});
				} else {
					return res.json({
						encontrado: true,
						precio: inventarioEncontrado.precio,
						cantidad: inventarioEncontrado.cantidad
					});
				}
			});


		} else {
			return res.json({
				encontrado: false,
				alerta: {
					btnCancelar: false,
					btnAceptar: true,
					mensaje: "No se encontro ese libro en la sucursal.",
					titulo: "Error"
				}
			});
		}
	});

});

router.post("/editar/:isbn/", middleware.esUsuarioRegular, (req, res) => {
	carrito.findOne({
		usuarioId: req.user.usuarioId,
		libros: {
			$elemMatch: {
				isbn: Number(req.params.isbn)
			}
		}
	}, (err, libroEncontrado) => {
		if (libroEncontrado) {
			let index = -1;
			for (let i = 0; i < libroEncontrado.libros.length; i++) {
				if (libroEncontrado.libros[i].isbn == Number(req.params.isbn)) index = i;
			}
			if (req.body.cantidad <= 0) req.body.cantidad = 1;
			inventario.findOne({
				id: libroEncontrado.libros[index].sucursal,
				isbn: Number(req.params.isbn)
			}, (err, inventarioEncontrado) => {
				if (inventarioEncontrado) {
					if (inventarioEncontrado.cantidad >= req.body.cantidad) {
						let libro = libroEncontrado.libros[index];
						libro.cantidad = req.body.cantidad;
						libroEncontrado.libros.splice(index, 1);
						libroEncontrado.libros.push(libro);
						libroEncontrado.save(function (err) {
							if (!err) {
								utils("libroCarrito", req.user, libroEncontrado, "Modificado cantidad de libro.");
								return res.json({
									modificado: true,
									alerta: {
										btnCancelar: false,
										btnAceptar: true,
										mensaje: "Se ha modificado la cantidad del libro.",
										titulo: "Modificado con éxito"
									}
								});
							} else {
								console.log("Error: could not save contact ");
							}
						});
					} else {
						return res.json({
							modificado: false,
							alerta: {
								btnCancelar: false,
								btnAceptar: true,
								mensaje: "Esta sucursal no tiene tantos libros.",
								titulo: "Error"
							}
						});
					}


				} else {
					return res.json({
						encontrado: false,
						alerta: {
							btnCancelar: false,
							btnAceptar: true,
							mensaje: "No se encontro ese libro en la sucursal.",
							titulo: "Error"
						}
					});
				}
			});



		} else {
			return res.json({
				modificado: false,
				alerta: {
					btnCancelar: false,
					btnAceptar: true,
					mensaje: "No se encontro ese libro en tu carrito.",
					titulo: "Error"
				}
			});
		}
	});

});

router.get("/libro/:isbn", (req, res) => {
	libro.findOne({
		ISBN: Number(req.params.isbn)
	}).exec((err, libroEncontrado) => {
		if (err) return res.json({});
		res.json(libroEncontrado);
	});
});

router.get("/sucursal/:id", (req, res) => {
	sucursal.findOne({
		id: Number(req.params.id)
	}, "nombre id").exec((err, sucursalEncontrada) => {
		if (err) return res.json({});
		res.json(sucursalEncontrada);
	});
});

router.post("/envio/:isbn/", middleware.esUsuarioRegular, (req, res) => {
	carrito.findOne({
		usuarioId: req.user.usuarioId,
		libros: {
			$elemMatch: {
				isbn: Number(req.params.isbn)
			}
		}
	}, (err, libroEncontrado) => {
		if (libroEncontrado) {
			let index = -1;
			for (let i = 0; i < libroEncontrado.libros.length; i++) {
				if (libroEncontrado.libros[i].isbn == Number(req.params.isbn)) index = i;
			}
			sucursal.findOne({
				id: libroEncontrado.libros[index].sucursal
			}, (err, sucursalEncontrada) => {
				if (sucursalEncontrada) {
					let libro = libroEncontrado.libros[index];
					if (!libro.envio) {
						libro.envio = Number(sucursalEncontrada.costoEnvio);
					} else if (libro.envio != 0) {
						libro.envio = 0;
					} else {
						libro.envio = Number(sucursalEncontrada.costoEnvio);
					}

					libroEncontrado.libros.splice(index, 1);
					libroEncontrado.libros.push(libro);
					libroEncontrado.save(function (err) {
						if (!err) {
							utils("libroCarrito", req.user, libroEncontrado, "Modificado envío de libro.");
							return res.json({
								modificado: true,
								alerta: {
									btnCancelar: false,
									btnAceptar: true,
									mensaje: "Modificado el envío del libro.",
									titulo: "Modificado con éxito"
								}
							});
						} else {
							console.log("Error: could not save contact ");
						}
					});



				} else {
					return res.json({
						encontrado: false,
						alerta: {
							btnCancelar: false,
							btnAceptar: true,
							mensaje: "No se encontro ese libro en la sucursal.",
							titulo: "Error"
						}
					});
				}
			});



		} else {
			return res.json({
				modificado: false,
				alerta: {
					btnCancelar: false,
					btnAceptar: true,
					mensaje: "No se encontro ese libro en tu carrito.",
					titulo: "Error"
				}
			});
		}
	});

});

router.get("/eliminarCompleto/", middleware.esUsuarioRegular, (req, res) => {
	console.log(req.params);
	carrito.findOne({
		usuarioId: req.user.usuarioId
	}, (err, libroEncontrado) => {
		libroEncontrado.libros = [];
		libroEncontrado.save(function (err) {
			if (!err) {
				utils("libroCarrito", req.user, libroEncontrado, "Carrito eliminado.");
				return res.json({
					eliminado: true,
					alerta: {
						btnCancelar: false,
						btnAceptar: true,
						mensaje: "Se ha eliminado el carrito de comrpas.",
						titulo: "Removido con éxito"
					}
				});
			} else {
				console.log("Error: could not save contact ");
			}
		});

	});

});

router.post("/comprar", middleware.esUsuarioRegular, (req, res) => {
	if (req.body.tarjeta == "") return res.json({
		finalizado: false,
		alerta: {
			btnCancelar: false,
			btnAceptar: true,
			mensaje: "Favor escoger una tarjeta.",
			titulo: "Error"
		}
	});
	global.findOne({
		"impuestoVentas": {
			$exists: true
		}
	}, (err, impuesto) => {
		if (!err && impuesto) {
			carrito.findOne({
				usuarioId: req.user.usuarioId,
				libros: {
					$exists: true
				}
			}, (err, carritoEncontrado) => {
				if (err) return res.json({});
				if (carritoEncontrado) {

					metodoPago.findOne({
						propietario: req.user.usuarioId,
						_id: req.body.tarjeta
					}, (err, tarjetaEncontrada) => {
						if (err) return res.json({});
						console.log(tarjetaEncontrada);
						if (tarjetaEncontrada) {


							let libros = carritoEncontrado.libros;

							console.log("libros", libros);

							comprasManager.revisarLibros(libros).then(item => {
								console.log("Devuelta:", item);
								comprasManager.compraFunc(item, impuesto, req).then(item2 => {
									console.log("Devuelta 2:", item2);
									mailCompraFormato(item2.finalizadas, (respuestaMail) => {
										console.log("enviado");
										//Cambiar correo a req.user.email 
										mail("", req.user.email, "Compra en Libros.cr", "", respuestaMail);
										return res.json(item2.mensaje);
									});
								}).catch(
									catchMsj => {
										return res.json(catchMsj);
									}
								);
							}).catch(
								catchMsj => {
									return res.json(catchMsj);
								}
							);


							/* let indexOfLibro = carritoNuevo.indexOf(item);
										carritoNuevo.splice(indexOfLibro, 1); */


						} else {
							return res.json({
								modificado: false,
								alerta: {
									btnCancelar: false,
									btnAceptar: true,
									mensaje: "La tarjeta no se pudo encontrar.",
									titulo: "Error"
								}
							});
						}
					});

				} else {
					return res.json({
						modificado: false,
						alerta: {
							btnCancelar: false,
							btnAceptar: true,
							mensaje: "El carrito está vacío.",
							titulo: "Error"
						}
					});
				}
			});
		} else {
			return res.json({
				finalizado: false,
				alerta: {
					btnCancelar: false,
					btnAceptar: true,
					mensaje: "El impuesto de ventas no está configurado correctamente.",
					titulo: "Error"
				}
			});
		}
	});



});

module.exports = router;