const dialogRequest = require("../controllers/dialogRequest");

const router = require("express").Router();

router.post("/question", dialogRequest);

module.exports = router;
