const app = require("express"),
	path = require("path"),
	autorModel = require("../models/autor"),
	libroModel = require("../models/libro"),
	router = app.Router();

const folder = path.join(__dirname, "../public");

router.get("/", (req, res) => {
	res.redirect("./perfilAutor/-1");
});

router.get("/:autor", (req, res) => {
	res.sendFile(`${folder}/perfilAutor/index.html`);
});

router.get("/:autor/listar", (req, res) => {
	autorModel.findOne({
		identificador: req.params.autor
	}, (err, autorEncontrado) => {
		console.log(autorEncontrado);
		if (err) return console.log(err);;
		res.json(autorEncontrado);
	});
});

router.get("/:autor/libros", (req, res) => {
	console.log(req.params.libro);
	libroModel.find({
		autor: req.params.autor
	}, (err, libroEncontrado) => {
		console.log(libroEncontrado);
		if (err) return console.log(err);;
		res.json(libroEncontrado);
	});
});

module.exports = router;