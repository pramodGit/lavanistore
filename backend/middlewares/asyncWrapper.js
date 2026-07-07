// backend/middlewares/asyncWrapper.js

const asyncWrapper = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next); // all errors go to errorMiddleware
};

export default asyncWrapper;