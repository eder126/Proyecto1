const app = require("express"),
	path = require("path"),
	usuarioModel = require("../models/usuario"),
	libroModel = require("../models/libro"),
	sucursalModel = require("../models/sucursal"),
	intercambioModel = require("../models/intercambio"),
	chatModel = require("../models/chat"),
	mongoose = require("mongoose"),
	utils = require("../utils"),
	middleware = require("../middleware"),
	router = app.Router();

const folder = path.join(__dirname, "../public");

router.get("/", middleware.loggeado, (req, res) => {
	res.sendFile(`${folder}/intercambios/index.html`);
});

router.get("/intercambio/:id", middleware.loggeado, (req, res) => {
	intercambioModel.findOne({
		idIntercambio: req.params.id,
		$or: [{
			emisorId: Number(req.user.usuarioId)
		}, {
			receptorId: Number(req.user.usuarioId)
		}]
	}, (err, encontrado) => {
		if (err) return res.json([]);
		if (encontrado) {
			sucursalModel.findOne({
				id: Number(encontrado.sucursal)
			}, (err, sucursalEncontrada) => {
				if (err) return res.json([]);
				if (sucursalEncontrada) {
					res.json({
						encontrado: true,
						sucursalNombre: sucursalEncontrada.nombre,
						idSucursal: sucursalEncontrada.id,
						lat: sucursalEncontrada.direccion.coordenadas.lat,
						long: sucursalEncontrada.direccion.coordenadas.long,
						dia: encontrado.dia,
						hora: encontrado.hora
					});
				} else {
					res.json({
						encontrado: false,
						sucursal: undefined
					});
				}
			});
		} else {
			res.json({
				encontrado: false,
				sucursal: undefined
			});
		}
	});
});

router.get("/solicitudesSalientes", middleware.loggeado, (req, res) => {
	intercambioModel.find({
		emisorId: Number(req.user.usuarioId),
		aceptada: false,
		$and: [{
			finalizadoEmisor: false
		}, {
			finalizadoReceptor: false
		}]
	}, (err, encontrado) => {
		if (err) return res.json([]);
		if (encontrado.length != 0) {
			var arr = [];
			encontrado.forEach((item, index, arrCompleto) => {
				usuarioModel.findOne({
					usuarioId: Number(item.receptorId),
				}, "nombre usuarioId", (err, receptorEncontrado) => {
					if (err) return res.json([]);
					usuarioModel.findOne({
						usuarioId: Number(req.user.usuarioId),
					}, "nombre usuarioId", (err, emisorEncontrado) => {
						if (err) return res.json([]);
						libroModel.findOne({
							ISBN: Number(item.receptorISBN),
						}, "nombre ISBN", (err, receptorLibroEncontrado) => {
							if (err) return res.json([]);
							libroModel.findOne({
								ISBN: Number(item.emisorISBN),
							}, "nombre ISBN", (err, emisorLibroEncontrado) => {
								if (err) return res.json([]);

								arr.push({
									idIntercambio: item.idIntercambio,
									emisorId: emisorEncontrado.usuarioId,
									emisorNombre: emisorEncontrado.nombre,
									emisorISBN: emisorLibroEncontrado.ISBN,
									emisorLibro: emisorLibroEncontrado.nombre,
									receptorId: receptorEncontrado.usuarioId,
									receptorNombre: receptorEncontrado.nombre,
									receptorISBN: receptorLibroEncontrado.ISBN,
									receptorLibro: receptorLibroEncontrado.nombre
								});
								if (arrCompleto.length == arr.length) {
									return res.json({
										encontrado: true,
										entrante: false,
										saliente: true,
										activa: false,
										finalizada: false,
										solicitudes: arr
									});
								}
							});
						});
					});
				});
			});
		} else {
			res.json({
				encontrado: false,
				solicitudes: []
			});
		}
	});
});

