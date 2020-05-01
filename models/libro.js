var mongoose = require("mongoose");

var librosSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	ISBN: { type: Number, required: true },
	nombre: { type: String, required: true },
	descripcion: { type: String, required: false },
	genero: { type: Number, required: false },
	categoria: { type: Number, required: false },
	formato: { type: Boolean, required: true },
	img: { type: String, required: true },
	rating: { type: Number, required: true, default: 0 },
	ventas: { type: Number, required: true, default: 0 },
	autor: { type: Number, required: true },
	calificado: [{
		usuarioId: { type: Number, required: true },
		calificacion: { type: Number, required: true },
		resenna: { type: String, required: false}
	}],
	calificadoN: { type: Number, required: true, default: 0 }
});

module.exports = mongoose.model("Libros", librosSchema, "Libros");
