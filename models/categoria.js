var mongoose = require("mongoose");

var categoriaSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	nombre: { type: String, required: true },
	id: { type: Number, required: true},
	desactivado: { type: Boolean, required: false, default: false}
});

module.exports = mongoose.model("Categorias", categoriaSchema, "Categorias");
