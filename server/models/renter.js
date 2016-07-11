/* eslint-disable func-names, no-param-reassign, consistent-return, no-underscore-dangle */

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const schema = new Schema({
  name: { type: String, required: true },
  money: { type: Number, required: true },
  apartment: { type: mongoose.Schema.ObjectId, ref: 'Apartment' },
});

schema.methods.pay = function (apt, cb) {
  if (this.money < apt.rent) return cb(new Error('not enough money'));
  this.money -= apt.rent;
  apt.collectedRent += apt.rent;
  this.save(() => {
    apt.save((err, apartment) => {
      cb(err, this, apartment);
    });
  });
};

module.exports = mongoose.model('Renter', schema);
