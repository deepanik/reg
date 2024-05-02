const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/public/register.html');
});

app.post('/register', (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  fs.readFile('users.json', 'utf8', (err, data) => {
    if (err) throw err;
    const users = JSON.parse(data);

    // Check if email already exists
    const emailExists = users.some(u => u.email === email);

    if (emailExists) {
      res.send('Email already exists. Please use a different email address.');
    } else {
      // Add new user to JSON file
      users.push({ firstname, lastname, email, password });
      fs.writeFile('users.json', JSON.stringify(users, null, 2), (err) => {
        if (err) throw err;
        res.redirect('/');
      });
    }
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  fs.readFile('users.json', 'utf8', (err, data) => {
    if (err) throw err;
    const users = JSON.parse(data);

    // Check if user exists and credentials match
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      res.redirect('/dashboard');
    } else {
      res.send('Invalid email or password. Please try again.');
    }
  });
});

app.get('/dashboard', (req, res) => {
  res.sendFile(__dirname + '/public/dashboard.html');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
