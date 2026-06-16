fetch('../data/modulos_entidades.json')
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById('modulos-entidades-grid');
    data.forEach(entidad => {
      const col = document.createElement('div');
      col.className = 'col-sm-6 col-md-4 col-lg-3';
      col.innerHTML = `
        <div class="card h-100 shadow-sm">
          <img src="../${entidad.imagen}" class="card-img-top" alt="Módulo ${entidad.nombre}">
          <div class="card-body text-center">
            <h6 class="fw-bold mb-1">${entidad.nombre}</h6>
            <ul class="list-unstyled small text-muted mb-0">
              ${entidad.modulos.map(m => `<li>📍 ${m}</li>`).join('')}
            </ul>
          </div>
        </div>
      `;
      container.appendChild(col);
    });
  })
  .catch(error => console.error('Error al cargar el JSON de entidades:', error));