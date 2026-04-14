// Placeholder for role-based access control
module.exports = (...roles) => {
  return (req, res, next) => {
    next();
  };
};