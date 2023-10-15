const Usuario = require("../models/User");
const { encriptPassword, comparePass } = require("../helpers/encriptPass");
const { responseBody } = require("../helpers/response-body");
const { userExists } = require("../helpers/validateUserExistence");
const { createToken } = require("../helpers/jwt");
const { generate } = require("../helpers/username-generator");


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

        const exists = await userExists(correo);

        if (exists || exists?.length > 0) {
            response = responseBody({
                code: 400, message: "Usuario/Contraseña inválidos", data: null
            });

            return res.status(+response.code).json(response);
        }

        password = await encriptPassword(password);

        const nuevoUsuario = await Usuario.create({
            nombre,
            apellidos,
            correo,
            password,
            username: generate('_', 5, 15)
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

        if (!exists || exists?.length === 0) {
            response = responseBody({
                code: 400, message: "Usuario/Contraseña inválidos", data: null
            });

            return res.status(+data.code).json(data);
        }
        console.log("Llegó")
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


const obtenerUsuario = async (req, res) => {

    let response = {}

    try {

        //const { id } = req.params;
        const { sub: id } = req.currentUser;

        const usuario = await await userExists(id);

        if (!usuario || usuario?.length === 0) {
            response = responseBody({
                code: 400, message: "Usuario no existe", data: null
            });

            return res.status(+data.code).json(data);
        }

        response = responseBody({
            code: 200, message: "", data: usuario
        });

        response.data = usuario;

        return res.status(+response.code).json(response);


    } catch (error) {

        data = responseBody({ code: 500, message: error.message, data: null });
        return res.status(500).json(response);
    }
}

const actualizarCuenta = async (req, res) => {
    let response = {};

    try {

        const {
            nombre,
            apellidos,
            genero,
            fechaNacimiento,
            correo,
            username,
            profesion,
            descripcion,
            telefono,
        } = req.body;

        const { sub: id } = req.currentUser;

        const exists = await await userExists(correo);

        if (!exists || exists?.length === 0) {
            response = responseBody({
                code: 400, message: "Usuario/Contraseña inválidos", data: null
            });

            return res.status(+data.code).json(data);
        }

        const existsEmail = await Usuario.findOne({ // saber si ya alguien actualizó el email con uno antes registrado
            $and: [{
                correo
            },
            {
                _id: { $ne: id }
            }]
        });

        if (existsEmail || existsEmail?.length > 0) {
            response = responseBody({
                code: 400, message: "El correo ya existe", data: null
            });

            return res.status(+response.code).json(response);
        }

        console.log(fechaNacimiento)

        const updated = await Usuario.updateOne({
            _id: id
        }, {
            nombre,
            apellidos,
            genero,
            fechaNacimiento: new Date(fechaNacimiento),
            correo,
            username,
            profesion,
            descripcion,
            telefono,
        }, { password: 0 });

        if (!updated) {
            response = responseBody({
                code: 500, message: "No se actualizó el usuario", data: null
            });
        } else {
            response = responseBody({
                code: 200, message: "Se actualizó el usuario", data: req.body
            });
        }

        return res.status(+response.code).json(response);


    } catch (error) {
        console.log(error)
        data = responseBody({ code: 500, message: error.message, data: null });
        return res.status(500).json(response);
    }
}
module.exports = {
    registar,
    login,
    obtenerUsuario,
    actualizarCuenta
}