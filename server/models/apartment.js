/* eslint-disable func-names, no-param-reassign, consistent-return, no-underscore-dangle */

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const schema = new Schema({
  name: { type: String, required: true },
  sqft: { type: Number, required: true },
  bedrooms: { type: Number, required: true },
  floor: { type: Number, required: true },
  rent: { type: Number, required: true },
  dateCreated: { type: Date, default: Date.now },
  collectedRent: { type: Number, default: 0 },
  renter: { type: mongoose.Schema.ObjectId, ref: 'Renter' },
});

schema.methods.lease = function (renter, cb) {
  this.renter = renter._id;
  renter.apartment = this._id;
  this.save((err, apartment) => {
    renter.save(() => {
      cb(apartment);
    });
  });
};

module.exports = mongoose.model('Apartment', schema);
