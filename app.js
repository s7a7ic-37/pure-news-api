const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const { errorHandler } = require("./errors/errors");

app = express();

app.get("/api/topics", getTopics);

app.use(errorHandler);

module.exports = app;
