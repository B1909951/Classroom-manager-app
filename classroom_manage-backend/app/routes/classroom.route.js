const express = require("express");
const classrooms = require("../controllers/classroom.controller");

const router = express.Router();
router.route("/")
    .get(classrooms.findAll)
    .post(classrooms.create)
    .delete(classrooms.deleteAll);

router.route("/:id")
    .get(classrooms.findOne)
    .put(classrooms.update)
    .delete(classrooms.delete);

module.exports = router;