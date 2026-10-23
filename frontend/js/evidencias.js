let estudianteActualId = null;

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

async function cargarEvidencias(id) {
  if (!id) return;
  estudianteActualId = id;
  document.getElementById('contenido-paz-salvo').style.display = 'block';

  const res = await fetch(`/api/evidencias/estudiante/${id}`);
  const data = await res.json();

  const panel = document.getElementById('panel-paz-salvo');
  
  if (data.error) {
    panel.innerHTML = `<h3 style="color: var(--danger);">${data.error}</h3><p>El estudiante debe estar inscrito en práctica para gestionar evidencias.</p>`;
    document.getElementById('tabla-evidencias').innerHTML = '';
    return;
  }

  // Mostrar panel de Paz y Salvo
  if (data.paz_y_salvo) {
    panel.innerHTML = `
      <h2 style="color: var(--success);">✅ PAZ Y SALVO OTORGADO</h2>
      <p>El estudiante ha cumplido con el 100% de materias y evidencias.</p>
    `;
    panel.style.borderLeft = "5px solid var(--success)";
  } else {
    panel.innerHTML = `
      <h2 style="color: var(--warning);">⏳ PENDIENTE POR TITULAR</h2>
      <p>Faltan materias por aprobar o evidencias por entregar.</p>
    `;
    panel.style.borderLeft = "5px solid var(--warning)";
  }

  // Mostrar tabla
  const tbody = document.getElementById('tabla-evidencias');
  tbody.innerHTML = data.evidencias.map(ev => {
    const estaAprobada = ev.estado_entrega === 'Aprobado';
    return `
      <tr>
        <td>${ev.nombre_evidencia}</td>
        <td><span class="badge ${estaAprobada ? 'badge-limpio' : 'badge-deuda'}">${ev.estado_entrega || 'Pendiente'}</span></td>
        <td>
          ${!estaAprobada ? `<button onclick="aprobarEvidencia(${ev.id_tipo}, ${data.practica.id_seguimiento})" style="padding: 0.5rem;">Simular Entrega</button>` : '✅ OK'}
        </td>
      </tr>
    `;
  }).join('');
}

async function aprobarEvidencia(id_tipo, id_seguimiento) {
  const res = await fetch('/api/evidencias', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id_estudiante: estudianteActualId,
      id_seguimiento: id_seguimiento,
      id_tipo: id_tipo,
      estado_entrega: 'Aprobado'
    })
  });
  if (res.ok) cargarEvidencias(estudianteActualId);
}

document.getElementById('selector-estudiante').addEventListener('change', (e) => {
  cargarEvidencias(e.target.value);
});

cargarListaEstudiantes();