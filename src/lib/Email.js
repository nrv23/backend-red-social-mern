const { sendMail } = require("../config/emailConfig");
const handlebars = require("handlebars");
const ejs = require("ejs");
const getFileContent = require("../helpers/file");
const path = require("path");


class Email {

    constructor(code, email) {
        this.code = code;
        this.email = email;
    }

    async getHtmlContent() {
        const _path = __dirname + '/../template/password-recuperation.html';
        const html = await getFileContent(_path);
        const res_html = ejs.render(html, { code: this.code });
        const template = handlebars.compile(res_html);
        return template({ op: true });
    }

    async sendEmail() {

        return sendMail({
            from: "'Red Social' <noreplay@gmail.com>",
            to: this.email,
            subject: "Recuperar contraseña",
            html: await this.getHtmlContent()
        })

    }
}

module.exports = Email;