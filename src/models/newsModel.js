const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema(
  {
    category: { type: String, required: true, trim: true },

    thumbnailImage: { type: String, required: true },

    headline: { type: String, required: true, trim: true },

    auther: { type: String, required: true, trim: true },

    uploadTime: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("newsDb", newsSchema);
