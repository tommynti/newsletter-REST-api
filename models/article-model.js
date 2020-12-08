const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const articleSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  description: String,
  category: { type: mongoose.Types.ObjectId, required: true, ref: "Category" },
});

module.exports = mongoose.model("Article", articleSchema);
