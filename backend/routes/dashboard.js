const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    // 1. Total estudiantes
    const [[{ total_est }]] = await db.query('SELECT COUNT(*) as total_est FROM estudiantes');
    
    // 2. Estudiantes limpios vs con deuda (usando la vista que creamos)
    const [[{ limpios }]] = await db.query("SELECT COUNT(*) as limpios FROM v_estado_estudiante WHERE indicador = 'LIMPIO'");
    const [[{ deudas }]] = await db.query("SELECT COUNT(*) as deudas FROM v_estado_estudiante WHERE indicador = 'CON DEUDA ACADÉMICA'");

    // 3. Prácticas en curso
    const [[{ practicas }]] = await db.query("SELECT COUNT(*) as practicas FROM seguimiento_practica WHERE estado_proceso = 'En curso'");

    // 4. Paz y Salvos (Estudiantes con evidencias aprobadas)
    // (Simplificado: contamos las prácticas finalizadas que tienen todas sus evidencias en 'Aprobado')
    const [[{ paz_salvos }]] = await db.query(`
      SELECT COUNT(DISTINCT id_estudiante) as paz_salvos 
      FROM evidencias_grado 
      WHERE estado_entrega = 'Aprobado' 
      GROUP BY id_estudiante 
      HAVING COUNT(id_evidencia) >= 3
    `);

    res.json({
      total_estudiantes: total_est,
      limpios: limpios,
      deudas: deudas,
      en_practica: practicas,
      titulados: paz_salvos || 0
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;