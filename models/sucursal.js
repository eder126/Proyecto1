var mongoose = require("mongoose");

var sucursalSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	imgPerfil: { type: String, required: false, default: "" },
	nombre: { type: String, required: true },
	telefono: { type: String, required: true },
	direccion: { type: mongoose.Schema.Types.Mixed, required: true },
	costoEnvio: { type: Number, required: true },
	id: { type: Number, required: true },
	libreriaId: { type: Number, required: true },
	mejorLibro: { type: String, required: false },
	ventas: { type: Array, required: false}
});

module.exports = mongoose.model("Sucursales", sucursalSchema, "Sucursales");