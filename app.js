let db = { doctores: [], pacientes: [], citas: [] };

async function cargarDatos() {
    try {
        const res = await fetch('data.json');
        db = await res.json();
        renderDoctores();
        actualizarSelects();
    } catch (err) {
        console.error("Error al cargar datos:", err);
    }
}

function renderDoctores() {
    const div = document.getElementById('lista-doctores');
    div.innerHTML = '';
    db.doctores.forEach(doc => {
        div.innerHTML += `<p><strong>${doc.nombre}</strong> - ${doc.especialidad} (${doc.horario})</p>`;
    });
}

function actualizarSelects() {
    const selectDoc = document.getElementById('select-doctor');
    const selectPac = document.getElementById('select-paciente');
    selectDoc.innerHTML = '';
    selectPac.innerHTML = '';

    db.doctores.forEach(doc => {
        selectDoc.innerHTML += `<option value="${doc.id}">${doc.nombre} (${doc.especialidad})</option>`;
    });
    db.pacientes.forEach(pac => {
        selectPac.innerHTML += `<option value="${pac.cedula}">${pac.nombre}</option>`;
    });
}

// Validación Crítica de Citas (Paso 4): Bloquea choques en el mismo segmento de horario
document.getElementById('form-cita').addEventListener('submit', (e) => {
    e.preventDefault();
    const idDoctor = document.getElementById('select-doctor').value;
    const horaCita = document.getElementById('hora-cita').value;
    const errorText = document.getElementById('mensaje-error');

    const choque = db.citas.find(c => c.idDoctor == idDoctor && c.hora === horaCita);

    if (choque) {
        errorText.textContent = "⚠️ Error: El doctor seleccionado ya tiene una cita asignada en este horario.";
        return;
    }

    errorText.textContent = "";
    db.citas.push({ idDoctor, cedulaPaciente: document.getElementById('select-paciente').value, hora: horaCita });
    alert("¡Cita agendada con éxito!");
});

document.getElementById('form-paciente').addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nombre-paciente').value;
    const cedula = document.getElementById('cedula-paciente').value;
    db.pacientes.push({ nombre, cedula });
    actualizarSelects();
    alert("Paciente registrado correctamente.");
    e.target.reset();
});

cargarDatos();
