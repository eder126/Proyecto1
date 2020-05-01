const app = require("express"),
	path = require("path"),
	promocionModel = require("../models/promocion"),
	libroModel = require("../models/libro"),
	usuario = require("../models/usuario"),
	router = app.Router();

const folder = path.join(__dirname, "../public");

router.get("/", (req, res) => {
	res.sendFile(`${folder}/buscarPromociones/index.html`);
});


router.post("/", (req, res) => {
	console.log(req.body);
	if (req.body.tipo == "promocion") {
		if (req.body.query.length > 3) {
			let objBuscar1 = {
				nombre: new RegExp(req.body.query, "i")
			};

			libroModel.findOne(objBuscar1, (err, libroEncontrado) => {
				console.log(libroEncontrado);
				if (err) return res.json([]);
				/*res.json({
			isbn: libroEncontrado.isbn
		});*/
				if (libroEncontrado != null && libroEncontrado != [] && libroEncontrado != undefined) {
					let isbn = libroEncontrado.ISBN;
					let objBuscar = {
						isbn: new RegExp(isbn, "i")
					};

					var Filtro = req.body.sort;
					if (Filtro == "activa") {
						console.log("Filtro de solo activas");
						objBuscar = Object.assign(objBuscar, {
							fechaFin: {
								$gte: new Date()
							}
						});
					} else if (Filtro == "semana") {
						console.log("Filtro de una semana");
						var d = new Date();
						var year = d.getFullYear();
						var month = d.getMonth();
						var day = d.getDate();
						var c = new Date(year, month, day + 7);
						objBuscar = Object.assign(objBuscar, {
							fechaFin: {
								$gte: new Date(),
								$lt: c
							}
						});
					} else if (Filtro == "mes") {
						console.log("Filtro de un mes");
						var d = new Date();
						var year = d.getFullYear();
						var month = d.getMonth();
						var day = d.getDate();
						var c = new Date(year, month + 1, day);
						objBuscar = Object.assign(objBuscar, {
							fechaFin: {
								$gte: new Date(),
								$lt: c
							}
						});
					} else if (Filtro == "anno") {
						console.log("Filtro de un año");
						var d = new Date();
						var year = d.getFullYear();
						var month = d.getMonth();
						var day = d.getDate();
						var c = new Date(year + 1, month, day);
						objBuscar = Object.assign(objBuscar, {
							fechaFin: {
								$gte: new Date(),
								$lt: c
							}
						});
					} else if (Filtro == "todo" || Filtro == "none") {
						console.log("Sin filtro temporal, todas las promociones futuras y pasadas.");
					}

					/*var d = new Date();
			var year = d.getFullYear();
			var month = d.getMonth();
			var day = d.getDate();
			var c = new Date(year+1, month, day)
			if (1==1) {
				console.log("Filtro de un año");
				objBuscar = Object.assign(objBuscar, {
					fechaFin: {
						$gte: new Date() ,     
						$lt: c
					}
				});
			}*/
					promocionModel.find(objBuscar, "isbn sucursal fechaFin tipoDescuento rebaja").exec((err, promocionEncontrada) => {
						console.log(promocionEncontrada + " encontrados");
						if (err) return res.json([]);
						if (promocionEncontrada.length != 0) {
							res.json({
								encontrado: true,
								libro: libroEncontrado.nombre,
								datos: promocionEncontrada
							});
						} else {
							res.json({
								encontrado: false,
								alerta: {
									btnCancelar: false,
									btnAceptar: true,
									mensaje: "No se ha podido encontrar una promoción de este libro.",
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
							mensaje: "No se ha podido encontrar una promoción de este libro.",
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
					mensaje: "Favor escribir más de 3 letras.",
					titulo: "Error"
				}
			});
		}
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
	return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = router;