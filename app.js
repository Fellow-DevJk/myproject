const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect('mongodb+srv://dhonithegoat956:OzRr1HJkoNBwR5Od@cluster0.a6ahffu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',{
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err.message);
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));

const User = mongoose.model('User', {
  username: String,
  password: String
});

app.get('/', (req, res) => {
  if (req.session.loggedIn) {
    res.render('index', { loggedIn: true });
  } else {
    res.redirect('/login');
  }
});

app.get('/contact', (req, res) => {
  res.render('contact');
});

app.post('/send-email', (req, res) => {
    res.sendStatus(200);
});

app.get('/menu', (req, res) => {
  res.render('menu');
});

app.get('/order', (req, res) => {
  res.render('order');
});

app.post('/order', (req, res) => {
    const orderId = Math.floor(100000 + Math.random() * 900000);
    const { name, phone, address } = req.body;
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
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Address:</strong> ${address}</p>
            <p><strong>Order ID:</strong> ${orderId}</p>
        </body>
        </html>
    `;
    res.send(orderDetailsPage);
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/login', (req, res) => {
  res.render('login');
});

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

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user || user.password !== password) {
      return res.status(400).send('Invalid username or password');
    }
    req.session.loggedIn = true;
    res.redirect('/');
  } catch (err) {
    console.error('Error finding user:', err.message);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});