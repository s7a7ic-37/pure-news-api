const express = require("express");
const { errorHandler } = require("./errors/errors.js");
const { getTopics } = require("./controllers/topics.controllers.js");
const { getAllEndpoints } = require("./controllers/endpoints.controllers.js");
const {
  getArticleById,
  getAllArticles,
} = require("./controllers/articles.controllers.js");
const {
  getCommentsByArticleId,
} = require("./controllers/comments.controllers.js");

const app = express();

app.get("/api/topics", getTopics);

app.get("/api", getAllEndpoints);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.use(errorHandler);

module.exports = app;
