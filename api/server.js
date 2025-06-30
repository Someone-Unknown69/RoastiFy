const express = require('express')
const app = express()
const fs = require('fs')

app.use(express.static("public"));

app.listen(3000, () => {
  console.log("Server running on http://127.0.0.1:3000");
});