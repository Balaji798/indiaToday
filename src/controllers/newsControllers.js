const newsModel = require("../models/newsModel");
const moment = require("moment");
let aws = require("./aws");

const creatNews = async (req, res) => {
  try {
    let newsBody = req.body;
    let files = req.files;
    const thumbnailImage = await aws.uploadFile(files[0]);
    let { category, headline, auther } = newsBody;
    let uploadTime = moment().format("Do MMM YY");
    let newsData = { thumbnailImage, category, headline, auther, uploadTime };
    const dataCreated = await newsModel.create(newsData);
    return res
      .status(201)
      .send({
        status: true,
        message: "User created successfully",
        data: dataCreated,
      });
  } catch (error) {
    return res.status(500).send({ success: false, error: error.message });
  }
};

const getNews = async (req, res) => {
  try {
    let newsData = await newsModel.find();
    return res.status(200).send({ status: true, News: newsData });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};
const getNewsBycategory = async (req, res) => {
  try {
    const queryParams = req.query.filter;
    let allCategory = await newsModel.find({ category: queryParams });
    if (!allCategory) {
      return res.status(403).send({ status: false, message: "no news found" });
    }
    return res.status(200).send({ status: true, News: allCategory });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

const getNewsByTime = async (req, res) => {
  try {
    //const queryParams = req.query
    const news = await newsModel.find().sort({ uploadTime: -1 });
    return res.status(200).send({ status: true, News: news });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

module.exports = { creatNews, getNews, getNewsBycategory, getNewsByTime };
