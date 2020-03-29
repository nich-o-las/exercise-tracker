const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    userName: {
      type: String,
      trim: true,
      required: "name is required"
    },
    exercises: [{
      type: Schema.Types.ObjectId,
      ref: "Exercise"
    }]
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;