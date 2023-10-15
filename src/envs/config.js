require("dotenv").config({ path: "variables.env" });

const config = {

    mongoUrlConnect: process.env.DB_CONNECT,
    tokenSecretKey: process.env.TOKEN_SECRET_KEY,
    serverPort: process.env.SERVER_PORT
}

module.exports = config;