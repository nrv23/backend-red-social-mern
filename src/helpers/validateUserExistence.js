const { isValidObjectId } = require("mongoose");
const User = require("../models/User");

const userExists = async user => {
    if (isValidObjectId(user)) return await User.findOne({ _id: user });
    return await User.findOne({ correo: user });
};


module.exports = {
    userExists
}