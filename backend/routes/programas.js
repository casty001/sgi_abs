const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM programas');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id/mallas', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM mallas_curriculares WHERE id_programa = ? ORDER BY semestre_bloque',
      [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;   // ← ESTO es lo clave