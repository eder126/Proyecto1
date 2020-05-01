var mongoose = require("mongoose");

var generoSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	nombre: { type: String, required: true },
	id: { type: Number, required: true},
	desactivado: { type: Boolean, required: false, default: false}
});

module.exports = mongoose.model("Generos", generoSchema, "Generos");