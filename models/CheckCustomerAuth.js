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
