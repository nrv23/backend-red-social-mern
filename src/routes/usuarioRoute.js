const { Router } = require("express");
const { registar, login } = require("../controllers/usuarioController");
const router = Router();


router.post("/signup", registar);
router.post("/login", login);

module.exports = router;