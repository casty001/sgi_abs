# SGI-ABS 🎓
**Sistema de Gestión Académica y Seguimiento de Prácticas**
*Institución Educativa ABS (abs.edu.co)*

## 📝 Descripción del Proyecto
El SGI-ABS es un sistema de información diseñado para automatizar el control curricular y la etapa práctica de los estudiantes de la institución. Permite gestionar la oferta académica, validar el avance de los estudiantes, bloquear automáticamente el paso a práctica si hay materias pendientes, y hacer seguimiento a las evidencias para la emisión del Paz y Salvo.

El proyecto fue construido con un enfoque **Full-Stack** ligero, sin frameworks pesados en el frontend, garantizando velocidad y facilidad de mantenimiento.

## 🚀 Tecnologías Utilizadas
*   **Frontend:** HTML5, CSS3, JavaScript (Vanilla).
*   **Backend:** Node.js, Express.js.
*   **Base de Datos:** MySQL / MariaDB.
*   **Seguridad:** Bcrypt (encriptación de contraseñas).
*   **Sesiones:** Express-session (preparado para módulo de login).

## ✨ Características Principales
*   **📊 Dashboard Estadístico:** Panel de control con métricas en tiempo real (Total estudiantes, Estudiantes Limpios, Estudiantes con Deuda, En Práctica).
*   **⚙️ Administración Académica:** Creación dinámica de nuevos Programas Técnicos y asignación de sus respectivas Competencias/Materias (Mallas Curriculares).
*   **👤 Gestión de Estudiantes:** Registro de nuevos estudiantes asignándolos a un programa específico.
*   **📚 Control de Notas:** Interfaz multi-estudiante para registrar calificaciones (Aprobado, No Aprobado, Habilita) y visualización automática del estado "Limpio" o "Con Deuda".
*   **💼 Etapa Práctica:** Registro de la modalidad (Práctica, Pasantía, Proyecto) con validación estricta a nivel de Base de Datos (Trigger) que impide el paso a estudiantes con deudas.
*   **🎓 Paz y Salvo:** Checklist de evidencias de grado y emisión del Paz y Salvo tras cumplir con el 100% de los requisitos académicos y documentales.

## 🗄️ Estructura de la Base de Datos
El sistema cuenta con 11 tablas relacionales y 1 vista, destacando:
*   `programas` y `mallas_curriculares`: Oferta académica.
*   `usuarios` y `estudiantes`: Datos de acceso y perfil.
*   `intentos_materia`: Historial de notas.
*   `seguimiento_practica` y `evidencias_grado`: Control de la etapa productiva.
*   `v_estado_estudiante`: Vista que calcula en tiempo real si un estudiante está LIMPIO o CON DEUDA ACADÉMICA.
*   `trg_bloqueo_practica`: Trigger (RN-01) que impide inscribir a práctica a estudiantes con materias pendientes.

## ⚙️ Instalación y Ejecución Local

Sigue estos pasos para correr el proyecto en tu computadora:

### 1. Requisitos previos
*   Tener instalado **Node.js** (v18 o superior).
*   Tener instalado **MySQL** (o MariaDB).

### 2. Configurar la Base de Datos
1. Abre tu cliente MySQL (Workbench, DBeaver, etc.).
2. Ejecuta el script SQL (`schema.sql`, `triggers.sql`, `vista.sql`) y luego el `seed.sql` para cargar los datos de prueba (12 estudiantes, programas, etc.).

### 3. Configurar el Backend
1. Abre una terminal y ve a la carpeta del backend:
   ```bash
   cd backend