const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'sgi-abs-secreto',
  resave: false,
  saveUninitialized: false
}));

// Servir el frontend como archivos estáticos
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Rutas
app.use('/api/programas', require('./routes/programas'));
app.use('/api/notas', require('./routes/notas'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/evidencias', require('./routes/evidencias'));
app.use('/api/estudiantes', require('./routes/estudiantes'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/nuevo-estudiante', require('./routes/nuevo_estudiante'));
app.use('/api/admin', require('./routes/admin'));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`SGI-ABS en http://localhost:${PORT}`);
});