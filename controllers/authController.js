const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

// @desc Login
// @route POST /auth
// @access public
const login = asyncHandler(async (req, res) => {});

// @desc Refresh
// @route Get /auth/refresh
// @access public - because access token has expired
const refresh = (req, res) => {};

// @desc Logout
// @route POST /auth/logout
// @access public for it allows to clear the cookie if exists(clear token infos)
const logout = (req, res) => {};

module.exports = {
  login,
  refresh,
  logout,
};
