import * as assert from 'power-assert';
import * as http from 'http';
import { makeRequest } from '../src/';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as superagent from 'superagent';

const app = express();
const echo = (req: express.Request, res: express.Response) => {
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
app.get('/foo', echo);
app.post('/bar', echo);

describe('mocha-request-describer', () => {
  let server: http.Server;
  let req: (params: Object, data: Object) => Promise<superagent.Response>;

  const sharedExamples = () => {
    describe('GET /foo', () => {
      it('makes request from description', async function () {
        const res = await req.call(this)
          .expect(200);

        assert(res.body.path === '/foo');
      });
    });

    describe('GET /{path}{?param}', () => {
      describe('200', () => {
        it('makes request with query', async function () {
          const res = await req.call(this, { path: 'foo', param: 'value' })
            .expect(200);

          assert(res.body.method === 'GET');
          assert(res.body.path === '/foo');
          assert(res.body.query.param === 'value');
        });

        it('makes request without query', async function () {
          const res = await req.call(this, { path: 'foo' })
            .expect(200);

          assert(res.body.method === 'GET');
          assert(res.body.path === '/foo');
          assert(Object.keys(res.body.query).length === 0);
        });
      });

      describe('404', () => {
        it('returns 404', async function () {
          await req.call(this, { path: 'bar' })
            .expect(404);
        });
      });
    });

    describe('POST /bar', () => {
      it('makes request with request body', async function () {
        const res = await req.call(this, {}, { 'prop': 'value' })
          .expect(200);

        assert(res.body.method === 'POST');
        assert(res.body.path === '/bar');
        assert(res.body.data.prop === 'value');
      });
    });

    describe('no request description', () => {
      it('throws error', async function () {
        try {
          await req.call(this);

          assert(false);
        } catch (e) {
          assert(e.message === 'request description not found');
        }
      });
    });
  };

  describe('make request from an instance of http.Server', () => {
    beforeEach(() => {
      server = app.listen(10081);
      req = makeRequest(server);
    });

    afterEach(() => {
      server.close();
    });

    sharedExamples();
  });

  describe('make request from an instance of express.Application', () => {
    before(() => {
      req = makeRequest(app);
    });

    sharedExamples();
  });
});
