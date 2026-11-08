exports.errorHandler = (err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).send({ message: "Request body must be valid JSON." });
  }
  if (err.type === "entity.too.large") {
    return res.status(413).send({ message: "Request body is too large." });
  }
  if (Number.isInteger(err.status) && err.status >= 400 && err.status < 500 && err.message) {
    return res.status(err.status).send({ message: err.message });
  }
  if (err.code === "22P02" || err.code === "22003") {
    return res.status(400).send({ message: "Bad request." });
  }
  if (err.code === "23503" && err.constraint === "comments_author_fkey") {
    return res
      .status(404)
      .send({ message: "User with provided username is not found" });
  }
  const code = typeof err.code === "string" && /^[A-Z0-9_]{1,32}$/.test(err.code)
    ? err.code
    : "UNKNOWN";
  console.error("Unhandled API error", { code });
  const status = Number.isInteger(err.status) && err.status >= 500 && err.status <= 599 ? err.status : 500;
  return res.status(status).send({ message: "Internal Server Error" });
};
