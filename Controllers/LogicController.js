const EmpSchema = require("../Models/EmployeeModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

function EmployeeFunc() {
  //register Employee
  this.registerEmployee = async (req, res) => {
    try {
      // Get user input
      const { first_name, last_name, email, password, role } = req.body;

      // Validate user input
      if (!(email && password && first_name && last_name && role)) {
        res.status(400).send("All input is required");
      }

      // check if user already exist
      // Validate if user exist in our database
      const oldemployee = await EmpSchema.findOne({ email });

      if (oldemployee) {
        return res.status(409).send("User Already Exist. Please Login");
      }

      //Encrypt user password
      const encryptedPassword = await bcrypt.hash(password, 10);

      // Create user in our database
      const user = await EmpSchema.create({
        first_name,
        last_name,
        email: email.toLowerCase(), // sanitize: convert email to lowercase
        password: encryptedPassword,
        role,
      });

      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );
      // save user token
      user.token = token;

      // return new user
      res.status(201).json(user);
    } catch (err) {
      console.log(err);
    }
  };

  //Login Employee
  this.LoginEmployee = async (req, res) => {
    try {
      // Get user input
      const { email, password } = req.body;

      // Validate user input
      if (!(email && password)) {
        res.status(400).send("All input is required");
      }
      // Validate if user exist in our database
      const user = await EmpSchema.findOne({ email });

      if (user && (await bcrypt.compare(password, user.password))) {
        // Create token
        const token = jwt.sign({ email: email }, process.env.TOKEN_KEY, {
          expiresIn: 864000,
        });
        // user
        console.log("Welcome 🙌", user.first_name);
        res
          .status(200)
          .json({ status: true, token: token, message: "Welcome 🙌 " });
      } else {
        res.status(400).json("Invalid Credentials");
      }
    } catch (err) {
      console.log(err);
      return res.json({ message: "user not exsists...please register" });
    }
  };

  //Get All By Admin Only Logic
  this.GetAllEmployee = async (req, res) => {
    EmpSchema.find({}, (err, users) => {
      if (err) {
        console.log("Error occured in Exraction");
        res.status(500).json({ errmsg: err });
        return;
      } else {
        console.log("All Employee List", users);
        console.log(
          "Hey Admin you have Extracted All user data Successfully...."
        );
        return res.status(200).json({ msg: users });
      }
    }).select("-password");
  };
  //get employee data By Id
  this.GetEmployeeById = (req, res) => {
    EmpSchema.findById({ _id: req.params.id }, (err, employee) => {
      if (err) {
        console.log(err);
        console.log("no access to Extract data.....");
      } else {
        console.log("employee", employee);
        console.log("Employee by Id is Extracted Successfully.....");
        return res.json({ status: true });
      }
    }).select("-password");
  };

  //Update Employee

  this.UpdateEmployee = (req, res) => {
    console.log("req.body", req.body);

    EmpSchema.findById({ _id: req.params.id }, (err, employeeById) => {
      if (err) {
        res.status(500).json({ errmsg: err });
        console.log("not able to update data from...");
        return;
      } else {
        employeeById.first_name = req.body.first_name,
        employeeById.last_name = req.body.last_name,
        employeeById.email = req.body.email,
        employeeById.password = req.body.password;
        employeeById.role = req.body.role;
        //save the updated data
        employeeById.save((err, employeeById) => {
          if (err) {
            res.status(500).json({ errmsg: err });
            return;
          } else {
            res.status(200).json({ data: employeeById, status: true });
            console.log("Employee updated successfully...");
          }
        });
      }
    });
  };

  //Delete Employee
  this.DeleteEmployee = (req, res) => {
    EmpSchema.findOneAndRemove({ _id: req.params.id }, (err, student) => {
      if (err) {
        res.status(500).json({ errmsg: err });
        console.log("no access to delete data.....");
        return;
      } else {
        res.status(200).json({ msg: student });
        console.log("deleted sucessfully");
      }
    });
  };
}

module.exports = new EmployeeFunc();
