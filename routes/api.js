const app = require("express"),
	path = require("path"),
	generoModel = require("../models/genero"),
	categoriaModel = require("../models/categoria"),
	libroModel = require("../models/libro"),
	sucursalModel = require("../models/sucursal"),
	clubModel = require("../models/club"),
	router = app.Router();


const folder = path.join(__dirname, "../public");

router.get("/categorias", (req, res) => {
	categoriaModel.find({
		desactivado: false
	}).sort({
		nombre: 1
	}).exec((err, categorias) => {
		if (err) return res.json([]);
		res.json(categorias);
	});
});

router.get("/generos", (req, res) => {
	generoModel.find({
		desactivado: false
	}).sort({
		nombre: 1
	}).exec((err, generos) => {
		if (err) return res.json([]);
		res.json(generos);
	});
});

router.get("/libro/:isbn", (req, res) => {
	libroModel.findOne({
		ISBN: req.params.isbn
	}, (err, libro) => {
		if (err) return res.json([]);
		res.json(libro);
	});
});

router.get("/libros", (req, res) => {
	libroModel.find({}).sort({
		nombre: 1
	}).exec((err, libros) => {
		if (err) return res.json([]);
		res.json(libros);
	});
});

router.get("/user/datos", (req, res) => {
	if (req.user) {
		delete req.user.clave;
		res.json({
			loggeado: true,
			user: req.user
		});
	} else {
		res.json({
			loggeado: false
		});
	}
});

router.get("/user", (req, res) => {

	if (req.user) {
		let menu = [];
		let icono = "";
		let iconoLink = "";
		if (req.user.rol == 0) {
			menu = [{
					"opcion": "Autores",
					"href": "/buscarAutor"
				},
				{
					"opcion": "Clubes",
					"href": "/buscarClub"
				},
				{
					"opcion": "Crear club de lectura",
					"href": "/registrarClubDeLectura"
				},
				{
					"opcion": "Intercambios",
					"href": "/intercambios"
				},
				{
					"opcion": "Librerías",
					"href": "/buscarLibreria"
				},
				{
					"opcion": "Libros",
					"href": "/buscarLibros"
				},
				{
					"opcion": "Métodos de Pago",
					"href": "/listarMetodoDePago"
				},
				{
					"opcion": "Promociones",
					"href": "/buscarPromociones"
				},
				{
					"opcion": "Sucursales",
					"href": "/buscarSucursal"
				},
				{
					"opcion": "Usuarios",
					"href": "/buscarUsuarios"
				}
			];
			icono = "fas fa-shopping-cart";
			iconoLink = "carrito";
		} else if (req.user.rol == 1) {
			menu = [{
					"opcion": "Autores",
					"href": "/buscarAutor"
				},
				{
					"opcion": "Clubes",
					"href": "/buscarClub"
				},
				{
					"opcion": "Crear club de lectura",
					"href": "/registrarClubDeLectura"
				},
				{
					"opcion": "Librerías",
					"href": "/buscarLibreria"
				},
				{
					"opcion": "Libros",
					"href": "/buscarLibros"
				},
				{
					"opcion": "Promociones",
					"href": "/buscarPromociones"
				},
				{
					"opcion": "Sucursales",
					"href": "/buscarSucursal"
				},
				{
					"opcion": "Usuarios",
					"href": "/buscarUsuarios"
				}
			];
			icono = "fas fa-cogs";
			iconoLink = "registrarAutor";
		} else if (req.user.rol == 2) {
			menu = [{
					"opcion": "Autores",
					"href": "/buscarAutor"
				},
				{
					"opcion": "Clubes",
					"href": "/buscarClub"
				},
				{
					"opcion": "Crear club de lectura",
					"href": "/registrarClubDeLectura"
				},
				{
					"opcion": "Librerías",
					"href": "/buscarLibreria"
				},
				{
					"opcion": "Libros",
					"href": "/buscarLibros"
				},
				{
					"opcion": "Promociones",
					"href": "/buscarPromociones"
				},
				{
					"opcion": "Sucursales",
					"href": "/buscarSucursal"
				},
				{
					"opcion": "Usuarios",
					"href": "/buscarUsuarios"
				}
			];
			icono = "fas fa-cogs";
			iconoLink = "buscarAdministrador";
		}
		res.json({
			loggeado: true,
			nombre: req.user.nombre,
			menu: menu,
			icono: icono,
			iconoLink: iconoLink
		});
	} else {
		res.json({
			loggeado: false
		});
	}

});

router.get("/perfil", (req, res) => {
	res.redirect("/perfilPersonalUsuario");
});

router.get("/", (req, res) => {
	if (req.user) {
		res.redirect("/mainPage");
	} else {
		res.redirect("/landingProducto");
	}
});

router.get("/mainPage", (req, res) => {
	res.sendFile(`${folder}/mainPage/index.html`);
});

router.get("/sucursales", (req, res) => {
	sucursalModel.find({}, (err, encontrado) => {
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


router.get("/clubMasPersonas", (req, res) => {
	clubModel.find({}, (err, encontrado) => {
		if (err) return res.json([]);

		var arr = [];
		if (encontrado.length != 0) {

			encontrado.forEach(item => {
				console.log(item);
				if (item.miembros) {
					arr.push({
						url: item.url,
						nombre: item.nombre,
						miembros: item.miembros.length,
						id: item.id
					});
				}
			});

			arr.sort((a, b) => {
				if (a.miembros > b.miembros) {
					return -1;
				}
				if (a.miembros < b.miembros) {
					return 1;
				}
				return 0;
			});
			console.log(arr);
			res.json({
				club: arr[0]
			});

		} else {
			res.json({
				sucursales: arr
			});
		}
	});


});

router.get("/libro", (req, res) => {
	libroModel.find({}).sort({
		ventas: -1
	}).limit(4).exec((err, libroEncontrado) => {
		if (err) return res.json([]);
		res.json(libroEncontrado);
	});
});

router.get("/librosDestacado", (req, res) => {
	libroModel.find({}).sort().exec((err, libroEncontrado) => {
		if (err) return res.json([]);

		res.json(libroEncontrado.shuffle());
	});
});
Array.prototype.shuffle = function () {
	var i = this.length,
		j, temp;
	if (i == 0) return this;
	while (--i) {
		j = Math.floor(Math.random() * (i + 1));
		temp = this[i];
		this[i] = this[j];
		this[j] = temp;
	}
	return this;
}

module.exports = router;