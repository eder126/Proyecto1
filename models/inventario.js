var mongoose = require("mongoose");

var inventarioSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	id: { type: Number, required: true },
	nombre: { type: String, required: true },
	cantidad: { type: Number, required: true },
	precio: { type: Number, required: true },
	isbn: { type: Number, required: true },
	formato: { type: Boolean, required: true }
});

module.exports = mongoose.model("Inventarios", inventarioSchema, "Inventarios");