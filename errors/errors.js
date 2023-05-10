exports.errorHandler = (err, req, res, next) => {
  if (err.status === 404) {
    res.status(err.status).send({ message: err.message });
  }
  res.status(500).send({ message: "Internal Server Error" });
};
