
const multer = require("multer");

const configImage = {
    limits: { fileSize: 2000000 }, //limitar tamaño de imagen a 100 kb
    storage: fileStorage = multer.diskStorage({
        destination: (req, file, next) => { // donde se va subir la imagen
            console.log("entró")
            next(null, __dirname + '/../uploads/');
        },
        filename: (req, file, next) => {

            let filename = shortId.generate();
            const ext = file.mimetype.split('/')[1]; // obtener tipo de archivo

            filename = filename + '.' + ext;
            console.log(filename);
            next(null, filename);
        }
    }),
    //filtrar formatos de imagen
    fileFilter: (req, file, next) => {
        const tiposImagen = ["png", "jpeg", "gif", "webp", "jpg"];
        const ext = file.mimetype.split('/')[1]; //
        console.log("ext", ext);
        if (tiposImagen.includes(ext)) {
            next(null, true); // el archivo se acepta
        } else {
            next(new Error('Formato no válido para llave criptográfica'), false);
        }
    }
}

const uploadImageConfig = multer(configImage).single('image');

const uploadImage = (req, res, next) => {


    uploadImageConfig(req, res, function (error) {

        if (typeof req.file === 'undefined') {
            return next();
        } else {

            if (error) {
                if (error instanceof multer.MulterError) { // si el error es una instancia de MulterError
                    if (error.code === 'LIMIT_FILE_SIZE') {
                        console.log("error c", error)
                        return res.status(500).json({
                            err: 'El tamaño es demasiado grande. Máximo "2 MB"'
                        })
                    } else {
                        console.log("error m ", error)
                        return res.status(500).json({ 'err': 'aqui ' + error.message });
                    }

                } else if (error.hasOwnProperty('message')) { // si el objeto error contiene la propiedad
                    //message.
                    console.log("error ", error)
                    return res.status(500).json({
                        'error': error.message
                    })
                }

            } else {
                return next();
            }
        }
    })
}


module.exports = {
    uploadImage
}