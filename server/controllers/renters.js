/* eslint-disable newline-per-chained-call, new-cap, no-param-reassign, consistent-return, no-underscore-dangle, array-callback-return, max-len */

import express from 'express';
import Renter from '../models/renter';
import Apartment from '../models/apartment';
import bodyValidator from '../validators/renters/body';
const router = module.exports = express.Router();

// create
router.post('/', bodyValidator, (req, res) => {
  Renter.create(res.locals, (err, renter) => {
    res.send({ renter });
  });
});

// get
router.get('/', (req, res) => {
  Renter.find((err, renters) => {
    res.send({ renters });
  });
});

// get
router.get('/:id', (req, res) => {
  Renter.findById(req.params.id, (err, renter) => {
    if (renter) {
      res.send({ renter });
    } else {
      res.status(400).send({ messages: ['id not found'] });
    }
  });
});


// update
router.put('/:id', bodyValidator, (req, res) => {
  Renter.findByIdAndUpdate(req.params.id, res.locals, { new: true }, (err, renter) => {
    if (renter) {
      res.send({ renter });
    } else {
      res.status(400).send({ messages: ['id not found'] });
    }
  });
});

// delete
router.delete('/:id', (req, res) => {
  Renter.findByIdAndRemove(req.params.id, (err, renter) => {
    if (renter) {
      res.send({ renter });
    } else {
      res.status(400).send({ messages: ['id not found'] });
    }
  });
});

// pay
router.put('/:id/pay', (req, res) => {
  Renter.findById(req.params.id, (err, renter) => {
    Apartment.findById(renter.apartment, (err2, apartment) => {
      renter.pay(apartment, (err3, renter2, apartment2) => {
        if (err3) {
          res.status(400).send({ messages: [err3.message] });
        } else {
          res.send({ renter: renter2, apartment: apartment2 });
        }
      });
    });
  });
});
