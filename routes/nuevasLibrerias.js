const app = require("express"),
	path = require("path"),
	usuario = require("../models/usuario"),
	middleware = require("../middleware"),
	mailNotificacionSucursal = require("../mailNotificacionSucursal"),
	mail = require("../mail"),
	utils = require("../utils"),
	router = app.Router();

const folder = path.join(__dirname, "../public");

router.get("/", middleware.esAdmin, (req, res) => {
	res.sendFile(`${folder}/nuevasLibrerias/index.html`);
});

router.post("/", middleware.esAdmin, (req, res) => {
	let nombre = req.body.nombre;

	let objBuscar = {
		aceptado: false,
		rol: 1
	};

	if (nombre.length > 0) {
		objBuscar = {
			nombreComercial: new RegExp(nombre, "i")
		};
	}

	usuario.find(objBuscar).sort({nombreComercial: 1}).exec((err, usuariosEncontrados) => {
		if (err) return res.json([]);
		if (usuariosEncontrados.length != 0) {
			res.json({
				encontrado: true,
				datos: usuariosEncontrados
			});
		} else {
			res.json({});
		}
	});

});

router.get("/id/:id", middleware.esAdmin, (req, res) => {

	usuario.findOne({
		libreriaId: req.params.id,
		rol: 1,
		aceptado: false
	}, (err, libreriaEncontrada) => {
		if (err) return res.json([]);
		if (libreriaEncontrada) {
			res.json({
				encontrado: true,
				datos: libreriaEncontrada
			});
		} else {
			res.json({
				encontrado: false,
				alerta: {
					btnCancelar: false,
					btnAceptar: true,
					mensaje: "No se ha podido encontrar la librería.",
					titulo: "Error"
				}
			});
		}
	});

});

router.get("/rechazar/:id", middleware.esAdmin, (req, res) => {

	usuario.findOne({
		libreriaId: req.params.id,
		rol: 1,
		aceptado: false
	}, (err, libreriaEncontrada) => {
		if (err) return res.json([]);
		if (libreriaEncontrada) {
			let nombre = libreriaEncontrada.nombreComercial,
				email = libreriaEncontrada.email;
			libreriaEncontrada.remove((err)=>{
				if (err) return res.json({
					actualizado: false,
					alerta: {
						btnCancelar: false,
						btnAceptar: true,
						mensaje: "Ha ocurrido un error, favor intentar luego",
						titulo: "Error"
					}
				});
				utils("solicitudLibreria", req.user, libreriaEncontrada, "Librería rechazada.");
				mailNotificacionSucursal(`Su librería ${nombre} ha sido rechazada en Libros.cr.`,(respuestaMail) => {
					console.log("enviado");
					//Cambiar correo a req.user.email 
					mail("", email, "Estado de solicitud de librería.", "", respuestaMail);
					res.json({
						encontrado: false,
						alerta: {
							btnCancelar: false,
							btnAceptar: true,
							mensaje: "Se ha rechazado la solicitud de " + libreriaEncontrada.nombreComercial,
							titulo: `<i class="fas fa-check" style="color: #009688;"></i>`
						}
					});
				});
			});
		} else {
			res.json({
				encontrado: false,
				alerta: {
					btnCancelar: false,
					btnAceptar: true,
					mensaje: "No se ha podido encontrar la librería.",
					titulo: "Error"
				}
			});
		}
	});

});

router.get("/aceptar/:id", middleware.esAdmin, (req, res) => {

	usuario.findOne({
		libreriaId: req.params.id,
		rol: 1,
		aceptado: false
	}, (err, libreriaEncontrada) => {
		if (err) return res.json([]);
		if (libreriaEncontrada) {
			libreriaEncontrada.aceptado = true;
			libreriaEncontrada.save((err)=>{
				if (err) return res.json({
					actualizado: false,
					alerta: {
						btnCancelar: false,
						btnAceptar: true,
						mensaje: "Ha ocurrido un error, favor intentar luego",
						titulo: "Error"
					}
				});
				//Enviar correo de que se accepto. ez
				mailNotificacionSucursal(`Su librería ${libreriaEncontrada.nombreComercial} ha sido aceptada en Libros.cr.`,(respuestaMail) => {
					console.log("enviado");
					//Cambiar correo a req.user.email 
					mail("", libreriaEncontrada.email, "Estado de solicitud de librería.", "", respuestaMail);
					utils("solicitudLibreria", req.user, libreriaEncontrada, "Librería acceptada.");
					res.json({
						encontrado: false,
						alerta: {
							btnCancelar: false,
							btnAceptar: true,
							mensaje: "Se ha aceptado la solicitud de " + libreriaEncontrada.nombreComercial,
							titulo: `<i class="fas fa-check" style="color: #009688;"></i>`
						}
					});
				});
			});
		} else {
			res.json({
				encontrado: false,
				alerta: {
					btnCancelar: false,
					btnAceptar: true,
					mensaje: "No se ha podido encontrar la librería.",
					titulo: "Error"
				}
			});
		}
	});

});



module.exports = router;