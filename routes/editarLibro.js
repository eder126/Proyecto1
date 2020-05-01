const app = require("express"),
	path = require("path"),
	autorModel = require("../models/autor"),
	libroModel = require("../models/libro"),
	sucursal = require("../models/sucursal"),
	generoModel = require("../models/genero"),
	categoriaModel = require("../models/categoria"),
	mongoose = require("mongoose"),
	utils = require("../utils"),
	inventario = require("../models/inventario"),
	middleware = require("../middleware"),
	isbnValidator = require("isbn-validate"),
	router = app.Router();

const folder = path.join(__dirname, "../public");


router.get("/", middleware.esAdmin, (req, res) => {
	res.redirect("/buscarLibrosAdmin");
});

router.get("/:isbn", middleware.esAdmin, (req, res) => {
	res.sendFile(`${folder}/editarLibro/index.html`);
});


router.get("/:isbn/info", middleware.esAdmin, (req, res) => {
	libroModel.findOne({
		ISBN: Number(req.params.isbn)
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
					mensaje: "No se ha encontrado el libro.",
					titulo: "Error"
				}
			});
	});
});


const cloudinary = require("cloudinary");
require("../handlers/cloudinary");
const upload = require("../handlers/multer");
const multer = require("multer");

var uploadVar = upload.single("fotoPerfilImagen");




router.post("/:isbn", middleware.esAdmin, (req, res) => {
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


		if (req.body.nombre != "" && req.body.autor != "" &&
			req.body.genero != "" && req.body.categoria != "") {
			autorModel.findOne({
				identificador: req.body.autor
			}, (err, autorEncontrado) => {
				console.log(autorEncontrado);
				if (err) return res.json([]);
				if (autorEncontrado != null && autorEncontrado != undefined) {
					libroModel.findOne({
						ISBN: Number(req.params.isbn)
					}, (err, libroEncontrado) => {
						console.log(libroEncontrado);
						if (err) return res.json([]);
						if (libroEncontrado) {
							generoModel.findOne({
								id: req.body.genero
							}, (err, generoEncontrado) => {
								//console.log(generoEncontrado);
								if (err) return res.json([]);
								if (generoEncontrado != null && generoEncontrado != undefined) {
									categoriaModel.findOne({
										id: Number(req.body.categoria)
									}, (err, categoriaEncontrada) => {
										//console.log(categoriaEncontrada);
										if (err) return res.json([]);
										if (categoriaEncontrada != null && categoriaEncontrada != undefined) {
											var nombrelibro = req.body.nombre;
											nombrelibro = nombrelibro.split(" ").map((palabra) => {
												return mayuscula(palabra);
											}).join(" ");


											if (result && result.secure_url) {
												libroEncontrado.img = result.secure_url;
											}
											libroEncontrado.nombre = nombrelibro;
											libroEncontrado.autor = req.body.autor;
											libroEncontrado.descripcion = req.body.descripcion;
											libroEncontrado.genero = req.body.genero;
											libroEncontrado.categoria = req.body.categoria;

											libroEncontrado.save((err) => {
												if (err) {
													console.log(err);
													return res.json({
														encontrado: false,
														alerta: {
															btnCancelar: false,
															btnAceptar: true,
															mensaje: "Error en la base de datos, favor intentar luego.",
															titulo: "Error"
														}
													});
												}


												inventario.find({
													isbn: Number(req.params.isbn)
												}, (err, encontradosInventarios) => {
													if (encontradosInventarios.length > 0) {

														encontradosInventarios.forEach(sucursalActiva => {
															sucursalActiva.nombre = nombrelibro;
															sucursalActiva.save();
														});
													}
													utils("libroEditado", req.user, libroEncontrado, "Libro modificado.");
													return res.json({
														actualizado: true,
														alerta: {
															btnCancelar: false,
															btnAceptar: true,
															mensaje: "Libro actualizado.",
															titulo: `<i class="fas fa-check" style="color: #009688;"></i>`
														}
													});

												});




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
									mensaje: "El ISBN no existe.",
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
					mensaje: "Favor llenar todos los campos correctamente",
					titulo: "Error"
				}
			});
		}





	});
});


router.get("/:autor/listar", middleware.esAdmin, (req, res) => {
	autorModel.findOne({
		identificador: req.params.autor
	}, (err, autorEncontrado) => {
		//console.log(autorEncontrado);
		if (err) return res.json([]);
		res.json(autorEncontrado);
	});
});

router.get("/:libro/libros", middleware.esAdmin, (req, res) => {
	//console.log(req.params.libro);
	libroModel.findOne({
		isbn: req.params.libro
	}, (err, libroEncontrado) => {
		console.log(libroEncontrado);
		if (err) return res.json([]);
		res.json(libroEncontrado);
	});
});

router.get("/generos", middleware.esAdmin, (req, res) => {
	generoModel.find({}).sort({
		nombre: 1
	}).exec((err, generoEncontrado) => {
		//console.log(generoEncontrado);
		if (err) return res.json([]);
		res.json(generoEncontrado);
	});
});

router.get("/categorias", middleware.esAdmin, (req, res) => {
	categoriaModel.find({}).sort({
		nombre: 1
	}).exec((err, categoriaEncontrada) => {
		//console.log(categoriaEncontrada);
		if (err) return res.json([]);
		res.json(categoriaEncontrada);
	});
});

router.get("/autores", middleware.esAdmin, (req, res) => {
	autorModel.find({}, "nombre identificador").sort({
		nombre: 1
	}).exec((err, autores) => {
		if (err) return res.json({});
		res.json(autores);
	});
});

function mayuscula(string) {
	if (typeof string !== "string") return "";
	return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

module.exports = router;