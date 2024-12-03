const generateToken = require("../middleware/generateToken");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const updateuser = async (req, res) => {
  console.log("reached updateUser")
  const { id } = req.params; // User ID should be in req.params
  const { userName, userEmail, password, role } = req.body; // Other fields are in req.body
  console.log(id)
  if (!id) {
    return res.status(400).json({ message: "User ID is required for update" });
  }

  try {
    // Find the user by ID
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check for uniqueness of userName and userEmail if they are being updated
    if (userName && userName !== user.userName) {
      const existingUserName = await User.findOne({ userName });
      if (existingUserName) {
        return res.status(400).json({ message: "Username is already taken" });
      }
    }

    if (userEmail && userEmail !== user.userEmail) {
      const existingUserEmail = await User.findOne({ userEmail });
      if (existingUserEmail) {
        return res.status(400).json({ message: "Email is already registered" });
      }
    }

    // Update user fields
    if (userName) user.userName = userName;
    if (userEmail) user.userEmail = userEmail;
    if (role) user.role = role;
    if (password) user.password = await bcrypt.hash(password, 10);

    // Save updated user
    await user.save();
    
    const data = {
      userName:userName,
      userEmail:userEmail,
      role:user.role,
      _id:user._id
    }
    // console.log()
    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: data,
      accessToken:generateToken(user._id)
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the user",
    });
  }
};



const registerUser = async (req, res) => {
  const { userName, userEmail, password, role } = req.body;

  const existingUser = await User.findOne({
    $or: [{ userEmail }, { userName }],
  });

  if (existingUser) {
    if (existingUser.userEmail === userEmail) {
      
      return res.status(400).json({ message: "Email is already registered" });
    } else if (existingUser.userName === userName) {
     
      return res.status(400).json({ message: "Username is already taken" });
    }
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    userName,
    userEmail,
    role,
    password: hashPassword,
  });

  await newUser.save();

  return res.status(201).json({
    success: true,
    message: "User registered successfully!",
  });
};

module.exports = {registerUser,updateuser};
