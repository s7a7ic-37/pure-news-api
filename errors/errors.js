exports.errorHandler = (err, req, res, next) => {
  if (err.status && err.message) {
    res.status(err.status).send({ message: err.message });
  }
  if (err.code === "22P02") {
    res.status(400).send({ message: "Bad request." });
  }
  if (err.code === "23503" && err.constraint === "comments_author_fkey") {
    res
      .status(404)
      .send({ message: "User with provided username is not found" });
  }
  res.status(500).send({ message: "Internal Server Error" });
};
