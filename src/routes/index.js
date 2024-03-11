const dialogRequest = require("../controllers/dialogRequest");
const downloadFile = require('../controllers/downloadFile')

const router = require("express").Router();

router.post("/question", dialogRequest);
router.get("/download/:file", downloadFile);

module.exports = router;
