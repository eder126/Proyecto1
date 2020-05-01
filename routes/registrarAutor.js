const app = require("express"),
	path = require("path"),
	autorModel = require("../models/autor"),
	mongoose = require("mongoose"),
	utils = require("../utils"),
	middleware = require("../middleware"),
	router = app.Router();

const folder = path.join(__dirname, "../public");

router.get("/", middleware.esAdminOUsuarioLibreria, (req, res) => {
	res.sendFile(`${folder}/registrarAutor/index.html`);
});

const cloudinary = require("cloudinary");
require("../handlers/cloudinary");
const upload = require("../handlers/multer");
const multer = require("multer");

var uploadVar = upload.single("fotoPerfil");

router.post("/", middleware.esAdminOUsuarioLibreria, (req, res) => {
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

		autorModel.find({}, "identificador", (err, autorEncontrado) => {

			var idAutor = undefined;
			let ids = [];
			console.log(autorEncontrado);
			for (let ii = 0; ii < autorEncontrado.length; ii++) {
				ids.push(autorEncontrado[ii].identificador);
			}
			for (let iii = 0; iii < autorEncontrado.length; iii++) {
				if (ids.indexOf(iii) == -1) {
					idAutor = iii;
					break;
				} else {
					idAutor = autorEncontrado.length;
				}
			}
			console.log(idAutor);
			//console.log(autorEncontrado);
			if (err) return res.json([]);
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
				autorModel.create({
					_id: mongoose.Types.ObjectId(),
					imagenPerfil: result.secure_url,
					identificador: idAutor,
					nombre: Nombre,
					alias: Alias,
					nacimiento: new Date(req.body.nacimiento),
					descripcion: req.body.descripcion
				}, (err, nuevo) => {
					if (err) return res.json([]);
					console.log("Creado: " + nuevo);
					res.json({
						creado: true,
						alerta: {
							btnCancelar: false,
							btnAceptar: true,
							mensaje: "Autor creado.",
							titulo: `<i class="fas fa-check" style="color: #009688;"></i>`
						}
					});
					utils("registroAutor", req.user, nuevo, "Nuevo autor");
				});

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