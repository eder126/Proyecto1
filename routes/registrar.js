const app = require("express"),
	path = require("path"),
	usuario = require("../models/usuario"),
	mongoose = require("mongoose"),
	mail = require("../mail"),
	utils = require("../utils"),
	mailNuevoFormato = require("../mailNuevoFormato"),
	middleware = require("../middleware"),
	router = app.Router();

const folder = path.join(__dirname, "../public");

router.get("/", middleware.noLoggeado, (req, res) => {
	res.sendFile(`${folder}/registrar/index.html`);
});

router.post("/", middleware.noLoggeado, (req, res) => {
	if (req.body.nombre != "" && req.body.apellido != "" && req.body.apellido2 != "" && req.body.sexo != "" && req.body.direccion != "" && req.body.tid != "" && req.body.id != "" && req.body.email != "" && req.body.tel != "" &&
		req.body.direccion.provincia != "" && req.body.direccion.canton != "" && req.body.direccion.distrito != "" && req.body.direccion.coordenadas.lat != "" && req.body.direccion.coordenadas.long != "") {
		if (validateEmail(req.body.email)) {
			//De momento 2 asumiendo que hay 3 tipos. Cédula, Dimex, Otro...
			if (dentro(req.body.tid, 0, 2)) {
				//Hombre = 0 && Mujer == 1
				if (dentro(req.body.sexo, 0, 2)) {

					if (!isNaN(Number(req.body.id)) && !isNaN(Number(req.body.tel))) {
						console.log("todo valido");




						//Se creá un arreglo de 8. Está vacio inicialmente. El map itera por cada uno de los espacios y asigna un
						// NOT BITWISE, este es un sustituto a Math.floor()... Luego el .toString(36) convierte el número generado a una letra o un número.
						// Está bastante sencillo de entender. Sin embargo, a primera vista se ve bastante feo. :) -Kamil

						const clave = [...Array(8)].map(() => (~~(Math.random() * 36)).toString(36)).join("");




						console.log({
							"tid": req.body.tid,
							id: Number(req.body.id)
						});
						usuario.find({}, (err, total) => {
							
							var idUsuario = undefined;
							let ids = [];
							console.log(total);
							for (let ii = 0; ii < total.length; ii++) {
								ids.push(total[ii].usuarioId);
							}
							for (let iii = 0; iii < total.length; iii++) {
								if (ids.indexOf(iii) == -1) {
									idUsuario = iii;
									break;
								} else {
									idUsuario = total.length;
								}
							}

	




							usuario.find({
								"tid": req.body.tid,
								id: Number(req.body.id)
							}, (err, encontrado) => {
								if (err) return res.json([]);
								console.log("Encontrado: " + typeof encontrado);
								console.log(encontrado);
								if (encontrado.length == 0) {




									usuario.find({
										"email": req.body.email
									}, (err, encontrado) => {
										if (err) return res.json([]);
										console.log("Encontrado: " + typeof encontrado);
										if (encontrado.length == 0) {

											/*
                                        req.body.switch retorna undefined si es usuario regular
                                         entonces por ello utilizo el !, para negar el valor 
                                         entonces si es undefined sería false entonces lo 
                                         haría true y si es true entonces es usuario regular.
                                         */

											var dir = {
												provincia: req.body.direccion.provincia,
												canton: req.body.direccion.canton,
												distrito: req.body.direccion.distrito,
												coordenadas: {
													lat: req.body.direccion.coordenadas.lat,
													long: req.body.direccion.coordenadas.long
												}
											};

											console.log("Dirección", dir);

											if (!req.body.switch) {

												usuario.create({
													_id: mongoose.Types.ObjectId(),
													nombre: mayuscula(req.body.nombre),
													apellido: mayuscula(req.body.apellido),
													apellido2: mayuscula(req.body.apellido2),
													sexo: req.body.sexo,
													direccion: dir,
													tid: req.body.tid,
													id: req.body.id,
													email: req.body.email,
													tel: req.body.tel,
													clave: clave, //Autogenerar acá
													rol: 0, //Rol 0 = Usuario regular, 1 = Usuario Librería y 2 = Usuario Administrador
													primerLogin: true,
													usuarioId: idUsuario
												}, (err, nuevo) => {
													if (err) return res.json([]);
													console.log("Creado: " + nuevo);
													nuevo.clave = undefined;
													utils("registroUsuarioRegular", nuevo, nuevo, "Nuevo usuario");
													res.json({
														creado: true,
														alerta: {
															btnCancelar: false,
															btnAceptar: true,
															mensaje: "Favor revisar su correo para conseguir la clave.",
															titulo: `<i class="fas fa-check" style="color: #009688;"></i>`
														}
													});
													mailNuevoFormato(`Clave temporaria: ${clave}`, "¡Gracias por registrarse en Libros.cr!", "Su clave temporaria es:", (respuestaMail) => {
														mail("", nuevo.email, "Cuenta de Libros.cr", "", respuestaMail);
													});
												});
											//TODO: Enviar correo con clave y luego obligar al usuario a cambiarla.
											} else {

												usuario.find({rol: 1}, (err, encontrado) => {
													var idLibreria = undefined;
													let ids2 = [];
													console.log(encontrado);
													for (let ii = 0; ii < encontrado.length; ii++) {
														ids2.push(encontrado[ii].libreriaId);
													}
													for (let iii = 0; iii < encontrado.length; iii++) {
														if (ids2.indexOf(iii) == -1) {
															idLibreria = iii;
															break;
														} else {
															idLibreria = encontrado.length;
														}
													}
						



													usuario.create({
														_id: mongoose.Types.ObjectId(),
														nombre: mayuscula(req.body.nombre),
														apellido: mayuscula(req.body.apellido),
														apellido2: mayuscula(req.body.apellido2),
														sexo: req.body.sexo,
														direccion: dir,
														tid: req.body.tid,
														id: req.body.id,
														email: req.body.email,
														tel: req.body.tel,
														clave: clave, //Autogenerar acá
														rol: 1, //Rol 0 = Usuario regular, 1 = Usuario Librería y 2 = Usuario Administrador
														primerLogin: true,
														libreriaId: idLibreria,
														nombreFantasia: mayuscula(req.body.nombreFantasia),
														nombreComercial: mayuscula(req.body.nombreComercial),
														usuarioId: idUsuario,
														aceptado: false
													}, (err, nuevo) => {
														if (err) return res.json([]);
														console.log("Creado usuario librería: " + nuevo);
														nuevo.clave = undefined;
														utils("registroUsuarioLibreria", nuevo, nuevo, "Nuevo usuario");
														mailNuevoFormato(`Clave temporaria: ${clave}`, "Se le notificará cuando se acepte su solicitud de librería", "Su clave temporaria es:",(respuestaMail) => {
															mail("", nuevo.email, "Cuenta de Libros.cr", "", respuestaMail);
														});
														res.json({
															creado: true,
															alerta: {
																btnCancelar: false,
																btnAceptar: true,
																mensaje: "Favor revisar su correo para conseguir la clave.",
																titulo: `<i class="fas fa-check" style="color: #009688;"></i>`
															}
														});
													});




												});

											




											}


										} else {
											console.log("Correo ya existe...");
											if (encontrado.length > 1) console.log("Alerta, existen dos usuarios con el mismo correo");
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
									console.log("Id ya existe...");
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