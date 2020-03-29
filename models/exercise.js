const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const exerciseSchema = new Schema(
  {
    userId: {
      type: mongoose.ObjectId,
      required: "userID is required"
    },
    description: {
      type: String,
      required: "description is required"
    },
    duration: {
      type: Number,
      required: "duration is required"
    },
    date: {
      type: Date,
      default: Date.now
    }
  }
);

const Exercise = mongoose.model("Exercise", exerciseSchema);

module.exports = Exercise;