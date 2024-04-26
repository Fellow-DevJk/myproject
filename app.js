// Import required modules
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err.message);
});

// Set views directory and template engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Set up middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: 'your_secret_key', // Change this to a secure key
    resave: false,
    saveUninitialized: true
}));

// Define Mongoose schema and model
const User = mongoose.model('User', {
  username: String,
  password: String
});

// Define routes to render EJS templates

// Home route
app.get('/', (req, res) => {
  // Check if the user is logged in
  if (req.session.loggedIn) {
    // User is logged in, render index template
    res.render('index', { loggedIn: true });
  } else {
    // User is not logged in, redirect to login page
    res.redirect('/login');
  }
});

// Contact route
app.get('/contact', (req, res) => {
  res.render('contact');
});
app.post('/send-email', (req, res) => {
    // Do nothing, just send back a success response
    res.sendStatus(200);
});
// Menu route
app.get('/menu', (req, res) => {
  res.render('menu');
});

// Order route
app.get('/order', (req, res) => {
  res.render('order');
});

app.post('/order', (req, res) => {
    // Generate a random orderId
    const orderId = Math.floor(100000 + Math.random() * 900000);

    // Send a response indicating that the order is on the way
    res.send(`Your order (Order ID: ${orderId}) is on the way!`);
});

// About route
app.get('/about', (req, res) => {
  res.render('about');
});

// Login route
app.get('/login', (req, res) => {
  res.render('login');
});

// Signup route
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).send('Username already exists');
    }

    const newUser = new User({ username, password });
    await newUser.save();
    res.redirect('/login');
  } catch (err) {
    console.error('Error saving user:', err.message);
    res.status(500).send('Internal Server Error');
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user || user.password !== password) {
      return res.status(400).send('Invalid username or password');
    }

    // Set session variable to indicate user is logged in
    req.session.loggedIn = true;
    res.redirect('/');
  } catch (err) {
    console.error('Error finding user:', err.message);
    res.status(500).send('Internal Server Error');
  }
});

// Logout route
app.get('/logout', (req, res) => {
  // Destroy session and redirect to login page
  req.session.destroy();
  res.redirect('/login');
});

// Start server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
