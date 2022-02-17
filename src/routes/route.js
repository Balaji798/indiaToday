const express = require("express");
const router = express.Router();

const userController = require("../controllers/userControllers");
const newsController = require("../controllers/newsControllers");
const myMiddleware = require("../middleWares/authMiddleWares");
const validator = require("../valideter/valideter.js");

router.post("/sinup", validator.checkUser, userController.createUser);
router.post("/login", userController.userLogin);
router.put("/user/:userId/profile", myMiddleware.checkLogin, validator.checkUserupdate, userController.updateProfile);
router.post("/creatNews", validator.checkNews, newsController.creatNews);
router.get("/getNews", newsController.getNews);
router.get("/getNewsBycategory", newsController.getNewsBycategory);
router.get("/getNewsByTime", newsController.getNewsByTime);

module.exports = router;
