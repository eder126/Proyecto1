const app = require("express"),
	path = require("path"),
	sucursal = require("../models/sucursal"),
	router = app.Router();

const folder = path.join(__dirname, "../public");

router.get("/", (req, res) => {
	res.sendFile(`${folder}/buscarSucursal/index.html`);
});


router.post("/", (req, res) => {
	if (req.body.tipo == "sucursal") {

		let nombre = mayuscula(req.body.query);
		let objBuscar = {};
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


function mayuscula(string) {
	if (typeof string !== "string") return "";
	return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

module.exports = router;