const db = require("./../db/connection.js");
const {
  checkArticleExists,
  checkUsernameExists,
  checkTopicExists,
} = require("../utils/utilsForAPI");

afterAll(() => {
  db.end();
});

describe("checkArticleExists", () => {
  it("should return 404 error and a message if article does not exist", () => {
    return checkArticleExists(998).catch((err) => {
      expect(err.status).toBe(404);
      expect(err.message).toBe("No articles has been found with id of 998");
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
    return checkUsernameExists("username123").catch((err) => {
      expect(err.status).toBe(404);
      expect(err.message).toBe(
        "No user has been found with username 'username123'"
      );
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
  it("should return 404 error and a message if topic does not exist", () => {
    return checkTopicExists("Topic123").catch((err) => {
      expect(err.status).toBe(400);
      expect(err.message).toBe(
        "No articles has been found with selected topic"
      );
    });
  });

  it("should return a resolved promise if topic exists", () => {
    return checkTopicExists("mitch").then((result) => {
      const topic = result.rows;
      expect(topic.length).toBe(1);
    });
  });
});
