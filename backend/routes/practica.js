const express = require('express');
const router = express.Router();
const db = require('../db');

// POST /api/practica -> Intentar inscribir a práctica
router.post('/', async (req, res) => {
  const { id_estudiante, modalidad, empresa_o_entidad } = req.body;
  
  try {
    // Aquí es donde entra en acción el Trigger de la Base de Datos (RN-01)
    const [result] = await db.query(
      `INSERT INTO seguimiento_practica (id_estudiante, modalidad, empresa_o_entidad) 
       VALUES (?, ?, ?)`,
      [id_estudiante, modalidad, empresa_o_entidad]
    );

    res.json({ ok: true, mensaje: 'Práctica inscrita correctamente', id: result.insertId });
  } catch (err) {
    // Si el Trigger nos bloquea, atrapamos el error SQLSTATE 45000
    if (err.sqlState === '45000') {
      return res.status(400).json({ error: err.sqlMessage });
    }
    res.status(500).json({ error: err.message });
  }
});

// GET /api/practica -> Ver prácticas registradas
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT s.*, u.nombres, u.apellidos 
      FROM seguimiento_practica s
      JOIN estudiantes e ON e.id_estudiante = s.id_estudiante
      JOIN usuarios u ON u.id_usuario = e.id_usuario
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;