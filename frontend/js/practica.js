async function cargarPracticas() {
  const res = await fetch('/api/practica');
  const data = await res.json();
  
  const tbody = document.getElementById('tabla-practicas');
  tbody.innerHTML = data.map(p => `
    <tr style="border-bottom: 1px solid #ccc; text-align: center;">
      <td>${p.nombres} ${p.apellidos}</td>
      <td>${p.modalidad}</td>
      <td>${p.empresa_o_entidad}</td>
      <td>${p.estado_proceso}</td>
    </tr>
  `).join('');
}

document.getElementById('form-practica').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const body = {
    id_estudiante: document.getElementById('id_estudiante').value,
    modalidad: document.getElementById('modalidad').value,
    empresa_o_entidad: document.getElementById('empresa').value
  };

  const res = await fetch('/api/practica', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  const resultado = await res.json();

  if (res.ok) {
    alert('✅ ' + resultado.mensaje);
    document.getElementById('form-practica').reset();
    cargarPracticas();
  } else {
    // Aquí atrapamos el error del Trigger RN-01
    alert('🛑 BLOQUEADO: ' + resultado.error);
  }
});

cargarPracticas();