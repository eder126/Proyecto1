var mongoose = require("mongoose");

var globalSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	impuestoVentas: { type: Number, required: true }
});

module.exports = mongoose.model("Globales", globalSchema, "Globales");
