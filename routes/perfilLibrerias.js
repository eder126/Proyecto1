const app = require("express"),
	path = require("path"),
	libreriaModel = require("../models/usuario"),
	sucursalModel = require("../models/sucursal"),
	middleware = require("../middleware"),
	router = app.Router();

const folder = path.join(__dirname, "../public");

router.get("/", middleware.esAdmin, (req, res) => {
	res.sendFile(`${folder}/perfilLibrerias/index.html`);
});

router.get("/listar", middleware.esAdmin, (req, res) => {
	libreriaModel.findOne({
	}, (err, libreriaEncontrada) => {
		//console.log(libreriaEncontrada);
		if (err) return console.log(err);;
		res.json(libreriaEncontrada);
	});
});

router.get("/sucursales", middleware.esAdmin, (req, res) => {
	sucursalModel.find({
	}, (err, sucursalEncontrada) => {
		//console.log(sucursalEncontrada);
		if (err) return console.log(err);;
		res.json(sucursalEncontrada);
	});
});

module.exports = router;