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

exports.checkTopicExists = (topic) => {
  const queryString = "SELECT * FROM topics WHERE slug = $1";
  const queryValues = [topic];
  return db.query(queryString, queryValues).then((result) => {
    if (result.rows.length === 0 && topic) {
      return Promise.reject({
        status: 400,
        message: "No articles has been found with selected topic",
      });
    }
    return result;
  });
};
