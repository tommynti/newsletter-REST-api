const mongoose = require("mongoose");

const Article = require("../models/article-model");
const Category = require("../models/category-model");
const HttpError = require("../models/http-error");

const getAllArticles = async (req, res, next) => {
  const { contents, category } = req.query; //either a value or undefined

  let foundArticles;
  try {
    foundArticles = await Article.find();
  } catch (err) {
    const error = new HttpError("Something went wrong", 500);
    return next(error);
  }
  if (category) {
    const requestedCategory = await Category.find({ _id: category });
    const requestedCategoryId = requestedCategory[0]._id;

    if (contents === "true" && category == requestedCategoryId) {
      // Prepei na balw 2 ison gt sugrinw string me int opote to olo statement den ginetai pote true
      const categoryArticles = foundArticles.filter((article) => {
        return article["category"] == category;
      });
      res.json({ articles: categoryArticles });
    } else if (category == requestedCategoryId) {
      let categoryArticles = foundArticles.filter((article) => {
        return article["category"] == category;
      });
      categoryArticles = categoryArticles.map((article) => {
        return article["title"];
      });
      res.json({ titles: categoryArticles });
    }
  } else if (contents === "true") {
    res.json({ articles: foundArticles });
  } else {
    const titleArticles = foundArticles.map((article) => {
      return article["title"];
    });
    res.json({ titles: titleArticles });
  }
};

const createArticle = async (req, res, next) => {
  const { title, content, description, category } = req.body;
  const newArticle = new Article({
    title,
    content,
    description,
    category,
  });

  const articleCategory = await Category.findById(category);
  // console.log(articleCategory);
  if (!articleCategory) {
    const error = new HttpError(
      "Could not find category for the provided id, you might forget to enter a category or enter a category which doesnt exist.",
      404
    );
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await newArticle.save({ session: sess }); // we refer to the current session
    articleCategory.articles.push(newArticle);
    await articleCategory.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Creating article failed, please try again",
      500
    );
    return next(error);
  }
  res.json({ article: newArticle });
};

const getArticleById = async (req, res, next) => {
  const articleId = req.params.arid;
  const payload = req.query.payload;

  let foundArticle;
  try {
    foundArticle = await Article.findById(articleId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find this article",
      500
    );
    return next(error);
  }

  if (!foundArticle) {
    const error = new HttpError(
      "Could not find an article for the provided id.",
      404
    );
    return next(error);
  }

  if (payload === "true") {
    res.json({ article: foundArticle });
  } else {
    res.json({ title: foundArticle.title });
  }
};

const updateArticle = async (req, res, next) => {
  const content = req.body.content;
  const articleId = req.params.arid;
  console.log(content);

  let foundArticle;
  try {
    foundArticle = await Article.findById(articleId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update article.",
      500
    );
    return next(error);
  }

  foundArticle.content = content; // antikatastash toy paliou content me to neo

  try {
    await foundArticle.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update article.",
      500
    );
    return next(error);
  }

  res.json({ article: foundArticle });
};

const deleteArticleById = async (req, res, next) => {
  const articleId = req.params.arid;

  const foundArticle = await Article.findById(articleId).populate("category");

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await foundArticle.remove({ session: sess });
    foundArticle.category.articles.pull(foundArticle);
    await foundArticle.category.save({ session: sess }); // gia na afairesw to artho apo tin antisoixh kathgoria
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError("Somewithg went wrong", 500);
    return next(error);
  }

  if (foundArticle) {
    res.json({ message: "Successfully deleted the article with this id." });
  } else {
    res.json({ message: "article with this id doesn't exist" });
  }
};

exports.getAllArticles = getAllArticles;
exports.createArticle = createArticle;
exports.getArticleById = getArticleById;
exports.updateArticle = updateArticle;
exports.deleteArticleById = deleteArticleById;
