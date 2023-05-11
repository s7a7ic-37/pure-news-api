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

exports.fetchAllArticles = () => {
  return db
    .query(
      `
  SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, 
  CAST(COUNT(comments.article_id) AS INTEGER) AS comment_count
  FROM articles
  LEFT JOIN comments ON comments.article_id = articles.article_id
  GROUP BY articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url
  ORDER BY articles.created_at DESC;
  `
    )
    .then((result) => {
      return result.rows;
    });
};
