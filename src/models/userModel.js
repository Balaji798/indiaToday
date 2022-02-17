const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true, trim: true },
    profilePicture: { type: String, required: true }, //AWS require
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: true,
    },
    password: { type: String, required: true, trim: true },
    phone: {
      type: String,
      unique: true,
      require: true,
      trim: true,
    },
    gender: {
      type: String,
      required: true,
      trim: true,
      enum: ["Male", "Femail"],
    },
    language: {
      type: String,
      required: true,
      trim: true,
      enum: ["Hindi", "English"],
    },
    maritalStatus: {
      type: String,
      required: true,
      trim: true,
      enum: ["Unmarried", "Married", "Other"],
    },
    dateOfBirth: {
      day: {
        type: Number,
        required: true,
      },
      month: {
        type: Number,
        required: true,
      },
      year: { type: Number, required: true },
    },
    timeOfBirth: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("userDB", userSchema);
