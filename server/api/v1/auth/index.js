const express = require("express");
const auth = require("../../../middleware/authenticate");
const controller = require("./auth.controller");

const router = express.Router();

router.get('/me', auth.isAuthenticated(), controller.getLoggedInUser);
router.post('/login', controller.login);
router.post('/forget-password', controller.forgotPassword);
router.post('/reset-password', controller.resetPassword);

module.exports = router;