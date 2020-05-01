const app = require("express"),
	path = require("path"),
	usuario = require("../models/usuario"),
	libro = require("../models/libro"),
	middleware = require("../middleware"),
	utils = require("../utils"),
	router = app.Router();

const folder = path.join(__dirname, "../public");

router.get("/", middleware.esAdmin, (req, res) => {
	res.sendFile(`${folder}/buscarUsuariosAdmin/index.html`);
});


router.post("/", middleware.esAdmin, (req, res) => {

	let nombre = req.body.nombre;

	let objBuscar = {};

	if (nombre) {
		objBuscar["nombre"] = new RegExp(nombre, "i");
	}
	usuario.find(objBuscar).sort({
		nombre: 1
	}).exec((err, usuariosEncontrados) => {
		console.log(usuariosEncontrados + " encontrados");
		if (err) return res.json([]);
		if (usuariosEncontrados.length != 0) {
			res.json({
				encontrado: true,
				datos: usuariosEncontrados
			});
		} else {
			res.json({
				encontrado: false,
				alerta: {
					btnCancelar: false,
					btnAceptar: true,
					mensaje: "No se ha podido encontrar ningún usuario con ese query.",
					titulo: "Error"
				}
			});
		}
	});

});


router.post("/bloquearUsuario/:identificador", middleware.esAdmin, (req, res) => {

	if(req.params.identificador){
		usuario.findOne({
			usuarioId: Number(req.params.identificador)
		}, (err, usuarioEncontrado) => {
			//console.log(sucursalesEncontradas);
			if (err) return res.json([]);
			if(usuarioEncontrado){
				usuarioEncontrado.razon = req.body.razon;
				usuarioEncontrado.bloqueado = true;
				usuarioEncontrado.save((err) => {
					if(!err){
						res.json({
							actualizado: true,
							alerta: {
								btnCancelar: false,
								btnAceptar: true,
								mensaje: "Se ha bloqueado el usuario con éxito",
								titulo: `<i class="fas fa-check" style="color: #009688;"></i>`
							}
						});
						utils("bloqueoUsuario", req.user, usuarioEncontrado, "Usuario bloqueado.");
					} else {
						console.log(err);
						res.json({
							actualizado: false,
							alerta: {
								btnCancelar: false,
								btnAceptar: true,
								mensaje: "Error, favor intentar luego.",
								titulo: "Error"
							}
						});
					}
				});
			}else{
				res.json({
					encontrado: false,
					alerta: {
						btnCancelar: false,
						btnAceptar: true,
						mensaje: "No se ha podido encontrar ningún usuario con ese id.",
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
				mensaje: "Favor digitar un id.",
				titulo: "Error"
			}
		});
	}





});



router.get("/desBloquearUsuario/:identificador", middleware.esAdmin, (req, res) => {

	if(req.params.identificador){
		usuario.findOne({
			usuarioId: Number(req.params.identificador)
		}, (err, usuarioEncontrado) => {
			//console.log(sucursalesEncontradas);
			if (err) return res.json([]);
			if(usuarioEncontrado){
				usuarioEncontrado.razon = "";
				usuarioEncontrado.bloqueado = false;
				usuarioEncontrado.save((err) => {
					if(!err){
						utils("desbloqueoUsuario", req.user, usuarioEncontrado, "Usuario desbloqueado.");
						res.json({
							actualizado: true,
							alerta: {
								btnCancelar: false,
								btnAceptar: true,
								mensaje: "Se ha desbloqueado el usuario con éxito",
								titulo: `<i class="fas fa-check" style="color: #009688;"></i>`
							}
						});
					} else {
						console.log(err);
						res.json({
							actualizado: false,
							alerta: {
								btnCancelar: false,
								btnAceptar: true,
								mensaje: "Error, favor intentar luego.",
								titulo: "Error"
							}
						});
					}
				});
			}else{
				res.json({
					encontrado: false,
					alerta: {
						btnCancelar: false,
						btnAceptar: true,
						mensaje: "No se ha podido encontrar ningún usuario con ese id.",
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
				mensaje: "Favor digitar un id.",
				titulo: "Error"
			}
		});
	}





});


module.exports = router;