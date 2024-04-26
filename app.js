const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');

// Create Express app
const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb+srv://dhonithegoat956:OzRr1HJkoNBwR5Od@cluster0.a6ahffu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',{
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
// Order route
app.get('/order', (req, res) => {
  res.render('order');
});

app.post('/order', (req, res) => {
    // Generate a random orderId
    const orderId = Math.floor(100000 + Math.random() * 900000);

    // Retrieve order details from the request body
    const { name, email, phone, address } = req.body;

    // Create a dynamic HTML page to display the order details
    const orderDetailsPage = `
        <html>
        <head>
            <title>Order Details</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 20px;
                }
                h1 {
                    color: #333;
                }
                p {
                    margin-bottom: 10px;
                }
            </style>
        </head>
        <body>
            <h1>Order Confirmation</h1>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Address:</strong> ${address}</p>
            <p><strong>Order ID:</strong> ${orderId}</p>
        </body>
        </html>
    `;

    // Send the dynamically generated HTML page as the response
    res.send(orderDetailsPage);
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
app.get('/signup', (req, res) => {
  res.render('signup');
}); 
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