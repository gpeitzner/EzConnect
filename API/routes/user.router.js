const express = require("express");
const router = express.Router();
const user = require("../controllers/user.controller");

router.get("/:email", user.getUser);

router.post("/", user.createUser);

router.post("/login", user.login);

module.exports = router;
