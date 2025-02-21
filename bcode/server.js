const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'product_review'
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
  console.log('✅ MySQL Connected...');
});

// =================== USER AUTH ===================

// User Login
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const sql = 'SELECT * FROM users WHERE email = ?';

  db.query(sql, [email], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error logging in', error: err });

    if (results.length === 0) {
      return res.status(400).json({ message: 'User not found' });
    }

    const user = results[0];

    if (user.password !== password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.json({ message: 'Login successful', userId: user.user_id, email: user.email });
  });
});
// Get all users
app.get('/users', (req, res) => {
  const sql = 'SELECT user_id, name, email FROM users'; // Exclude password for security

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching users', error: err });

    res.json(results);
  });
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));