const app = require("express"),
	path = require("path"),
	usuarioModel = require("../models/usuario"),
	intercambioModel = require("../models/intercambio"),
	middleware = require("../middleware"),
	router = app.Router();

const folder = path.join(__dirname, "../public");

router.get("/", middleware.loggeado, (req, res) => {
	res.redirect("./perfilUsuario/-1");
});

router.get("/:usuario", middleware.loggeado, (req, res) => {
	if(req.user.usuarioId === Number(req.params.usuario)){
		res.redirect("/perfilPersonalUsuario");
	} else {
		res.sendFile(`${folder}/perfilUsuario/index.html`);
	}
});

router.get("/:usuario/listar", middleware.loggeado, (req, res) => {
	usuarioModel.findOne({
		usuarioId: req.params.usuario
	},"nombre apellido apellido2 calificacion rol url", (err, usuarioEncontrado) => {
		if (err) return res.json([]);
		if(usuarioEncontrado.rol === 0){
			res.json({
				url: usuarioEncontrado.url,
				nombre: usuarioEncontrado.nombre,
				apellido: usuarioEncontrado.apellido,
				apellido2: usuarioEncontrado.apellido2,
				calificacion: usuarioEncontrado.calificacion,
				libros: true,
				usuarioId: usuarioEncontrado.usuarioId
			});
		} else {
			res.json({
				url: usuarioEncontrado.url,
				nombre: usuarioEncontrado.nombre,
				apellido: usuarioEncontrado.apellido,
				apellido2: usuarioEncontrado.apellido2,
				calificacion: -1,
				libros: false,
				usuarioId: usuarioEncontrado.usuarioId
			});
		}
	});
});

router.post("/:usuario/calificar", (req, res) => {
	intercambioModel.find({
		$and: [
			{ $or: [ { emisorId: req.params.usuario }, { receptorId: req.params.usuario } ] },
			{ $or: [ { emisorId: req.user.usuarioId }, { receptorId: req.user.usuarioId } ] }
		]
	}, (err, intercambioEncontrado) => {
		if (err) return res.json([]);
		if(intercambioEncontrado.length != 0){
			var encontrado = true;
			var idInter = -1;
			intercambioEncontrado.forEach((item, index, arrCompleto) => {
				usuarioModel.findOne({
					usuarioId: req.params.usuario,
					$and: [
						{ 'calificadoPor.usuarioId': req.user.usuarioId },
						{ 'calificadoPor.idIntercambio': item.idIntercambio }
					]
				}, (err, calificacionEncontrada) => {
					if (err) return res.json([]);
					if(!calificacionEncontrada) {
						encontrado = false; 
						idInter = item.idIntercambio;
					}
					if(encontrado == false && arrCompleto.length == index+1 && idInter != -1){
						usuarioModel.updateOne({ usuarioId: req.params.usuario },
						{ $push: {
							calificadoPor: {
								idIntercambio: Number(idInter),
								usuarioId: Number(req.user.usuarioId),
								calificacion: Number(req.body.calificacion),
								resenna: req.body.resenna
							} }
						}, (err, usuarioActualizado) => {
							if (err) return res.json([]);
							if(usuarioActualizado){
								usuarioModel.findOne({
									usuarioId: req.params.usuario
								}, (err, calificacionActualizado) => {
									if (err) return res.json([]);
									if(calificacionActualizado){
										var cantidad = calificacionActualizado.calificadoPor.length;
										var suma = 0;
										for (var i = 0; i < cantidad; i++) {
											suma += calificacionActualizado.calificadoPor[i].calificacion;
										}
										calificacionActualizado.calificacion = Math.round(Number(suma / cantidad));
										calificacionActualizado.save(function (err) {
											if (!err) {
												//console.log("Usuario actualizado");
												res.json({
													creado: true,
													alerta: {
														btnCancelar: false,
														btnAceptar: true,
														mensaje: "Calificación exitosa",
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
												mensaje: "No se ha encontrado al usuario por calificar",
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
										mensaje: "No se ha encontrado al usuario por calificar",
										titulo: "Error"
									}
								});
							}
						});
					} else if (arrCompleto.length == index+1 && encontrado == true && idInter == -1) {
						res.json({
							creado: false,
							alerta: {
								btnCancelar: false,
								btnAceptar: true,
								mensaje: "Debe realizar un nuevo intercambio para calificar nuevamente a este usuario",
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
					mensaje: "Usted no ha intercambiado libros con este usuario, por ende no puede calificarlo",
					titulo: "Error"
				}
			});
		}
	});
});

router.get("/:usuario/remover", (req, res) => {
	usuarioModel.updateOne({ usuarioId: req.params.usuario },
	{ $pull: {
		calificadoPor: {
			usuarioId: Number(req.user.usuarioId)
		} }
	}, (err, usuarioActualizado) => {
		if (err) return res.json([]);
		console.log(usuarioActualizado);
		res.json({
			creado: true,
			alerta: {
				btnCancelar: false,
				btnAceptar: true,
				mensaje: "Calificación exitosa",
				titulo: `<i class="fas fa-check" style="color: #009688;"></i>`
			}
		});
	});
});

router.get("/:usuario/calificado", (req, res) => {
	intercambioModel.find({
		$and: [
			{ $or: [ { emisorId: req.params.usuario }, { receptorId: req.params.usuario } ] },
			{ $or: [ { emisorId: req.user.usuarioId }, { receptorId: req.user.usuarioId } ] }
		]
	}, (err, intercambioEncontrado) => {
		if (err) return res.json([]);
		if(intercambioEncontrado.length != 0){
			var encontrado = true;
			intercambioEncontrado.forEach((item, index, arrCompleto) => {
				usuarioModel.findOne({
					usuarioId: req.params.usuario,
					$and: [
						{ 'calificadoPor.usuarioId': req.user.usuarioId },
						{ 'calificadoPor.idIntercambio': item.idIntercambio }
					]
				}, (err, calificacionEncontrada) => {
					if (err) return res.json([]);
					if(!calificacionEncontrada) encontrado = false;
					if(encontrado == false && arrCompleto.length == index+1){
						return res.json({
							creado: true,
							encontrado: encontrado
						});
					} else if (arrCompleto.length == index+1 && encontrado == true) {
						return res.json({
							creado: true,
							encontrado: encontrado
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
					mensaje: "Usted no ha intercambiado libros con este usuario, por ende no puede calificarlo",
					titulo: "Error"
				}
			});
		}
	});
});

router.get("/:usuario/usuario", (req, res) => {
	//console.log(req.params.libro);
	usuarioModel.findOne({
		usuarioId: req.params.usuario
	}, (err, usuarioEncontrado) => {
		if (err) return res.json([]);
		console.log(usuarioEncontrado);
		res.json(usuarioEncontrado);
	});
});

module.exports = router;