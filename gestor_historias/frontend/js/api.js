// URL base del gateway — si cambia el puerto, solo se modifica aquí
const URL_BASE = 'http://localhost:8080/api';


// --- FUNCIÓN BASE ---
// Todas las demás funciones la usan internamente
// Hace la petición y maneja los errores en un solo lugar
async function peticion(endpoint, opciones = {}) {
  try {
    const respuesta = await fetch(URL_BASE + endpoint, opciones);

    // Si el servidor respondió con un error (404, 500, etc.)
    if (!respuesta.ok) {
      throw new Error(`Error ${respuesta.status} en ${endpoint}`);
    }

    // Convierte la respuesta a JSON y la retorna
    return await respuesta.json();

  } catch (error) {
    console.error('Error en petición:', error);
    return null;
  }
}


// --- SPRINTS ---
// Campos reales: id_sprint, nombre, objetivo, fecha_inicio, fecha_fin, estado, fecha_creacion

function obtenerSprints() {
  return peticion('/sprints');
}

function obtenerSprint(id_sprint) {
  return peticion('/sprints/' + id_sprint);
}

function crearSprint(datos) {
  // datos: { nombre, objetivo, fecha_inicio, fecha_fin, estado }
  return peticion('/sprints', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  });
}

function actualizarSprint(id_sprint, datos) {
  return peticion('/sprints/' + id_sprint, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  });
}

function eliminarSprint(id_sprint) {
  return peticion('/sprints/' + id_sprint, {
    method: 'DELETE'
  });
}


// --- HISTORIAS ---
// Campos reales: id_historia, titulo, descripcion, puntos_scrum, fecha_creacion, id_sprint, id_responsable, id_estado

function obtenerHistorias(filtros = {}) {
  // Construye los filtros opcionales: ?id_sprint=1&id_responsable=2
  const params = new URLSearchParams(filtros).toString();
  const endpoint = params ? '/historias?' + params : '/historias';
  return peticion(endpoint);
}

function obtenerHistoria(id_historia) {
  return peticion('/historias/' + id_historia);
}

function crearHistoria(datos) {
  // datos: { titulo, descripcion, puntos_scrum, id_sprint, id_responsable, id_estado }
  return peticion('/historias', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  });
}

function actualizarHistoria(id_historia, datos) {
  return peticion('/historias/' + id_historia, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  });
}

function cambiarEstadoHistoria(id_historia, id_estado) {
  return peticion('/historias/' + id_historia + '/estado', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id_estado })
  });
}

function eliminarHistoria(id_historia) {
  return peticion('/historias/' + id_historia, {
    method: 'DELETE'
  });
}


// --- ESTADOS ---
// Campos reales: id_estado, nombre_estado

function obtenerEstados() {
  return peticion('/estados');
}


// --- RESPONSABLES ---
// Campos reales: id_responsable, nombre, correo, rol, fecha_registro

function obtenerResponsables() {
  return peticion('/responsables');
}

function obtenerResponsable(id_responsable) {
  return peticion('/responsables/' + id_responsable);
}

function crearResponsable(datos) {
  // datos: { nombre, correo, rol }
  return peticion('/responsables', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  });
}

function actualizarResponsable(id_responsable, datos) {
  return peticion('/responsables/' + id_responsable, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  });
}

function eliminarResponsable(id_responsable) {
  return peticion('/responsables/' + id_responsable, {
    method: 'DELETE'
  });
}


// --- REPORTES ---

function obtenerResumen() {
  return peticion('/reportes/resumen');
}

function obtenerReporteSprint(id_sprint) {
  return peticion('/reportes/sprint/' + id_sprint);
}

function obtenerReporteResponsable(id_sprint = null) {
  const endpoint = id_sprint
    ? '/reportes/responsable?id_sprint=' + id_sprint
    : '/reportes/responsable';
  return peticion(endpoint);
}

function obtenerImpedimentos() {
  return peticion('/reportes/impedimentos');
}


// --- COMENTARIOS ---
// Campos reales: id_comentario, comentario, fecha_comentario, id_historia

function obtenerComentarios(id_historia) {
  return peticion('/comentarios/historia/' + id_historia);
}

function crearComentario(datos) {
  // datos: { id_historia, comentario }
  return peticion('/comentarios', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  });
}

function eliminarComentario(id_comentario) {
  return peticion('/comentarios/' + id_comentario, {
    method: 'DELETE'
  });
}