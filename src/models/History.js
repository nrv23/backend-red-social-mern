const mongoose = require("mongoose");

const historiaSchema = mongoose.Schema({
    imagen: {
        type: String,
        required: false
    },
    usuarioRef: {
        type: mongoose.Schema.ObjectId,
        ref: "Usuario",
        required: true
    },
    createAt: {
        type: Date,
        default: Date.now()
    },
    expireAt: {
        type: Date,
        required: true
    }
});


module.exports = mongoose.model("Historia", historiaSchema);