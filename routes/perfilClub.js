const app = require("express"),
	path = require("path"),
	clubModel = require("../models/club"),
	chatModel = require("../models/chat"),
	sucursalModel = require("../models/sucursal"),
	generoModel = require("../models/genero"),
	libroModel = require("../models/libro"),
	middleware = require("../middleware"),
	router = app.Router();

const folder = path.join(__dirname, "../public");

router.get("/", middleware.loggeado, (req, res) => {
	res.redirect("/perfilClub/-1");
});

router.get("/:club", middleware.loggeado, (req, res) => {
	res.sendFile(`${folder}/perfilClub/index.html`);
});

router.get("/:libro/libro", middleware.loggeado, (req, res) => {
	libroModel.findOne({
		ISBN: req.params.libro
	}, (err, libroEncontrado) => {
		if (err) return res.json([]);
		res.json(libroEncontrado);
	});
});

router.get("/:genero/genero", middleware.loggeado, (req, res) => {
	generoModel.findOne({
		id: req.params.genero,
		desactivado: false
	}, (err, generoEncontrado) => {
		if (err) return res.json([]);
		res.json(generoEncontrado);
	});
});

router.get("/:club/listar", middleware.loggeado, (req, res) => {
	clubModel.findOne({
		id: req.params.club
	}, (err, clubEncontrado) => {
		//console.log(sucursalEncontrada);
		if (err) return res.json([]);
		res.json(clubEncontrado);
	});
});

router.get("/:sucursal/sucursal", middleware.loggeado, (req, res) => {
	sucursalModel.findOne({
		id: Number(req.params.sucursal)
	},"nombre direccion.coordenadas", (err, sucursalEncontrada) => {
		//console.log(sucursalEncontrada);
		if (err) return res.json([]);
		res.json(sucursalEncontrada);
	});
});

router.get("/:club/miembros", middleware.loggeado, (req, res) => {
	clubModel.findOne({
		id: req.params.club,
		"miembros.usuarioId": req.user.usuarioId
	},"miembros", (err, clubEncontrado) => {
		//console.log(clubEncontrado);
		if (err) return res.json([]);
		if(clubEncontrado){
			res.json({encontrado: true});
		} else{
			res.json({encontrado: false});
		}
	});
});

router.get("/:club/chat", middleware.loggeado, (req, res) => {
	chatModel.findOne({
		idClub: Number(req.params.club),
		Club: true
	},"idChat", (err, clubEncontrado) => {
		if (err) return res.json([]);
		if(clubEncontrado){
			res.json({
				encontrado: true,
				idChat: clubEncontrado.idChat
			});
		} else{
			res.json({
				encontrado: false,
				idChat: -1
			});
		}
	});
});

router.get("/:club/clubes", middleware.loggeado, (req, res) => {
	clubModel.find({
		"miembros.usuarioId": req.user.usuarioId
	}, (err, clubEncontrado) => {
		//console.log(sucursalEncontrada);
		if (err) return res.json([]);
		if(clubEncontrado.length!=0){
			res.json({encontrado: true});
		} else{
			res.json({encontrado: false});
		}
	});
});

