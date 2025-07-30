const checkRole = (requiredRole) => {
  return (req, res, next) => {
    if (req.userRole !== requiredRole) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};

export default checkRole;
