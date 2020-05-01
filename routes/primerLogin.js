const express = require("express"),
	path = require("path"),
	middleware = require("../middleware"),
	usuario = require("../models/usuario"),
	utils = require("../utils"),
	router = express.Router();

const folder = path.join(__dirname, "../public");

router.post("/", middleware.loggeado,
	function (req, res) {
		console.log(req.params.path);
		usuario.findOne({
			usuarioId: req.user.usuarioId,
			primerLogin: true
		}, (err, encontrado) => {
			if(err) return res.redirect("/");
			if(encontrado){
				if(req.body.password1 == req.body.password2 && req.body.password1.length > 5){
					encontrado.clave = req.body.password1;
					encontrado.primerLogin = false;
					encontrado.save((err) => {
						if(err) return res.json({
							encontrado: false,
							alerta: {
								btnCancelar: false,
								btnAceptar: true,
								mensaje: "Error en la base de datos, favor intentar luego.",
								titulo: "Error"
							}
						});
							
						utils("perfilEditado", req.user, encontrado, "Perfil modificado.");
						return res.json({
							actualizado: true,
							alerta: {
								btnCancelar: false,
								btnAceptar: true,
								mensaje: "Contraseña actualizada favor re ingresar.",
								titulo: `<i class="fas fa-check" style="color: #009688;"></i>`
							}
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
	});



router.get("/", middleware.loggeado,
	function (req, res) {
		res.sendFile(`${folder}/primerLogin/index.html`);
	});



module.exports = router;