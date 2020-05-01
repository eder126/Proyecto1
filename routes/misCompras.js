const app = require("express"),
	path = require("path"),
	usuarioModel = require("../models/usuario"),
	libroModel = require("../models/libro"),
	middleware = require("../middleware"),
	router = app.Router();

const folder = path.join(__dirname, "../public");

router.get("/", middleware.loggeado, (req, res) => {
	res.sendFile(`${folder}/misCompras/index.html`);
});

router.get("/listar/:fechaInicio/:fechaFin", middleware.loggeado, (req, res) => {
	usuarioModel.findOne({
		usuarioId: req.user.usuarioId
	}, "compras", (err, usuarioEncontrado) => {
		if (err || !usuarioEncontrado) return res.json([]);
		let filtrado = undefined;
		let inicio = new Date(req.params.fechaInicio);
		let fin = new Date(req.params.fechaFin);

		if (inicio && fin) {
			filtrado = usuarioEncontrado.compras.filter(d => {
				var tiempo = new Date(d.fecha);
				return (inicio < tiempo && tiempo < fin);
			});
			filtrado.sort(function (a, b) {
				// Turn your strings into dates, and then subtract them
				// to get a value that is either negative, positive, or zero.
				return new Date(b.fecha) - new Date(a.fecha);
			});
		} else {
			filtrado = usuarioEncontrado.compras;
		}
		res.json(filtrado);
	});
});

router.get("/libro/:libro", middleware.loggeado, (req, res) => {
	libroModel.findOne({
		ISBN: Number(req.params.libro)
	}, "nombre ISBN", (err, libroEncontrado) => {
		if (err) return res.json([]);
		res.json(libroEncontrado);
	});
});

function validateEmail(email) {
	var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
}

function dentro(x, min, max) {
	return x >= min && x <= max;
}

function mayuscula(string) {
	if (typeof string !== "string") return "";
	return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

module.exports = router;