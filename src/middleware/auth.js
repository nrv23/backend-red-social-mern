const { decodeToken } = require("../helpers/jwt");
const { responseBody } = require("../helpers/response-body");

module.exports = (req, res, next) => {
    //autorizacion por medio del Header
    const authHeader = req.get('Authorization');

    if (!authHeader) { // sino se envia el token0
        return res.status(403).json({ message: 'No autenticado' });
    }

    const token = authHeader.split(' ')[1]; //comentario de prueba1
    let verificarToken;
    let response = {};
    try {
        verificarToken = decodeToken(token)
        req.currentUser = verificarToken;
    } catch (error) { // cae en el catch si el token no es valido
        response = responseBody({
            code: 500,
            message: "Hubo un error en el servidor",
            data: null
        })

        return res.status(response.code).json(response)
    }

    if (!verificarToken) { // si el token es valido pero tiene algun error

        response = responseBody({
            code: 401,
            message: "Hubo un error en la verificacion del token",
            data: null
        })

        return res.status(response.code).json(response)
    }

    // si el token pasa toda la verificacion entonces pasa al siguiente middleware
    next();
}