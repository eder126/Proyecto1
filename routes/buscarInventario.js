const app = require("express"),
	path = require("path"),
	utils = require("../utils"),
	sucursal = require("../models/sucursal"),
	inventario = require("../models/inventario"),
	middleware = require("../middleware"),
	router = app.Router();

const folder = path.join(__dirname, "../public");


router.get("/", middleware.esAdminOUsuarioLibreria, (req, res) => {
	res.redirect("./buscarInventario/-1");
});

router.get("/:id", middleware.esAdminOUsuarioLibreria, (req, res) => {
	res.sendFile(`${folder}/buscarInventario/index.html`);
});

router.get("/:id/editar/", middleware.esAdminOUsuarioLibreria, (req, res) => {
	res.redirect(`../../editarInventario/${req.params.id}`);
});

router.get("/:id/editar/:isbn", middleware.esAdminOUsuarioLibreria, (req, res) => {
	res.sendFile(`${folder}/editarInventario/index.html`);
});

router.post("/:id/editar/:isbn", middleware.esAdminOUsuarioLibreria, (req, res) => {
	console.log(req.body);
	let objBuscar = {
		id: Number(req.params.id)
	};
	if (req.user.rol != 2) {
		objBuscar["libreriaId"] = req.user.libreriaId;
	}

	sucursal.findOne(objBuscar, (err, encontrado) => {
		if (err) return res.json([]);
		console.log("Encontrado: " + typeof encontrado);
		console.log(encontrado);


		if (encontrado) {

			inventario.findOne({
				isbn: Number(req.params.isbn),
				id: Number(req.params.id)
			}, (err, inventarioEncontrado) => {
				if (inventarioEncontrado) {


					inventarioEncontrado.cantidad = Number(req.body.cantidad);
					inventarioEncontrado.precio = Number(req.body.precio);
					inventarioEncontrado.save(function (err) {
						if (!err) {
							utils("inventarioActualizado", req.user, inventarioEncontrado, "Inventario modificado.");
							console.log("hola actualizado");
							console.log(inventarioEncontrado);
							res.json({
								actualizado: true,
								alerta: {
									btnCancelar: false,
									btnAceptar: true,
									mensaje: "Actualizado con éxito",
									titulo: `<i class="fas fa-check" style="color: #009688;"></i>`
								}
							});
						} else {
							console.log("Error: could not save contact ");
						}
					});
				} else {
					return res.json({
						actualizado: false,
						alerta: {
							btnCancelar: false,
							btnAceptar: true,
							mensaje: "No se ha encontrado en su inventario este libro.",
							titulo: "Errpr"
						}
					});
				}

			});

		} else {
			return res.json({
				creado: false,
				alerta: {
					btnCancelar: false,
					btnAceptar: true,
					mensaje: "No se ha encontrado la sucursal.",
					titulo: "Errpr"
				}
			});
		}

	});
});


router.get("/:id/eliminar/:isbn", middleware.esAdminOUsuarioLibreria, (req, res) => {
	console.log(req.body);

	let objBuscar = {
		id: Number(req.params.id)
	};
	if (req.user.rol != 2) {
		objBuscar["libreriaId"] = req.user.libreriaId;
	}

	sucursal.findOne(objBuscar, (err, encontrado) => {
		if (err) return res.json([]);
		console.log("Encontrado: " + typeof encontrado);
		console.log(encontrado);

		if (encontrado) {
			inventario.findOne({
				isbn: Number(req.params.isbn),
				id: Number(req.params.id)
			}, (err, inventarioEncontrado) => {
				if (inventarioEncontrado) {

					inventarioEncontrado.remove(function (err) {
						if (!err) {
							console.log("hola actualizado");
							console.log(inventarioEncontrado);
							utils("inventarioActualizado", req.user, inventarioEncontrado, "Libro eliminado.");
							res.json({
								eliminado: true,
								alerta: {
									btnCancelar: false,
									btnAceptar: true,
									mensaje: "Eliminado con éxito",
									titulo: `<i class="fas fa-check" style="color: #009688;"></i>`
								}
							});
						} else {
							console.log("Error: could not save contact ");
						}
					});
				} else {
					return res.json({
						creado: false,
						alerta: {
							btnCancelar: false,
							btnAceptar: true,
							mensaje: "No se ha encontrado en su inventario este libro.",
							titulo: "Errpr"
						}
					});
				}

			});
		} else {
			return res.json({
				creado: false,
				alerta: {
					btnCancelar: false,
					btnAceptar: true,
					mensaje: "No se ha encontrado la sucursal.",
					titulo: "Errpr"
				}
			});
		}



	});
});


router.post("/:id", middleware.esAdminOUsuarioLibreria, (req, res) => {
	if (!isNaN(req.params.id)) {
		console.log("Hola");

		let nombre = mayuscula(req.body.query);
		let objBuscar = {
			id: req.params.id
		};

		inventario.find(objBuscar).exec((err, sucursalesEncontradas) => {
			if (err) return res.json([]);
			if (sucursalesEncontradas.length != 0) {
				sucursal.findOne(objBuscar, (err, sucursalEncontrada) => {
					let libros = sucursalesEncontradas;


					if (nombre.length >= 3) {
						var regex = new RegExp(nombre, "i");
						libros = libros.filter((libros) => {
							return regex.test(libros.nombre);
						});
					}


					if (req.body.sort == "NDESC") {
						libros.sort((a, b) => (a.nombre < b.nombre) ? 1 : ((b.nombre < a.nombre) ? -1 : 0));
					} else if (req.body.sort == "NASC") {
						libros.sort((a, b) => (a.nombre > b.nombre) ? 1 : ((b.nombre > a.nombre) ? -1 : 0));
					} else if (req.body.sort == "CDESC") {
						libros.sort((a, b) => (a.cantidad < b.cantidad) ? 1 : ((b.cantidad < a.cantidad) ? -1 : 0));
					} else if (req.body.sort == "CASC") {
						libros.sort((a, b) => (a.cantidad > b.cantidad) ? 1 : ((b.cantidad > a.cantidad) ? -1 : 0));
					}


					res.json({
						encontrado: true,
						datos: {
							sucursal: sucursalEncontrada.nombre,
							id: sucursalEncontrada.id,
							libreria: sucursalEncontrada.libreriaId,
							libros: libros
						}
					});



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
				mensaje: "ID invalido.",
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