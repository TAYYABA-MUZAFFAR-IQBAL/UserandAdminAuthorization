const express = require("express");
// const mongoose = require("mongoose");
const DB= require("./Config/DataBase");
const PathOfRegisterEmployee= require("./Routes/path");
const { API_PORT } = process.env;


const app = express();



//SERVER CONNECTION
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

//BODY PARSER 
app.use(express.json())

//USE ROUTES PATHS
app.use("/Employee",PathOfRegisterEmployee);




module.exports = app;