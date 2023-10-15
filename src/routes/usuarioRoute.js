const { Router } = require("express");
const { registar, login, obtenerUsuario, actualizarCuenta } = require("../controllers/usuarioController");
const auth = require("../middleware/auth");
const router = Router();

router.post("/signup", registar);
router.post("/login", login);
router.get("/", auth, obtenerUsuario);
router.patch("/update", auth, actualizarCuenta);

module.exports = router;