const mongoose = require("mongoose");


const usuarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    apellidos: {
        type: String,
        required: true
    },
    correo: {
        type: String,
        required: true
    },
    pais: {
        type: String,
        required: false
    },
    genero: {
        type: String,
        required: false
    },
    profesion: {
        type: String,
        required: false
    },
    fechaNacimiento: {
        type: Date,
        required: false
    },
    telefono: {
        type: String,
        required: false
    },
    avatar: {
        type: String,
        default: 'defecto.png'
    },
    estado: { type: Boolean, default: true },
    descripcion: { type: String, required: false },
    username: { type: String, required: false },
    password: { type: String, required: true }
});


module.exports = mongoose.model("Usuario", usuarioSchema);

