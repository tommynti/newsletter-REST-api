const express = require("express");

const articles = require("../controllers/articles");

const router = express.Router();

router.post("/", articles.createArticle);

router.get("/id/:arid/:payload?", articles.getArticleById);

router.get("/:contents?/:category?", articles.getAllArticles); // problhma me to path - de blepei ta get sa 2 ksexwrista kai ektelei mono to prwto

router.patch("/id/:arid", articles.updateArticle);

router.delete("/id/:arid", articles.deleteArticleById);

module.exports = router;
