const { createTransport } = require("nodemailer");
const smtp = require("nodemailer-smtp-transport");
const config = require("../envs/config");

console.log(config);
const transport = createTransport(smtp({
    service: config.service,
    host: config.email_host,
    auth: {
        user: config.user_email,
        pass: config.googleKey
    }
}))


const sendMail = async (options) => {

    try {
        const response = await transport.sendMail(options);
        console.log({ response })
        return Promise.resolve();
    } catch (error) {
        console.log(error);
        throw new Error("No se pudo enviar el correo");
    }
}


module.exports = {
    sendMail
}