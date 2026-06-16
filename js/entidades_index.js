document.addEventListener("DOMContentLoaded", function () {

    fetch("data/entidades_index.json")
        .then(response => response.json())
        .then(data => {

            const entidadesList = data.value || data;
            const grid = document.getElementById("entidades-grid");
            if (!grid) return;
            
            // Buscar el índice de "Coordinación Mixta de Posgrado" de manera robusta ante problemas de codificación
            const targetIndex = entidadesList.findIndex(e => {
                const n = e.nombre || "";
                return (n.includes("Coordinación") && n.includes("Posgrado")) || 
                       (n.includes("Coordinacin") && n.includes("Posgrado")) ||
                       (n.includes("Posgrado") && (n.includes("Mixta") || n.includes("Coordin")));
            });
            const splitIndex = targetIndex !== -1 ? targetIndex : 48; // fallback al elemento 49 (índice 48)

            function renderEntidades() {
                grid.innerHTML = "";
                
                entidadesList.forEach((entidad, index) => {
                    const col = document.createElement("div");
                    // Usar bootstrap columns para distribución fluida
                    col.className = "col-6 col-sm-4 col-md-3 col-lg-2 d-flex justify-content-center mb-2";
                    
                    // Ocultar elementos después de Coordinación Mixta de Posgrado
                    if (index > splitIndex) {
                        col.classList.add("d-none", "extra-entidad");
                    }
                    
                    col.innerHTML = `
                        <div class="entidad-card-glass text-center w-100" 
                             data-index="${index}" 
                             style="cursor:pointer">
                            <div class="entidad-logo-wrapper">
                                <img src="${entidad.logo}" 
                                     loading="lazy" 
                                     class="img-fluid" 
                                     alt="${entidad.nombre}">
                            </div>
                            <div class="entidad-nombre">
                                ${entidad.nombre}
                            </div>
                        </div>
                    `;
                    grid.appendChild(col);
                });
            }

            // Inicializar renderizado
            renderEntidades();

            // Configurar el botón de "Ver más"
            const btnVerMas = document.getElementById("btn-ver-mas-entidades");
            if (btnVerMas) {
                btnVerMas.addEventListener("click", function () {
                    const extraCols = document.querySelectorAll(".extra-entidad");
                    const isExpanded = btnVerMas.getAttribute("aria-expanded") === "true";
                    
                    if (isExpanded) {
                        // Colapsar
                        extraCols.forEach(col => col.classList.add("d-none"));
                        btnVerMas.innerHTML = 'Ver más entidades <i class="bi bi-chevron-down ms-1"></i>';
                        btnVerMas.setAttribute("aria-expanded", "false");
                        // Desplazamiento suave al inicio del directorio de entidades
                        const section = document.getElementById("directorio-entidades");
                        if (section) {
                            section.scrollIntoView({ behavior: 'smooth' });
                        }
                    } else {
                        // Expandir
                        extraCols.forEach(col => col.classList.remove("d-none"));
                        btnVerMas.innerHTML = 'Ver menos <i class="bi bi-chevron-up ms-1"></i>';
                        btnVerMas.setAttribute("aria-expanded", "true");
                    }
                });
            }

            // Exponer la función de apertura del modal globalmente
            window.abrirModalEntidad = function (entidad) {
                // Título
                document.getElementById("modalTitulo").innerText = entidad.nombre;

                // Contenido del modal Liquid Glass
                document.getElementById("modalContenido").innerHTML = `
                <div class="entity-modal-inner d-flex flex-column align-items-center py-2">
                    <!-- Logo con contenedor esmerilado -->
                    <div class="entity-modal-logo-wrapper mb-4">
                        <img src="${entidad.logo}" 
                             alt="${entidad.nombre}" 
                             class="img-fluid" 
                             style="max-height: 140px; object-fit: contain;">
                    </div>
                    
                    <!-- Info y Botones Premium -->
                    <div class="entity-modal-info w-100 px-3 text-center">
                        <div class="row g-3 justify-content-center mt-2">
                            <!-- Botón Correo -->
                            <div class="col-md-6 col-12">
                                <a href="${entidad.correo ? 'mailto:' + entidad.correo : '#'}" class="btn-entity-action mail-action w-100 ${!entidad.correo ? 'disabled' : ''}">
                                    <i class="bi bi-envelope-fill"></i>
                                    <span>${entidad.correo || "Correo no disponible"}</span>
                                </a>
                            </div>
                            
                            <!-- Botón Web -->
                            <div class="col-md-6 col-12">
                                <a href="${entidad.sitio || entidad.web || '#'}" target="_blank" class="btn-entity-action web-action w-100 ${!(entidad.sitio || entidad.web) ? 'disabled' : ''}">
                                    <i class="bi bi-globe"></i>
                                    <span>${(entidad.sitio || entidad.web) ? "Visitar Sitio Web" : "Sitio no disponible"}</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                `;

                const modal = new bootstrap.Modal(
                    document.getElementById("entidadModal")
                );

                modal.show();
            };

            // MODAL DINÁMICO DESDE REJILLA
            document.addEventListener("click", function (e) {
                const card = e.target.closest(".entidad-card-glass");
                if (!card) return;

                const entidad = entidadesList[card.dataset.index];
                window.abrirModalEntidad(entidad);
            });

        })
        .catch(error => {
            console.error("Error cargando entidades:", error);
        });

});