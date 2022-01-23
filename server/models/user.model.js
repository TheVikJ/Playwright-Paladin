const mongoose = require("mongoose");

const User = new mongoose.Schema(
  {
    phone: { type: String, required: true, unique: true },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "PostData" }],
  },
  { collection: "user-data" }
);

const model = mongoose.model("UserData", User);

module.exports = model;
