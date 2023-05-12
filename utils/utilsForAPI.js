const db = require("../db/connection");

exports.checkArticleExists = (article_id) => {
  return db
    .query(
      `
    SELECT * FROM articles
    WHERE article_id = $1;
    `,
      [article_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: `No articles has been found with id of ${article_id}`,
        });
      }

      return result;
    });
};

exports.checkUsernameExists = (username) => {
  return db
    .query(
      `
    SELECT * FROM users
    WHERE username = $1;
    `,
      [username]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: `No user has been found with username '${username}'`,
        });
      }

      return result;
    });
};
