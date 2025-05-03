// server.js
const express = require('express');
const mysql = require('mysql2/promise'); // Use promise version
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL Connection Pool
const db = mysql.createPool({
  host: 'localhost',
  user: 'dba_user',
  password: 'Dba@1234',
  database: 'dba_project'
});

// GET: Fetch all devices
app.get('/traffic', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM devices');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching devices:', err);
    res.status(500).json({ error: 'Failed to fetch traffic data' });
  }
});

// POST: Add new device
app.post('/add', async (req, res) => {
  try {
    const { device, usage, priority } = req.body;
    const sql = 'INSERT INTO devices (device, data_usage, priority) VALUES (?, ?, ?)';
    await db.query(sql, [device, usage, priority]);
    res.status(200).json({ message: 'Device added' });
  } catch (err) {
    console.error('Error adding device:', err);
    res.status(500).json({ error: 'Failed to add device' });
  }
});

// DELETE: Remove device
app.delete('/delete/:device', async (req, res) => {
  try {
    const { device } = req.params;
    const [result] = await db.query('DELETE FROM devices WHERE device = ?', [device]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Device not found' });
    }
    res.status(200).json({ message: 'Device removed' });
  } catch (err) {
    console.error('Error deleting device:', err);
    res.status(500).json({ error: 'Failed to delete device' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

