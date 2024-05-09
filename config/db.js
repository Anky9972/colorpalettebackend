const mongoose = require('mongoose');

require("dotenv").config();
const URL = process.env.DATABASE;
console.log("url",URL)
const dbConnect = () => {
  mongoose.connect(URL, {

  })
    .then(() => console.log("DB connection successful"))
    .catch((err) => {
      console.error("Error in DB connection");
      console.error(err);
      process.exit(1);
    });
};

module.exports = dbConnect;