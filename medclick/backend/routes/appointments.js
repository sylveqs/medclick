const express = require('express');
const pool = require('../db');

const router = express.Router();

router.post('/', async (req, res) => {
  const { patient_id, schedule_id } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const slot = await client.query(
      `SELECT is_available FROM schedule WHERE id = $1 FOR UPDATE`,
      [schedule_id]
    );
    if (!slot.rows[0]?.is_available) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Slot already taken' });
    }
    await client.query(`UPDATE schedule SET is_available = false WHERE id = $1`, [schedule_id]);
    await client.query(
      `INSERT INTO appointments (patient_id, schedule_id) VALUES ($1, $2)`,
      [patient_id, schedule_id]
    );
    await client.query('COMMIT');
    res.json({ message: 'Appointment booked' });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: 'Server error' });
  } finally {
    client.release();
  }
});

router.get('/my/:patient_id', async (req, res) => {
  const result = await pool.query(`
    SELECT a.id, a.status, s.slot_time, d.full_name as doctor_name
    FROM appointments a
    JOIN schedule s ON a.schedule_id = s.id
    JOIN doctors d ON s.doctor_id = d.id
    WHERE a.patient_id = $1
    ORDER BY s.slot_time DESC
  `, [req.params.patient_id]);
  res.json(result.rows);
});

module.exports = router;