var mongoose = require("mongoose");

var pagosSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	n_tarjeta: { type: Number, required: true },
	vencimiento: { type: Date, required: true },
	cardholder: { type: String, required: true },
	propietario: { type: Number, required: true },
	CVC: { type: Number, required: true },
	tipo: String
});

module.exports = mongoose.model("MetodosPago", pagosSchema, "MetodosPago");