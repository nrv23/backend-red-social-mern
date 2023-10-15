const { generateUsername } = require("unique-username-generator");


const generate = (split = null, numberOfDigits = null, length = null) => generateUsername(split, numberOfDigits, length);



module.exports = {
    generate
}