const Historia = require("../models/History");
const moment = require("moment");
const { responseBody } = require("../helpers/response-body");

const nuevaHistoria = async (req, res) => {

    let response = {};
    try {

        const { sub: id } = req.currentUser;

        const newStory = new Historia({
            imagen: req.file.filename,
            usuarioRef: id,
            expireAt: moment(new Date().toISOString()).add(1, "days").toDate(),
        });

        if ((await newStory.save())) {
            response = responseBody({
                code: 200,
                message: "Se ha agregado la historia",
                data: null
            });
        } else {
            response = responseBody({
                code: 500,
                message: "No se pudo agregar la historia",
                data: null
            });
        }

        return res.status(+response.code).json(response);

    } catch (error) {

        console.log({ error });
        response = responseBody({
            code: 500,
            message: "Hubo un error",
            data: null
        });

        return res.status(+response.code).json(response);
    }
}


module.exports = {
    nuevaHistoria
};