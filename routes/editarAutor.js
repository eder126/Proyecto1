const app = require("express"),
	path = require("path"),
	autorModel = require("../models/autor"),
	mongoose = require("mongoose"),
	utils = require("../utils"),
	middleware = require("../middleware"),
	router = app.Router();

const folder = path.join(__dirname, "../public");

router.get("/", middleware.esAdmin, (req, res) => {
	res.redirect("/buscarAutoresAdmin");
});

router.get("/:identificador", middleware.esAdmin, (req, res) => {
	res.sendFile(`${folder}/editarAutor/index.html`);
});

const cloudinary = require("cloudinary");
require("../handlers/cloudinary");
const upload = require("../handlers/multer");
const multer = require("multer");

var uploadVar = upload.single("fotoPerfil");

router.get("/:id/info", middleware.esAdmin, (req, res) => {
	autorModel.findOne({
		identificador: req.params.id
	}, (err, encontrado) => {
		if (err) return res.json({
			actualizado: false,
			alerta: {
				btnCancelar: false,
				btnAceptar: true,
				mensaje: "Error de la base de datos, favor intentar luego.",
				titulo: "Error"
			}
		});
		if (encontrado)
			return res.json(encontrado);
		else
			return res.json({
				encontrado: false,
				alerta: {
					btnCancelar: false,
					btnAceptar: true,
					mensaje: "No se ha encontrado el autor.",
					titulo: "Error"
				}
			});
	});
});

router.post("/:id", middleware.esAdmin, (req, res) => {
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
		if (req.file && req.file.path) {
			var result = await cloudinary.v2.uploader.upload(req.file.path);
		}
		autorModel.findOne({
			identificador: req.params.id
		}, (err, autorEncontrado) => {
			if (err) return res.json({
				actualizado: false,
				alerta: {
					btnCancelar: false,
					btnAceptar: true,
					mensaje: "Error de la base de datos, favor intentar luego.",
					titulo: "Error"
				}
			});

			if (autorEncontrado) {

				if (req.body.nombre != "" && new Date(req.body.nacimiento) instanceof Date && new Date(req.body.nacimiento) < new Date()) {
					if(req.body.descripcion > 500) return res.json({
						creado: false,
						alerta: {
							btnCancelar: false,
							btnAceptar: true,
							mensaje: "La descripción debe de ser menor a 500 caracteres.",
							titulo: "Error"
						}
					});
					var Nombre = req.body.nombre;
					Nombre = Nombre.split(" ").map((palabra) => {
						return mayuscula(palabra);
					}).join(" ");
					var Alias = req.body.alias;
					Alias = Alias.split(" ").map((palabra) => {
						return mayuscula(palabra);
					}).join(" ");

					if (result && result.secure_url) {
						autorEncontrado.imagenPerfil = result.secure_url;
					}
					autorEncontrado.nombre = Nombre;
					autorEncontrado.alias = Alias;
					autorEncontrado.nacimiento = new Date(req.body.nacimiento);
					autorEncontrado.descripcion = req.body.descripcion;

					autorEncontrado.save((err) => {
						if (err) return res.json({
							encontrado: false,
							alerta: {
								btnCancelar: false,
								btnAceptar: true,
								mensaje: "Error en la base de datos, favor intentar luego.",
								titulo: "Error"
							}
						});
						utils("autorEditado", req.user, autorEncontrado, "Autor modificado.");
						return res.json({
							actualizado: true,
							alerta: {
								btnCancelar: false,
								btnAceptar: true,
								mensaje: "Autor actualizado.",
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
							mensaje: "No se ha encontrado el autor.",
							titulo: "Error"
						}
					});
				}
			} else {
				res.json({
					creado: false,
					alerta: {
						btnCancelar: false,
						btnAceptar: true,
						mensaje: "Favor llenar los campos",
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