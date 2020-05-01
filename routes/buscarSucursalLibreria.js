const app = require("express"),
	path = require("path"),
	sucursal = require("../models/sucursal"),
	middleware = require("../middleware"),
	usuario = require("../models/usuario"),
	utils = require("../utils"),
	mail = require("../mail"),
	mailEliminacionSucursal = require("../mailEliminacionSucursal"),
	inventario = require("../models/inventario"),
	router = app.Router();

const folder = path.join(__dirname, "../public");

router.get("/", middleware.esLibreria, (req, res) => {
	res.sendFile(`${folder}/buscarSucursalLibreria/index.html`);
});



router.post("/", middleware.esLibreria, (req, res) => {
	if (req.body.tipo == "sucursal") {

		let nombre = mayuscula(req.body.query);
		let objBuscar = {
			libreriaId: req.user.libreriaId
		};
		if (nombre.length > 0) {
			objBuscar["nombre"] = new RegExp(nombre, "i");
		}

		let sort = {};
		if (req.body.sort == "NDESC") {
			sort = {
				nombre: -1
			};
		} else if (req.body.sort == "NASC") {
			sort = {
				nombre: 1
			};
		}


		//Pedir url de imagen... también pedir cant libros de un arreglo que tenga y tambien calificación...
		sucursal.find(objBuscar).sort(sort).exec((err, sucursalesEncontradas) => {
			var sucursales = [];
			if (err) return res.json([]);
			if (sucursalesEncontradas.length != 0) {
				sucursalesEncontradas.forEach((item) => {
					//if(item.libros.length != 0){
					sucursales.push({
						url: item.imgPerfil,
						sucursal: item.nombre,
						id: item.id,
						libreria: item.libreriaId //Aquí se podría poner el ID.
					});
					//}
				});



				res.json({
					encontrado: true,
					datos: sucursales
				});



			} else {
				res.json({
					encontrado: false,
					alerta: {
						btnCancelar: false,
						btnAceptar: true,
						mensaje: "No se ha podido encontrar la sucursal.",
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
				mensaje: "Tipo de busqueda no existente.",
				titulo: "Error"
			}
		});
	}
});


router.get("/eliminar/:id", middleware.esAdminOUsuarioLibreria, (req, res) => {

	let objBuscar = {
		id: req.params.id
	};
	if(req.user.rol == 1){
		objBuscar["libreriaId"] = req.user.libreriaId;
	}


	//Pedir url de imagen... también pedir cant libros de un arreglo que tenga y tambien calificación...
	sucursal.findOne(objBuscar).exec((err, sucursalEncontrada) => {
		if (err) return res.json([]);
		if (sucursalEncontrada) {
			
			inventario.find({
				id: req.params.id
			}, (err, inventarioE) => {
				if(err) return res.json({
					encontrado: false,
					alerta: {
						btnCancelar: false,
						btnAceptar: true,
						mensaje: "Ha ocurrido un error, favor intentar luego.",
						titulo: "Error"
					}
				});
				if(inventarioE.length > 0){
					res.json({
						eliminado: false,
						alerta: {
							btnCancelar: false,
							btnAceptar: true,
							mensaje: "Tiene que eliminar el inventario de dicha sucursal",
							titulo: "Error"
						}
					});
				} else {
					let nombre = sucursalEncontrada.nombre;
					sucursalEncontrada.remove(err => {
						utils("sucursalEliminada", req.user, sucursalEncontrada, "Sucursal eliminada.");
						if(err) return res.json({
							eliminado: false,
							alerta: {
								btnCancelar: false,
								btnAceptar: true,
								mensaje: "Favor intentar luego.",
								titulo: "Error"
							}
						});
						usuario.find({
							rol: 2
						}, (err, admin)=>{
							admin.forEach((item)=>{
								mailEliminacionSucursal(`${nombre} por el usuario ${req.user.nombre}`,(respuestaMail) => {
									console.log("enviado");
									//Cambiar correo a req.user.email 
									mail("", item.email, "Notifiación Sucursal Eliminada", "", respuestaMail);
								});
							});
						});
						return res.json({
							eliminando: true,
							alerta: {
								btnCancelar: false,
								btnAceptar: true,
								mensaje: "Se ha eliminando exitosamente la sucursal.",
								titulo: `<i class="fas fa-check" style="color: #009688;"></i>`
							}
						});
					});
				}
			});


		} else {
			res.json({
				encontrado: false,
				alerta: {
					btnCancelar: false,
					btnAceptar: true,
					mensaje: "No se ha podido encontrar la sucursal.",
					titulo: "Error"
				}
			});
		}




	});


});

function mayuscula(string) {
	if (typeof string !== "string") return "";
	return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

module.exports = router;