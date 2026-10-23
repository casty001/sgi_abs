let estudianteActualId = null;

// 1. Cargar la lista de estudiantes en el selector
async function cargarListaEstudiantes() {
  const res = await fetch('/api/estudiantes');
  const estudiantes = await res.json();
  
  const selector = document.getElementById('selector-estudiante');
  selector.innerHTML = '<option value="">Seleccione un estudiante...</option>';
  
  estudiantes.forEach(est => {
    selector.innerHTML += `<option value="${est.id_estudiante}">
      ${est.nombres} ${est.apellidos} (${est.nombre_programa})
    </option>`;
  });
}

// 2. Cargar los datos del estudiante seleccionado
async function cargarDatosEstudiante(id) {
  if (!id) return;
  estudianteActualId = id;

  // Mostrar secciones ocultas
  document.getElementById('panel-estado').style.display = 'block';
  document.getElementById('seccion-trabajo').style.display = 'grid';
  document.getElementById('id_estudiante_form').value = id;

  // Traer datos de la API
  const res = await fetch(`/api/notas/estudiante/${id}`);
  const data = await res.json();

  // Actualizar panel de estado
  const panel = document.getElementById('panel-estado');
  if (data.info) {
    const esLimpio = data.info.indicador === 'LIMPIO';
    panel.innerHTML = `
      <h2>${data.info.nombres} ${data.info.apellidos}</h2>
      <p style="margin-top: 10px;">Materias Aprobadas: <b>${data.info.materias_aprobadas} de ${data.info.total_materias}</b></p>
      <h3 style="margin-top: 10px;" class="badge ${esLimpio ? 'badge-limpio' : 'badge-deuda'}">
        ESTADO: ${data.info.indicador}
      </h3>
    `;
  }

  // Actualizar tabla de notas
  const tbody = document.getElementById('tabla-notas');
  tbody.innerHTML = data.notas.map(n => `
    <tr>
      <td>${n.nombre_materia}</td>
      <td>${n.numero_intento}</td>
      <td><span class="badge ${n.estado_nota === 'Aprobado' ? 'badge-limpio' : 'badge-deuda'}">${n.estado_nota}</span></td>
      <td><b>${n.calificacion}</b></td>
    </tr>
  `).join('');

  // Cargar las materias correspondientes a su programa en el formulario
  const resMaterias = await fetch(`/api/programas/${data.info.id_programa}/mallas`);
  const materias = await resMaterias.json();
  
  const selectMateria = document.getElementById('id_materia');
  selectMateria.innerHTML = '<option value="">Seleccione la materia...</option>';
  materias.forEach(m => {
    selectMateria.innerHTML += `<option value="${m.id_materia}">${m.nombre_materia} (Semestre ${m.semestre_bloque})</option>`;
  });
}

// 3. Escuchar cuando el usuario cambia el selector
document.getElementById('selector-estudiante').addEventListener('change', (e) => {
  cargarDatosEstudiante(e.target.value);
});

// 4. Guardar la nueva nota
document.getElementById('form-nota').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const body = {
    id_estudiante: document.getElementById('id_estudiante_form').value,
    id_materia: document.getElementById('id_materia').value,
    id_periodo: document.getElementById('id_periodo').value,
    estado_nota: document.getElementById('estado_nota').value,
    calificacion: document.getElementById('calificacion').value
  };

  const res = await fetch('/api/notas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (res.ok) {
    document.getElementById('form-nota').reset();
    document.getElementById('id_estudiante_form').value = estudianteActualId; // Mantener el ID
    cargarDatosEstudiante(estudianteActualId); // Recargar datos
  } else {
    const errorData = await res.json();
    alert('Error: ' + (errorData.error || 'No se pudo guardar'));
  }
});

// Arrancar
cargarListaEstudiantes();