const express = require("express");

const categories = require("../controllers/categories");

const router = express.Router();

router.post("/", categories.createCategory);

router.get("/", categories.getAllCategories);

router.delete("/:cid", categories.deleteCategoryByName);

module.exports = router;
