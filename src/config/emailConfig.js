const { createTransport } = require("nodemailer");
const smtp = require("nodemailer-smtp-transport");

const transport = createTransport(smtp({
    service: "gmail",
    host: "smt.gmail.com",
    auth: {
        user: "nrv2391@gmail.com",
        pass: "izmwscdjfzxoepjp"
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