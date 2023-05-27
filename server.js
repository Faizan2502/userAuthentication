const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const path = require('path');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1/authentication-app', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error('Error connecting to MongoDB:', error));

// Create a User model
const User = mongoose.model('User', {
  username: String,
  password: String
});

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Register endpoint
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  // Generate a salt and hash the password
  bcrypt.genSalt(10, (error, salt) => {
    if (error) {
      console.error('Error generating salt:', error);
      return res.status(500).json({ message: 'Error registering user' });
    }

    bcrypt.hash(password, salt, (error, hash) => {
      if (error) {
        console.error('Error hashing password:', error);
        return res.status(500).json({ message: 'Error registering user' });
      }

      // Create a new user instance with the hashed password
      const newUser = new User({ username, password: hash });

      // Save the user to the database
      newUser.save()
        .then(() => {
          res.status(200).json({ message: 'User registered successfully' });
        })
        .catch(error => {
          console.error('Error saving user:', error);
          res.status(500).json({ message: 'Error registering user' });
        });
    });
  });
});

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Check if the user exists in the database
  User.findOne({ username: username })
    .then(user => {
      if (!user) {
        // User not found
        res.status(404).json({ message: 'User not found' });
      } else {
        // Compare the provided password with the hashed password
        bcrypt.compare(password, user.password, (error, result) => {
          if (error) {
            console.error('Error comparing passwords:', error);
            return res.status(500).json({ message: 'Error logging in' });
          }

          if (result) {
            // Password is correct, login successful
            res.status(200).json({ message: 'Login successfully' });
          } else {
            // Password is incorrect
            res.status(401).json({ message: 'Incorrect password' });
          }
        });
      }
    })
    .catch(error => {
      console.error('Error finding user:', error);
      res.status(500).json({ message: 'Error logging in' });
    });
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
