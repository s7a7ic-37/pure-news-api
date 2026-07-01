const db = require("./../db/connection.js");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const {
  checkArticleExists,
  checkUsernameExists,
  checkTopicExists,
} = require("../utils/utilsForAPI");

beforeAll(() => seed(testData));
afterAll(() => db.end());

describe("checkArticleExists", () => {
  it("should return 404 error and a message if article does not exist", () => {
    return expect(checkArticleExists(998)).rejects.toMatchObject({
      status: 404,
      message: "No articles has been found with id of 998",
    });
  });

  it("should return a resolved promise if article exists", () => {
    return checkArticleExists(1).then((result) => {
      const article = result.rows;
      expect(article.length).toBe(1);
    });
  });
});

describe("checkUsernameExists", () => {
  it("should return 404 error and a message if username does not exist", () => {
    return expect(checkUsernameExists("username123")).rejects.toMatchObject({
      status: 404,
      message: "No user has been found with username 'username123'",
    });
  });

  it("should return a resolved promise if username exists", () => {
    return checkUsernameExists("rogersop").then((result) => {
      const username = result.rows;
      expect(username.length).toBe(1);
    });
  });
});

describe("checkTopicExists", () => {
  it("should return 400 error and a message if topic does not exist", () => {
    return expect(checkTopicExists("Topic123")).rejects.toMatchObject({
      status: 400,
      message: "No articles has been found with selected topic",
    });
  });

  it("should return a resolved promise if topic exists", () => {
    return checkTopicExists("mitch").then((result) => {
      const topic = result.rows;
      expect(topic.length).toBe(1);
    });
  });
});
