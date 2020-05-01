const app = require("express"),
	path = require("path"),
	sucursalModel = require("../models/sucursal"),
	usuarioModel = require("../models/usuario"),
	mongoose = require("mongoose"),
	middleware = require("../middleware"),
	utils = require("../utils"),
	router = app.Router();

const folder = path.join(__dirname, "../public");

router.get("/", middleware.esAdmin, (req, res) => {
	res.sendFile(`${folder}/registrarSucursalAdmin/index.html`);
});

const cloudinary = require("cloudinary");
require("../handlers/cloudinary");
const upload = require("../handlers/multer");
const multer = require("multer");

var uploadVar = upload.single("fotoPerfil");

router.post("/", middleware.esAdmin, (req, res) => {
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

		sucursalModel.find({}, (err, total) => {
			var idSucursal = undefined;
			let ids = [];
			console.log(total);
			for (let ii = 0; ii < total.length; ii++) {
				ids.push(total[ii].id);
			}
			for (let iii = 0; iii < total.length; iii++) {
				if (ids.indexOf(iii) == -1) {
					idSucursal = iii;
					break;
				} else {
					idSucursal = total.length;
				}
			}
			if (err) return res.json([]);
			if (req.body.nombre != "" && req.body.provincia != "" &&
				req.body.canton != "" && req.body.distrito != "" &&
				req.body.coordenadas != "" &&
				req.body.telefono != "" && req.body.costoEnvio != "") {
				if (!isNaN(req.body.costoEnvio) && req.body.costoEnvio >= 0) {
					var nombre = req.body.nombre;
					nombre = nombre.split(" ").map((palabra) => {
						return mayuscula(palabra);
					}).join(" ");

					var dir = {
						provincia: req.body.provincia,
						canton: req.body.canton,
						distrito: req.body.distrito,
						coordenadas: {
							lat: req.body.coordenadas.split(", ")[0],
							long: req.body.coordenadas.split(", ")[1]
						}
					};
					usuarioModel.findOne({
						libreriaId: Number(req.body.libreriaId)
					}, (err, existe) => {
						if (existe) {
							sucursalModel.create({
								_id: mongoose.Types.ObjectId(),
								imgPerfil: result.secure_url,
								nombre: nombre,
								telefono: req.body.telefono,
								direccion: dir,
								costoEnvio: req.body.costoEnvio,
								id: idSucursal,
								libreriaId: Number(req.body.libreriaId)
							}, (err, nuevo) => {
								if (err) return res.json([]);
								console.log("Creado: " + nuevo);
								res.json({
									creado: true,
									alerta: {
										btnCancelar: false,
										btnAceptar: true,
										mensaje: "Sucursal creada.",
										titulo: `<i class="fas fa-check" style="color: #009688;"></i>`
									}
								});
								utils("registroSucursal", req.user, nuevo, "Nueva sucursal");
							});
						} else {
							res.json({
								creado: false,
								alerta: {
									btnCancelar: false,
									btnAceptar: true,
									mensaje: "Librería ID no existe.",
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
							mensaje: "Costo de envío necesita ser un número y mayor o igual a 0.",
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


router.get("/librerias", middleware.esAdmin, (req, res) => {
	usuarioModel.find({
		rol: 1
	}, "libreriaId nombreFantasia").sort({nombreFantasia: 1}).exec((err, libreriasEncontrado) => {
		if (err) return res.json({});
		res.json(libreriasEncontrado);
	});
});



function mayuscula(string) {
	if (typeof string !== "string") return "";
	return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

module.exports = router;