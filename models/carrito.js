var mongoose = require("mongoose");

var carritoSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	usuarioId: { type: Number, required: true, unique: true },
	libros: { type: Array, required: true, default: []}
});

module.exports = mongoose.model("Carritos", carritoSchema, "Carritos");
