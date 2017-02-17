const requestDescriber = require('mocha-request-describer');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const assert = require('assert');

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

describe('mocha-request-describer', () => {
  let req;

  // use function expression!
  beforeEach(function () {
    req = requestDescriber.makeRequest(app, this.currentTest);
  });

  // use the syntax of URI Template (https://tools.ietf.org/html/rfc6570)
  // for describing a request
  describe('GET /{path1}/{path2}{?param}', () => {
    it('makes request with query', () => {
      // makes request `GET /foo/bar?param=value`
      return req({ path1: 'foo', path2: 'bar', param: 'value' })
        // you can use supertest API (https://github.com/visionmedia/supertest#api)
        .expect(200)
        .then((res) => {
          assert(res.body.method === 'GET');
          assert(res.body.path === '/foo/bar');
          assert(res.body.query.param === 'value');
        });
    });
  });

  describe('POST /{path1}/{path2}{?param}', () => {
    it('makes request with query', () => {
      return req({ path1: 'foo', path2: 'bar', param: 'value' }, { 'aaa': 'bbb' })
        .expect(200)
        .then((res) => {
          assert(res.body.method === 'POST');
          assert(res.body.path === '/foo/bar');
          assert(res.body.query.param === 'value');
          assert(res.body.data.aaa === 'bbb');
        });
    });
  });
});