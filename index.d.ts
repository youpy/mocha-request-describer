/// <reference types="supertest" />
/// <reference types="node" />
/// <reference types="express" />
/// <reference types="mocha" />
import * as express from 'express';
import * as http from 'http';
import * as st from 'supertest';
import * as mocha from 'mocha';
export declare type makeRequestFn = (params?: Object, data?: Object) => st.Test;
export declare function makeRequest(serverOrApp: http.Server | express.Application, test: mocha.ISuite): makeRequestFn;
