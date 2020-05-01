var mongoose = require("mongoose");

var chatSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    idChat: { type: Number, required: true, unique: true },
    Club: { type: Boolean, required: true, default: true },
    idClub: { type: Number, required: false, unique: true },
    idIntercambio: { type: Number, required: false, unique: true },
    mensajes: [{
        idEmisor: { type: Number, required: false },
        msj: { type: String, required: false },
    }],
    miembros: { type: Array, required: false }
});

module.exports = mongoose.model("Chat", chatSchema, "Chats");