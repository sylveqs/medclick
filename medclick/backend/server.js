const express = require('express');
const cors = require('cors');
const pool = require('./db');

const authRoutes = require('./routes/auth');
const scheduleRoutes = require('./routes/schedule');
const appointmentRoutes = require('./routes/appointments');
const materialRoutes = require('./routes/materials');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/materials', materialRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Добавить после других маршрутов
app.get('/api/doctors', async (req, res) => {
    const result = await pool.query('SELECT id, full_name, specialty FROM doctors');
    res.json(result.rows);
});

app.get('/api/appointments/all', async (req, res) => {
    const result = await pool.query(`
        SELECT a.id, a.patient_id, a.status, s.slot_time, d.full_name as doctor_name,
               u.full_name as patient_name
        FROM appointments a
        JOIN schedule s ON a.schedule_id = s.id
        JOIN doctors d ON s.doctor_id = d.id
        LEFT JOIN users u ON a.patient_id = u.id
        ORDER BY s.slot_time DESC
    `);
    res.json(result.rows);
});

app.put('/api/appointments/:id/cancel', async (req, res) => {
    const { id } = req.params;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const app = await client.query(`SELECT schedule_id FROM appointments WHERE id = $1`, [id]);
        if (app.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Appointment not found' });
        }
        await client.query(`UPDATE appointments SET status = 'cancelled' WHERE id = $1`, [id]);
        await client.query(`UPDATE schedule SET is_available = true WHERE id = $1`, [app.rows[0].schedule_id]);
        await client.query('COMMIT');
        res.json({ message: 'Cancelled' });
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: 'Server error' });
    } finally {
        client.release();
    }
});

app.put('/api/appointments/:id/confirm', async (req, res) => {
    const { id } = req.params;
    await pool.query(`UPDATE appointments SET status = 'completed' WHERE id = $1`, [id]);
    res.json({ message: 'Confirmed' });
});

app.put('/api/appointments/:id/noshow', async (req, res) => {
    const { id } = req.params;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const app = await client.query(`SELECT schedule_id FROM appointments WHERE id = $1`, [id]);
        if (app.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Appointment not found' });
        }
        await client.query(`UPDATE appointments SET status = 'noshow' WHERE id = $1`, [id]);
        await client.query(`UPDATE schedule SET is_available = true WHERE id = $1`, [app.rows[0].schedule_id]);
        await client.query('COMMIT');
        res.json({ message: 'No show marked' });
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: 'Server error' });
    } finally {
        client.release();
    }
});

app.post('/api/schedule/add', async (req, res) => {
    const { doctor_id, slot_time } = req.body;
    try {
        await pool.query(
            `INSERT INTO schedule (doctor_id, slot_time, is_available) VALUES ($1, $2, true)`,
            [doctor_id, slot_time]
        );
        res.json({ message: 'Slot added' });
    } catch (err) {
        res.status(400).json({ error: 'Slot already exists' });
    }
});