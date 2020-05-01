const app = require("express"),
	path = require("path"),
	usuarioModel = require("../models/usuario"),
	intercambioModel = require("../models/intercambio"),
	chatModel = require("../models/chat"),
	mongoose = require("mongoose"),
	utils = require("../utils"),
	middleware = require("../middleware"),
	router = app.Router();

const folder = path.join(__dirname, "../public");

router.get("/:id", middleware.loggeado, (req, res) => {
	res.sendFile(`${folder}/chatI/index.html`);
});

router.get("/:id/chat", middleware.loggeado, (req, res) => {
	chatModel.findOne({
		idChat: req.params.id,
		"miembros": Number(req.user.usuarioId)
	}, (err, chatEncontrado) => {
		if (err) return res.json([]);
		if (chatEncontrado) {
			res.json({
				encontrado: true,
				chat: chatEncontrado
			});
		} else {
			res.json({
				encontrado: false,
				chats: chatEncontrado
			});
		}
	});
});

router.get("/:id/chats", middleware.loggeado, (req, res) => {
	chatModel.find({}, (err, chatEncontrados) => {
		if (err) return res.json([]);
		if (chatEncontrados.length != 0) {
			res.json({
				encontrado: true,
				chats: chatEncontrados
			});
		} else {
			res.json({
				encontrado: false,
				chats: []
			});
		}
	});
});

router.get("/:id/miembro", middleware.loggeado, (req, res) => {
	chatModel.findOne({
		idChat: req.params.id,
		"miembros": Number(req.user.usuarioId)
	}, (err, chatEncontrado) => {
		if (err) return res.json([]);
		if (chatEncontrado) {
			var otroUsuario = -1;
			otroUsuario = Number(chatEncontrado.miembros[0]) == Number(req.user.usuarioId) ? chatEncontrado.miembros[1] : chatEncontrado.miembros[0];
			console.log(otroUsuario);
			usuarioModel.findOne({
				usuarioId: otroUsuario
			}, "nombre apellido url usuarioId", (err, usuarioEncontrado) => {
				if (err) return res.json([]);
				if (usuarioEncontrado) {
					intercambioModel.findOne({
						idIntercambio: chatEncontrado.idIntercambio,
						$or: [{
							emisorId: Number(req.user.usuarioId)
						}, {
							receptorId: Number(req.user.usuarioId)
						}]
					}, "idIntercambio emisorId finalizadoReceptor finalizadoEmisor", (err, intercambioEncontrado) => {
						if (err) return res.json([]);
						if (intercambioEncontrado) {

							if (Number(otroUsuario) === Number(intercambioEncontrado.emisorId)) {
								console.log("***RECEPTOR***");
								console.log(intercambioEncontrado.finalizadoReceptor);
								console.log(usuarioEncontrado.usuarioId);
								res.json({
									encontrado: true,
									idIntercambio: intercambioEncontrado.idIntercambio,
									finalizado: intercambioEncontrado.finalizadoReceptor,
									url: usuarioEncontrado.url,
									nombre: usuarioEncontrado.nombre,
									apellido: usuarioEncontrado.apellido,
									usuarioId: usuarioEncontrado.usuarioId
								});

								//intercambioEncontrado.finalizadoReceptor === false;
							} else {
								console.log("***EMISOR***");
								console.log(intercambioEncontrado.finalizadoEmisor);
								console.log(usuarioEncontrado.usuarioId);
								res.json({
									encontrado: true,
									idIntercambio: intercambioEncontrado.idIntercambio,
									finalizado: intercambioEncontrado.finalizadoEmisor,
									url: usuarioEncontrado.url,
									nombre: usuarioEncontrado.nombre,
									apellido: usuarioEncontrado.apellido,
									usuarioId: usuarioEncontrado.usuarioId
								});

								//intercambioEncontrado.finalizadoEmisor === false;
							}

						} else {
							res.json({
								encontrado: false
							});
						}
					});
				} else {
					res.json({
						encontrado: false
					});
				}
			});
		} else {
			res.json({
				encontrado: false
			});
		}
	});
});

router.get("/:id/mensajes", middleware.loggeado, (req, res) => {
	chatModel.findOne({
		idChat: req.params.id,
		"miembros": Number(req.user.usuarioId)
	}, "mensajes", (err, chatEncontrado) => {
		if (chatEncontrado) {
			if (!err) {
				res.json({
					encontrado: true,
					mensajes: chatEncontrado.mensajes
				});
			} else {
				res.json({
					encontrado: false,
					mensajes: "No se han encontrado mensajes"
				});
			}
		} else {
			res.json({
				encontrado: false,
				mensajes: "No se han encontrado mensajes"
			});
		}
	});
});

router.get("/:id/mensajesNuevos/:index", middleware.loggeado, (req, res) => {
	chatModel.findOne({
		idChat: req.params.id,
		"miembros": Number(req.user.usuarioId)
	}, "mensajes", (err, chatEncontrado) => {
		var arr = [];
		chatEncontrado.mensajes.forEach( (mensaje, index, arrayMensajes) => {
			if(index > Number(req.params.index)){
				arr.push({
					idIndex: index,
					idEmisor: mensaje.idEmisor,
					msj: mensaje.msj
				});
			}
		});
		res.json({
			mensajes: arr
		});
	});
});

