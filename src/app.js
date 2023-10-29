const express = require("express");
const http = require("http");
const Db = require("./config/dbConnection");
const app = express();
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const { serverPort } = require("./envs/config");
// rutas 
const usuarioRoute = require("./routes/usuarioRoute");
const historiaRoutes = require("./routes/historiaRoutes");
const noEncontradoRoute = require("./routes/not-found");

const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 200,
    message: "Too Many Accounts from this ip. Try please after a minute"
})

async function startServer() {

    try {

        await Db.connect();

        app.use(express.json());
        app.use(express.urlencoded({ extended: false }));
        app.use(cors());
        app.use(limiter);
        app.use(helmet());
        app.use(morgan("dev"));
        app.disable('x-powered-by');
        app.use("/api/account", usuarioRoute);
        app.use("/api/history", historiaRoutes);

        app.use((req, res) => { // agregar ruta cuando la busqueda no encuentre un recurso
            return noEncontradoRoute(req, res);
        });


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

