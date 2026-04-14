const express = require('express');
const pool = require('../db');

const router = express.Router();

router.get('/available', async (req, res) => {
  const result = await pool.query(`
    SELECT s.id, s.slot_time, d.full_name as doctor_name
    FROM schedule s
    JOIN doctors d ON s.doctor_id = d.id
    WHERE s.is_available = true AND s.slot_time > NOW()
    ORDER BY s.slot_time
  `);
  res.json(result.rows);
});

module.exports = router;