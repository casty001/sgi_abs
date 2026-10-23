const express = require('express');
const router = express.Router();
const db = require('../db');

// POST /api/admin/programas -> Crear un nuevo programa
router.post('/programas', async (req, res) => {
  const { nombre_programa, codigo_sena_o_ies, total_semestres } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO programas (nombre_programa, codigo_sena_o_ies, total_semestres) VALUES (?, ?, ?)',
      [nombre_programa, codigo_sena_o_ies, total_semestres]
    );
    res.json({ ok: true, mensaje: 'Programa creado exitosamente', id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/materias -> Crear una nueva materia (competencia) en un programa
router.post('/materias', async (req, res) => {
  const { id_programa, semestre_bloque, nombre_materia, creditos_o_horas } = req.body;
  try {
    await db.query(
      'INSERT INTO mallas_curriculares (id_programa, semestre_bloque, nombre_materia, creditos_o_horas) VALUES (?, ?, ?, ?)',
      [id_programa, semestre_bloque, nombre_materia, creditos_o_horas]
    );
    res.json({ ok: true, mensaje: 'Competencia/Materia agregada al programa' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;