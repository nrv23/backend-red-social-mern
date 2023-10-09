const User = require("../models/User");

const userExists = async user => await User.findOne({ correo: user });


module.exports = {
    userExists
}