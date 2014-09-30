'use strict';

var expect = require('chai').expect;
var request = require('supertest');

var app = require('./../../src/app');

describe('Todos controller', function () {
    describe('GET /todos', function () {
        it('responds with success', function (done) {
            request(app)
                .get('/todos')
                .end(function (err, res) {
                    expect(res.status).to.equal(200);
                    expect(res.body.length).to.equal(2);
                    done();
                });
        });
    });

    // or
    describe('GET /todos/1', function () {
        it('responds with success', function (done) {
            request(app)
                .get('/todos/1')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, done);
        });
    });
});
