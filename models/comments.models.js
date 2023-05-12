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

exports.addComment = (article_id, username, body) => {
  if (!body) {
    return Promise.reject({
      status: 400,
      message: "Your comment cannot be empty!",
    });
  }

  const queryString = `
  INSERT INTO comments (article_id, author, body)
  VALUES ($1, $2, $3)
  RETURNING *
  `;
  const queryValues = [article_id, username, body];

  const promises = [
    checkArticleExists(article_id),
    db.query(queryString, queryValues),
  ];

  return Promise.all(promises).then((result) => {
    return result[1].rows;
  });
};
