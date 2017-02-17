const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const echo = (req, res) => {
  res
    .status(200)
    .json({
      method: req.method,
      query: req.query,
      path: req.path,
      data: req.body
    });
};

app.use(bodyParser.json());
app.get('/foo/bar', echo);
app.post('/foo/bar', echo);

module.exports = app;
