const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const router = express.Router();
const SECRET = 'secretkey';

router.post('/register', async (req, res) => {
  const { full_name, email, password, role, phone } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (full_name, email, password_hash, role, phone)
       VALUES ($1,$2,$3,$4,$5) RETURNING id, email, role`,
      [full_name, email, hash, role, phone]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: 'Email already exists' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
  if (user.rows.length === 0) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const match = await bcrypt.compare(password, user.rows[0].password_hash);
  if (!match) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign(
    { id: user.rows[0].id, role: user.rows[0].role },
    SECRET,
    { expiresIn: '24h' }
  );
  res.json({ token, role: user.rows[0].role, user_id: user.rows[0].id });
});

module.exports = router;