const app = require("express"),
	path = require("path"),
	club = require("../models/club"),
	sucursal = require("../models/sucursal"),
	generoModel = require("../models/genero"),
	libroModel = require("../models/libro"),
	chatModel = require("../models/chat"),
	utils = require("../utils"),
	middleware = require("../middleware"),
	mongoose = require("mongoose"),
	router = app.Router();

const folder = path.join(__dirname, "../public");

router.get("/", middleware.loggeado, (req, res) => {
	res.sendFile(`${folder}/registrarClubDeLectura/index.html`);
});

router.get("/generos", middleware.loggeado, (req, res) => {
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

router.get("/libros/:genero", middleware.loggeado, (req, res) => {
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

router.post("/", middleware.loggeado, (req, res) => {
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
		var presencial = false;
		if (req.body.switch) presencial = true;

		if (req.body.nombre != "" && req.body.descripcion != "" && req.body.diaReunion != "" && req.body.hora != "") {
			if (req.body.switch == "on" && req.body.sucursalId == "") {
				return res.json({
					creado: false,
					alerta: {
						btnCancelar: false,
						btnAceptar: true,
						mensaje: "Favor escoger una sucursal.",
						titulo: "Error"
					}
				});
			}
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
											club.find({}, (err, total) => {

												var idClub = undefined;
												let ids = [];
												console.log(total);
												for (let ii = 0; ii < total.length; ii++) {
													ids.push(total[ii].id);
												}
												for (let iii = 0; iii < total.length; iii++) {
													if (ids.indexOf(iii) == -1) {
														idClub = iii;
														break;
													} else {
														idClub = total.length;
													}
												}

												if(idClub == undefined) idClub = 0;
												club.create({
													_id: mongoose.Types.ObjectId(),
													url: result.secure_url,
													nombre: mayuscula(req.body.nombre).split(" ").map((palabra) => {
														return mayuscula(palabra);
													}).join(" "),
													descripcion: req.body.descripcion,
													dia: req.body.diaReunion,
													hora: req.body.hora,
													presencial: presencial,
													id: idClub,
													sucursal: req.body.sucursalId,
													creadorId: req.user.usuarioId,
													genero: req.body.genero,
													libro: req.body.libro
												}, (err, nuevo) => {
													if (err) return res.json([]);
													if(nuevo) {
														console.log("Creado club: " + nuevo);
														utils("registroClubDeLectura", req.user, nuevo, "Nuevo club de lectura");
														if(!presencial){
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
																if(idChat == undefined){
																	idChat = 0;
																}
																var arr=[Number(req.user.usuarioId)];
																chatModel.create({
																	_id: mongoose.Types.ObjectId(),
																	idChat: idChat,
																	Club: true,
																	idClub: Number(idClub),
																	miembros: arr
																}, (err, nuevo) => {
																	console.log(err);
																	if (err) return res.json([]);
																	console.log(nuevo);
																	if(!err){
																		res.json({
																			creado: true,
																			alerta: {
																				btnCancelar: false,
																				btnAceptar: true,
																				mensaje: "Club creado con éxito.",
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
															});
														} else {
															res.json({
																creado: true,
																alerta: {
																	btnCancelar: false,
																	btnAceptar: true,
																	mensaje: "Club creado con éxito.",
																	titulo: `<i class="fas fa-check" style="color: #009688;"></i>`
																}
															});
														}
													} else {
														res.json({
															encontrado: false,
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

/*
if(!presencial){
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
		if(idChat == undefined){
			idChat = 0;
		}
		var arr=[Number(req.user.usuarioId)];
		chatModel.create({
			_id: mongoose.Types.ObjectId(),
			idChat: idChat,
			Club: true,
			idClub: Number(idClub),
			miembros: arr
		}, (err, nuevo) => {
			console.log(err);
			if (err) return res.json([]);
			console.log(nuevo);
			if(!err){
				console.log("Creado club: " + nuevo);
				utils("registroClubDeLectura", req.user, nuevo, "Nuevo club de lectura");
				res.json({
					creado: true,
					alerta: {
						btnCancelar: false,
						btnAceptar: true,
						mensaje: "Club creado con éxito.",
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
	});
}
*/


router.get("/sucursales", middleware.loggeado, (req, res) => {
	sucursal.find({}).sort({nombre: 1}).exec((err, encontrado) => {
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

function dentro(x, min, max) {
	return x >= min && x <= max;
}

function mayuscula(string) {
	if (typeof string !== "string") return "";
	return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

module.exports = router;