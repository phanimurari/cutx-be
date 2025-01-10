const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Register API
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  
  try {
    // Check if a user with the same username or email already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });
    
    if (existingUser) {
      return res.status(400).send("User with this username or email already exists");
    }

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    await newUser.save();
    res.send(`Created new user with ID ${newUser._id}`);
  } catch (error) {
    res.status(500).send("Error creating user");
  }
});

// Login API

router.post('/login', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Find the user by either username or email
    const dbUser = await User.findOne({
      $or: [
        { username: new RegExp(`^${username}$`, "i") },
        { email: new RegExp(`^${email}$`, "i") }
      ]
    });
  
    if (!dbUser) {
      return res.status(400).send("Invalid username/email or password");
    }

    // Compare the provided password with the stored hashed password
    const isPasswordMatched = await bcrypt.compare(password, dbUser.password);

    if (isPasswordMatched) {
      const token = jwt.sign(
        { _id: dbUser._id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.send({ message: "Login Success!", token });
    } else {
      res.status(400).send("Invalid username/email or password");
    }
  } catch (error) {
    console.log(error)
    res.status(500).send("Error logging in");
  }
});

module.exports = router;
