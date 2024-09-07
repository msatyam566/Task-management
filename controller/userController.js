const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const {userValidation, loginValidation} = require("../middleware/validator") 
const { generateAccessToken, generateRefreshToken } =require( "../functions/generateToken");
const Token = require("../models/RefreshToken.model")
const config = require("../config/keys");



exports.registerUser = async (req, res) => {
    try {
        const { email, userName, password } = await userValidation.validateAsync(req.body) ;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ email, userName, password: hashedPassword });

        await user.save();
        res.status(201).json({ token });
    } catch (error) {
        if (error.isJoi) {
          return res.status(400).json({ errors: error.details.map((detail) => detail.message) });
        }
    
        console.log(error);
        res.status(500).json({ error: 'Server error' });
      }
};

exports.loginUser = async (req, res) => {
    try {
      const { email, password } = await loginValidation.validateAsync(req.body); 

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(401).json({
            status: false,
            message: "Incorrect password. Please try again.",
          });    }

          const payload = {
            role: user.role,
            email: user.email,
            _id: user._id,
          };

          console.log(config.jwt)
          const accessToken = generateAccessToken(
            payload,
            config.jwt.accessTokenLife
          );
          const refreshToken = generateRefreshToken(
            payload,
            config.jwt.refreshTokenLife
          );
          if (!accessToken || !refreshToken) {
            return res.status(500).json({
              status: false,
              message: "Unable to generate tokens. Please try again later.",
            });
          }
          const token = new Token({
            user: user._id,
            token: accessToken,
            refreshToken: refreshToken,
          });
          await token.save();
          res.cookie("auth", refreshToken, { httpOnly: true });


        res.status(200).json({ token });
    } catch (error) {
        if (error.isJoi) {
            return res.status(400).json({ errors: error.details.map((detail) => detail.message) });
          }
        res.status(500).json({ error: error.message });
    }
};



exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error.message);
    
    if (error.isJoi) {
      return res.status(400).json({ errors: error.details.map((detail) => detail.message) });
    }
    
    res.status(500).send('Server error');
  }
};

  