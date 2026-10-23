const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../db');

router.post('/login', async (req, res) => {
  const { documento, password } = req.body;
  try {
    const [rows] = await db.query(
      'SELECT u.*, r.nombre_rol FROM usuarios u JOIN roles r ON r.id_rol = u.id_rol WHERE u.documento = ?',
      [documento]
    );
    if (rows.length === 0) return res.status(401).json({ error: 'Usuario no existe' });

    const usuario = rows[0];
    const ok = await bcrypt.compare(password, usuario.password_hash);
    if (!ok) return res.status(401).json({ error: 'Contraseña incorrecta' });

    req.session.usuario = { id: usuario.id_usuario, rol: usuario.nombre_rol };
    res.json({ ok: true, rol: usuario.nombre_rol });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;   // ← clave