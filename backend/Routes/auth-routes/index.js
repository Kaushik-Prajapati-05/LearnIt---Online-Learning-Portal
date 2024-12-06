const express = require("express");
const loginUser = require("../../controllers/loginUser");
const {registerUser,updateuser} = require("../../controllers/registerUser");
const authenticateMiddleware = require("../../middleware/authentication");
const authenticate=require("../../middleware/authentication")
const router = express.Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/update/:id", updateuser);
router.post("/authRole", authenticate, (req, res) => {
  const user = req.user;

  


  res.status(200).json({
    success: true,
    message: "Authenticated user!",
    data: {
      user,
    },
  });
});
router.get("/check-auth", authenticateMiddleware, (req, res) => {
  const user = req.user;


  res.status(200).json({
    success: true,
    message: "Authenticated user!",
    data: {
      user,
    },
  });
});

module.exports = router;