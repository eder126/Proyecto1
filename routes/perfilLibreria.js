const app = require("express"),
	path = require("path"),
	libreriaModel = require("../models/usuario"),
	sucursalModel = require("../models/sucursal"),
	router = app.Router();


const folder = path.join(__dirname, "../public");

router.get("/", (req, res) => {
	res.redirect("./perfilLibreria/-1");
});

router.get("/:libreria", (req, res) => {
	res.sendFile(`${folder}/perfilLibreria/index.html`);
});

router.get("/:libreria/listar", (req, res) => {
	libreriaModel.findOne({
		libreriaId: req.params.libreria
	}, (err, libreriaEncontrada) => {
		//console.log(libreriaEncontrada);
		if (err) return console.log(err);;
		res.json(libreriaEncontrada);
	});
});

router.get("/:libreria/sucursales", (req, res) => {
	let sort = {};
	sort = {
		nombre: 1
	};
	sucursalModel.find({
		libreriaId: req.params.libreria
	}).sort(sort).exec((err, sucursalEncontrada) => {
		//console.log(sucursalEncontrada);
		if (err) return console.log(err);;
		res.json(sucursalEncontrada);
	});
});

router.post("/:libreria/buscarSucursales", (req, res) => {

	let objBuscar = {};
	if (req.body.query.length > 3) {
		objBuscar = {
			nombre: new RegExp(req.body.query, "i"),
			libreriaId: req.params.libreria
		};
	} else {
		objBuscar = {
			libreriaId: req.params.libreria
		};
	}
	let sort = {};
	sort = {
		nombre: 1
	};
	//console.log(objBuscar);

	//Pedir url de imagen... también pedir cant libros de un arreglo que tenga y tambien calificación...
	sucursalModel.find(objBuscar).sort(sort).exec((err, sucursalesEncontradas) => {
		var sucursales = [];
		if (err) return console.log(err);;
		if (sucursalesEncontradas.length != 0) {
			sucursalesEncontradas.forEach((item) => {
				//if(item.libros.length != 0){
				sucursales.push({
					nombre: item.nombre,
					id: item.id
				});
				//}
			});
			//console.log(sucursales);
			res.json({
				encontrado: true,
				datos: sucursales
			});
		} else {
			res.json({
				encontrado: false,
				alerta: {
					btnCancelar: false,
					btnAceptar: true,
					mensaje: "No se ha encontrado ninguna sucursal bajo este nombre.",
					titulo: "Error"
				}
			});
		}
	});
});

module.exports = router;