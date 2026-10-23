const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/estudiantes -> Devuelve la lista de todos los estudiantes
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT e.id_estudiante, u.nombres, u.apellidos, p.nombre_programa 
      FROM estudiantes e
      JOIN usuarios u ON u.id_usuario = e.id_usuario
      JOIN programas p ON p.id_programa = e.id_programa
      ORDER BY u.nombres
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;