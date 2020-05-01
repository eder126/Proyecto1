const passport = require("passport"),
	path = require("path"),
	express = require("express"),
	mongoose = require("mongoose"),
	middleware = require("../middleware"),
	mail = require("../mail"),
	utils = require("../utils"),
	usuario = require("../models/usuario"),
	mailNuevoFormato = require("../mailNuevoFormato"),
	cambioContrasenna = require("../models/cambioContrasenna"),
	router = express.Router();


router.post("/login",
	passport.authenticate("local", {
		failureRedirect: "/login?err=usuario"
	}),
	function (req, res) {
		console.log(req.user);
		res.redirect("/");
	});

const folder = path.join(__dirname, "../public");

router.get("/login", middleware.noLoggeado,
	function (req, res) {
		res.sendFile(`${folder}/login/index.html`);
	});

router.get("/logout", function (req, res) {
	req.logout();
	res.redirect("/");
});


router.get("/olvidoClave/:path", middleware.noLoggeado,
	function (req, res) {
		console.log(req.params.path);
		cambioContrasenna.findOne({
			path: req.params.path
		}, (err, encontrado) => {
			if(err) return res.redirect("/");
			if(encontrado){
				res.sendFile(`${folder}/olvidoClaveCambiar/index.html`);
			}else{
				return res.redirect("/");
			}
		});

	});

	
router.post("/olvidoClave/:path", middleware.noLoggeado,
	function (req, res) {
		console.log(req.params.path);
		cambioContrasenna.findOne({
			path: req.params.path
		}, (err, encontrado) => {
			if(err) return res.redirect("/");
			if(encontrado){
				usuario.findOne({
					usuarioId: encontrado.id
				}, (err, usuario) => {
					if(err) return res.json({
						encontrado: false,
						alerta: {
							btnCancelar: false,
							btnAceptar: true,
							mensaje: "Error en la base de datos, favor intentar luego.",
							titulo: "Error"
						}
					});
					if(usuario){
						if(req.body.password1 == req.body.password2 && req.body.password1.length > 5){
							usuario.clave = req.body.password1;
							usuario.save((err) => {
								if(err) return res.json({
									encontrado: false,
									alerta: {
										btnCancelar: false,
										btnAceptar: true,
										mensaje: "Error en la base de datos, favor intentar luego.",
										titulo: "Error"
									}
								});
								encontrado.remove((err) => {
									if(err) return res.json({
										encontrado: false,
										alerta: {
											btnCancelar: false,
											btnAceptar: true,
											mensaje: "Error en la base de datos, favor intentar luego.",
											titulo: "Error"
										}
									});
									utils("perfilEditado", req.user, encontrado, "Contraseña modificada.");
									return res.json({
										actualizado: true,
										alerta: {
											btnCancelar: false,
											btnAceptar: true,
											mensaje: "Contraseña actualizada.",
											titulo: `<i class="fas fa-check" style="color: #009688;"></i>`
										}
									});
	
								});

							});
						} else {
							return res.json({
								actualizado: false,
								alerta: {
									btnCancelar: false,
									btnAceptar: true,
									mensaje: "Los campos de contraseñas deben de ser mayor a 5 caracteres.",
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
								mensaje: "Error en la base de datos, favor intentar luego.",
								titulo: "Error"
							}
						});
					}
				});
			}else{
				return res.redirect("/");
			}
		});

	});


router.get("/olvidoClave", middleware.noLoggeado,
	function (req, res) {
		res.sendFile(`${folder}/olvidoClave/index.html`);
	});

router.post("/olvidoClave", middleware.noLoggeado,
	function (req, res) {
		console.log(req.body);
		if (req.body.email) {
			usuario.findOne({
				email: req.body.email
			}, (err, encontrado) => {
				if (err) {
					console.log(err);
					return res.json({
						encontrado: false,
						alerta: {
							btnCancelar: false,
							btnAceptar: true,
							mensaje: "Error en la base de datos, favor intentar luego.",
							titulo: "Error"
						}
					});
				}
				if (encontrado) {
					cambioContrasenna.findOne({
						id: encontrado.usuarioId
					},
					(err, existe) => {
						if (existe) {
							mailNuevoFormato(`Cambie su contraseña: <a href="localhost:8080/olvidoClave/${existe.path}">Aquí</a>`, "¡Recuerda no darle tu contraseña a nadie!", "Podrá realizar el cambio de contraseña en el siguiente enlace:",(respuestaMail) => {
								mail("", req.body.email, "Contraseña de Libros.cr", "", respuestaMail);
							});
						} else {
							cambioContrasenna.create({
								_id: mongoose.Types.ObjectId(),
								id: encontrado.usuarioId,
								path: [...Array(25)].map(() => (~~(Math.random() * 36)).toString(36)).join("")
							}, (err, nuevo) => {
								if (err) return res.json([]);
								console.log("Creado: " + nuevo);
								mailNuevoFormato(`Cambie su contraseña: <a href="localhost:8080/olvidoClave/${nuevo.path}">Aquí</a>`, "¡Recuerda no darle tu contraseña a nadie!", "Podrá realizar el cambio de contraseña en el siguiente enlace:",(respuestaMail) => {
									mail("", req.body.email, "Contraseña de Libros.cr", "", respuestaMail);
								});
								utils("solicitudCambioContrasenna", req.user, nuevo, "Solicitud de cambio de contraseña.");
							});
						}
					});

				}

				res.json({
					encontrado: undefined,
					alerta: {
						btnCancelar: false,
						btnAceptar: true,
						mensaje: "Si existe el usuario, se le enviará un correo para el cambio de clave.",
						titulo: "Info"
					}
				});


			});
		} else {
			res.json({
				encontrado: false,
				alerta: {
					btnCancelar: false,
					btnAceptar: true,
					mensaje: "Favor llenar el campo de correo",
					titulo: "Error"
				}
			});
		}


	});


module.exports = router;