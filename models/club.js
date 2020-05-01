var mongoose = require("mongoose");

var clubSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	url: { type: String, required: true },
	nombre: { type: String, required: true },
	descripcion: { type: String, required: true },
	dia: { type: Number, required: true },
	hora: { type: String, required: true },
	presencial: { type: Boolean, required: true },
	id: { type: Number, required: true, unique: true },
	sucursal: { type: Number, required: false},
	creadorId: { type: Number, required: true},
	creado: { type: Date, default: Date.now },
	miembros: [{
		usuarioId: { type: Number, required: true }
	}],
	genero: { type: Number, required: true },
	libro: { type: Number, required: true }
});

module.exports = mongoose.model("Clubes", clubSchema, "Clubes");
