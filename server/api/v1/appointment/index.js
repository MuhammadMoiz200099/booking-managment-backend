const express = require("express");
const controller = require("./appointment.controller");

const router = express.Router();

router.get('/', controller.get);
router.post('/', controller.create);
router.get('/:id', controller.getByID);
router.get('/user/:id', controller.getByUserID);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

module.exports = router;