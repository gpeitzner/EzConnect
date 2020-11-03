const users = require("./routes/user.router");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const port = 3000;
const app = express();

app.use(bodyParser.json({ limit: "10mb", extended: true }));
app.use(cors());
app.use(morgan("combined"));

app.use("/users", users);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}/`);
});
