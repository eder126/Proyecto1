const app = require("express"),
	path = require("path"),
	sucursal = require("../models/sucursal"),
	router = app.Router();

const folder = path.join(__dirname, "../public");

router.get("/", (req, res) => {
	res.sendFile(`${folder}/mostrarMapa/index.html`);
});

router.get("/sucursales", (req, res) => {
	sucursal.find({}, (err, encontrado) => {
		if (err) return res.json([]);

		var arr = [];
		if (encontrado.length != 0) {

			encontrado.forEach(item => {
				if (item.direccion.coordenadas.lat && item.direccion.coordenadas.long) {
					arr.push({
						id: item.id,
						nombre: item.nombre,
						lat: item.direccion.coordenadas.lat,
						long: item.direccion.coordenadas.long
					});
				}
			});

			res.json({
				sucursales: arr
			});

		} else {
			res.json({
				sucursales: arr
			});
		}
	});


});


module.exports = router;