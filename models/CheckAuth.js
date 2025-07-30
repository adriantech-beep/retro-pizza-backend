import jwt from "jsonwebtoken";

const checkAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Auth failed." });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.adminId = decoded.adminId;
    req.userRole = decoded.role;
    next();
  } catch (err) {
    res.status(401).json({ message: "Authentication failed." });
  }
};

export default checkAuth;
