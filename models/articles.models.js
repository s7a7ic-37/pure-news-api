const {
  checkArticleExists,
  checkTopicExists,
} = require("../utils/utilsForAPI.js");
const db = require("./../db/connection.js");

exports.fetchArticleById = (article_id) => {
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
          message: "No articles has been found.",
        });
      }
      return result.rows[0];
    });
  };
  
  exports.fetchAllArticles = (topic, sort_by = "created_at", order = "desc") => {
  const orderList = ["asc", "desc"];
  const sortByList = [
    "title",
    "topic",
    "author",
    "body",
    "created_at",
    "votes",
    "comment_count",
  ];

  if (!sortByList.includes(sort_by)) {
    return Promise.reject({ status: 400, message: "Bad 'sort_by' query" });
  }
  
  if (!orderList.includes(order)) {
    return Promise.reject({ status: 400, message: "Bad 'order' query" });
  }

  const queryValues = [];

  let queryString = `
  SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, 
  CAST(COUNT(comments.article_id) AS INTEGER) AS comment_count
  FROM articles
  LEFT JOIN comments ON comments.article_id = articles.article_id
  `;

  if (topic) {
    queryString += ` WHERE articles.topic = $1`;
    queryValues.push(topic);
  }

  queryString += ` GROUP BY articles.article_id`;
  queryString += ` ORDER BY ${sort_by} ${order}`;
  queryString += `;`;

  return checkTopicExists(topic)
    .then(() => {
      return db.query(queryString, queryValues);
    })
    .then((result) => {
      return result.rows;
    });
};

exports.updateArticleVotesById = (article_id, newVote) => {
  if (typeof newVote !== "number") {
    return Promise.reject({ status: 400, message: "Bad request." });
  }

  const queryString = `
    UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *;
    `;

  const queryValues = [newVote, article_id];

  const promises = [
    checkArticleExists(article_id),
    db.query(queryString, queryValues),
  ];

  return Promise.all(promises).then((result) => {
    return result[1].rows[0];
  });
};
