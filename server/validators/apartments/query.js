/* eslint-disable consistent-return, no-param-reassign */

import joi from 'joi';

const schema = {
  filter: joi.object().keys({
    // floor: joi.number().default(1),
    bedrooms: joi.number(),
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

    if (result.value.filter) {
      const filter2 = {};
      if (result.value.filter.isVacant || result.value.filter.isVacant === false) {
        filter2.renter = result.value.filter.isVacant ?
            { $exists: false } : { $ne: null };
      }
      filter2.sqft = { $gte: res.locals.filter.sqft };

      if (res.locals.filter.bedrooms > 0) {
        filter2.bedrooms = res.locals.filter.bedrooms;
      }

      res.locals.filter2 = filter2;
    } else {
      res.locals.filter2 = null;
    }

    console.log('filter2:', res.locals.filter2);

    next();
  }
};
