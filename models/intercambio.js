var mongoose = require("mongoose");

var intercambioSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	idIntercambio: { type: Number, required: true, unique: true },
	emisorId : { type: Number, required: true },
	receptorId : { type: Number, required: true },
	emisorISBN : { type: Number, required: true },
	receptorISBN : { type: Number, required: true },
	sucursal: { type: Number, required: true },
	dia: { type: Date, required: true, default: new Date("01000-1-0:00:00")},
	hora: { type: String, required: true },
	aceptada: { type: Boolean, required: true, default: false },
	finalizadoEmisor: { type: Boolean, required: true, default: false },
	finalizadoReceptor: { type: Boolean, required: true, default: false }
});

module.exports = mongoose.model("Intercambio", intercambioSchema, "Intercambios");
