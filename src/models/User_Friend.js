const mongoose = require("mongoose");

const usuario_amigoSchema = mongoose.Schema({

    usuario_origen: { // usuario en sesion
        type: mongoose.Schema.ObjectId,
        ref: "Usuario",
        required: true
    },
    usuario_amigo: {
        type: mongoose.Schema.ObjectId,
        ref: "Usuario",
        required: true
    },
    createAt: {
        type: Date,
        default: Date.now()
    },

});


module.exports = mongoose.model("Usuario_Amigo", usuario_amigoSchema);