const express = require('express');
const router = express.Router();
const db = require('../db');

// POST /api/notas -> Registrar una nota (intento de materia)
router.post('/', async (req, res) => {
  const { id_estudiante, id_materia, id_periodo, estado_nota, calificacion } = req.body;
  
  try {
    // Averiguar cuántos intentos previos tiene en esta materia
    const [previos] = await db.query(
      'SELECT COUNT(*) as total FROM intentos_materia WHERE id_estudiante = ? AND id_materia = ?',
      [id_estudiante, id_materia]
    );
    const numero_intento = previos[0].total + 1;

    // Insertar la nota
    await db.query(
      `INSERT INTO intentos_materia 
      (id_estudiante, id_materia, id_periodo, numero_intento, estado_nota, calificacion) 
      VALUES (?, ?, ?, ?, ?, ?)`,
      [id_estudiante, id_materia, id_periodo, numero_intento, estado_nota, calificacion]
    );

    res.json({ ok: true, mensaje: 'Nota registrada', intento: numero_intento });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/notas/estudiante/:id -> Ver el estado (Limpio o Con Deuda) y sus notas
router.get('/estudiante/:id', async (req, res) => {
  const id_est = req.params.id;
  try {
    // Consultamos la vista que creamos en la base de datos
    const [estado] = await db.query('SELECT * FROM v_estado_estudiante WHERE id_estudiante = ?', [id_est]);
    
    // Consultamos el historial de notas
    const [notas] = await db.query(
      `SELECT i.*, m.nombre_materia 
       FROM intentos_materia i 
       JOIN mallas_curriculares m ON m.id_materia = i.id_materia 
       WHERE i.id_estudiante = ? ORDER BY m.semestre_bloque, m.nombre_materia`,
      [id_est]
    );

    res.json({
      info: estado[0] || null,
      notas: notas
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;