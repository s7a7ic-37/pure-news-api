const fs = require("fs/promises");

exports.getAllEndpoints = (req, res, next) => {
  return fs
    .readFile(`${__dirname}/../endpoints.json`, "utf-8")
    .then((endpointsData) => {
      const parsedData = JSON.parse(endpointsData);
      res.status(200).send(parsedData);
    })
    .catch((err) => {
      next(err);
    });
};
