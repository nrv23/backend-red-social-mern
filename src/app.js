const express = require("express");
const http = require("http");
const Db = require("./config/dbConnection");
const app = express();
const cors = require("cors");
// rutas 
const tesroute = require("./routes/testRoute");
const usuarioRoute = require("./routes/usuarioRoute");
const { serverPort } = require("./envs/config");

async function startServer() {

    try {

        await Db.connect();

        app.use(express.json());
        app.use(cors());
        app.use("/api/test", tesroute);
        app.use("/api/account", usuarioRoute);

        const PORT = serverPort || 4201;
        const server = http.createServer(app);

        server.listen(PORT, () => {
            console.log(`Servidor escuchando peticiones en puerto ${PORT}`);
        })

    } catch (error) {

        console.log(error);
        throw error;
    }

}

startServer();


module.exports = app;

