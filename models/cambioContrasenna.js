var mongoose = require("mongoose");

var cambiarContrasennaSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	id: { type: Number, required: true },
	path: { type: String, required: true }
});

module.exports = mongoose.model("cambiarContrasenna", cambiarContrasennaSchema, "cambiarContrasenna");