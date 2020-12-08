const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator"); // gia na epikurwsw oti to name einai unique to name

const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: { type: String, required: true, unique: true },
  articles: [{ type: mongoose.Types.ObjectId, ref: "Article" }],
});

categorySchema.plugin(uniqueValidator);

module.exports = mongoose.model("Category", categorySchema);
