var mongoose = require("mongoose");

var autorSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	imagenPerfil: { type: String, required: false },
	identificador: { type: Number, required: true, unique: true },
	nombre: { type: String, required: true },
	descripcion: { type: String, required: false },
	nacimiento: { type: Date, required: true, default: new Date("01000-1-0:00:00")},
	alias: { type: String, required: false }
});

module.exports = mongoose.model("Autor", autorSchema, "Autores");