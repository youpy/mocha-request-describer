# mocha-request-describer [![Build Status](https://travis-ci.org/youpy/mocha-request-describer.svg?branch=master)](https://travis-ci.org/youpy/mocha-request-describer)

Inspired by [r7kamura](https://github.com/r7kamura)'s [rspec-request_describer](https://github.com/r7kamura/rspec-request_describer)

## Usage

```javascript
import { makeRequest } from 'mocha-request-describer';

describe('GET /foo/{path}{?param}', () => {
  const app = express();
  let req;

  // use function expression!
  beforeEach(function () {
    req = makeRequest(app, this.currentTest);
  });

  // async/await
  it('makes request with query', async () => {
    // makes request `GET /foo/bar?param=value`
    const res = await req({ path: 'bar', param: 'value' })
      // you can use supertest API
      .expect(200);

    assert(res.body.method === 'GET');
  });

  // promise
  it('makes request with query', () => {
    return req({ path: 'bar', param: 'value' })
      .expect(200)
      .then((res) => {
        assert(res.body.method === 'GET');
      });
  });
});
```
