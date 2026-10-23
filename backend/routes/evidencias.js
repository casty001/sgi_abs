const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/evidencias/estudiante/:id -> Ver checklist y validar Paz y Salvo
router.get('/estudiante/:id', async (req, res) => {
  const id_est = req.params.id;
  try {
    // 1. Validar que el estudiante esté LIMPIO
    const [estado] = await db.query('SELECT * FROM v_estado_estudiante WHERE id_estudiante = ?', [id_est]);
    const estaLimpio = estado[0]?.indicador === 'LIMPIO';

    // 2. Traer la práctica activa
    const [practica] = await db.query(
      'SELECT * FROM seguimiento_practica WHERE id_estudiante = ? ORDER BY id_seguimiento DESC LIMIT 1', 
      [id_est]
    );

    if (practica.length === 0) {
      return res.json({ error: 'El estudiante no tiene una práctica registrada', estado: estado[0] });
    }

    // 3. Traer el checklist de evidencias (las que debe entregar vs las que ya subió)
    const [evidencias] = await db.query(`
      SELECT t.id_tipo, t.nombre_evidencia, t.obligatoria, e.estado_entrega, e.fecha_entrega
      FROM tipos_evidencia t
      LEFT JOIN evidencias_grado e ON e.id_tipo = t.id_tipo AND e.id_estudiante = ?
      WHERE t.modalidad = ?
    `, [id_est, practica[0].modalidad]);

    // 4. Calcular si puede recibir Paz y Salvo
    const todasAprobadas = evidencias.every(e => e.estado_entrega === 'Aprobado');
    const pazYSalvo = estaLimpio && todasAprobadas;

    res.json({
      estado: estado[0],
      practica: practica[0],
      evidencias: evidencias,
      paz_y_salvo: pazYSalvo
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/evidencias -> Registrar que el estudiante entregó un documento
router.post('/', async (req, res) => {
  const { id_estudiante, id_seguimiento, id_tipo, estado_entrega } = req.body;
  try {
    // Validar si ya existe
    const [existe] = await db.query(
      'SELECT * FROM evidencias_grado WHERE id_estudiante = ? AND id_tipo = ?',
      [id_estudiante, id_tipo]
    );

    if (existe.length > 0) {
      // Actualizar
      await db.query(
        'UPDATE evidencias_grado SET estado_entrega = ?, fecha_entrega = NOW() WHERE id_evidencia = ?',
        [estado_entrega, existe[0].id_evidencia]
      );
    } else {
      // Insertar
      await db.query(
        'INSERT INTO evidencias_grado (id_estudiante, id_seguimiento, id_tipo, estado_entrega, fecha_entrega) VALUES (?, ?, ?, ?, NOW())',
        [id_estudiante, id_seguimiento, id_tipo, estado_entrega]
      );
    }
    res.json({ ok: true, mensaje: 'Evidencia actualizada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;