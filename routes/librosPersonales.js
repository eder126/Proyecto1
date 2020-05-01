const app = require("express"),
	path = require("path"),
	usuarioModel = require("../models/usuario"),
	libroModel = require("../models/libro"),
	chatModel = require("../models/chat"),
	intercambioModel = require("../models/intercambio"),
	middleware = require("../middleware"),
	router = app.Router();

const folder = path.join(__dirname, "../public");

router.get("/", middleware.loggeado, (req, res) => {
    res.sendFile(`${folder}/librosPersonales/index.html`);
});

router.get("/listarLibros", middleware.loggeado, (req, res) => {
	if(req.user.rol === 0){
		usuarioModel.findOne({
			usuarioId: req.user.usuarioId
		},"libros", (err, usuarioEncontrado) => {
			if (err) return res.json([]);
			const libros =  getUnique(usuarioEncontrado.libros,'isbn');
			res.json({
				usuario: true,
				libros: libros
			});
		});
	} else {
		res.json({
			usuario: false,
			libros: []
		});
	}
});

/*router.get("/actualizar", middleware.loggeado, (req, res) => { 
	intercambioModel.deleteMany ({},
	(err, eliminado) => {
		if (err) return res.json([]);
		console.log(eliminado);
		res.json(eliminado);
	});

	usuarioModel.updateOne(
	{ usuarioId: req.user.usuarioId },
	{ $set: { "libros.$[elem].intercambiado" : false } },
	{ arrayFilters: [{ "elem.isbn": 879751991 }], multi: true },
	(err, librosActualizados) => {
		if (err) return res.json([]);
		res.json(librosActualizados);
	});
});*/




router.get("/:libro/libro", middleware.loggeado, (req, res) => {
	//console.log(req.params.libro);
	libroModel.findOne({
		ISBN: Number(req.params.libro)
	},"nombre img ISBN formato", (err, libroEncontrado) => {
		if (err) return res.json([]);
		res.json(libroEncontrado);
	});
});

router.post("/", middleware.esUsuarioRegular, (req, res) => {
	if(req.body.isbn != ""){
		usuarioModel.findOne({
			usuarioId: req.user.usuarioId
		},"libros rol", (err, usuarioEncontrado) => {
			if (err) return res.json([]);
			if(usuarioEncontrado && usuarioEncontrado.rol ===0){
				const libros =  getUnique(usuarioEncontrado.libros,'isbn');
				var libro = libros.find(temp => temp.isbn === Number(req.body.isbn));
				console.log(libro);
				if(!libro.intercambiado){
					var nuevoValor = !libro.intercambio;
					usuarioModel.updateOne(
					{ usuarioId: req.user.usuarioId },
					{ $set: { "libros.$[elem].intercambio" : nuevoValor } },
					{ arrayFilters: [{ "elem.isbn": Number(req.body.isbn) }], multi: true },
					(err, librosActualizados) => {
						if (err) return res.json([]);
						console.log(librosActualizados);
						if(!err){
							var mensaje="";
							if(nuevoValor){
								mensaje = "El libro será visible a otros usuarios para ser intercambiado";
							} else {
								mensaje = "El libro ya no será visible a otros usuarios para ser intercambiado";
							}
							res.json({
								creado: true,
								alerta: {
									btnCancelar: false,
									btnAceptar: true,
									mensaje: mensaje,
									titulo: `<i class="fas fa-check" style="color: #009688;"></i>`
								}
							});
						} else {
							res.json({
								creado: false,
								alerta: {
									btnCancelar: false,
									btnAceptar: true,
									mensaje: "Favor intente luego",
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
							mensaje: "El libro se encuentra actualmente intercambiado",
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
						mensaje: "Esta opción no esta disponible para su cuenta",
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
				mensaje: "El valor del libro que intenta modificar esta vacio",
				titulo: "Error"
			}
		});
	}
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

function getUnique(arr,comp){
	//store the comparison  values in array
const unique =  arr.map(e=> e[comp]). 
  // store the keys of the unique objects
  map((e,i,final) =>final.indexOf(e) === i && i) 
  // eliminate the dead keys & return unique objects
 .filter((e)=> arr[e]).map(e=>arr[e]);
return unique;
}

module.exports = router;