const express = require("express");
const http = require("http");
const Db = require("./config/dbConnection");
const app = express();
const cors = require("cors");
const { serverPort } = require("./envs/config");
// rutas 
const usuarioRoute = require("./routes/usuarioRoute");
const historiaRoutes = require("./routes/historiaRoutes");


async function startServer() {

    try {

        await Db.connect();

        app.use(express.json());
        app.use(cors());
        app.use("/api/account", usuarioRoute);
        app.use("/api/history", historiaRoutes);

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

