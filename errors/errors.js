exports.errorHandler = (err, req, res, next) => {
  if (err.status === 404) {
    res.status(err.status).send({ message: err.message });
  }
};
