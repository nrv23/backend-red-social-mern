
const { responseBody } = require("../helper/response-body");
const Usuario = require("../models/User");


const registar = async (req, res) => {
    let data = {};
    try {

        const {

            body: {
                nombre,
                apellidos,
                correo,
                password
            }
        } = req;



        const nuevoUsuario = await Usuario.create({
            nombre,
            apellidos,
            correo,
            password
        });

        if (!nuevoUsuario) {
            data = responseBody({
                code: 500, message: "No se creó el usuario", data: {

                }
            });
        } else {
            data = responseBody({
                code: 201, message: "Usuario creado con éxito", data: {
                    nombre,
                    apellidos,
                    correo,
                    password
                }
            });
        }
        console.log(data)

        return res.status(+data.code).json({ data });

    } catch (error) {

        data = responseBody({ code: 500, message: error.message, data: null });
        return res.status(500).json({ data });
    }
}

module.exports = {
    registar
}