let estudianteActualId = null;

// 1. Cargar lista de estudiantes
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

// 2. Función para verificar si ya tiene práctica (necesitamos una ruta extra en el backend)
async function cargarPracticaEstudiante(id) {
  if (!id) return;
  estudianteActualId = id;
  document.getElementById('seccion-practica').style.display = 'grid';
  document.getElementById('id_estudiante_form').value = id;

  // Consultamos todas las prácticas y filtramos la de este estudiante
  const res = await fetch('/api/practica');
  const practicas = await res.json();
  const miPractica = practicas.find(p => p.id_estudiante == id);

  const divInfo = document.getElementById('info-practica');
  if (miPractica) {
    divInfo.innerHTML = `
      <p><b>Modalidad:</b> ${miPractica.modalidad}</p>
      <p><b>Empresa:</b> ${miPractica.empresa_o_entidad}</p>
      <p><b>Estado:</b> <span class="badge ${miPractica.estado_proceso === 'En curso' ? 'badge-limpio' : 'badge-deuda'}">${miPractica.estado_proceso}</span></p>
    `;
    // Deshabilitar formulario si ya está inscrito
    document.querySelector('#form-practica button').disabled = true;
    document.querySelector('#form-practica button').innerText = "Práctica ya registrada";
  } else {
    divInfo.innerHTML = `<p style="color: #666;">Este estudiante aún no tiene una práctica registrada.</p>`;
    document.querySelector('#form-practica button').disabled = false;
    document.querySelector('#form-practica button').innerText = "Inscribir Práctica";
  }
}

// 3. Escuchar el selector
document.getElementById('selector-estudiante').addEventListener('change', (e) => {
  cargarPracticaEstudiante(e.target.value);
});

// 4. Guardar la práctica (aquí actúa el Trigger RN-01)
document.getElementById('form-practica').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const body = {
    id_estudiante: document.getElementById('id_estudiante_form').value,
    modalidad: document.getElementById('modalidad').value,
    empresa_o_entidad: document.getElementById('empresa').value
  };

  const res = await fetch('/api/practica', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  const data = await res.json();

  if (res.ok) {
    alert('✅ ' + data.mensaje);
    document.getElementById('form-practica').reset();
    cargarPracticaEstudiante(estudianteActualId);
  } else {
    alert('🛑 BLOQUEADO: ' + data.error);
  }
});

cargarListaEstudiantes();