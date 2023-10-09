const jwt = require("jwt-simple");
const moment = require("moment");
const { tokenSecretKey } = require("../envs/config");

const createToken = usuario => {

    return jwt.encode({
        sub: usuario._id,
        nombres: usuario.nombre,
        apellidos: usuario.apellidos,
        email: usuario.correo,
        iat: moment().unix(),
        exp: moment().add(1, 'day').unix() // vence un dia despues

    }, tokenSecretKey);

}

const decodeToken = token => {

    try {
        return jwt.decode(token, tokenSecretKey, false);
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createToken,
    decodeToken
}