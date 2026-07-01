exports.errorHandler = (err, req, res, next) => {
  if (err.status && err.message) {
    return res.status(err.status).send({ message: err.message });
  }
  if (err.code === "22P02") {
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
  return res.status(500).send({ message: "Internal Server Error" });
};
