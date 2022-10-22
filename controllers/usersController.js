const User = require("../models/User");
const Note = require("../models/Note");

const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

// @desc Get all users
// @route Get /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").lean(); // select('-password') permet de dire à mongo de ne pas renvoyer le mot de passe
  if (!users) {
    return res.status(400).json({ message: "No users found" });
  }

  res.json(users); // TODO : ajouter un return ?
});

// @desc Create a new User
// @route POST /users
// @access Private
const createNewUser = asyncHandler(async (req, res) => {
  const { username, password, roles } = req.body;

  // Confirm data
  if (!username || !password || !Array.isArray(roles) || !roles.length) {
    return res.status(400).json({ message: "All fields are required !" });
  }

  // Check for duplicate
  const duplicate = await User.findOne({ username }).lean().exec();
  if (duplicate) {
    return res.status(409).json({ message: "Duplicate username" });
  }

  // Hash password
  const hashedPwd = await bcrypt.hash(password, 10);
  const userInfos = { username, password: hashedPwd, roles };

  const user = await User.create(userInfos);

  if (user) {
    res.status(201).json({ message: `New user ${username} created` });
  } else {
    res.status(400).json({ message: "Invalid user date received" });
  }
});

// @desc Update a  User
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {
  const { id, username, roles, active, password } = req.body;

  // Confirm Date
  if (
    !id ||
    !username ||
    !password ||
    !Array.isArray(roles) ||
    !roles.length ||
    typeof active !== "boolean"
  ) {
    return res.status(400).json({ message: "All fields are required !" });
  }

  const user = await User.findById(id).exec();

  if (!user) {
    res.status(400).json({ message: "User not found" });
  }

  //Duplicate
  const duplicate = await User.findOne({ username }).lean().exec();
  // Allow update
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate username" });
  }

  // Update
  user.username = username;
  user.roles = roles;
  user.active = active;

  if (password) {
    // Hash password
    user.password = await bcrypt.hash(password, 10);
  }
  const updatedUser = await user.save();
  res.json({ message: `${updateUser.username} updated` });
});

// @desc Delete a new User
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: "User id required" });
  }

  const notes = await Note.findOne({ user: id }).lean().exec();
  if (notes?.length) {
    return res.status(400).json({ message: "User has assigned notes" });
  }

  const user = await User.findById(id).exec();
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const result = await user.deleteOne();

  res.json({
    message: `Username ${result.username} with id ${result.id} deleted !`,
  });
});

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
};
