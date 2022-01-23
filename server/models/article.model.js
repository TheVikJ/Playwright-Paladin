const mongoose = require("mongoose");

const Post = new mongoose.Schema(
  {
    header: { type: String, required: true },
    content: { type: String, required: true },
  },
  { collection: "post-data" }
);

const model = mongoose.model("PostData", Post);

module.exports = model;
