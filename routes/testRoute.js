const { Router } = require("express");
const { test_api } = require("../controllers/testController");
const router = Router();

router.get("/test", test_api);


module.exports = router;
