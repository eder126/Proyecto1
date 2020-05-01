const app = require("express"),
	usuario = require("../models/usuario"),
	utils = require("../utils"),
	middleware = require("../middleware"),
	router = app.Router();

router.get("/", middleware.loggeado, (req, res) => {
	let objBuscar = {
		_id: req.user._id
	};
	if(req.user.rol == 2){
		objBuscar["rol"] = 2;
	}
	usuario.find(objBuscar, (err, encontrado) => {
		if (err) return res.json({
			eliminado: false,
			alerta: {
				btnCancelar: false,
				btnAceptar: true,
				mensaje: "Error de la base de datos, favor intentar luego.",
				titulo: "Error"
			}
		});
		if (encontrado.length > 0) {
			//Iterar por cada club de lectura que tenga al usuario...
			if(req.user.rol == 2 && encontrado.length -1 > 0) {
				return res.json({
					eliminado: false,
					alerta: {
						btnCancelar: false,
						btnAceptar: true,
						mensaje: "No puede eliminar su cuenta ya que es el único administrador.",
						titulo: "Error"
					}
				});
			} else if(req.user.rol == 1) {
				return res.json({
					eliminado: false,
					alerta: {
						btnCancelar: false,
						btnAceptar: true,
						mensaje: "No puede eliminar una cuenta librería.",
						titulo: "Error"
					}
				});
			}
			encontrado[0].remove((err)=>{
				if(err){
					return res.json({
						eliminado: false,
						alerta: {
							btnCancelar: false,
							btnAceptar: true,
							mensaje: "Error de la base de datos, favor intentar luego.",
							titulo: "Error"
						}
					});
				}else{
					utils("cuentaEliminada", req.user, encontrado, "Usuario eliminado.");
					return res.json({
						eliminado: true,
						alerta: {
							btnCancelar: false,
							btnAceptar: true,
							mensaje: "Muchas gracias por usar Libros.cr",
							titulo: ""
						}
					});
				}
			});
			
		} else {
			return res.json({
				eliminado: false,
				alerta: {
					btnCancelar: false,
					btnAceptar: true,
					mensaje: "No se ha encontrado el usuario.",
					titulo: "Error"
				}
			});
		}
	});
});

module.exports = router;