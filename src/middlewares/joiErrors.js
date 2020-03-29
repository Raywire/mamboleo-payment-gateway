import { isCelebrate } from 'celebrate';
import * as statusCodes from '../constants/statusCodes';

const joiErrors = (err, req, res, next) => {
  if (!isCelebrate(err)) {
    req.joiError = false;
    return next(err);
  }

  return res.status(statusCodes.UNPROCESSABLE_ENTITY).json({
    statusCode: statusCodes.UNPROCESSABLE_ENTITY,
    success: false,
    errors: err.joi.details.map(detail => ({ [detail.context.key]: detail.message.replace(/"/g, '') }))
  });
};

export default joiErrors;