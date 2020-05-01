const app = require("express"),
	path = require("path"),
	usuarioModel = require("../models/usuario"),
    chatModel = require("../models/chat"),
    clubModel = require("../models/club"),
	mongoose = require("mongoose"),
	utils = require("../utils"),
	middleware = require("../middleware"),
	router = app.Router();

const folder = path.join(__dirname, "../public");

router.get("/:id", middleware.loggeado, (req, res) => {
    res.sendFile(`${folder}/chatG/index.html`);
});

router.get("/:id/chat", middleware.loggeado, (req, res) => {
    chatModel.findOne({
        idChat: req.params.id,
        Club: true,
        "miembros": Number(req.user.usuarioId)
    }, (err, chatEncontrado) => {
        if (err) return res.json([]);
        if(chatEncontrado){
            res.json({
                encontrado: true,
                chat: chatEncontrado
            });
        } else {
            res.json({
                encontrado: false,
                chats: chatEncontrado
            });
        }
    });
});

router.get("/:id/chats", middleware.loggeado, (req, res) => {
    chatModel.find({}, (err, chatEncontrados) => {
        if (err) return res.json([]);
        if(chatEncontrados.length != 0){
            res.json({
                encontrado: true,
                chats: chatEncontrados
            });
        } else {
            res.json({
                encontrado: false,
                chats: []
            });
        }
    });
});

router.get("/:id/miembros", middleware.loggeado, (req, res) => {
    chatModel.findOne({
        idChat: req.params.id,
        Club: true,
        "miembros": Number(req.user.usuarioId)
    },"miembros", (err, chatEncontrado) => {
        if (err) return res.json([]);
        if(chatEncontrado){
            if(chatEncontrado.miembros.length != 0){
                var arr = [];
                chatEncontrado.miembros.forEach((item, index, arrCompleto) => {
                    usuarioModel.findOne({
                        usuarioId: Number(item),
                    },"nombre apellido usuarioId", (err, usuario) =>{
                        if (err) return res.json([]);
                        arr.push({
                            nombre: usuario.nombre,
                            apellido: usuario.apellido,
                            usuarioId: usuario.usuarioId
                        });
                        if (arrCompleto.length == arr.length) {
                            return res.json({
                                encontrado: true,
                                miembros: arr
                            });
                        }
                    });
                });
            } else {
                res.json({
                    encontrado: false,
                    miembros: []
                });
            }
        } else {
            res.json({
                encontrado: false,
                miembros: []
            });
        }
    });
});

/*
if(chatEncontrado.miembros.length != 0){
    var arr = [];
    chatEncontrado.miembros.forEach((item, index, arrCompleto) => {
        usuarioModel.findOne({
            usuarioId: Number(item),
        },"nombre apellido usuarioId", (err, usuario) =>{
            if (err) return res.json([]);
            arr.push({
                nombre: usuario.nombre,
                apellido: usuario.apellido
                usuarioId: usuario.usuarioId
            });
            if (arrCompleto.length == arr.length) {
                return res.json({
                    encontrado: true,
                    miembros: arr
                });
            }
        });
    });
} else {
    res.json({
        encontrado: false,
        miembros: []
    });
}
*/

router.get("/:id/mensajes", middleware.loggeado, (req, res) => {
    chatModel.findOne({
        idChat: req.params.id,
        Club: true,
        "miembros": Number(req.user.usuarioId)
    },"mensajes",(err, chatEncontrado) => {
        if(chatEncontrado){
            if(!err){
                res.json({
                    encontrado: true,
                    mensajes: chatEncontrado.mensajes
                });
            } else {
                res.json({
                    encontrado: false,
                    mensajes: "No se han encontrado mensajes"
                });
            }
        } else {
            res.json({
                encontrado: false,
                mensajes: "No se han encontrado mensajes"
            });
        }
    });
});

router.get("/:id/mensajesNuevos/:index", middleware.loggeado, (req, res) => {
	chatModel.findOne({
		idChat: req.params.id,
        Club: true,
        "miembros": Number(req.user.usuarioId)
	}, "mensajes", (err, chatEncontrado) => {
		var arr = [];
		chatEncontrado.mensajes.forEach( (mensaje, index, arrayMensajes) => {
			if(index > Number(req.params.index)){
				arr.push({
					idIndex: index,
					idEmisor: mensaje.idEmisor,
					msj: mensaje.msj
				});
			}
		});
		res.json({
			mensajes: arr
		});
	});
});

router.post("/:id", middleware.loggeado, (req, res) => {
    chatModel.findOne({
        idChat: req.params.id,
        "miembros": Number(req.user.usuarioId)
    }, (err, chatEncontrado) => {
        if(chatEncontrado){
            if(!err){
                chatModel.updateOne ({idChat: Number(req.params.id)},
                { $push: {
                    mensajes: {
                        idEmisor: Number(req.user.usuarioId),
                        msj: req.body.mensaje
                    }
                }},(err, clubActualizado) => {
                    if (err) return res.json([]);
                    console.log(clubActualizado);
                    if(!err){
                        res.json({
                            enviado: true,
                            mensaje: req.body.mensaje
                        });
                    } else {
                        res.json({
                            enviado: false,
                            mensaje: "El mensaje no se ha enviado"
                        });
                    }
                });
            } else {
                res.json({
                    enviado: false,
                    mensaje: "El mensaje no se ha enviado"
                });
            }
        } else {
            res.json({
                enviado: false,
                mensaje: "El mensaje no se ha enviado"
            });
        }
    });
});

module.exports = router;