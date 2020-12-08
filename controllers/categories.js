const HttpError = require("../models/http-error");
const Category = require("../models/category-model");

const createCategory = async (req, res, next) => {
  const name = req.body.name;

  const newCategory = new Category({
    name,
    articles: [],
  });

  try {
    await newCategory.save();
  } catch (err) {
    const error = new HttpError(
      "Creating category failed, please try again in a while :( ",
      500
    );
    return next(error);
  }

  res.json({ message: "Successfully created!", category: newCategory });
};

const getAllCategories = async (req, res, next) => {
  let categories;
  try {
    categories = await Category.find({});
  } catch (err) {
    const error = new HttpError(
      "Fetching categories failed, please try again later.",
      500
    );
    return next(error);
  }

  res.send({ categories: categories.map((user) => user) });
};

const deleteCategoryByName = async (req, res, next) => {
  const categoryName = req.params.cid;
  let category;
  try {
    category = await Category.findOneAndDelete({ name: categoryName });
  } catch (err) {
    const error = new HttpError(
      "Deleting category failed , please try again in a while.",
      500
    );
    return next(error);
  }

  if (category) {
    res.json({ message: `Successfully deleted the ${categoryName} category` });
  } else {
    res.json({ message: "There is no such category" });
  }
};

exports.createCategory = createCategory;
exports.getAllCategories = getAllCategories;
exports.deleteCategoryByName = deleteCategoryByName;
