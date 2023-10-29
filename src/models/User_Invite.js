const mongoose = require("mongoose");

const usuario_invitacionSchema = mongoose.Schema({

    usuario_origen: {
        type: mongoose.Schema.ObjectId,
        ref: "Usuario",
        required: true
    },
    usuario_destino: {
        type: mongoose.Schema.ObjectId,
        ref: "Usuario",
        required: true
    },
    createAt: {
        type: Date,
        default: Date.now()
    },

});


module.exports = mongoose.model("Usuario_Invitacion", usuario_invitacionSchema);