router.get("/:club/unirse", middleware.loggeado, (req, res) => {
	if(req.user.rol === 0){
		clubModel.findOne({
			id: req.params.club,
			"miembros.usuarioId": req.user.usuarioId
		},"miembros", (err, clubMiembros) => {
			console.log(clubMiembros);
			if (err) return res.json([]);
			if(!clubMiembros){
				clubModel.find({
					"miembros.usuarioId": req.user.usuarioId
				}, (err, clubesEncontrados) => {
					console.log(clubesEncontrados);
					if (err) return res.json([]);
					if(clubesEncontrados.length === 0){
						clubModel.updateOne ( { id: Number(req.params.club) },
						{ $push:
								{
									miembros: {
										usuarioId: Number(req.user.usuarioId)
									}
								}
						},(err, clubActualizado) => {
							if (err) return res.json([]);
							console.log(clubActualizado);
							if(!err) {
								clubModel.findOne({
									id: Number(req.params.club),
									"miembros.usuarioId": req.user.usuarioId
								}, (err, clubEncontrado) => {
									if (err) return res.json([]);
									if(clubEncontrado){
										if(!clubEncontrado.presencial){
											chatModel.updateOne (
											{ idClub: Number(req.params.club) , Club: true },
											{ $push: { miembros: Number(req.user.usuarioId) } },
											(err, chatActualizado) => {
												if (err) return res.json([]);
												if(chatActualizado){
													res.json({
														creado: true,
														alerta: {
															btnCancelar: false,
															btnAceptar: true,
															mensaje: "Bienvenido al club",
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
												creado: true,
												alerta: {
													btnCancelar: false,
													btnAceptar: true,
													mensaje: "Bienvenido al club",
													titulo: `<i class="fas fa-check" style="color: #009688;"></i>`
												}
											});
										}
									} else {
										res.json({
											creado: false,
											alerta: {
												btnCancelar: false,
												btnAceptar: true,
												mensaje: "No se ha encontrado el club",
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
					} else {
						res.json({
							creado: false,
							alerta: {
								btnCancelar: false,
								btnAceptar: true,
								mensaje: "Usted ya forma parte de un Club",
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
						mensaje: "Usted ya forma parte de este Club",
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
				mensaje: "Usted no puede formar parte de un Club",
				titulo: "Error"
			}
		});
	}
});

router.get("/:club/retirarse", middleware.loggeado, (req, res) => {
	clubModel.findOne({
		id: req.params.club,
		"miembros.usuarioId": req.user.usuarioId
	},"miembros", (err, clubMiembros) => {
		console.log(clubMiembros);
		if (err) return res.json([]);
		if(clubMiembros){
			clubModel.updateOne ({
				id: Number(req.params.club) },
			{ $pull:
					{
						miembros: {
							usuarioId: Number(req.user.usuarioId)
						}
					}
			},
			(err, clubActualizado) => {
				if (err) return res.json([]);
				console.log(clubActualizado);
				if(!err){
					clubModel.findOne({
						id: Number(req.params.club)
					}, (err, clubEncontrado) => {
						if (err) return res.json([]);
						if(clubEncontrado){
							if(!clubEncontrado.presencial){
								chatModel.updateOne (
								{ idClub: Number(req.params.club) , Club: true },
								{ $pull: { miembros: Number(req.user.usuarioId) } },
								(err, chatActualizado) => {
									if (err) return res.json([]);
									if(chatActualizado){
										res.json({
											creado: true,
											alerta: {
												btnCancelar: false,
												btnAceptar: true,
												mensaje: "Ya no formas parte de este Club",
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
									creado: true,
									alerta: {
										btnCancelar: false,
										btnAceptar: true,
										mensaje: "Ya no formas parte de este Club",
										titulo: `<i class="fas fa-check" style="color: #009688;"></i>`
									}
								});
							}
						} else {
							res.json({
								creado: false,
								alerta: {
									btnCancelar: false,
									btnAceptar: true,
									mensaje: "No se ha encontrado el club",
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
		} else {
			res.json({
				creado: false,
				alerta: {
					btnCancelar: false,
					btnAceptar: true,
					mensaje: "Usted no forma parte de este Club",
					titulo: "Error"
				}
			});
		}
	});
});

router.get("/:club/editarClub", middleware.loggeado, (req, res) => {
	res.sendFile(`${folder}/editarClub/index.html`);
});

router.get("/:club/editarClub/listar", middleware.loggeado, (req, res) => {
	clubModel.findOne({
		id: req.params.club
	}, (err, clubEncontrado) => {
		if (err) return res.json([]);
		console.log(clubEncontrado);
		res.json(clubEncontrado);
	});
});

router.get("/:club/editarClub/sucursales", middleware.loggeado, (req, res) => {
	sucursalModel.find({}).sort({nombre: 1}).exec((err, encontrado) => {
		if (err) return res.json([]);
		var arr = [];
		if (encontrado.length != 0) {
			encontrado.forEach(item => {
				if (item.direccion.coordenadas.lat && item.direccion.coordenadas.long) {
					arr.push({
						id: item.id,
						nombre: item.nombre,
						lat: item.direccion.coordenadas.lat,
						long: item.direccion.coordenadas.long
					});
				}
			});
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

router.get("/:club/editarClub/generos", middleware.loggeado, (req, res) => {
	generoModel.find({
		desactivado: false
	}).sort({nombre: 1}).exec((err, generosEncontradas) => {
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
					mensaje: "No hay generos literarios disponibles.",
					titulo: "Error"
				}
			});
		}
	});
});

router.get("/:club/editarClub/libros/:genero", middleware.loggeado, (req, res) => {
	libroModel.find({
		genero: req.params.genero
	}).sort({nombre: 1}).exec((err, librosEncontrados) => {
		if (err) return res.json([]);
		if (librosEncontrados.length != 0) {
			res.json({
				encontrado: true,
				datos: librosEncontrados
			});
		} else {
			res.json({
				encontrado: false,
				alerta: {
					btnCancelar: false,
					btnAceptar: true,
					mensaje: "No hay libros disponibles para esta categoria.",
					titulo: "Error"
				}
			});
		}
	});
});

const cloudinary = require("cloudinary");
require("../handlers/cloudinary");
const upload = require("../handlers/multer");
const multer = require("multer");

var uploadVar = upload.single("fotoPerfilImagen");

router.post("/:club/editarClub", middleware.loggeado, (req, res) => {
	uploadVar(req, res, async function (err) {
		console.log("aca");
		console.log(req.body);
		if (err instanceof multer.MulterError) {
			console.log("aca2");
			console.log(req.body);
			return res.json({
				creado: false,
				alerta: {
					btnCancelar: false,
					btnAceptar: true,
					mensaje: "Favor intentar luego",
					titulo: "Error"
				}
			});
		} else if (err) {
			return res.json({
				creado: false,
				alerta: {
					btnCancelar: false,
					btnAceptar: true,
					mensaje: "Archivo no permitido",
					titulo: "Error"
				}
			});
		}
		var result = {
			secure_url: " "
		};
		if (req.file && req.file.path) {
			result = await cloudinary.v2.uploader.upload(req.file.path);
		}

		if (req.body.nombre != "" && req.body.descripcion != "" && req.body.diaReunion != "" && req.body.hora != "" &&
		req.body.genero != "" && req.body.libro != "") {
			if (dentro(req.body.diaReunion, 0, 6)) {
				if (req.body.descripcion.length < 250) {
					if (dentro(Number(req.body.hora.replace(":", "")), 0, 2400)) {
						generoModel.findOne({
							id: Number(req.body.genero),
							desactivado: false
						}, (err, generoEncontrado) => {
							if (err) return res.json([]);
							if (generoEncontrado) {
								libroModel.findOne({
									ISBN: req.body.libro
								}, (err, libroEncontrado) => {
									if (err) return res.json([]);
									if (libroEncontrado) {
										if(libroEncontrado.genero === Number(req.body.genero)){
											clubModel.findOne({
												id: req.params.club
											}, (err, clubEncontrado) => {
												if (err) return res.json([]);
												console.log(clubEncontrado);
												if(clubEncontrado){
													var seguir = false;
													if(req.user.rol === 2){
														seguir = true;
													} else if (req.user.usuarioId === Number(clubEncontrado.creadorId)) {
														seguir = true;
													} else {
														res.json({
															creado: false,
															alerta: {
																btnCancelar: false,
																btnAceptar: true,
																mensaje: "Usted no puede modificar este Club",
																titulo: "Error"
															}
														});
													}
													if(seguir){
														var Nombre = req.body.nombre;
														Nombre = Nombre.split(" ").map((palabra) => {
															return mayuscula(palabra);
														}).join(" ");
	
														clubEncontrado.nombre = Nombre;
														clubEncontrado.descripcion = req.body.descripcion;
														clubEncontrado.dia = req.body.diaReunion;
														clubEncontrado.hora = req.body.hora;
														clubEncontrado.genero = Number(req.body.genero);
														clubEncontrado.libro = Number(req.body.libro);
														if(clubEncontrado.presencial){
															clubEncontrado.sucursal = Number(req.body.sucursalId);
														}
	
														if(result.secure_url != " ") {
															clubEncontrado.url = result.secure_url;
														}
														clubEncontrado.save(function (err) {
															if (!err) {
																//console.log("Usuario actualizado");
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
													} else {
														res.json({
															creado: false,
															alerta: {
																btnCancelar: false,
																btnAceptar: true,
																mensaje: "Usted no puede modificar este Club",
																titulo: "Error"
															}
														});
													}
												} else {
													res.json({
														encontrado: false,
														alerta: {
															btnCancelar: false,
															btnAceptar: true,
															mensaje: "No se ha encontrado el club especificado",
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
													mensaje: "Este libro no se encuentra bajo el género seleccionado",
													titulo: "Error"
												}
											});
										}
									} else {
										res.json({
											encontrado: false,
											alerta: {
												btnCancelar: false,
												btnAceptar: true,
												mensaje: "Este libro no existe",
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
										mensaje: "Este género literario no existe",
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
								mensaje: "Hora invalida.",
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
							mensaje: "Descripción debe de ser menor a 250 letras.",
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
						mensaje: "Día invalido.",
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
					mensaje: "Favor llenar los campos.",
					titulo: "Error"
				}
			});
		}
	});
});

router.get("/:club/editarClub/eliminarClub", middleware.loggeado, (req, res) => {
	res.sendFile(`${folder}/eliminarClub/index.html`);
});

router.post("/:club/editarClub/eliminarClub", middleware.loggeado, (req, res) => {
	console.log(req.body.nombre);
	clubModel.findOne({
		id: req.params.club
	}, (err, clubEncontrado) => {
		if(err) return res.json([]);
		if(clubEncontrado){
			if(req.user.rol === 2 || req.user.usuarioId === clubEncontrado.creadorId) {
				if(clubEncontrado.nombre === req.body.nombre){
					clubModel.deleteOne ({
						id: Number(req.params.club) },
					(err, clubActualizado) => {
						if (err) return res.json([]);
						console.log(clubActualizado);
						if(!err){
							res.json({
								creado: true,
								alerta: {
									btnCancelar: false,
									btnAceptar: true,
									mensaje: "Club eliminado",
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
							mensaje: "El nombre ingresado no corresponde al club que intenta eliminar",
							titulo: "Error"
						}
					});
				}
			}
		} else {
			res.json({
				creado: false,
				alerta: {
					btnCancelar: false,
					btnAceptar: true,
					mensaje: "No se ha encontrado el club",
					titulo: "Error"
				}
			});
		}
	});
});

function dentro(x, min, max) {
	return x >= min && x <= max;
}

function mayuscula(string) {
	if (typeof string !== "string") return "";
	return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

module.exports = router;