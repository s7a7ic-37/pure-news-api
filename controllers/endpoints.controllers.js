const { fetchAllEndpoints } = require("../models/endpoints.models.js");

exports.getAllEndpoints = (req, res, next) => {
  fetchAllEndpoints()
    .then((availableEndpoints) => {
      res.status(200).send(availableEndpoints);
    })
    .catch((err) => {
      next(err);
    });
};
