const app = require("express"),
	path = require("path"),
	usuarioModel = require("../models/usuario"),
	utils = require("../utils"),
	libro = require("../models/libro"),
	middleware = require("../middleware"),
	router = app.Router();

const folder = path.join(__dirname, "../public");

router.get("/", middleware.loggeado, (req, res) => {
	res.sendFile(`${folder}/perfilPersonalUsuario/index.html`);
});

router.get("/listar", middleware.loggeado, (req, res) => {
	usuarioModel.findOne({
		usuarioId: req.user.usuarioId
	}, (err, usuarioEncontrado) => {
		if (err) return res.json([]);
		//console.log(usuarioEncontrado);
		res.json(usuarioEncontrado);
	});
});

router.get("/contrasenna", middleware.loggeado, (req, res) => {
	res.sendFile(`${folder}/editarContrasenna/index.html`);
});

router.post("/contrasenna", middleware.loggeado, (req, res) => {
	//console.log(req.body.confirmar);
	//console.log(req.body.nuevacontrasenna);
	//console.log(req.body.viejacontrasenna);
	if(req.body.nuevacontrasenna != "" && req.body.confirmar != "" && req.body.viejacontrasenna){
		if(req.body.nuevacontrasenna.length < 5){
			return res.json({
				creado: false,
				alerta: {
					btnCancelar: false,
					btnAceptar: true,
					mensaje: "La contraseña debe de ser mayor a 5 caracteres.",
					titulo: "Error"
				}
			});
		} 
		if(req.body.nuevacontrasenna === req.body.confirmar){
			usuarioModel.findOne({
				usuarioId: req.user.usuarioId
			}).select("+clave").exec((err, encontradoFinal) => {
				if(err) return console.log(err);
				if(encontradoFinal) {
					//console.log(encontradoFinal.clave);
					//console.log(req.body.viejacontrasenna);
					if(encontradoFinal.clave === req.body.viejacontrasenna){
						encontradoFinal.clave = req.body.nuevacontrasenna;
						encontradoFinal.save(function (err) {
							if (!err) {
								utils("perfilEditado", req.user, encontradoFinal, "Perfil modificado.");
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
								mensaje: "La contraseña ingresada es incorrecta",
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
							mensaje: "No se ha encontrado el usuario",
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
					mensaje: "Los campos de contraseña y confirmación deben ser idénticos",
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
				mensaje: "Favor rellene todos los campos",
				titulo: "Error"
			}
		});
	}
});

router.get("/editarPerfilPersonalUsuario", middleware.loggeado, (req, res) => {
	res.sendFile(`${folder}/editarPerfilPersonalUsuario/index.html`);
});

router.get("/editarPerfilPersonalUsuario/listar", middleware.loggeado, (req, res) => {
	usuarioModel.findOne({
		usuarioId: req.user.usuarioId
	}, (err, usuarioEncontrado) => {
		if (err) return res.json([]);
		//console.log(usuarioEncontrado);
		res.json(usuarioEncontrado);
	});
});


const cloudinary = require("cloudinary");
require("../handlers/cloudinary");
const upload = require("../handlers/multer");
const multer = require("multer");
var uploadVar = upload.single("fotoPerfilImagen");

router.post("/editarPerfilPersonalUsuario", middleware.loggeado, (req, res) => {
	uploadVar(req, res, async function (err) {
		if (err instanceof multer.MulterError) {
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
		//console.log(req.body);
		if (req.body.nombre != "" && req.body.apellido != "" && req.body.apellido2 != "" && 
		req.body.sexo != "" && req.body.tid != "" && req.body.id != "" && req.body.email != "" && 
		req.body.tel != "" && req.body.coordenadas != "") {
			if (validateEmail(req.body.email)) {
				if (dentro(req.body.tid, 0, 2)) {
					if (dentro(req.body.sexo, 0, 2)) {
						if (!isNaN(Number(req.body.id)) && !isNaN(Number(req.body.tel))) {
							usuarioModel.find({
								"tid": req.body.tid,
								id: Number(req.body.id)
							}, (err, encontrado) => {
								if (err) return res.json([]);
									//console.log("Encontrado: " + typeof encontrado);
									if (encontrado.length <= 1) {
									usuarioModel.findOne({
										usuarioId: req.user.usuarioId
									}, (err, encontradoFinal) => {
										if(err) return console.log(err);
										if(encontradoFinal) {

											var Nombre = req.body.nombre;
											Nombre = Nombre.split(" ").map((palabra) => {
												return mayuscula(palabra);
											}).join(" ");

											encontradoFinal.nombre = Nombre;
											encontradoFinal.apellido = req.body.apellido;
											encontradoFinal.apellido2 = req.body.apellido2;
											encontradoFinal.sexo = req.body.sexo;
											encontradoFinal.tid = req.body.tid;
											encontradoFinal.id = req.body.id;
											encontradoFinal.tel = req.body.tel;
											if(req.body.provincia != "" && req.body.canton != "" && req.body.distrito != ""){
												//console.log("LLEGO AQUI");
												encontradoFinal.direccion = {
													provincia : req.body.provincia,
													canton : req.body.canton,
													distrito : req.body.distrito,
													coordenadas : {
														lat : req.body.coordenadas.split(", ")[0],
														long : req.body.coordenadas.split(", ")[1]
													}
												};
											} else {
												//console.log("LLEGO AQUI X2");
												encontradoFinal.direccion = {
													provincia : encontradoFinal.direccion.provincia,
													canton : encontradoFinal.direccion.canton,
													distrito : encontradoFinal.direccion.distrito,
													coordenadas : {
														lat : req.body.coordenadas.split(", ")[0],
														long : req.body.coordenadas.split(", ")[1]
													}
												};
											}
											if(result.secure_url != " ") {
												encontradoFinal.url = result.secure_url;
											}
											encontradoFinal.save(function (err) {
												if (!err) {
													utils("perfilEditado", req.user, encontradoFinal, "Perfil modificado.");
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
													mensaje: "No se ha encontrado el usuario",
													titulo: "Error"
												}
											});
										}
									});
								} else {
									//console.log("Id ya existe...");
									if (encontrado.length > 1) console.log("Alerta, existen dos usuarios con el mismo tipo e id...");
									res.json({
										creado: false,
										alerta: {
											btnCancelar: false,
											btnAceptar: true,
											mensaje: "Ya existe este usuario",
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
									mensaje: "Favor ingresar un número válido.",
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
								mensaje: "Sexo invalido",
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
							mensaje: "Tipo de ID invalido",
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
						mensaje: "Correo invalido",
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

module.exports = router;