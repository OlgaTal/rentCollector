/* eslint-disable consistent-return, no-param-reassign */

import joi from 'joi';

const schema = {
  filter: joi.object().keys({
    // floor: joi.number().default(1),
    // bedrooms: joi.number().default(1),
    isVacant: joi.boolean(),
    sqft: joi.number().default(0),
  }),
  sort: joi.object(),
};

module.exports = (req, res, next) => {
  const result = joi.validate(req.query, schema);

  if (result.error) {
    res.status(400).send({ messages: result.error.details.map(d => d.message) });
  } else {
    res.locals = result.value;

    // it's not a good thing to do, but let's modify the filter:
    if (result.value.filter) {
      if (result.value.filter.isVacant || result.value.filter.isVacant === false) {
        res.locals.filter.renter = result.value.filter.isVacant ?
            { $exists: false } : { $ne: null };
        delete result.value.filter.isVacant;
      }

      res.locals.filter.sqft = { $gte: res.locals.filter.sqft };
    }

    next();
  }
};
