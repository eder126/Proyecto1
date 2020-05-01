const app = require("express"),
	path = require("path"),
	middleware = require("../middleware"),
	sucursalModel = require("../models/sucursal"),
	router = app.Router();

const folder = path.join(__dirname, "../public");

router.get("/", (req, res) => {
	res.sendFile(`${folder}/ganancia/index.html`);
});

router.get("/sucursal/:sucursal/:fechaInicio/:fechaFin", middleware.esAdminOUsuarioLibreria, (req, res) => {

	let objBuscar = {
		id: req.params.sucursal,
		ventas: {
			$exists: true
		}
	};

	if (req.user.rol != 2) {
		objBuscar["libreriaId"] = req.user.libreriaId;
	}

	sucursalModel.findOne(objBuscar, "ventas", (err, sucursalEncontrada) => {
		//console.log(libreriaEncontrada);
		if (err || !sucursalEncontrada) return res.json([]);
		let filtrado = undefined;
		let inicio = new Date(req.params.fechaInicio);
		let fin = new Date(req.params.fechaFin);
		if (inicio && fin) {
			filtrado = sucursalEncontrada.ventas.filter(d => {
				var tiempo = new Date(d.fecha);
				return (inicio < tiempo && tiempo < fin);
			});
		} else {
			filtrado = sucursalEncontrada.ventas;
		}
		res.json(filtrado);
	});
});



router.get(["/libreria/:libreria/:fechaInicio/:fechaFin", "/libreria/:fechaInicio/:fechaFin"], middleware.esAdminOUsuarioLibreria, (req, res) => {

	let objBuscar = {
		libreriaId: req.params.libreria,
		ventas: {
			$exists: true
		}
	};

	if (req.user.rol != 2) {
		objBuscar["libreriaId"] = req.user.libreriaId;
	}

	sucursalModel.find(objBuscar, "ventas id nombre", (err, sucursalesEncontradas) => {
		//console.log(libreriaEncontrada);
		if (err) return res.json([]);
		var ventas = [];
		console.log(sucursalesEncontradas.length);
		sucursalesEncontradas = sucursalesEncontradas.filter(d => {
			return d.ventas.length > 0;
		});
		console.log(sucursalesEncontradas.length);
		sucursalesEncontradas.forEach(sucursal => {
			let filtrado = undefined;
			let inicio = new Date(req.params.fechaInicio);
			let fin = new Date(req.params.fechaFin);
			if (inicio && fin) {
				filtrado = sucursal.ventas.filter(d => {
					var tiempo = new Date(d.fecha);
					return (inicio < tiempo && tiempo < fin);
				});
			} else {
				filtrado = sucursal.ventas;
			}
			if (filtrado.length > 0)
				ventas.push({
					sucursal: sucursal.id,
					nombre: sucursal.nombre,
					ventas: filtrado
				});
		});
		res.json(ventas);
	});
});






router.get("/libreria/isbn/:isbn/:fechaInicio/:fechaFin", middleware.esAdminOUsuarioLibreria, (req, res) => {

	let objBuscar = {
		libreriaId: req.params.libreria,
		ventas: {
			$elemMatch: {
				isbn: Number(req.params.isbn)
			}
		}
	};

	if (req.user.rol != 2) {
		objBuscar["libreriaId"] = req.user.libreriaId;
	}

	sucursalModel.find(objBuscar, "ventas id nombre", (err, sucursalesEncontradas) => {
		//console.log(libreriaEncontrada);
		if (err) return res.json([]);
		var ventas = {
			ventas: []
		};
		console.log(sucursalesEncontradas.length);
		sucursalesEncontradas = sucursalesEncontradas.filter(d => {
			return d.ventas.length > 0;
		});
		console.log(sucursalesEncontradas.length);
		sucursalesEncontradas.forEach(sucursal => {
			let filtrado = undefined;
			let inicio = new Date(req.params.fechaInicio);
			let fin = new Date(req.params.fechaFin);
			if (inicio && fin) {
				filtrado = sucursal.ventas.filter(d => {
					var tiempo = new Date(d.fecha);
					return (inicio < tiempo && tiempo < fin);
				});
			} else {
				filtrado = sucursal.ventas;
			}

			filtrado = filtrado.filter(d => {
				return d.isbn == Number(req.params.isbn);
			});
			if (filtrado.length > 0) {
				filtrado.forEach(element => {
					ventas.ventas.push(element);
				});
			}
		});
		res.json(ventas);
	});
});


router.get("/sucursal/:sucursal/isbn/:isbn/:fechaInicio/:fechaFin", middleware.esAdminOUsuarioLibreria, (req, res) => {

	let objBuscar = {
		id: req.params.sucursal,
		ventas: {
			$elemMatch: {
				isbn: Number(req.params.isbn)
			}
		}
	};

	if (req.user.rol != 2) {
		objBuscar["libreriaId"] = req.user.libreriaId;
	}

	sucursalModel.find(objBuscar, "ventas id nombre", (err, sucursalesEncontradas) => {
		//console.log(libreriaEncontrada);
		if (err) return res.json([]);
		var ventas = {
			ventas: []
		};
		console.log(sucursalesEncontradas.length);
		sucursalesEncontradas = sucursalesEncontradas.filter(d => {
			return d.ventas.length > 0;
		});
		console.log(sucursalesEncontradas.length);
		sucursalesEncontradas.forEach(sucursal => {
			let filtrado = undefined;
			let inicio = new Date(req.params.fechaInicio);
			let fin = new Date(req.params.fechaFin);
			if (inicio && fin) {
				filtrado = sucursal.ventas.filter(d => {
					var tiempo = new Date(d.fecha);
					return (inicio < tiempo && tiempo < fin);
				});
			} else {
				filtrado = sucursal.ventas;
			}

			filtrado = filtrado.filter(d => {
				return d.isbn == Number(req.params.isbn);
			});
			if (filtrado.length > 0) {
				filtrado.forEach(element => {
					ventas.ventas.push(element);
				});
			}
		});
		res.json(ventas);
	});
});



module.exports = router;