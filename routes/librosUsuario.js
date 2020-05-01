const app = require("express"),
	path = require("path"),
	usuarioModel = require("../models/usuario"),
	libroModel = require("../models/libro"),
	sucursalModel = require("../models/sucursal"),
	intercambioModel = require("../models/intercambio"),
	utils = require("../utils"),
	chatModel = require("../models/chat"),
	mongoose = require("mongoose"),
	middleware = require("../middleware"),
	router = app.Router();

const folder = path.join(__dirname, "../public");

router.get("/:usuario", middleware.loggeado, (req, res) => {
	if(Number(req.params.usuario) === req.user.usuarioId){
		res.redirect("/librosPersonales");
	} else {
		res.sendFile(`${folder}/librosUsuario/index.html`);
	}
});

router.post("/:usuario", middleware.esUsuarioRegular, (req, res) => {
	if(req.body.receptorId != "" && req.user.usuarioId != ""){
		if(req.body.emisorISBN != "none" && req.body.emisorISBN != "" && req.body.receptorISBN != ""){
			if(req.body.dia != "" && req.body.hora != ""){
				if(new Date(req.body.dia) > new Date()){
					if(dentro(Number(req.body.hora.replace(":", "")), 0, 2400)){
						if(req.body.sucursal != ""){
							usuarioModel.findOne({
								usuarioId: Number(req.body.receptorId)
							},"libros usuarioId", (err, receptorEncontrado) =>{
								if (err) return res.json([]);
								if(receptorEncontrado){
									usuarioModel.findOne({
										usuarioId: Number(req.user.usuarioId)
									},"libros usuarioId", (err, emisorEncontrado) =>{
										if (err) return res.json([]);
										if(emisorEncontrado){
											libroModel.findOne({
												ISBN: Number(req.body.emisorISBN)
											},"ISBN", (err, emisorISBN) =>{
												if (err) return res.json([]);
												if(emisorISBN){
													libroModel.findOne({
														ISBN: Number(req.body.receptorISBN)
													},"ISBN", (err, receptorISBN) =>{
														if (err) return res.json([]);
														if(receptorISBN){
															sucursalModel.findOne({
																id: Number(req.body.sucursal)
															},"id", (err, sucursalEncontrada) =>{
																if (err) return res.json([]);
																if(sucursalEncontrada){
																	intercambioModel.find({}, "idIntercambio", (err, intercambiosEncontrados) => {
																		if (err) return res.json([]);
																		var idIntercambio = undefined;
																		let ids = [];
																		for (let ii = 0; ii < intercambiosEncontrados.length; ii++) {
																			ids.push(intercambiosEncontrados[ii].idIntercambio);
																		}
																		for (let iii = 0; iii < intercambiosEncontrados.length; iii++) {
																			if (ids.indexOf(iii) == -1) {
																				idIntercambio = iii;
																				break;
																			} else {
																				idIntercambio = intercambiosEncontrados.length;
																			}
																		}
																		const librosEmisor =  getUnique(emisorEncontrado.libros,'isbn');
																		const librosReceptor =  getUnique(receptorEncontrado.libros,'isbn');
																		const libroEmisor = librosEmisor.find(temp => temp.isbn === Number(req.body.emisorISBN));
																		const libroReceptor = librosReceptor.find(temp => temp.isbn === Number(req.body.receptorISBN));
																		if(!libroEmisor){
																			return res.json({
																				creado: false,
																				alerta: {
																					btnCancelar: false,
																					btnAceptar: true,
																					mensaje: "El libro que intenta intercambiar no parece ser parte de sus libros",
																					titulo: "Error"
																				}
																			});
																		} else if(!libroReceptor){
																			return res.json({
																				creado: false,
																				alerta: {
																					btnCancelar: false,
																					btnAceptar: true,
																					mensaje: "El libro que intenta recibir no parece ser parte de los libros comprados por el usuario",
																					titulo: "Error"
																				}
																			});
																		} else {
																			if(libroEmisor.intercambio){
																				if(!libroEmisor.intercambiado){
																					if(libroReceptor.intercambio){
																						if(!libroReceptor.intercambiado){
																							intercambioModel.findOne({
																								emisorId : emisorEncontrado.usuarioId,
																								receptorId : receptorEncontrado.usuarioId,
																								receptorISBN : receptorISBN.ISBN,
																								$or: [ { finalizadoEmisor: false },{ finalizadoReceptor: false } ]
																							}, (err, intercambioExistente) => {
																								if (err) return res.json([]);
																								if(!intercambioExistente){
																									intercambioModel.find({
																										emisorId : emisorEncontrado.usuarioId,
																										emisorISBN : emisorISBN.ISBN,
																										$or: [ { finalizadoEmisor: false },{ finalizadoReceptor: false } ]
																									}, (err, intercambiosPersonal) => {
																										if (err) return res.json([]);
																										if(idIntercambio == undefined){
																											idIntercambio = 0;
																										}
																										if(intercambiosPersonal.length == 0){
																											intercambioModel.create({
																												_id: mongoose.Types.ObjectId(),
																												idIntercambio: idIntercambio,
																												emisorId : Number(emisorEncontrado.usuarioId),
																												receptorId : Number(receptorEncontrado.usuarioId),
																												emisorISBN : Number(emisorISBN.ISBN),
																												receptorISBN : Number(receptorISBN.ISBN),
																												sucursal: sucursalEncontrada.id,
																												dia: new Date(req.body.dia),
																												hora: req.body.hora,
																												aceptada: false,
																												//finalizado: false,
																												finalizadoEmisor: false,
																												finalizadoReceptor: false
																											}, (err, nuevo) => {
																												if (err) return res.json([]);
																												console.log("Creado: " + nuevo);
																												res.json({
																													creado: true,
																													alerta: {
																														btnCancelar: false,
																														btnAceptar: true,
																														mensaje: "Se ha enviado la solicitud de intercambio",
																														titulo: `<i class="fas fa-check" style="color: #009688;"></i>`
																													}
																												});
																												utils("registroSolicitudIntercambio", req.user, nuevo, "Nueva solicitud de Intercambio");
																											});
																										} else {
																											res.json({
																												creado: false,
																												alerta: {
																													btnCancelar: false,
																													btnAceptar: true,
																													mensaje: "Una solicitud de intercambio por el libro personal seleccionado se encuentra en proceso",
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
																											mensaje: "Una solicitud de intercambio por el libro seleccionado actualmente se encuentra en proceso",
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
																									mensaje: "El libro seleccionado parace actualmente estar intercambiado",
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
																								mensaje: "El libro seleccionado no parece estar habilitado para ser intercambiado",
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
																							mensaje: "Su libro personal seleccionado parace actualmente estar intercambiado",
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
																						mensaje: "Su libro personal seleccionado no parece estar habilitado para ser intercambiado",
																						titulo: "Error"
																					}
																				});
																			}
																		}
																	});
																} else {
																	res.json({
																		creado: false,
																		alerta: {
																			btnCancelar: false,
																			btnAceptar: true,
																			mensaje: "No se ha encontrado la sucursal donde desea realizar el intercambio",
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
																	mensaje: "No se ha encontrado el libro que desea recibir",
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
															mensaje: "No se ha encontrado el libro que desea intercambiar",
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
													mensaje: "No se ha encontrado su cuenta",
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
											mensaje: "No se ha encontrado el usuario con el que desea realizar un intercambio",
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
									mensaje: "Debe seleccionar una sucursal en donde realizar el intercambio",
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
								mensaje: "La hora de intercambio es invalida",
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
							mensaje: "La fecha de intercambio debe ser posterior a hoy",
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
						mensaje: "Debe seleccionar una fecha y hora para realizar el intercambio",
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
					mensaje: "Debe seleccionar un libro para ser intercambiado",
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
				mensaje: "Favor llene todos los campos",
				titulo: "Error"
			}
		});
    }
});

router.get("/:usuario/listarLibros", middleware.loggeado, (req, res) => {
	usuarioModel.findOne({
		usuarioId: req.params.usuario
	},"libros nombre rol", (err, usuarioEncontrado) => {
		if (err) return res.json([]);
		if(usuarioEncontrado.rol === 0){
			const libros =  getUnique(usuarioEncontrado.libros,'isbn');
			res.json({
				usuario: true,
				nombre: usuarioEncontrado.nombre,
				libros: libros
			});
		} else {
			res.json({
				usuario: false,
				nombre: usuarioEncontrado.nombre,
				libros: []
			});
		}
	});
});

router.get("/:usuario/listarLibros/personales", middleware.loggeado, (req, res) => {
	usuarioModel.findOne({
		usuarioId: req.user.usuarioId
	},"libros nombre rol", (err, usuarioEncontrado) => {
		if (err) return res.json([]);
		if(usuarioEncontrado.rol === 0) {
			const libros =  getUnique(usuarioEncontrado.libros,'isbn');
			res.json({
				usuario: true,
				libros: libros
			});
		} else {
			res.json({
				usuario: false,
				libros: []
			});
		}
	});
});

router.get("/:usuario/:libro/libro", middleware.loggeado, (req, res) => {
	//console.log(req.params.libro);
	libroModel.findOne({
		ISBN: Number(req.params.libro)
	},"nombre img ISBN formato", (err, libroEncontrado) => {
		if (err) return res.json([]);
		res.json(libroEncontrado);
	});
});

router.get("/:usuario/sucursales", middleware.loggeado, (req, res) => {
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

router.get("/:usuario/solicitudes", middleware.loggeado, (req, res) => {
	intercambioModel.find({},(err, encontrado) => {
		if (err) return res.json([]);
		if(encontrado.length != 0){
			res.json({
				algo: true,
				solicitudes: encontrado
			});
		} else {
			res.json({
				algo: false,
				solicitudes: []
			});
		}
	});
});

function validateEmail(email) {
	var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
}

function dentro(x, min, max) {
	return x >= min && x <= max;
}

function mayuscula(string) {
	if (typeof string !== "string") return "";
	return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function getUnique(arr,comp){
	//store the comparison  values in array
const unique =  arr.map(e=> e[comp]). 
  // store the keys of the unique objects
  map((e,i,final) =>final.indexOf(e) === i && i) 
  // eliminate the dead keys & return unique objects
 .filter((e)=> arr[e]).map(e=>arr[e]);
return unique;
}

module.exports = router;