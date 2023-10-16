const fs = require("fs");

const getFileContent = async path => await readFile(path);

const readFile = async path => {

    const exists = await validateFileExist(path);

    return new Promise((resolve, reject) => {

        if (!exists) throw new Error("EL archivo no existe");
        fs.readFile(path, { encoding: 'utf-8' }, (err, data) => {
            if (!err) return resolve(data);
            throw err;
        })
    })
}

const validateFileExist = async path => {

    try {
        await fs.promises.access(path, fs.constants.F_OK);
        return true
    } catch (error) {
        return false;
    }
}

module.exports = getFileContent