const express = require('express');
const pool = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
  const result = await pool.query(`SELECT * FROM materials ORDER BY id`);
  res.json(result.rows);
});

router.post('/write-off', async (req, res) => {
  const { material_id, appointment_id, quantity } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const mat = await client.query(
      `SELECT quantity FROM materials WHERE id = $1 FOR UPDATE`,
      [material_id]
    );
    if (mat.rows[0].quantity < quantity) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Not enough stock' });
    }
    await client.query(
      `UPDATE materials SET quantity = quantity - $1 WHERE id = $2`,
      [quantity, material_id]
    );
    await client.query(
      `INSERT INTO material_write_offs (material_id, appointment_id, quantity)
       VALUES ($1, $2, $3)`,
      [material_id, appointment_id, quantity]
    );
    await client.query('COMMIT');
    res.json({ message: 'Material written off' });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: 'Server error' });
  } finally {
    client.release();
  }
});

module.exports = router;