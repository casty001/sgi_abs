const db = require('./db');

async function cargarDatos() {
  try {
    await db.query("INSERT INTO roles (nombre_rol) VALUES ('Admin'), ('Coordinador'), ('Estudiante')");
    await db.query("INSERT INTO programas (nombre_programa, codigo_sena_o_ies, total_semestres) VALUES ('Técnico en Sistemas', 'SENA-228001', 6)");
    await db.query("INSERT INTO mallas_curriculares (id_programa, semestre_bloque, nombre_materia, creditos_o_horas) VALUES (1, 1, 'Matemáticas', 80), (1, 1, 'Informática Básica', 80), (1, 2, 'Bases de Datos', 80)");
    await db.query("INSERT INTO periodos (anio, semestre) VALUES (2026, 1)");
    await db.query("INSERT INTO usuarios (documento, nombres, apellidos, correo, password_hash, id_rol) VALUES ('1001', 'Juan', 'Pérez', 'juan@abs.edu.co', '$2b$10$rqKO63.vSM.cd8LwBg7W3ODoH4soCV63mW9vF27NU1JardvoyTrF.', 3)");
    await db.query("INSERT INTO estudiantes (id_usuario, id_programa) VALUES (1, 1)");
    console.log("✅ Datos insertados correctamente");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}
cargarDatos();