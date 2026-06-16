
import pandas as pd
from datetime import datetime

def generar_tarjeta(evento):
    tipo_clase = evento['tipo'].strip().lower().replace(" ", "-")
    return f"""
    <div class="col-md-4 mb-4 evento-card evento-{tipo_clase}">
      <div class="card h-100 shadow-sm">
        <div class="card-body">
          <span class="badge bg-primary mb-2">{evento['tipo']}</span>
          <h5 class="card-title">{evento['titulo']}</h5>
          <p class="card-text"><strong>Fecha:</strong> {evento['inicio'].strftime('%d/%m/%Y')}<br>
          <strong>Modalidad:</strong> {evento['modalidad']}<br>
          <strong>Ponente:</strong> {evento['ponente']}<br>
          <strong>Público:</strong> {evento['publico']}</p>
          <p class="card-text">{evento['descripcion']}</p>
          <a href="{evento['archivo_convocatoria']}" class="btn btn-outline-primary btn-sm" target="_blank">
            <i class="bi bi-file-earmark-pdf"></i> Convocatoria
          </a>
          <a href="{evento['archivo_calendario']}" class="btn btn-outline-secondary btn-sm" target="_blank">
            <i class="bi bi-calendar-event"></i> Calendario
          </a>
        </div>
      </div>
    </div>
    """

def generar_eventos_html(archivo_excel, salida="../paginas/eventos.html"):
    df = pd.read_excel(archivo_excel)
    df["inicio"] = pd.to_datetime(df["inicio"], errors="coerce")
    hoy = pd.Timestamp(datetime.now().date())
    proximos = df[df["inicio"] >= hoy]
    pasados = df[df["inicio"] < hoy]

    tarjetas_proximos = "\n".join(generar_tarjeta(row) for _, row in proximos.iterrows())
    tarjetas_pasados = "\n".join(generar_tarjeta(row) for _, row in pasados.iterrows())

    html = f"""<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Eventos PC Puma</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet">
  <link rel="stylesheet" href="../css/style.css">
</head>
<body>

<header class="bg-primary text-white text-center py-3">
  <h1 class="h4">Agenda de Eventos PC Puma</h1>
</header>

<main class="container py-5">
  <div class="text-center mb-4">
    <button class="btn btn-outline-primary filtro-evento mx-1" data-tipo="todos">Todos</button>
    <button class="btn btn-outline-primary filtro-evento mx-1" data-tipo="curso">Curso</button>
    <button class="btn btn-outline-primary filtro-evento mx-1" data-tipo="webinar">Webinar</button>
    <button class="btn btn-outline-primary filtro-evento mx-1" data-tipo="taller">Taller</button>
  </div>

  <ul class="nav nav-tabs justify-content-center mb-4">
    <li class="nav-item">
      <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#proximos" type="button">Próximos</button>
    </li>
    <li class="nav-item">
      <button class="nav-link" data-bs-toggle="tab" data-bs-target="#pasados" type="button">Pasados</button>
    </li>
  </ul>

  <div class="tab-content">
    <div class="tab-pane fade show active" id="proximos">
      <div class="row">{tarjetas_proximos}</div>
    </div>
    <div class="tab-pane fade" id="pasados">
      <div class="row">{tarjetas_pasados}</div>
    </div>
  </div>
</main>

<footer class="bg-dark text-white text-center py-4 mt-5">
  <small>Hecho en México. Universidad Nacional Autónoma de México (UNAM). Todos los derechos reservados 2025.</small>
</footer>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
<script>
  let tipoSeleccionado = "todos";

  function aplicarFiltros() {{
    const tipo = tipoSeleccionado;
    document.querySelectorAll(".tab-pane.active .evento-card").forEach((card) => {{
      const tipoClase = Array.from(card.classList).find(c => c.startsWith("evento-"));
      if (!tipoClase || tipo === "todos" || card.classList.contains(`evento-${{tipo}}`)) {{
        card.parentElement.style.display = "block";
      }} else {{
        card.parentElement.style.display = "none";
      }}
    }});
  }}

  document.querySelectorAll(".filtro-evento").forEach((btn) => {{
    btn.addEventListener("click", () => {{
      tipoSeleccionado = btn.getAttribute("data-tipo");
      aplicarFiltros();
    }});
  }});

  document.querySelectorAll('[data-bs-toggle="tab"]').forEach((tabBtn) => {{
    tabBtn.addEventListener("shown.bs.tab", () => {{
      aplicarFiltros();
    }});
  }});

  window.addEventListener("DOMContentLoaded", aplicarFiltros);
</script>

</body>
</html>
"""

    with open(salida, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"Archivo generado: {salida}")

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        generar_eventos_html(sys.argv[1])
    else:
        print("Uso: python generar_eventos.py plantilla_eventos_pc_puma.xlsx")
