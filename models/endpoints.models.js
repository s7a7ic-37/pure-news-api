const fs = require("fs/promises");

exports.fetchAllEndpoints = () => {
  return fs.readFile(`${__dirname}/../endpoints.json`, "utf-8").then((data) => {
    const parsedData = JSON.parse(data);
    return parsedData;
  });
};
