const express =  require("express");
const router = express.Router();
const teachersController = require('../../controllers/teachersController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');
//const verifyJWT = require('../../middleware/verifyJWT');
//const path = require("path");

router.route('/')
    .get(teachersController.getAllTeachers)
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),teachersController.createNewTeacher)
    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),teachersController.updateTeacher)
    .delete(verifyRoles(ROLES_LIST.Admin), teachersController.deleteTeacher)

router.route('/:id')
    .get(teachersController.getTeacher)

module.exports = router;