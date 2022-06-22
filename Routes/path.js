const express = require("express");
const { verify } = require("jsonwebtoken");
const Funccontroller = require("../Controllers/LogicController");
const Verify = require("../MiddleWare/VerifyMiddleWare");
const router = express.Router();

//register new employee route
router.route("/Signup").post(Funccontroller.registerEmployee);
//login route
router.route("/Login").post(Funccontroller.LoginEmployee);
//get all employess rote
router
  .route("/GetAcessToAllRecord")
  .get(
    [Verify.VerifyLoginUser, Verify.checkIsAdmin],
    Funccontroller.GetAllEmployee
  );

//get employee by id route
router
  .route("/Get/:id")
  .get(
    [Verify.VerifyLoginUser, Verify.checkIsAdmin],
    Funccontroller.GetEmployeeById
  );
//update route
router
  .route("/Update/:id")
  .put(
    [Verify.VerifyLoginUser, Verify.checkIsAdmin],
    Funccontroller.UpdateEmployee
  );
//delete route
router
  .route("/Delete/:id")
  .delete(
    [Verify.VerifyLoginUser, Verify.checkIsAdmin],
    Funccontroller.DeleteEmployee
  );

module.exports = router;
