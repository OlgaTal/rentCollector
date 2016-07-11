/* eslint-disable no-unused-expressions, no-underscore-dangle, max-len */

const expect = require('chai').expect;
const request = require('supertest');
const app = require('../../dst/server');
const cp = require('child_process');

describe('renters', () => {
  beforeEach((done) => {
    cp.execFile(`${__dirname}/../scripts/populate.sh`, { cwd: `${__dirname}/../scripts` }, () => {
      done();
    });
  });

  describe('post /renters', () => {
    it('should create a renter', (done) => {
      request(app)
      .post('/renters')
      .send({ name: 'rr1', money: 12000 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.renter.__v).to.not.be.null;
        expect(rsp.body.renter._id).to.not.be.null;
        expect(rsp.body.renter.name).to.equal('rr1');
        done();
      });
    });
    it('should not create a renter: no name', (done) => {
      request(app)
      .post('/renters')
      .send({ money: 1200 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal(['"name" is required']);
        done();
      });
    });
  });
  describe('get /renters', () => {
    it('should return renters', (done) => {
      request(app)
      .get('/renters')
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.renters).to.not.be.null;
        expect(rsp.body.renters).to.have.length.above(0);
        done();
      });
    });
  });

  describe('get /renters/:id', () => {
    it('should return a renter', (done) => {
      request(app)
      .get('/renters/a12345678901234567890012')
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.renter).to.not.be.null;
        expect(rsp.body.renter.name).to.equal('r2');
        expect(rsp.body.renter.money).to.equal(12000);
        done();
      });
    });
    it('should NOT return an renter: id does not exist', (done) => {
      request(app)
      .get('/renters/a123456789012345678900AA')
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal(['id not found']);
        done();
      });
    });
  });

  describe('put /renters/:id', () => {
    it('should update a renter', (done) => {
      request(app)
      .put('/renters/a12345678901234567890012')
      .send({ name: 'new r1', money: 22000 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.renter.name).to.equal('new r1');
        expect(rsp.body.renter.money).to.equal(22000);
        done();
      });
    });
    it('should NOT update an renter: id does not exist', (done) => {
      request(app)
      .put('/renters/a123456789012345678900AA')
      .send({ name: 'new a1', money: 22000 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal(['id not found']);
        done();
      });
    });
  });

  describe('delete /renters/:id', () => {
    it('should delete a renter', (done) => {
      request(app)
      .delete('/renters/a12345678901234567890012')
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.renter._id).to.equal('a12345678901234567890012');
        done();
      });
    });
    it('should NOT delete a renter: id does not exist', (done) => {
      request(app)
      .delete('/renters/a123456789012345678900AA')
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal(['id not found']);
        done();
      });
    });
  });

  describe('put /renters/:id/pay', () => {
    it('should pay for an apartment', (done) => {
      request(app)
      .put('/renters/a12345678901234567890003/pay')
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.renter._id).to.not.be.null;
        expect(rsp.body.renter.money).to.equal(13000);
        expect(rsp.body.apartment.collectedRent).to.equal(12000);
        done();
      });
    });
    it('should not lease an apartment: not enough money', (done) => {
      request(app)
      .put('/renters/a12345678901234567890002/pay')
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal(['not enough money']);
        done();
      });
    });
  });
});
