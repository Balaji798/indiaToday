const express = require("express");
var bodyParser = require("body-parser");
var multer = require("multer");

const route = require("./routes/route.js");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer().any());

const mongoose = require("mongoose");

mongoose
  .connect("",{ useNewUrlParser: true }) // use compnay MongoDB string to connect with
  .then(() => console.log("mongodb running on 27017"))
  .catch((err) => console.log(err));

app.use("/", route);

app.listen(3000, function () {
  console.log("Express app running on port " + 3000);
});
