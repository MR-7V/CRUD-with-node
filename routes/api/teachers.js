const express =  require("express");
const router = express.Router();
const teachersController = require('../../controllers/teachersController');
//const verifyJWT = require('../../middleware/verifyJWT');
//const path = require("path");

router.route('/')
    .get(teachersController.getAllTeachers)
    .post(teachersController.createNewTeacher)
    .put(teachersController.updateTeacher)
    .delete(teachersController.deleteTeacher)

router.route('/:id')
    .get(teachersController.getTeacher)

module.exports = router;