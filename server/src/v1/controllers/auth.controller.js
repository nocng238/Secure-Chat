const { StatusCodes } = require('http-status-codes');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const { BadRequestError } = require('../errors/bad-request');
const User = require('../models/user.model');

var that = (module.exports = {
  register: async (req, res, next) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please provide all values' });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Invalid Email' });
    }

    const isUserExists = await User.findOne({ email: email });
    if (isUserExists) {
      res.status(400).json({ message: 'User with this Email Already Exists' });
    }

    //hashing password
    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashPassword,
    });

    if (user) {
      const token = jwt.sign(
        {
          userId: user._id,
          username: user.username,
          userEmail: user.email,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_LIFETIME,
        }
      );

      res.status(200).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        token,
      });
    }
  },
  login: async (req, res) => {
    const { username, email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Please Provide All the Values' });
    }

    const isUser = await User.findOne({
      $or: [{ email: email }, { username: username }],
    });

    if (!isUser) {
      res.status(400).json({ message: 'Invalid Credentials' });
    } else {
      //compare password
      const comparePassword = await bcrypt.compare(password, isUser.password);

      if (!comparePassword) {
        res.status(400).json({
          message: 'Please Make Sure You have entered Correct Password!',
        });
      }

      const token = jwt.sign(
        {
          userId: isUser._id,
          username: isUser.username,
          userEmail: isUser.email,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_LIFETIME,
        }
      );

      res.status(200).json({
        _id: isUser._id,
        username: isUser.username,
        email: isUser.email,
        avatar: isUser.avatar,
        token,
      });
    }
  },
  searchUser: async (req, res) => {
    const { search } = req.query;

    if (!search) {
      res.status(200).json([]);
    } else {
      const user = await User.find({
        username: { $regex: search, $options: 'i' },
        _id: { $ne: req.user.id },
      }).select('username avatar _id email bio');

      res.status(200).json(user);
    }
  },
});
