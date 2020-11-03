const express = require("express");
const router = express.Router();
const user = require("../controllers/user.controller");

router.get("/:email", user.getUser);
router.get("/", user.getAllUsers);
router.post("/", user.createUser);
router.post("/login", user.login);
router.put("/", user.updateUser);

module.exports = router;
