const db = require("./../db/connection.js");

exports.fetchAllUsers = () => {
  const queryString = "SELECT * FROM users";

  return db.query(queryString).then((result) => {
    return result.rows;
  });
};
