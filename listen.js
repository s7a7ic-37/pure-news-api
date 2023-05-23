const app = require("./app.js");
const { PORT = 9727 } = process.env;

app.listen(PORT, () => console.log(`Listening on ${PORT}...`));
