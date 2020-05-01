const app = require("express"),
	path = require("path"),
	autorModel = require("../models/autor"),
	libroModel = require("../models/libro"),
	generoModel = require("../models/genero"),
	categoriaModel = require("../models/categoria"),
	mongoose = require("mongoose"),
	utils = require("../utils"),
	middleware = require("../middleware"),
	isbnValidator = require( "isbn-validate" ),
	router = app.Router();

const folder = path.join(__dirname, "../public");

router.get("/", middleware.esAdminOUsuarioLibreria, (req, res) => {
	res.sendFile(`${folder}/registrarLibro/index.html`);
});

const cloudinary = require("cloudinary");
require("../handlers/cloudinary");
const upload = require("../handlers/multer");
const multer = require("multer");

var uploadVar = upload.single("fotoPerfilImagen");

router.post("/", middleware.esAdminOUsuarioLibreria, (req, res) => {
	uploadVar(req, res, async function (err) {
		console.log(req.body);
		if (err instanceof multer.MulterError) {
			console.log(req.body);
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
		const result = await cloudinary.v2.uploader.upload(req.file.path);

		if (req.body.nombre != "" && req.body.isbn != "" && req.body.autor != "" && req.body.formato != ""
        && req.body.genero != "" && req.body.categoria != "") {
			if(isbnValidator.Validate(req.body.isbn)){
				autorModel.findOne({
					identificador: req.body.autor
				}, (err, autorEncontrado) => {
					console.log(autorEncontrado);
					if (err) return res.json([]);
					if(autorEncontrado != null && autorEncontrado != undefined){
						libroModel.findOne({
							ISBN: req.body.isbn
						}, (err, libroEncontrado) => {
							console.log(libroEncontrado);
							if (err) return res.json([]);
							if(libroEncontrado == null || libroEncontrado == undefined){
								generoModel.findOne({
									id: req.body.genero,
									desactivado: false
								}, (err, generoEncontrado) => {
								//console.log(generoEncontrado);
									if (err) return res.json([]);
									if(generoEncontrado != null && generoEncontrado != undefined){
										categoriaModel.findOne({
											id: Number(req.body.categoria),
											desactivado: false
										}, (err, categoriaEncontrada) => {
										//console.log(categoriaEncontrada);
											if (err) return res.json([]);
											if(categoriaEncontrada != null && categoriaEncontrada != undefined){
												var nombrelibro = req.body.nombre;
												nombrelibro = nombrelibro.split(" ").map((palabra) => {
													return mayuscula(palabra);
												}).join(" ");
                                
												libroModel.create({
													_id: mongoose.Types.ObjectId(),
													img: result.secure_url,
													nombre: nombrelibro,
													autor: req.body.autor,
													ISBN: req.body.isbn,
													descripcion:  req.body.descripcion,
													genero: req.body.genero,
													categoria: req.body.categoria,
													formato: req.body.formato
												}, (err, nuevo) => {
													if (err) return res.json([]);
													console.log("Creado: " + nuevo);
													res.json({
														creado: true,
														alerta: {
															btnCancelar: false,
															btnAceptar: true,
															mensaje: "Libro creado.",
															titulo: `<i class="fas fa-check" style="color: #009688;"></i>`
														}
													});
													utils("registroLibro", req.user, nuevo, "Nuevo libro");
												});
											} else {
												res.json({
													creado: false,
													alerta: {
														btnCancelar: false,
														btnAceptar: true,
														mensaje: "La categoría seleccionada no existe!",
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
												mensaje: "El género seleccionado no existe!",
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
										mensaje: "El ISBN de libro ingresado ya existe, no se puede registrar 2 veces el mismo libro!",
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
								mensaje: "El ID de autor ingresado no existe!",
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
						mensaje: "ISBN Invalido.",
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
					mensaje: "Favor llenar todos los campos correctamente",
					titulo: "Error"
				}
			});
		}
	});
});

router.get("/:autor/listar", middleware.esAdminOUsuarioLibreria, (req, res) => {
	autorModel.findOne({
		identificador: req.params.autor
	}, (err, autorEncontrado) => {
		//console.log(autorEncontrado);
		if (err) return res.json([]);
		res.json(autorEncontrado);
	});
});

router.get("/:libro/libros", middleware.esAdminOUsuarioLibreria, (req, res) => {
	//console.log(req.params.libro);
	libroModel.findOne({
		isbn: req.params.libro
	}, (err, libroEncontrado) => {
		console.log(libroEncontrado);
		if (err) return res.json([]);
		res.json(libroEncontrado);
	});
});

router.get("/generos", middleware.esAdminOUsuarioLibreria, (req, res) => {
	generoModel.find({}).sort({nombre: 1}).exec((err, generoEncontrado) => {
		//console.log(generoEncontrado);
		if (err) return res.json([]);
		res.json(generoEncontrado);
	});
});

router.get("/categorias", middleware.esAdminOUsuarioLibreria, (req, res) => {
	categoriaModel.find({}).sort({nombre: 1}).exec((err, categoriaEncontrada) => {
		//console.log(categoriaEncontrada);
		if (err) return res.json([]);
		res.json(categoriaEncontrada);
	});
});

router.get("/autores", middleware.esAdminOUsuarioLibreria, (req, res) => {
	autorModel.find({
	}, "nombre identificador").sort({nombre: 1}).exec((err, autores) => {
		if (err) return res.json({});
		res.json(autores);
	});
});

function mayuscula(string) {
	if (typeof string !== "string") return "";
	return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

module.exports = router;
