const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const validateTokenHandler = asyncHandler(async(req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401);
    throw new Error("Unauthorized: No token provided");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded.user; 
    next();
  } catch (err) {
    res.status(401);
    throw new Error("Unauthorized: Invalid token");
  }
});

module.exports = validateTokenHandler;
