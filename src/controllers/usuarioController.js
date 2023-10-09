const Usuario = require("../models/User");
const { encriptPassword, comparePass } = require("../helpers/encriptPass");
const { responseBody } = require("../helpers/response-body");
const { userExists } = require("../helpers/validateUserExistence");
const { createToken } = require("../helpers/jwt");

const registar = async (req, res) => {
    let response = {};
    try {

        let {

            body: {
                nombre,
                apellidos,
                correo,
                password
            }
        } = req;

        password = await encriptPassword(password);

        const nuevoUsuario = await Usuario.create({
            nombre,
            apellidos,
            correo,
            password
        });

        if (!nuevoUsuario) {
            response = responseBody({
                code: 500, message: "No se creó el usuario", data: null
            });
        } else {
            response = responseBody({
                code: 201, message: "Usuario creado con éxito", data: {
                    nombre,
                    apellidos,
                    correo
                }
            });
        }


        return res.status(+response.code).json(response);

    } catch (error) {

        response = responseBody({ code: 500, message: error.message, data: null });
        return res.status(500).json(response);
    }
}

const login = async (req, res) => {
    let response = {};
    try {
        const { body: { correo, password } } = req;
        const exists = await userExists(correo);

        if (!exists || exists.length === 0) {
            response = responseBody({
                code: 400, message: "Usuario/Contraseña inválidos", data: null
            });

            return res.status(+data.code).json(data);
        }

        const compareHash = await comparePass(password, exists.password);

        if (!compareHash) {
            response = responseBody({
                code: 400, message: "Usuario/Contraseña inválidos", data: null
            });
        } else {
            //Reflect.deleteProperty(exists, 'password');

            delete exists.password;

            response = responseBody({
                code: 200, message: "", data: {
                    token: createToken(exists),
                    usuario: exists
                }
            });
        }

        // se genera el token
        return res.status(+response.code).json(response);

    } catch (error) {
        data = responseBody({ code: 500, message: error.message, data: null });
        return res.status(500).json(response);
    }
}
module.exports = {
    registar,
    login
}