const express = require("express");
const http = require("http");
const Db = require("../config/dbConnection");
const app = express();
const PORT = process.env.PORT || 4201;

// rutas 
const tesroute = require("./../routes/testRoute");

async function startServer() {

    try {

        app.use(express.json());
        app.use("/api", tesroute);

        await Db.connect();
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

