// import jwt from "jsonwebtoken";

// const checkCustomerAuth = (req, res, next) => {
//   try {
//     const token = req.headers.authorization?.split(" ")[1];
//     if (!token) return res.status(401).json({ message: "Auth failed." });

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.customerId = decoded.customerId;
//     next();
//   } catch (err) {
//     res.status(401).json({ message: "Customer authentication failed." });
//   }
// };

// export default checkCustomerAuth;
// middleware/checkAuth.js
import jwt from "jsonwebtoken";
import Customer from "./Customer.js";

const checkCustomerAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // check secret!
    req.customerId = decoded.customerId;

    // Optional: Fetch user and attach to request
    const customer = await Customer.findById(req.customerId).select(
      "-password"
    );
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    req.customer = customer;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Auth failed." });
  }
};

export default checkCustomerAuth;
