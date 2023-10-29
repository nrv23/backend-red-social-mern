const { Router } = require("express");
const { nuevaHistoria } = require("../controllers/historiaController");
const auth = require("../middleware/auth");
const { uploadImage } = require("../middleware/upload-image");
const router = Router();

router.post("/", auth, uploadImage, nuevaHistoria)

module.exports = router;