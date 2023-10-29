const Usuario = require("../models/User");
const UsuarioInvitacion = require("../models/User_Invite");
const UsuarioAmigo = require("../models/User_Friend");
const { encriptPassword, comparePass } = require("../helpers/encriptPass");
const { responseBody } = require("../helpers/response-body");
const { userExists } = require("../helpers/validateUserExistence");
const { createToken } = require("../helpers/jwt");
const { generate } = require("../helpers/username-generator");
const { generarAleatorios } = require("../helpers/aleatorio");
const Email = require("../lib/Email");


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
        return res.status(+response.code).json(response);
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
        response = responseBody({ code: 500, message: error.message, data: null });
        return res.status(+response.code).json(response);
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
                code: 404, message: "Usuario no existe", data: null
            });

            return res.status(+data.code).json(data);
        }

        response = responseBody({
            code: 200, message: "", data: usuario
        });

        response.data = usuario;

        return res.status(+response.code).json(response);


    } catch (error) {

        response = responseBody({ code: 500, message: error.message, data: null });
        return res.status(+response.code).json(response);
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
        response = responseBody({ code: 500, message: error.message, data: null });
        return res.status(+response.code).json(response);
    }
}

const actualizarContrasena = async (req, res) => {

    let response = {};
    const { sub: id } = req.currentUser;
    const { password, newpassword } = req.body;

    try {

        const exists = await userExists(id);

        if (!exists || exists?.length === 0) {
            response = responseBody({
                code: 404, message: "Usuario no existe", data: null
            });

            return res.status(+response.code).json(response);
        }

        if (!(await comparePass(password, exists.password))) {
            response = responseBody({
                code: 400, message: "Usuario/Contraseña inválidos", data: null
            });

            return res.status(+response.code).json(response);
        }

        const passwordUpdated = await Usuario.updateOne({ _id: id }, {
            password: await encriptPassword(newpassword)
        });

        if (!passwordUpdated) {
            response = responseBody({
                code: 500, message: "No se actualizó el usuario", data: null
            });
        } else {
            response = responseBody({
                code: 200, message: "Se actualizó el usuario", data: null
            });
        }

        return res.status(+response.code).json(response);

    } catch (error) {
        console.log({ error })
        response = responseBody({ code: 500, message: error.message, data: error });
        return res.status(+response.code).json(response);
    }
}

const validarCuenta = async (req, res) => {

    let response = {};

    try {

        const { email } = req.params;
        const exists = await userExists(email);

        if (!exists || exists?.length === 0) {
            response = responseBody({
                code: 404, message: "Usuario no existe", data: false
            });

            return res.status(+response.code).json(response);
        }

        //actualizar el codigo de envio 
        const codigo_reset = generarAleatorios(6);
        const updated = await Usuario.updateOne({
            _id: exists._id
        }, {
            codigo_reset: codigo_reset.trim()
        });

        if (!updated) {
            response = responseBody({
                code: 500, message: "No se actualizó el usuario", data: null
            });

            return res.status(+response.code).json(response);
        }

        response = responseBody({
            code: 200,
            message: "Revisa tu bandeja de entra. Se ha enviado un correo con un código de verificación",
            data: null
        });

        await new Email(codigo_reset, email).sendEmail();
        // emviar el correo

        return res.status(+response.code).json(response);

    } catch (error) {
        console.log({ error })
        response = responseBody({ code: 500, message: "Hubo un error", data: error });
        return res.status(+response.code).json(response);
    }
}

const validarCodigo = async (req, res) => {

    let response = {};

    try {
        const { code, email } = req.body;
        const exists = await userExists(email);

        if (!exists || exists?.length === 0) {
            response = responseBody({
                code: 401, message: "Usuario inválido", data: false
            });

            return res.status(+response.code).json(response);
        }

        if (code !== exists.codigo_reset) {
            response = responseBody({
                code: 400, message: "Código inválido", data: false
            });

            return res.status(+response.code).json(response);
        }

        response = responseBody({
            code: 200, message: "", data: true
        });

        return res.status(+response.code).json(response);

    } catch (error) {
        console.log({ error })
        response = responseBody({ code: 500, message: "Hubo un error", data: error });
        return res.status(+response.code).json(response);
    }
}