router.get("/solicitudesEntrantes", middleware.loggeado, (req, res) => {
	intercambioModel.find({
		receptorId: Number(req.user.usuarioId),
		aceptada: false,
		$and: [{
			finalizadoEmisor: false
		}, {
			finalizadoReceptor: false
		}]
	}, (err, encontrado) => {
		if (err) return res.json([]);
		if (encontrado.length != 0) {
			var arr = [];
			encontrado.forEach((item, index, arrCompleto) => {
				usuarioModel.findOne({
					usuarioId: Number(req.user.usuarioId),
				}, "nombre usuarioId", (err, receptorEncontrado) => {
					if (err) return res.json([]);
					usuarioModel.findOne({
						usuarioId: Number(item.emisorId),
					}, "nombre usuarioId", (err, emisorEncontrado) => {
						if (err) return res.json([]);
						libroModel.findOne({
							ISBN: Number(item.receptorISBN),
						}, "nombre ISBN", (err, receptorLibroEncontrado) => {
							if (err) return res.json([]);
							libroModel.findOne({
								ISBN: Number(item.emisorISBN),
							}, "nombre ISBN", (err, emisorLibroEncontrado) => {
								if (err) return res.json([]);

								arr.push({
									idIntercambio: item.idIntercambio,
									emisorId: emisorEncontrado.usuarioId,
									emisorNombre: emisorEncontrado.nombre,
									emisorISBN: emisorLibroEncontrado.ISBN,
									emisorLibro: emisorLibroEncontrado.nombre,
									receptorId: receptorEncontrado.usuarioId,
									receptorNombre: receptorEncontrado.nombre,
									receptorISBN: receptorLibroEncontrado.ISBN,
									receptorLibro: receptorLibroEncontrado.nombre
								});
								if (arrCompleto.length == arr.length) {
									return res.json({
										encontrado: true,
										entrante: true,
										saliente: false,
										activa: false,
										finalizada: false,
										solicitudes: arr
									});
								}
							});
						});
					});
				});
			});
		} else {
			res.json({
				encontrado: false,
				solicitudes: []
			});
		}
	});
});

router.get("/activas", middleware.loggeado, (req, res) => {
	intercambioModel.find({
		$and: [{
			$or: [{
				emisorId: Number(req.user.usuarioId)
			}, {
				receptorId: Number(req.user.usuarioId)
			}]
		},
		{
			$or: [{
				finalizadoEmisor: false
			}, {
				finalizadoReceptor: false
			}]
		}
		],
		aceptada: true
	}, (err, encontrado) => {
		if (err) return res.json([]);
		if (encontrado.length != 0) {
			var arr = [];
			encontrado.forEach((item, index, arrCompleto) => {
				usuarioModel.findOne({
					usuarioId: Number(item.receptorId),
				}, "nombre usuarioId", (err, receptorEncontrado) => {
					if (err) return res.json([]);
					usuarioModel.findOne({
						usuarioId: Number(item.emisorId),
					}, "nombre usuarioId", (err, emisorEncontrado) => {
						if (err) return res.json([]);
						libroModel.findOne({
							ISBN: Number(item.receptorISBN),
						}, "nombre ISBN", (err, receptorLibroEncontrado) => {
							if (err) return res.json([]);
							libroModel.findOne({
								ISBN: Number(item.emisorISBN),
							}, "nombre ISBN", (err, emisorLibroEncontrado) => {
								if (err) return res.json([]);
								chatModel.findOne({
									idIntercambio: item.idIntercambio
								}, "idChat", (err, chatEncontrado) => {
									if (err) return res.json([]);
									var emisorYo = false;
									if (Number(emisorEncontrado.usuarioId) === Number(req.user.usuarioId)) {
										emisorYo = true;
									}
									arr.push({
										idIntercambio: item.idIntercambio,
										idChat: chatEncontrado.idChat,
										emisorYo: emisorYo,
										emisorId: emisorEncontrado.usuarioId,
										emisorNombre: emisorEncontrado.nombre,
										emisorISBN: emisorLibroEncontrado.ISBN,
										emisorLibro: emisorLibroEncontrado.nombre,
										receptorId: receptorEncontrado.usuarioId,
										receptorNombre: receptorEncontrado.nombre,
										receptorISBN: receptorLibroEncontrado.ISBN,
										receptorLibro: receptorLibroEncontrado.nombre
									});
									if (arrCompleto.length == arr.length) {
										console.log(arr);
										return res.json({
											encontrado: true,
											entrante: false,
											saliente: false,
											activa: true,
											finalizada: false,
											solicitudes: arr
										});
									}
								});
							});
						});
					});
				});
			});
		} else {
			res.json({
				encontrado: false,
				solicitudes: []
			});
		}
	});
});

