const mongoose = require("mongoose");
const { mongoUrlConnect } = require("../envs/config");

class Db {

    static async connect() {
        try {

            /*const conn = await mongoose.createConnection('mongodb://127.0.0.1:27017/social').asPromise();

            if (conn.readyState === 1) {

                console.info("Se ha conectado exitosamente a la base de datos");
                return Promise.resolve();

            } else {
                console.error("Hubo un error en la conexión ");
                throw new Error("No se conecto a la bd", {
                    status: conn.readyState
                })
            }*/

            await mongoose.connect(mongoUrlConnect, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });

            console.info("Se ha conectado exitosamente a la base de datos");

        } catch (error) {
            console.error("Hubo un error", error);
            return Promise.reject(error);
        }
    }
}


module.exports = Db;