const reestablecerContrasena = async (req, res) => {

    let response = {};

    try {

        const { password, email } = req.body;

        const exists = await userExists(email);

        if (!exists || exists?.length === 0) {
            response = responseBody({
                code: 401, message: "Usuario inválido", data: false
            });

            return res.status(+response.code).json(response);
        }

        const updated = await Usuario.updateOne({ correo: email }, {
            password: await encriptPassword(password)
        });

        if (!updated) {
            response = responseBody({
                code: 500, message: "No se pudo reestablecer la contraseña", data: null
            });


        } else {
            response = responseBody({
                code: 200,
                message: "Tu contraseña ha sido reestablecida. Ya puedes iniciar sesión",
                data: null
            });
        }

        return res.status(+response.code).json(response);

    } catch (error) {
        console.log({ error })
        response = responseBody({ code: 500, message: "Hubo un error", data: error });
        return res.status(+response.code).json(response);
    }
}

const enviarSolicitudAmistad = async (req, res) => {

    let response = {};

    try {

        const { sub: id } = req.currentUser;
        const { body: {
            friendId
        } } = req;

        // validar que el usuario que envio la solilcitud exista en la bd

        const exists = userExists(friendId);

        if (!exists || exists?.length === 0) {
            response = responseBody({
                code: 404, message: "Usuario no existe", data: false
            });

            return res.status(+response.code).json(response);
        }

        const newFriendInvitation = new UsuarioInvitacion({
            usuario_origen: id,
            usuario_destino: friendId
        });

        if ((await newFriendInvitation.save())) {
            response = responseBody({ code: 201, message: "Se ha enviado la solicitud de amistad", data: null });
        } else {
            response = responseBody({ code: 500, message: "No se pudo enviar la solicitud de amistad", data: null });
        }

        return res.status(+response.code).json(response);

    } catch (error) {

        console.log({ error })
        response = responseBody({ code: 500, message: "Hubo un error", data: error });
        return res.status(+response.code).json(response);
    }
}

const aceptarSolicitudAmistad = async (req, res) => {

    try {

        const { sub: id } = req.currentUser;
        const { body: {
            friendId
        } } = req;

        // validar que el usuario que envio la solilcitud exista en la bd

        const exists = userExists(friendId);

        if (!exists || exists?.length === 0) {
            response = responseBody({
                code: 404, message: "Usuario no existe", data: false
            });

            return res.status(+response.code).json(response);
        }

        // agrega la nueva relacion del nuevo amigo

        const newFriendAccepted = new UsuarioInvitacion({
            usuario_origen: id,
            usuario_destino: friendId
        });

        if ((await newFriendAccepted.save())) {
            response = responseBody({ code: 201, message: "Se ha agregado el nuevo contacto", data: error });
        } else {
            response = responseBody({ code: 500, message: "No se pudo agregar el contacto", data: error });
        }

        return res.status(+response.code).json(response);

    } catch (error) {
        console.log({ error })
        response = responseBody({ code: 500, message: "Hubo un error", data: error });
        return res.status(+response.code).json(response);
    }
}

const obtenerUsuariosRandmon = async (req, res) => {

    let response = {};

    try {
        const { sub: id } = req.currentUser;
        console.log(req.currentUser)
        const usuarios = await Usuario.find({
            $and: [
                {
                    _id: {
                        $ne: id
                    },
                    estado: true
                },
                {
                    _id: {
                        $nin: UsuarioInvitacion.distinct('usuario_destino')
                    }
                }
            ]
        }, {
            _id: 1, nombre: 1, apellidos: 1, profesion: 1
        })
        /* .populate('Usuqrio_Invitacion')
         .limit(5)
         .exec();*/


        response = responseBody({ code: 200, message: "", data: usuarios });

        return res.status(+response.code).json(response);

    } catch (error) {
        console.log({ error })
        response = responseBody({ code: 500, message: "Hubo un error", data: error });
        return res.status(+response.code).json(response);
    }
}

module.exports = {
    registar,
    login,
    obtenerUsuario,
    actualizarCuenta,
    actualizarContrasena,
    validarCuenta,
    validarCodigo,
    reestablecerContrasena,
    enviarSolicitudAmistad,
    aceptarSolicitudAmistad,
    obtenerUsuariosRandmon
}