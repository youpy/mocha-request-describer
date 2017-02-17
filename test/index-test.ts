import * as assert from 'power-assert';
import * as http from 'http';
import { makeRequestFn, makeRequest } from '../src/';
import * as express from 'express';
import * as bodyParser from 'body-parser';

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
  let req: makeRequestFn;

  const sharedExamples = () => {
    describe('GET /foo', () => {
      it('makes request from description', async () => {
        const res = await req()
          .expect(200);

        assert(res.body.path === '/foo');
      });
    });

    describe('GET /{path}{?param}', () => {
      describe('200', () => {
        it('makes request with query', async () => {
          const res = await req({ path: 'foo', param: 'value' })
            .expect(200);

          assert(res.body.method === 'GET');
          assert(res.body.path === '/foo');
          assert(res.body.query.param === 'value');
        });

        it('makes request without query', async () => {
          const res = await req({ path: 'foo' })
            .expect(200);

          assert(res.body.method === 'GET');
          assert(res.body.path === '/foo');
          assert(Object.keys(res.body.query).length === 0);
        });
      });

      describe('404', () => {
        it('returns 404', async () => {
          await req({ path: 'bar' })
            .expect(404);
        });
      });
    });

    describe('POST /bar', () => {
      it('makes request with request body', async () => {
        const res = await req({}, { 'prop': 'value' })
          .expect(200);

        assert(res.body.method === 'POST');
        assert(res.body.path === '/bar');
        assert(res.body.data.prop === 'value');
      });
    });

    describe('no request description', () => {
      it('throws error', async () => {
        try {
          await req();

          assert(false);
        } catch (e) {
          assert(e.message === 'request description not found');
        }
      });
    });
  };

  describe('make request from an instance of http.Server', () => {
    beforeEach(function () {
      server = app.listen(10081);
      req = makeRequest(server, this.currentTest);
    });

    afterEach(() => {
      server.close();
    });

    sharedExamples();
  });

  describe('make request from an instance of express.Application', () => {
    beforeEach(function () {
      req = makeRequest(app, this.currentTest);
    });

    sharedExamples();
  });
});
