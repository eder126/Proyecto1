var mongoose = require("mongoose");

var promocionSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	idPromo: { type: Number, required: true, unique: true },
	isbn: { type: String, required: true },
    tipoDescuento: { type: Boolean, required: true },
    rebaja: { type: Number, required: true },
	fechaFin: { type: Date, required: true },
	sucursal: { type: String, required: true }
});

module.exports = mongoose.model("Promocion", promocionSchema, "Promociones");