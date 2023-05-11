const testData = require("./../db/data/test-data/index.js");
const seed = require("./../db/seeds/seed.js");
const db = require("./../db/connection.js");
const { checkArticleExists } = require("../utils/utilsForAPI");

beforeEach(() => {
  return seed(testData);
});

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

  test("should return a resolved promise if article exists", () => {
    return checkArticleExists(1).then((result) => {
      const article = result.rows;
      expect(article.length).toBe(1);
    });
  });
});
