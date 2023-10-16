const { Router } = require("express");
const { registar, login, obtenerUsuario, actualizarCuenta, actualizarContrasena, validarCuenta, validarCodigo, reestablecerContrasena } = require("../controllers/usuarioController");
const auth = require("../middleware/auth");
const router = Router();

router.post("/signup", registar);
router.post("/login", login);
router.get("/", auth, obtenerUsuario);
router.patch("/update", auth, actualizarCuenta);
router.patch("/update-password", auth, actualizarContrasena);
router.get("/validate-account/:email", validarCuenta);
router.post("/validate-code-verification", validarCodigo);
router.patch("/reset-password", reestablecerContrasena);

module.exports = router;