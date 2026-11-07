jest.mock("../db/connection.js", () => ({ query: jest.fn() }));
jest.mock("../utils/utilsForAPI.js", () => ({ checkArticleExists: jest.fn() }));

const db = require("../db/connection.js");
const { checkArticleExists } = require("../utils/utilsForAPI.js");
const { addComment } = require("../models/comments.models.js");

it("does not attempt a comment insert when its article does not exist", async () => {
  const missing = { status: 404, message: "No articles has been found with id of 997" };
  checkArticleExists.mockRejectedValue(missing);
  db.query.mockResolvedValue({ rows: [] });

  await expect(addComment(997, "rogersop", "A fictional comment."))
    .rejects.toEqual(missing);
  expect(db.query).not.toHaveBeenCalled();
});
