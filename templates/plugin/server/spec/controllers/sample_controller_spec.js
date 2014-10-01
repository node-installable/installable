'use strict';

var expect = require('chai').expect;
var request = require('supertest');

var express = require('express');
var app = express();
var router = express.Router();
var routes = require('./../../src/config/routes');
routes(router);

app.use('/', router);

describe('Sample controller', function () {
    describe('GET /sample', function () {
        it('responds with success', function (done) {
            request(app)
                .get('/sample')
                .end(function (err, res) {
                    expect(res.status).to.equal(200);
                    expect(res.body.hello).to.equal('sample response');
                    done();
                });
        });
    });
});
