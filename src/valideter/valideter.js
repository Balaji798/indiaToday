const validator = require("email-validator");
const userModel = require("../models/userModel");
const ObjectId = require("mongoose").Types.ObjectId;

//---------------------------------------Validation-Function-------------------------------------//

const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.length === 0) return false;
  return true;
};

const isValidRequestBody = function (requestBody) {
  return Object.keys(requestBody).length > 0;
};

const isValidMobileNum = function (value) {
  if (!/^[6-9]\d{9}$/.test(value)) {
    return false;
  }
  return true;
};

const isValidSyntaxOfEmail = function (value) {
  if (!validator.validate(value)) {
    return false;
  }
  return true;
};

const isAlphabet = function (value) {
  let regex = /^[A-Za-z ]+$/;
  if (!regex.test(value)) {
    return false;
  }
  return true;
};

const isKeyPresent = function (value) {
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};

const checkUser = async (req, res, next) => {
  try {
    let files = req.files;
    if (!files[0]) {
      return res
        .status(400)
        .send({ status: false, message: "Please Provide Profile Image" });
    }
    let myData = req.body;

    if (!isValidRequestBody(myData)) {
      return res
        .status(400)
        .send({
          status: false,
          message: "Please provide data for successful registration",
        });
    }
    let { userName, email, phone, password } = myData;
    if (!isValid(userName)) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide  userName" });
    }

    if (!isAlphabet(userName)) {
      return res
        .status(400)
        .send({
          status: false,
          message: "You can't use special character or number in User Name",
        });
    }

    if (!isValid(email)) {
      return res
        .status(400)
        .send({
          status: false,
          message: "Please provide Email id or email field",
        });
    }
    if (!isValidSyntaxOfEmail(email)) {
      return res
        .status(404)
        .send({ status: false, message: "Please provide a valid Email Id" });
    }
    if (!isValid(phone)) {
      return res
        .status(400)
        .send({
          status: false,
          message: "Please provide phone number or phone field",
        });
    }
    if (!isValidMobileNum(phone)) {
      return res
        .status(400)
        .send({
          status: false,
          message: " Please provide a valid phone number",
        });
    }

    if (!isValid(password)) {
      return res
        .status(400)
        .send({
          status: false,
          message: "Please provide password or password field",
        });
    }
    let size = password.length;
    if (size < 8 || size > 15) {
      return res
        .status(400)
        .send({
          status: false,
          message:
            "Please provide password with minimum 8 and maximum 14 characters",
        });
    }
    let isDBexists = await userModel.find();
    let dbLen = isDBexists.length;
    if (dbLen != 0) {
      const DuplicateEmail = await userModel.find({ email: email });
      const emailFound = DuplicateEmail.length;
      if (emailFound != 0) {
        return res
          .status(400)
          .send({
            status: false,
            message: "This email Id already exists with another user",
          });
      }
      const duplicatePhone = await userModel.findOne({ phone: phone });
      if (duplicatePhone) {
        return res
          .status(400)
          .send({
            status: false,
            message: "This phone number already exists with another user",
          });
      }
    }
    next();
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const checkUserupdate = async (req, res, next) => {
  try {
    let myData = req.body;
    if (!myData) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide data to update" });
    }
    let paramsId = req.params.userId;
    let checkId = ObjectId.isValid(paramsId);
    if (!checkId) {
      return res
        .status(400)
        .send({
          status: false,
          message: "Please Provide a valid userId in path params",
        });
    }
    if (!(req.userId == paramsId)) {
      return res
        .status(400)
        .send({
          status: false,
          message: "Sorry you are not authorized to do this action",
        });
    }
    if (!isValidRequestBody(myData)) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide data to update" });
    }
    let { userName, email, phone, password } = myData;
    if (!isKeyPresent(userName)) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide fname" });
    }
    if (!isAlphabet(userName)) {
      return res
        .status(400)
        .send({
          status: false,
          message: "You can't use special character or number in fname",
        });
    }

    if (!isKeyPresent(email)) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide email" });
    }
    if (email) {
      if (!isValidSyntaxOfEmail(email)) {
        return res
          .status(404)
          .send({ status: false, message: "Please provide a valid Email Id" });
      }
    }
    if (!isKeyPresent(phone)) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide Phone Number" });
    }
    if (phone) {
      if (!isValidMobileNum(phone)) {
        return res
          .status(400)
          .send({
            status: false,
            message: "Please provide a valid Phone Number",
          });
      }
    }
    if (!isKeyPresent(password)) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide password" });
    }
    if (password) {
      let size = Object.keys(password.trim()).length;
      if (size < 8 || size > 15) {
        return res
          .status(400)
          .send({
            status: false,
            message:
              "Please provide password with minimum 8 and maximum 14 characters",
          });
      }
    }

    const foundId = await userModel.findOne({ email: email });
    if (foundId) {
      let userId1 = foundId._id;
      if (userId1 == paramsId) {
        // here we are checking that if we are the owner of duplicate id then still we are able to update
        const duplicatePhone1 = await userModel.findOne({ phone: phone });
        if (duplicatePhone1) {
          let userId2 = duplicatePhone1._id;
          if (userId2 == paramsId) {
            return next();
          } else if (duplicatePhone1) {
            return res
              .status(400)
              .send({
                status: false,
                message:
                  "This phone number already exists with another user(1)",
              });
          }
        } else {
          return next();
        }
      }
    }

    const foundId1 = await userModel.findOne({ phone: phone });
    if (foundId1) {
      let userId3 = foundId1._id;
      if (userId3 == paramsId) {
        // here we are checking that if we are the owner of duplicate id then still we are able to update
        const duplicateEmail1 = await userModel.findOne({ email: email });
        if (duplicateEmail1) {
          let userId2 = duplicateEmail1._id;
          if (userId2 == paramsId) {
            return next();
          } else if (duplicateEmail1) {
            return res
              .status(400)
              .send({
                status: false,
                message: "This email Id is already exists with another user(1)",
              });
          }
        } else {
          return next();
        }
      }
    }

    const DuplicateEmail = await userModel.find({ email: email });
    const emailFound = DuplicateEmail.length;
    if (emailFound != 0) {
      return res
        .status(400)
        .send({
          status: false,
          message: "This email Id already exists with another user(2)",
        });
    }
    const duplicatePhone = await userModel.findOne({ phone: phone });
    if (duplicatePhone) {
      return res
        .status(400)
        .send({
          status: false,
          message: "This phone number already exists with another user(2)",
        });
    }
    next();
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const checkNews = async (req, res, next) => {
  try {
    let files = req.files;
    if (!files[0]) {
      return res
        .status(400)
        .send({ status: false, message: "Please Provide Profile Image" });
    }
    let requestBody = req.body;

    if (!isValidRequestBody(requestBody)) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide data for news feed" });
    }
    let { category, headline, auther } = requestBody;
    if (!isValid(category)) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide  category" });
    }
    if (!isValid(headline)) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide  headline" });
    }
    if (!isValid(auther)) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide  auther" });
    }
    next();
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = { checkUser, checkUserupdate, checkNews };
