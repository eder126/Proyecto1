const app = require("express"),
	path = require("path"),
	logs = require("../models/bitacora"),
	middleware = require("../middleware"),
	router = app.Router();

const folder = path.join(__dirname, "../public");

router.get("/", middleware.esAdmin, (req, res) => {
	res.sendFile(`${folder}/buscarBitacora/index.html`);
});

router.post("/", middleware.esAdmin, (req, res) => {
	console.log(req.body.tipo);
	let query = req.body.query;
	let objBuscar = {};
	if(req.body.tipo != "todoMovimiento"){
		objBuscar["movimiento"] = req.body.tipo;
	}
	if (query.length > 3 && req.query.queryExtra != "") {
		objBuscar[req.body.queryExtra] = query;
	}
	let sort = {};
	if(req.body.sort == "HASC") {
		sort.hora = "asc";
	}else if(req.body.sort == "HDESC"){
		sort.hora = "desc";
	}else if(req.body.sort == "CASC"){
		sort.comentario = "asc";
	}else if(req.body.sort == "CDESC"){
		sort.comentario = "desc";
	}else if(req.body.sort == "MASC"){
		sort.movimiento = "asc";
	}else if(req.body.sort == "MDESC"){
		sort.movimiento = "desc";
	}else if(req.body.sort == "MHASC"){
		sort.movimiento = "asc";
		sort.hora = "asc";
	}else if(req.body.sort == "MHDESC"){
		sort.movimiento = "desc";
		sort.hora = "desc";
	}

	console.log(objBuscar, "objBuscar");
	
	logs.find(objBuscar).sort(sort).exec((err, logsEncontrados) => {
		if (err) return res.json([]);
		if (logsEncontrados.length != 0) {
			res.json({
				encontrado: true,
				datos: logsEncontrados
			});
		} else {
			res.json({
				encontrado: false,
				alerta: {
					btnCancelar: false,
					btnAceptar: true,
					mensaje: "No se han encontrado logs con ese query.",
					titulo: "Error"
				}
			});
		}
	});

	
});

module.exports = router;