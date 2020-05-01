const mongoose = require("mongoose"),
	logs = require("./models/bitacora");

module.exports = function(movimiento, usuario, registrado, comentario){
			
	logs.create({
		_id: mongoose.Types.ObjectId(),
		movimiento: movimiento,
		usuario: usuario,
		registrado: registrado,
		comentario: comentario
	}, (err, creado) => {
		console.log(creado + "log creado");
		if (err) return res.json([]);
	});
	
};