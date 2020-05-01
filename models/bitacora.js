var mongoose = require("mongoose");

var bitacoraSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	movimiento: { type: String, required: true },
	hora: { type: Date, default: Date.now() },
	usuario: { type: mongoose.Schema.Types.Mixed, required: true },
	registrado: { type: mongoose.Schema.Types.Mixed, required: false },
	comentario: { type: String, required: false, default: ""}
});

module.exports = mongoose.model("Logs", bitacoraSchema, "Logs");
