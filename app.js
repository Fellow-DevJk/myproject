const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://dhonithegoat956:Mj0x7OIfCFp9iqiN@@cluster0.dsuo43t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB Atlas');
}).catch((err) => {
  console.error('Error connecting to MongoDB Atlas:', err.message);
});

// Set views directory and template engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Set up middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Define Mongoose schema and model
const rsDetailsSchema = new mongoose.Schema({
  fullname: String,
  email: String,
  password: String
});

const RsDetails = mongoose.model('RsDetails', rsDetailsSchema);

// Define routes to render EJS templates
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/contact', (req, res) => {
  res.render('contact');
});

app.get('/menu', (req, res) => {
  res.render('listing');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/signup', (req, res) => {
  res.render('signup');
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/menu', (req, res) => {
  res.render('menu');
});

if (!user) {
    return res.redirect('/login');
  }

// Signup route
app.post('/signup', async (req, res) => {
  const { fullname, email, password, confirm_password } = req.body;

  if (password !== confirm_password) {
    return res.status(400).send('Passwords do not match');
  }

  try {
    const newUser = new RsDetails({ fullname, email, password });
    await newUser.save();
    res.redirect('/Login');
  } catch (err) {
    console.error('Error saving user:', err.message);
    res.redirect('/signup');
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await RsDetails.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(400).send('Invalid email or password');
    }

    res.redirect('/Listing');
  } catch (err) {
    console.error('Error finding user:', err.message);
    res.redirect('/Login');
  }
});

// Add additional routes for other pages in your assignment

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
