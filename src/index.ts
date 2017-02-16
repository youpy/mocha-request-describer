import * as express from 'express';
import * as http from 'http';
import * as uriTemplates from 'uri-templates';
import * as st from 'supertest';
import * as mocha from 'mocha';

const supertest = require('supertest');

const supportedMethods = 'GET POST PUT PATCH DELETE'.split(' ');
const re = new RegExp(`(${supportedMethods.join('|')}) (\/[^\\s]+)$`);

export function makeRequest(serverOrApp: http.Server | express.Application): (test: mocha.ISuite, params?: Object, data?: Object) => st.Test {
  return function (test: mocha.ISuite, params: Object = {}, data: Object = {}): st.Test {
    let matched;

    while (test) {
      if (matched = test.title.match(re)) {
        let method = matched[1];
        let path = matched[2];
        let tpl = uriTemplates(path);
        let req = supertest(serverOrApp)[method.toLowerCase()](tpl.fillFromObject(params));

        return req.send(data);
      } else {
        test = test.parent;
      }
    }

    throw new Error('request description not found');
  };
};
