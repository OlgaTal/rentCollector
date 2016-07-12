/* eslint-disable newline-per-chained-call, new-cap, no-param-reassign, consistent-return, no-underscore-dangle, array-callback-return, max-len */

import express from 'express';
import Apartment from '../models/apartment';
import Renter from '../models/renter';
import bodyValidator from '../validators/apartments/body';
import queryValidator from '../validators/apartments/query';
// import paramsValidator from '../validators/bookmarks/params';
const router = module.exports = express.Router();

// create
router.post('/', bodyValidator, (req, res) => {
  Apartment.create(res.locals, (err, apartment) => {
    res.send({ apartment });
  });
});

// get
router.get('/', queryValidator, (req, res) => {
  Apartment.find(res.locals.filter2)
  //       .sort(res.locals.sort)
  //       .limit(res.locals.limit)
  //       .skip(res.locals.skip)
        .exec((err, apartments) => {
          res.send({ apartments });
        });
});

// get
router.get('/:id', (req, res) => {
  Apartment.findById(req.params.id, (err, apartment) => {
    if (apartment) {
      res.send({ apartment });
    } else {
      res.status(400).send({ messages: ['id not found'] });
    }
  });
});


// update
router.put('/:id', bodyValidator, (req, res) => {
  Apartment.findByIdAndUpdate(req.params.id, res.locals, { new: true }, (err, apartment) => {
    if (apartment) {
      res.send({ apartment });
    } else {
      res.status(400).send({ messages: ['id not found'] });
    }
  });
});

// delete
router.delete('/:id', (req, res) => {
  Apartment.findByIdAndRemove(req.params.id, (err, apartment) => {
    if (apartment) {
      res.send({ apartment });
    } else {
      res.status(400).send({ messages: ['id not found'] });
    }
  });
});

// lease
router.put('/:id/lease', (req, res) => {
  Apartment.findById(req.params.id, (err, apartment) => {
    Renter.findById(req.body.renter, (err2, renter) => {
      if (renter) {
        apartment.lease(renter, (apartment2) => {
          res.send({ apartment: apartment2 });
        });
      } else {
        res.status(400).send({ messages: ['renter is not found'] });
      }
    });
  });
});
