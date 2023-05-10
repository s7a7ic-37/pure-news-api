const express = require("express");
const { getTopics } = require("./controllers/topics.controllers.js");
const { errorHandler } = require("./errors/errors.js");
const { getAllEndpoints } = require("./controllers/endpoints.controllers.js");

app = express();

app.get("/api/topics", getTopics);

app.get("/api", getAllEndpoints);

app.use(errorHandler);

module.exports = app;