router.get("/finalizadas", middleware.loggeado, (req, res) => {
	intercambioModel.find({
		$and: [{
			$or: [{
				emisorId: Number(req.user.usuarioId)
			}, {
				receptorId: Number(req.user.usuarioId)
			}]
		},
		{
			$and: [{
				finalizadoEmisor: true
			}, {
				finalizadoReceptor: true
			}]
		}
		],
		aceptada: true
	}, (err, encontrado) => {
		if (err) return res.json([]);
		if (encontrado.length != 0) {
			var arr = [];
			encontrado.forEach((item, index, arrCompleto) => {
				usuarioModel.findOne({
					usuarioId: Number(item.receptorId),
				}, "nombre usuarioId", (err, receptorEncontrado) => {
					if (err) return res.json([]);
					usuarioModel.findOne({
						usuarioId: Number(item.emisorId),
					}, "nombre usuarioId", (err, emisorEncontrado) => {
						if (err) return res.json([]);
						libroModel.findOne({
							ISBN: Number(item.receptorISBN),
						}, "nombre ISBN", (err, receptorLibroEncontrado) => {
							if (err) return res.json([]);
							libroModel.findOne({
								ISBN: Number(item.emisorISBN),
							}, "nombre ISBN", (err, emisorLibroEncontrado) => {
								if (err) return res.json([]);

								var emisorYo = false;
								if (Number(emisorEncontrado.usuarioId) === Number(req.user.usuarioId)) {
									emisorYo = true;
								}
								arr.push({
									idIntercambio: item.idIntercambio,
									emisorYo: emisorYo,
									emisorId: emisorEncontrado.usuarioId,
									emisorNombre: emisorEncontrado.nombre,
									emisorISBN: emisorLibroEncontrado.ISBN,
									emisorLibro: emisorLibroEncontrado.nombre,
									receptorId: receptorEncontrado.usuarioId,
									receptorNombre: receptorEncontrado.nombre,
									receptorISBN: receptorLibroEncontrado.ISBN,
									receptorLibro: receptorLibroEncontrado.nombre
								});
								if (arrCompleto.length == arr.length) {
									return res.json({
										encontrado: true,
										entrante: false,
										saliente: false,
										activa: false,
										finalizada: true,
										solicitudes: arr
									});
								}
							});
						});
					});
				});
			});
		} else {
			res.json({
				encontrado: false,
				solicitudes: []
			});
		}
	});
});

router.get("/todas", middleware.loggeado, (req, res) => {
	intercambioModel.find({}, (err, encontrado) => {
		if (err) return res.json([]);
		res.json(encontrado);
	});
});