router.post("/:id", middleware.loggeado, (req, res) => {
	chatModel.findOne({
		idChat: req.params.id,
		"miembros": Number(req.user.usuarioId)
	}, (err, chatEncontrado) => {
		if (chatEncontrado) {
			if (!err) {
				chatModel.updateOne({
					idChat: Number(req.params.id)
				}, {
					$push: {
						mensajes: {
							idEmisor: Number(req.user.usuarioId),
							msj: req.body.mensaje
						}
					}
				}, (err, clubActualizado) => {
					if (err) return res.json([]);
					console.log(clubActualizado);
					if (!err) {
						res.json({
							enviado: true,
							mensaje: req.body.mensaje
						});
					} else {
						res.json({
							enviado: false,
							mensaje: "El mensaje no se ha enviado"
						});
					}
				});
			} else {
				res.json({
					enviado: false,
					mensaje: "El mensaje no se ha enviado"
				});
			}
		} else {
			res.json({
				enviado: false,
				mensaje: "El mensaje no se ha enviado"
			});
		}
	});
});

router.get("/:id/finalizar/:intercambio", middleware.loggeado, (req, res) => {
	intercambioModel.findOne({
		idIntercambio: req.params.intercambio,
		$or: [{
			emisorId: Number(req.user.usuarioId)
		}, {
			receptorId: Number(req.user.usuarioId)
		}]
	}, (err, intercambioEncontrado) => {
		if (err) return res.json([]);
		if (intercambioEncontrado) {
			var otroUsuario = -1;
			otroUsuario = Number(intercambioEncontrado.emisorId) == Number(req.user.usuarioId) ? intercambioEncontrado.receptorId : intercambioEncontrado.emisorId;
			console.log(otroUsuario);
			usuarioModel.findOne({
				usuarioId: Number(otroUsuario)
			}, "nombre apellido usuarioId", (err, usuarioEncontrado) => {
				if (err) return res.json([]);
				if (usuarioEncontrado) {

					if (Number(otroUsuario) === Number(intercambioEncontrado.emisorId)) {
						intercambioEncontrado.finalizadoReceptor = true;
					} else {
						intercambioEncontrado.finalizadoEmisor = true;
					}
					//intercambioEncontrado.finalizado = true;

					intercambioEncontrado.save(function (err) {
						if (intercambioEncontrado.finalizadoReceptor == true && intercambioEncontrado.finalizadoEmisor == true) {

							usuarioModel.updateOne({
								usuarioId: Number(intercambioEncontrado.receptorId)
							}, {
								$set: {
									"libros.$[elem].intercambio": true,
									"libros.$[elem].intercambiado": false
								}
							}, {
								arrayFilters: [{
									"elem.isbn": Number(intercambioEncontrado.receptorISBN)
								}],
								multi: true
							},
							(err, ReceptorLibrosActualizados) => {
								if (err) return res.json([]);
								console.log(ReceptorLibrosActualizados);
								if (!err) {
									usuarioModel.updateOne({
										usuarioId: Number(intercambioEncontrado.emisorId)
									}, {
										$set: {
											"libros.$[elem].intercambio": true,
											"libros.$[elem].intercambiado": false
										}
									}, {
										arrayFilters: [{
											"elem.isbn": Number(intercambioEncontrado.emisorISBN)
										}],
										multi: true
									},
									(err, EmisorLibrosActualizados) => {
										if (err) return res.json([]);
										console.log(EmisorLibrosActualizados);
										if (!err) {

											var mensaje =
														`Ha finalizado el intercambio. Puede visitar el perfil de 
                                            <a href="../perfilUsuario/${usuarioEncontrado.usuarioId}">
                                            ${usuarioEncontrado.nombre} ${usuarioEncontrado.apellido}</a> 
                                            y calificar su interacción con el usuario`;
											res.json({
												creado: true,
												alerta: {
													btnCancelar: false,
													btnAceptar: true,
													mensaje: mensaje,
													titulo: `<i class="fas fa-check" style="color: #009688;"></i>`
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
											mensaje: "Favor intente luego",
											titulo: "Error"
										}
									});
								}
							});
						} else {
							var mensaje =
								`Ha finalizado el intercambio. Una vez que 
                            <a href="../perfilUsuario/${usuarioEncontrado.usuarioId}">
                            ${usuarioEncontrado.nombre} ${usuarioEncontrado.apellido}</a> 
                            finalice por igual el intercambio podrá calificar su interacción con el usuario`;
							res.json({
								creado: true,
								alerta: {
									btnCancelar: false,
									btnAceptar: true,
									mensaje: mensaje,
									titulo: `<i class="fas fa-check" style="color: #009688;"></i>`
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
							mensaje: "No se ha encontrado al usuario",
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
					mensaje: "No se encontró el intercambio especificado",
					titulo: "Error"
				}
			});
		}
	});
});

module.exports = router;