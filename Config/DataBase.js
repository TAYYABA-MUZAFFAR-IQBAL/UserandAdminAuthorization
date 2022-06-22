const mongoose = require("mongoose");

const db= mongoose
  .connect(
    "mongodb+srv://tayyaba:tayyaba@cluster0.kql16.mongodb.net/UserAdminRoleAuthorization",
    {
      useNewUrlParser: true,
    }
  )
  .then(() => {
    console.log("Successfully connected to database");
  })
  .catch((error) => {
    console.log("database connection failed. exiting now...");
    console.error(error);
    process.exit(1);
  });
module.export= db;