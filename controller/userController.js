const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const {userValidation, loginValidation} = require("../middleware/validator") 
const { generateAccessToken, generateRefreshToken } =require( "../functions/generateToken");
const Token = require("../models/RefreshToken.model")
const config = require("../config/keys");


// Api to register user

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
        res.status(201).json({ user });
    } catch (error) {
        if (error.isJoi) {
          return res.status(400).json({ errors: error.details.map((detail) => detail.message) });
        }
    
        console.log(error);
        res.status(500).json({ error: 'Server error' });
      }
};

// Api to login user

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

         // generate access token and refersh token
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

          // Making a new entry in database of token
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

// Api to logout user
exports.logoutUser = async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ success: false, message: "Authorization header missing" });
    }

    const tokenWithoutBearer = token.slice(7);

    const data = jwt.verify(tokenWithoutBearer, config.jwt.accessSecret);

    if (!data) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    // Remove the token from the database
    const removeToken = await Token.findOneAndDelete({
      user: data._id,
      token: tokenWithoutBearer,
    });

    if (!removeToken) {
      return res.status(400).json({ success: false, message: "No token found with this user" });
    }

    res.clearCookie("auth");
    res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

// Api to get details of profile 

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

  