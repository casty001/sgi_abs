USE sgi_abs;

INSERT INTO roles (nombre_rol) VALUES ('Admin'), ('Coordinador'), ('Estudiante');

INSERT INTO programas (nombre_programa, codigo_sena_o_ies, total_semestres)
VALUES ('Técnico en Sistemas', 'SENA-228001', 6);

INSERT INTO mallas_curriculares (id_programa, semestre_bloque, nombre_materia, creditos_o_horas)
VALUES
  (1, 1, 'Matemáticas', 80),
  (1, 1, 'Informática Básica', 80),
  (1, 2, 'Bases de Datos', 80);

INSERT INTO periodos (anio, semestre) VALUES (2026, 1);

-- Usuario estudiante (password: 123456)
INSERT INTO usuarios (documento, nombres, apellidos, correo, password_hash, id_rol)
VALUES ('1001', 'Juan', 'Pérez', 'juan@abs.edu.co',
        '$2b$10$abcdefghijklmnopqrstuv', 3);

INSERT INTO estudiantes (id_usuario, id_programa) VALUES (1, 1);