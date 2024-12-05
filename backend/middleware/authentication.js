const jwt = require("jsonwebtoken");
const User = require("../models/User");

const verifyToken = (token, secretKey) => {
  const x = jwt.verify(token, secretKey);
  // console.log(x);
  return x;
};

const authenticate = async (req, res, next) => {
  console.log("Hellloo");
  const authHeader = req.headers.authorization;
  console.log(authHeader, "authHeader");

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "User is not authenticated",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = verifyToken(token, "JWT_SECRET");

    // console.log("Hello");

    const user = await User.findById(payload._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = payload;

    // console.log(user);

    if(user.role === payload.role)
    next();

    else{
      return res.status(404).json({
        success: false,
        message: "User unauthorized",
      });
    }
  } catch (e) {
    return res.status(401).json({
      success: false,
      message: "invalid token",
      error: e,
    });
  }
};

module.exports = authenticate;
