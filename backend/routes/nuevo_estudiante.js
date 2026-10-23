const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
  const { documento, nombres, apellidos, correo, id_programa } = req.body;
  
  try {
    // 1. Validar que el documento o correo no existan
    const [existe] = await db.query('SELECT id_usuario FROM usuarios WHERE documento = ? OR correo = ?', [documento, correo]);
    if (existe.length > 0) return res.status(400).json({ error: 'El documento o correo ya está registrado.' });

    // 2. Encriptar contraseña por defecto "123456"
    const hash = await bcrypt.hash('123456', 10);

    // 3. Insertar en la tabla usuarios (Rol 3 = Estudiante)
    const [userResult] = await db.query(
      `INSERT INTO usuarios (documento, nombres, apellidos, correo, password_hash, id_rol) 
       VALUES (?, ?, ?, ?, ?, 3)`,
      [documento, nombres, apellidos, correo, hash]
    );

    // 4. Insertar en la tabla estudiantes
    await db.query(
      `INSERT INTO estudiantes (id_usuario, id_programa) VALUES (?, ?)`,
      [userResult.insertId, id_programa]
    );

    res.json({ ok: true, mensaje: 'Estudiante creado exitosamente. Contraseña por defecto: 123456' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;