require("dotenv").config({ path: "variables.env" });

const config = {
    mongoUrlConnect: process.env.DB_CONNECT,
    tokenSecretKey: process.env.TOKEN_SECRET_KEY,
    serverPort: process.env.SERVER_PORT,
    googleKey: process.env.GOOGLE_KEY,
    user_email: process.env.USER_EMAIL,
    service: process.env.SERVICE,
    email_host: process.env.EMAIL_HOST
}

module.exports = config;