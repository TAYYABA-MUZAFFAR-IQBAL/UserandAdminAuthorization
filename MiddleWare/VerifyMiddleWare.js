const jwt = require("jsonwebtoken");
const EmpSchema = require("../Models/EmployeeModel");

//middleware for authorization

const middlewareAuthorization = {
  //verify by token middle ware
  VerifyLoginUser: async (req, res, next) => {
    let token =
      req.headers["x-access-token"] ||
      req.headers.authorization ||
      req.body.token;
    // Express headers are auto converted to lowercase
    if (token && token.startsWith("Bearer")) {
      // Remove Bearer from string
      token = token.slice(7, token.length).trimLeft();
    }
    try {
      //  we extract the JWTSECRET from the .env file
      req.apiUser = jwt.verify(token, process.env.TOKEN_KEY);
      res.locals.apiUser = req.apiUser; //decoded token

      const userbyemail = await EmpSchema.find({ email: req.apiUser.email });
      console.log("User Extracted from login email", userbyemail);
      //find role from extracted data from email
       console.log("Req===>", req.apiUser);
      console.log(userbyemail[0].role);

      next();
    } catch (error) {
      console.log(error);
      return res.status(401).json({
        status: false,
        message: "Sorry, you must provide a valid token.",
      });
    }
  },

  //Check Admin Middle ware
  checkIsAdmin: async (req, res, next) => {
    const extractedEmployee = await EmpSchema.findOne({ email: req.apiUser.email });

    if (extractedEmployee.role === "Admin") {
      console.log("Welcome Admin!!");
      next();
    } else {
      console.log("login user Id", extractedEmployee.id);
      console.log("parameter Id", req.params.id);
      if (!(extractedEmployee.role === "Admin")) {
        if (extractedEmployee.id === req.params.id) {
          next();
        } else {
          console.log("you have no access to extract others ID");
          return res.json({
            message: "Acess Issue ",
          });
        }
      } else {
        next();
      }
      console.log("you Are Not Admin...");
      return;
    }
  },
};
module.exports = middlewareAuthorization;
