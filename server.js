const express = require("express");
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3500;

app.use('/',express.static(path.join(__dirname,'/public')));

// app.get("/", (req, res) => {
//   res.send("Hello world");
// });

app.listen(PORT, () =>
  console.log(`Server running on port: http://localhost:${PORT}`)
);
