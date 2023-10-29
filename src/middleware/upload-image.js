
const multer = require("multer");
const shortId = require("shortid");
const { responseBody } = require("../helpers/response-body");

const configImage = {
    limits: { fileSize: 2000000 }, //limitar tamaño de imagen a 100 kb
    storage: fileStorage = multer.diskStorage({
        destination: (req, file, next) => { // donde se va subir la imagen
            console.log("entró")
            next(null, __dirname + '/../uploads/stores/');
        },
        filename: (req, file, next) => {

            let filename = shortId.generate();
            const ext = file.mimetype.split('/')[1]; // obtener tipo de archivo

            filename = filename + '.' + ext;

            next(null, filename);
        }
    }),
    //filtrar formatos de imagen
    fileFilter: (req, file, next) => {
        const tiposImagen = ["png", "jpeg", "gif", "webp", "jpg"];
        const ext = file.mimetype.split('/')[1]; //
        console.log("ext", ext);
        console.log({ file })
        if (tiposImagen.includes(ext)) {
            next(null, true); // el archivo se acepta
        } else {
            next(new Error('Formato no válido para la imagen'), false);
        }
    }
}

const uploadImageConfig = multer(configImage).single('image');

const uploadImage = (req, res, next) => {

    let response = {}
    console.log(req.file)
    console.log(req.files)
    uploadImageConfig(req, res, function (error) {

        if (error) {
            if (error instanceof multer.MulterError) { // si el error es una instancia de MulterError
                if (error.code === 'LIMIT_FILE_SIZE') {
                    console.log("error c", error)

                    response = responseBody({
                        code: 400,
                        message: 'El tamaño es demasiado grande. Máximo 2 MB',
                        data: null
                    });
                    return res.status(+response.code).json(response);

                } else {
                    console.log("error m ", error)
                    response = responseBody({
                        code: 500,
                        message: error.message,
                        data: null
                    });
                    return res.status(+response.code).json(response);

                }

            } else if (error.hasOwnProperty('message')) { // si el objeto error contiene la propiedad
                //message.
                console.log({ error });
                response = responseBody({
                    code: 500,
                    message: error.message,
                    data: null
                });
                return res.status(+response.code).json(response);
            }

        }
        if (!req.file) {
            response = responseBody({
                code: 400,
                message: "Image is required",
                data: null
            });
            return res.status(+response.code).json(response);
        }
        return next();
    })
}


module.exports = {
    uploadImage
}