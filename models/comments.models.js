const db = require("./../db/connection.js");
const { checkArticleExists } = require("../utils/utilsForAPI.js");

exports.fetchCommentsByArticleId = (article_id) => {
  return checkArticleExists(article_id).then(() => {
    return db
      .query(
        `
      SELECT * FROM comments
      WHERE article_id = $1
      ORDER BY created_at DESC;
      `,
        [article_id]
      )
      .then((result) => {
        return result.rows;
      });
  });
};
