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
  
exports.fetchAllArticles = (topic, sort_by = "created_at", order = "desc", limit, p) => {
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

  const paginated = limit !== undefined || p !== undefined;
  const page = Number(p ?? "1");
  const pageSize = Number(limit ?? "12");
  if (paginated && (
    ![p ?? "1", limit ?? "12"].every((value) => typeof value === "string" && /^[1-9]\d*$/.test(value)) ||
    !Number.isSafeInteger(page) || page > 100000 ||
    !Number.isSafeInteger(pageSize) || pageSize > 100
  )) {
    return Promise.reject({ status: 400, message: "Use limit 1–100 and p 1–100000 as whole numbers." });
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

  const countValues = [...queryValues];

  queryString += ` GROUP BY articles.article_id`;
  queryString += ` ORDER BY ${sort_by} ${order}, articles.article_id ${order}`;
  if (paginated) {
    queryValues.push(pageSize, (page - 1) * pageSize);
    queryString += ` LIMIT $${queryValues.length - 1} OFFSET $${queryValues.length}`;
  }
  queryString += `;`;

  return checkTopicExists(topic)
    .then(() => {
      return Promise.all([
        db.query(queryString, queryValues),
        paginated
          ? db.query(`SELECT COUNT(*)::integer AS total_count FROM articles${topic ? " WHERE topic = $1" : ""}`, countValues)
          : null,
      ]);
    })
    .then(([result, count]) => {
      if (!paginated) return { articles: result.rows };
      return { articles: result.rows, total_count: count.rows[0].total_count, page, limit: pageSize };
    });
};

exports.updateArticleVotesById = (article_id, newVote) => {
  if (!Number.isSafeInteger(newVote)) {
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
