const { Router } = require("express");
const { registar } = require("../controllers/usuarioController");
const router = Router();


router.post("/signup", registar);

module.exports = router;