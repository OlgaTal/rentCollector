/* eslint-disable no-unused-expressions, no-underscore-dangle, max-len */

const expect = require('chai').expect;
const request = require('supertest');
const app = require('../../dst/server');
const cp = require('child_process');
// const Apartment = require('../../dst/models/apartment');


describe('apartments', () => {
  beforeEach((done) => {
    cp.execFile(`${__dirname}/../scripts/populate.sh`, { cwd: `${__dirname}/../scripts` }, () => {
      done();
    });
  });

  describe('post /apartments', () => {
    it('should create a apartment', (done) => {
      request(app)
      .post('/apartments')
      .send({ name: 'a1', sqft: 1200, bedrooms: 4, floor: 4, rent: 2500 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.apartment.__v).to.not.be.null;
        expect(rsp.body.apartment._id).to.not.be.null;
        expect(rsp.body.apartment.name).to.equal('a1');
        done();
      });
    });
    it('should not create an apartment: no name', (done) => {
      request(app)
      .post('/apartments')
      .send({ sqft: 1200, bedrooms: 4, floor: 4, rent: 2500 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal(['"name" is required']);
        done();
      });
    });
  });
  describe('get /apartments', () => {
    it('should return apartments', (done) => {
      request(app)
      .get('/apartments')
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.apartments).to.not.be.null;
        expect(rsp.body.apartments).to.have.length.above(0);
        done();
      });
    });

    // it('should filter apartments by floor, square feet and isVacant', (done) => {
    it('should filter apartments by isVacant', (done) => {
      request(app)
      .get('/apartments?filter[isVacant]=true')
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.apartments).to.have.length(3);
        done();
      });
    });
    it('should filter apartments by isVacant = false', (done) => {
      request(app)
      .get('/apartments?filter[isVacant]=false')
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.apartments).to.have.length(2);
        done();
      });
    });
    it('should filter apartments by sqft >= 1200', (done) => {
      request(app)
      .get('/apartments?filter[sqft]=1200')
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.apartments).to.have.length(4);
        done();
      });
    });
    it('should filter apartments by number of bedrooms = 3', (done) => {
      request(app)
      .get('/apartments?filter[bedrooms]=3')
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.apartments).to.have.length(1);
        done();
      });
    });
  });

  describe('get /apartments/:id', () => {
    it('should return an apartment', (done) => {
      request(app)
      .get('/apartments/012345678901234567890012')
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.apartment).to.not.be.null;
        expect(rsp.body.apartment.name).to.equal('a2');
        expect(rsp.body.apartment.sqft).to.equal(1200);
        expect(rsp.body.apartment.floor).to.equal(2);
        done();
      });
    });
    it('should NOT return an apartment: id does not exist', (done) => {
      request(app)
      .get('/apartments/0123456789012345678900AA')
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal(['id not found']);
        done();
      });
    });
  });

  describe('put /apartments/:id', () => {
    it('should update an apartment', (done) => {
      request(app)
      .put('/apartments/012345678901234567890012')
      .send({ name: 'new a1', sqft: 2200, bedrooms: 6, floor: 14, rent: 3500 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.apartment.name).to.equal('new a1');
        expect(rsp.body.apartment.sqft).to.equal(2200);
        expect(rsp.body.apartment.floor).to.equal(14);
        done();
      });
    });
    it('should NOT update an apartment: id does not exist', (done) => {
      request(app)
      .put('/apartments/0123456789012345678900AA')
      .send({ name: 'new a1', sqft: 2200, bedrooms: 6, floor: 14, rent: 3500 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal(['id not found']);
        done();
      });
    });
  });

  describe('delete /apartments/:id', () => {
    it('should delete an apartment', (done) => {
      request(app)
      .delete('/apartments/012345678901234567890012')
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.apartment._id).to.equal('012345678901234567890012');
        done();
      });
    });
    it('should NOT delete an apartment: id does not exist', (done) => {
      request(app)
      .delete('/apartments/0123456789012345678900AA')
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal(['id not found']);
        done();
      });
    });
  });

  describe('put /apartments/:id/lease', () => {
    it('should lease a apartment', (done) => {
      request(app)
      .put('/apartments/012345678901234567890012/lease')
      .send({ renter: 'a12345678901234567890012' })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.apartment._id).to.not.be.null;
        expect(rsp.body.apartment.name).to.equal('a2');
        expect(rsp.body.apartment.renter).to.equal('a12345678901234567890012');
        expect(rsp.body.apartment._id).to.equal('012345678901234567890012');
        done();
      });
    });
    it('should not lease an apartment: no renter id', (done) => {
      request(app)
      .put('/apartments/012345678901234567890012/lease')
      .send({ renter: 'a123456789012345678900aa' })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal(['renter is not found']);
        done();
      });
    });
  });
});
