import * as express from 'express';
import * as http from 'http';
import * as uriTemplates from 'uri-templates';
import * as superagent from 'superagent';

const supertest = require('supertest');

const supportedMethods = 'GET POST PUT PATCH DELETE'.split(' ');
const re = new RegExp(`(${supportedMethods.join('|')}) (\/[^\\s]+)$`);

export function makeRequest(serverOrApp: http.Server | express.Application): (params: Object, data: Object) => Promise<superagent.Response> {
  return function (params: Object = {}, data: Object = {}): Promise<superagent.Response> {
    let test = this.test;
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