router.get("/aceptar/:id", middleware.loggeado, (req, res) => {
	intercambioModel.findOne({
		idIntercambio: Number(req.params.id),
		receptorId: Number(req.user.usuarioId),
		aceptada: false,
		$and: [{
			finalizadoEmisor: false
		}, {
			finalizadoReceptor: false
		}]
	}, (err, encontrado) => {
		if (err) return res.json([]);
		console.log(encontrado);
		if (encontrado) {
			if (new Date(encontrado.dia) > new Date()) {
				encontrado.aceptada = true;
				encontrado.save(function (err) {
					if (!err) {
						usuarioModel.updateOne({
							usuarioId: Number(encontrado.receptorId)
						}, {
							$set: {
								"libros.$[elem].intercambio": false,
								"libros.$[elem].intercambiado": true
							}
						}, {
							arrayFilters: [{
								"elem.isbn": Number(encontrado.receptorISBN)
							}],
							multi: true
						},
						(err, ReceptorLibrosActualizados) => {
							if (err) return res.json([]);
							console.log(ReceptorLibrosActualizados);
							if (!err) {
								usuarioModel.updateOne({
									usuarioId: Number(encontrado.emisorId)
								}, {
									$set: {
										"libros.$[elem].intercambio": false,
										"libros.$[elem].intercambiado": true
									}
								}, {
									arrayFilters: [{
										"elem.isbn": Number(encontrado.emisorISBN)
									}],
									multi: true
								},
								(err, EmisorLibrosActualizados) => {
									if (err) return res.json([]);
									console.log(EmisorLibrosActualizados);
									if (!err) {
										chatModel.find({}, (err, chatEncontrados) => {
											if (err) return res.json([]);
											var idChat = undefined;
											let ids = [];
											for (let ii = 0; ii < chatEncontrados.length; ii++) {
												ids.push(chatEncontrados[ii].idChat);
											}
											for (let iii = 0; iii < chatEncontrados.length; iii++) {
												if (ids.indexOf(iii) == -1) {
													idChat = iii;
													break;
												} else {
													idChat = chatEncontrados.length;
												}
											}
											if (idChat == undefined) {
												idChat = 0;
											}
											var arr = [Number(encontrado.emisorId), Number(encontrado.receptorId)];
											chatModel.create({
												_id: mongoose.Types.ObjectId(),
												idChat: idChat,
												Club: false,
												idIntercambio: encontrado.idIntercambio,
												miembros: arr
											}, (err, nuevo) => {
												console.log(err);
												if (err) return res.json([]);
												console.log(nuevo);
												if (!err) {
													res.json({
														creado: true,
														alerta: {
															btnCancelar: false,
															btnAceptar: true,
															mensaje: "Oferta aceptada",
															titulo: `<i class="fas fa-check" style="color: #009688;"></i>`
														}
													});
													utils("ofertaAceptada", req.user, nuevo, "Oferta aceptada");
												} else {
													res.json({
														creado: false,
														alerta: {
															btnCancelar: false,
															btnAceptar: true,
															mensaje: "Favor intente luego",
															titulo: "Error"
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
												mensaje: "Favor intente luego",
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
										mensaje: "Favor intente luego",
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
								mensaje: "Favor intente más tarde",
								titulo: "Error"
							}
						});
					}
				});
			} else {
				intercambioModel.deleteOne({
					idIntercambio: Number(req.params.id)
				},
				(err, intercambioActualizado) => {
					if (err) return res.json([]);
					console.log(intercambioActualizado);
					if (!err) {
						res.json({
							creado: true,
							alerta: {
								btnCancelar: false,
								btnAceptar: true,
								mensaje: "Debido a que la fecha de esta solicitud de intercambio ya paso, se ha rechazado automaticamente",
								titulo: `<i class="fas fa-check" style="color: #009688;"></i>`
							}
						});
					} else {
						res.json({
							creado: false,
							alerta: {
								btnCancelar: false,
								btnAceptar: true,
								mensaje: "Favor intente mas tarde",
								titulo: "Error"
							}
						});
					}
				});
			}
		} else {
			res.json({
				creado: false,
				alerta: {
					btnCancelar: false,
					btnAceptar: true,
					mensaje: "Favor intente mas tarde",
					titulo: "Error"
				}
			});
		}
	});
});

router.get("/rechazar/:id", middleware.loggeado, (req, res) => {
	intercambioModel.findOne({
		idIntercambio: Number(req.params.id),
		receptorId: Number(req.user.usuarioId),
		aceptada: false,
		$and: [{
			finalizadoEmisor: false
		}, {
			finalizadoReceptor: false
		}]
	}, (err, encontrado) => {
		if (err) return res.json([]);
		console.log(encontrado);
		if (encontrado) {
			intercambioModel.deleteOne({
				idIntercambio: Number(encontrado.idIntercambio)
			},
			(err, intercambioActualizado) => {
				if (err) return res.json([]);
				console.log(intercambioActualizado);
				if (!err) {
					res.json({
						creado: true,
						alerta: {
							btnCancelar: false,
							btnAceptar: true,
							mensaje: "Oferta rechazada",
							titulo: `<i class="fas fa-check" style="color: #009688;"></i>`
						}
					});
				} else {
					res.json({
						creado: false,
						alerta: {
							btnCancelar: false,
							btnAceptar: true,
							mensaje: "Favor intente mas tarde",
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
					mensaje: "Favor intente mas tarde",
					titulo: "Error"
				}
			});
		}
	});
});

module.exports = router;