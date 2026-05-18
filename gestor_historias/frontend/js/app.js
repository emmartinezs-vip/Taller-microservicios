// Espera a que el HTML esté completamente cargado antes de ejecutar
document.addEventListener('DOMContentLoaded', async function() {

  // Inicia la carga de todos los datos del dashboard
  await cargarDashboard();

});


// --- FUNCIÓN PRINCIPAL ---
// Coordina la carga de estadísticas e historias
async function cargarDashboard() {

  // Llama a los microservicios al mismo tiempo para no esperar uno por uno
  const [sprints, historias] = await Promise.all([
    obtenerSprints(),
    obtenerHistorias()
  ]);

  // Si los datos llegaron correctamente, los muestra
  if (sprints)   llenarEstadisticas(sprints, historias);
  if (historias) mostrarHistoriasRecientes(historias);
}


// --- LLENAR ESTADÍSTICAS ---
// Toma los datos y los escribe en las tarjetas del dashboard
function llenarEstadisticas(sprints, historias) {

  // Cantidad de sprints activos
  const sprintsActivos = sprints.filter(function(s) {
    return s.estado === 'Activo';
  });
  document.getElementById('stat_sprints').textContent =
    sprintsActivos.length;

  // Total de historias
  document.getElementById('stat_historias').textContent =
    historias.length;

  // Historias finalizadas — usa nombre_estado que viene de estados_historia
  const finalizadas = historias.filter(function(h) {
    return h.nombre_estado === 'Finalizado';
  });
  document.getElementById('stat_finalizadas').textContent =
    finalizadas.length;

  // Historias con impedimento
  const impedimentos = historias.filter(function(h) {
    return h.nombre_estado === 'Impedimento';
  });
  document.getElementById('stat_impedimentos').textContent =
    impedimentos.length;
}


// --- MOSTRAR HISTORIAS RECIENTES ---
// Genera las tarjetas HTML y las inserta en la grilla
function mostrarHistoriasRecientes(historias) {

  // Busca el contenedor de historias en el HTML
  const contenedor = document.getElementById('historias_recientes');

  // Si no hay historias, muestra un mensaje
  if (historias.length === 0) {
    contenedor.innerHTML = '<p class="texto_tenue">No hay historias registradas.</p>';
    return;
  }

  // Toma solo las últimas 6 historias para el dashboard
  const recientes = historias.slice(0, 6);

  // Genera el HTML de cada tarjeta y los une en un solo string
  contenedor.innerHTML = recientes.map(function(historia) {
    return crearTarjetaHistoria(historia);
  }).join('');
}


// --- CREAR TARJETA DE HISTORIA ---
// Recibe una historia y devuelve su HTML como texto
function crearTarjetaHistoria(historia) {

  // Clase CSS del estado para el color correcto
  const claseEstado = 'estado_' + (historia.nombre_estado || 'nueva').toLowerCase();

  // Responsable — si no tiene, muestra "Sin asignar"
  const responsable = historia.nombre || 'Sin asignar';

  // Descripción — si no tiene, muestra un texto por defecto
  const descripcion = historia.descripcion || 'Sin descripción.';

  // Sprint — si no tiene, muestra "Sin sprint"
  const sprint = historia.nombre_sprint || 'Sin sprint';

  // Puntos — usa puntos_scrum según la base de datos
  const puntos = historia.puntos_scrum || 0;

  return `
    <div class="tarjeta tarjeta_historia">

      <!-- Encabezado: estado y puntos -->
      <div class="tarjeta_historia_encabezado">
        <span class="pastilla_estado ${claseEstado}">
          ${historia.nombre_estado || 'Nueva'}
        </span>
        <span class="historia_puntos">${puntos} pts</span>
      </div>

      <!-- Título de la historia -->
      <h3 class="historia_titulo">${historia.titulo}</h3>

      <!-- Descripción corta -->
      <p class="historia_descripcion">${descripcion}</p>

      <!-- Pie: sprint y responsable -->
      <div class="tarjeta_historia_pie">
        <span class="historia_sprint">${sprint}</span>
        <span class="historia_responsable">${responsable}</span>
      </div>

    </div>
  `;
}