const express = require("express");
const teachers = require("../controllers/teacher.controller");

const router = express.Router();
router.route("/")
    .get(teachers.findAll)
    .post(teachers.create)
    .delete(teachers.deleteAll);

router.route("/:id")
    .get(teachers.findOne)
    .put(teachers.update)
    .delete(teachers.delete);

module.exports = router;