const jwt = require("jsonwebtoken");

const checkLogin = async function (req, res, next) {
  try {
    let token1 = req.headers["x-api-key"];
    if (!token1) {
      return res
        .status(400)
        .send({
          status: false,
          message:
            "You are not logged in, Please login to proceed your request",
        });
    }
    let decodedToken = jwt.verify(token1, "the-legends-key");
    if (decodedToken) {
      req.userId = decodedToken.userId;
      next();
    } else {
      return res
        .status(400)
        .send({ status: false, message: "Oops...token is not valid" });
    }
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
};

module.exports.checkLogin = checkLogin;
