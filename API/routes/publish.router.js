const express = require("express");
const router = express.Router();
const publish = require("../controllers/publish.controller");

router.post("/", publish.createPublish);

module.exports = router;
