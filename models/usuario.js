var mongoose = require("mongoose");

var usuarioSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	url: { type: String, required: false },
	nombre: { type: String, required: true },
	apellido: { type: String, required: true },
	apellido2: { type: String, required: true },
	sexo: { type: Number, required: true },
	direccion: { type: mongoose.Schema.Types.Mixed, required: true },
	tid: { type: Number, required: true },
	id: { type: Number, required: true },
	email: { type: String, required: true, unique: true },
	tel: { type: Number, required: true },
	clave: { type: String, required: true, select: false},
	rol: { type: Number, required: true, default: 0 }, //Rol 0 = Usuario regular, 1 = Usuario Librería y 2 = Usuario Administrador
	primerLogin: { type: Boolean, required: true, default: true },
	creado: { type: Date, default: Date.now },
	nombreFantasia: { type: String, required: false },
	nombreComercial: { type: String, required: false },
	libreriaId: { type: Number, required: false, unique: true },
	aceptado: { type: Boolean, required: false, default: false },
	usuarioId: { type: Number, required: true, unique: true },
	compras: { type: Array, required: false },
	libros: [{ 
		isbn: {type: Number, required: true },
		cantidad: {type: Number, required: true },
		intercambio: {type: Boolean, required: false, default: false },
		intercambiado: {type: Boolean, required: false, default: false }
	}],
	calificacion: { type: Number, required: true, default: 5 },
	calificadoPor: [{ //{ type: Array, required: false, default: new Array() },
		idIntercambio: { type: Number, required: true },
		usuarioId: { type: Number, required: true },
		calificacion: { type: Number, required: true },
		resenna: { type: String, required: false}
	}],
	bloqueado: { type: Boolean, required: true, default: false },
	razon: { type: String, required: false, default: "" }
});

module.exports = mongoose.model("Usuarios", usuarioSchema, "Usuarios");
