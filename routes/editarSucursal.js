const app = require("express"),
	path = require("path"),
	utils = require("../utils"),
	sucursal = require("../models/sucursal"),
	middleware = require("../middleware"),
	router = app.Router();

const folder = path.join(__dirname, "../public");

router.get("/:id", middleware.esAdminOUsuarioLibreria, (req, res) => {
	if (req.user.rol == 1) {
		res.sendFile(`${folder}/editarSucursal/index.html`);
	} else {
		res.sendFile(`${folder}/editarSucursalAdmin/index.html`);
	}
});


router.get("/:id/get", middleware.esAdminOUsuarioLibreria, (req, res) => {
	let objBuscar = {
		id: Number(req.params.id)
	};
	if (req.user.rol == 1) {
		objBuscar["libreriaId"] = req.user.libreriaId;
	}
	sucursal.findOne(objBuscar, (err, encontrada) => {
		if (err) {
			console.log(err);
			return res.json({});
		}
		if (encontrada) {
			return res.json(encontrada);
		} else {
			return res.json({});
		}
	});
});


const cloudinary = require("cloudinary");
require("../handlers/cloudinary");
const upload = require("../handlers/multer");
const multer = require("multer");

var uploadVar = upload.single("fotoPerfil");

router.post("/:id", middleware.esAdminOUsuarioLibreria, (req, res) => {
	uploadVar(req, res, async function (err) {
		if (err instanceof multer.MulterError) {
			return res.json({
				creado: false,
				alerta: {
					btnCancelar: false,
					btnAceptar: true,
					mensaje: "Favor intentar luego",
					titulo: "Error"
				}
			});
		} else if (err) {
			return res.json({
				creado: false,
				alerta: {
					btnCancelar: false,
					btnAceptar: true,
					mensaje: "Archivo no permitido",
					titulo: "Error"
				}
			});
		}
		var result = {
			secure_url: " "
		};
		if (req.file && req.file.path) {
			result = await cloudinary.v2.uploader.upload(req.file.path);
		}

		let objBuscar = {
			id: Number(req.params.id)
		};
		if (req.user.rol == 1) {
			objBuscar["libreriaId"] = req.user.libreriaId;
		}

		sucursal.findOne(objBuscar, (err, sucursalPorEditar) => {
			if (err) return res.json([]);
			if (sucursalPorEditar) {
				if (req.body.nombre != "" && req.body.coordenadas != "" &&
					req.body.telefono != "" && req.body.costoEnvio != "") {
					if (!isNaN(req.body.costoEnvio) && req.body.costoEnvio >= 0) {
						var nombre = req.body.nombre;
						nombre = nombre.split(" ").map((palabra) => {
							return mayuscula(palabra);
						}).join(" ");
						if (req.body.provincia != "" && req.body.canton != "" && req.body.distrito != "") {
							sucursalPorEditar.direccion = {
								provincia: req.body.provincia,
								canton: req.body.canton,
								distrito: req.body.distrito,
								coordenadas: {
									lat: req.body.coordenadas.split(", ")[0],
									long: req.body.coordenadas.split(", ")[1]
								}
							};
						} else {
							sucursalPorEditar.direccion = {
								provincia: sucursalPorEditar.direccion.provincia,
								canton: sucursalPorEditar.direccion.canton,
								distrito: sucursalPorEditar.direccion.distrito,
								coordenadas: {
									lat: sucursalPorEditar.direccion.coordenadas.lat,
									long: sucursalPorEditar.direccion.coordenadas.long
								}
							};
						}
						sucursalPorEditar.nombre = nombre;
						sucursalPorEditar.telefono = req.body.telefono;
						sucursalPorEditar.costoEnvio = req.body.costoEnvio;

						if (result.secure_url != " ") {
							sucursalPorEditar.imgPerfil = result.secure_url;
						}
						console.log(sucursalPorEditar);
						sucursalPorEditar.save((err) => {
							if (err) return res.json([]);
							utils("sucursalActualizada", req.user, sucursalPorEditar, "Sucursal modificada.");
							res.json({
								actualizada: true,
								alerta: {
									btnCancelar: false,
									btnAceptar: true,
									mensaje: "Sucursal actualizada.",
									titulo: `<i class="fas fa-check" style="color: #009688;"></i>`
								}
							});
						});
					} else {
						res.json({
							actualizada: false,
							alerta: {
								btnCancelar: false,
								btnAceptar: true,
								mensaje: "Costo de envío necesita ser un número y mayor o igual a 0.",
								titulo: "Error"
							}
						});
					}
				} else {
					res.json({
						actualizada: false,
						alerta: {
							btnCancelar: false,
							btnAceptar: true,
							mensaje: "Favor llenar los campos",
							titulo: "Error"
						}
					});
				}
			} else {
				res.json({
					encontrada: false,
					alerta: {
						btnCancelar: false,
						btnAceptar: true,
						mensaje: "No se encontro la sucursal.",
						titulo: "Error"
					}
				});
			}
		});
	});

});

function mayuscula(string) {
	if (typeof string !== "string") return "";
	return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}


module.exports = router;