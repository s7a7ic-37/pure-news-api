const {
  fetchArticleById,
  fetchAllArticles,
  updateArticleVotesById,
} = require("../models/articles.models");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAllArticles = (req, res, next) => {
  const { topic, sort_by, order, limit, p, q } = req.query;
  fetchAllArticles(topic, sort_by, order, limit, p, q)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleVotesById = (req, res, next) => {
  const { article_id } = req.params;
  const newVote = req.body.inc_votes;
  const inputData = { newVote };
  updateArticleVotesById(article_id, inputData.newVote)
    .then((updatedArticle) => {
      res.status(200).send({ article: updatedArticle });
    })
    .catch((err) => {
      next(err);
    });
};
