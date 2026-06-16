
import pandas as pd
from datetime import datetime

df = pd.read_excel("plantilla_eventos_pc_puma_completa.xlsx")
hoy = pd.Timestamp.today().normalize()
df["inicio"] = pd.to_datetime(df["inicio"])
df["es_pasado"] = df["inicio"] < hoy

iconos = {
    "webinar": "bi-laptop",
    "taller": "bi-tools",
    "curso": "bi-journal-code",
    "conferencia": "bi-mic",
    "livestream": "bi-broadcast"
}

def generar_html_eventos(df_filtrado):
    bloques = []
    for _, evento in df_filtrado.iterrows():
        tipo = evento["tipo"].strip().lower()
        icono = iconos.get(tipo, "bi-calendar-event")
        badge_html = f"<span class='badge rounded-pill bg-light border text-dark mb-2 d-inline-flex align-items-center gap-1'><i class='bi {icono}'></i> {tipo.capitalize()}</span>"

        card = f"""
<div class='col-md-4 mb-4 evento-card evento-{tipo}' data-aos='fade-up' data-aos-delay='100'>
  <div class='card h-100 shadow-sm'>
    <div class='card-body'>
      {badge_html}
      <h5 class='card-title fw-bold text-dark'>{evento['titulo']}</h5>
      <p class='card-text'><strong>Fecha:</strong> {evento['inicio'].strftime('%d/%m/%Y')}<br/>
      <strong>Modalidad:</strong> {evento['modalidad']}<br/>
      <strong>Ponente:</strong> {evento['ponente']}<br/>
      <strong>Público:</strong> {evento['publico']}</p>
      <p class='card-text'>{evento['descripcion']}</p>
      <a class='btn btn-outline-primary btn-sm me-2' title='Descargar convocatoria PDF' href='{evento['archivo_convocatoria']}' target='_blank'>
        <i class='bi bi-file-earmark-pdf'></i> Convocatoria
      </a>
      <a class='btn btn-outline-secondary btn-sm' title='Agregar al calendario' href='{evento['archivo_calendario']}' target='_blank'>
        <i class='bi bi-calendar-event'></i> Calendario
      </a>
    </div>
  </div>
</div>
"""
        bloques.append(card)
    return "\n".join(bloques)

with open("../paginas/eventos.html", "w", encoding="utf-8") as f:
    f.write(f"""
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8"/>
  <title>Eventos 2025 · PC Puma</title>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <link href="../css/style.css" rel="stylesheet"/>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet"/>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet"/>
  <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet"/>
</head>
<body>
<nav class="navbar navbar-expand-lg navbar-dark bg-pcpuma sticky-top">
  <div class="container-fluid">
    <img src="../img/logos/unam.png" class="logo me-2" style="height: 40px;" alt="UNAM"/>
    <img src="../img/logos/sdi.png" class="logo me-3" style="height: 40px;" alt="SDI"/>
    <a class="navbar-brand" href="../index.html"><img src="../img/logos/logo-pcpuma.png" height="40" alt="PC Puma"/></a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
        <li class="nav-item"><a class="nav-link" href="nosotros.html"><i class="bi bi-info-circle"></i> Nosotros</a></li>
        <li class="nav-item"><a class="nav-link" href="estudiantes.html"><i class="bi bi-laptop"></i> Estudiantes</a></li>
        <li class="nav-item"><a class="nav-link" href="docentes.html"><i class="bi bi-person"></i> Docentes</a></li>
        <li class="nav-item"><a class="nav-link" href="admin.html"><i class="bi bi-gear"></i> TI</a></li>
        <li class="nav-item"><a class="nav-link active" href="eventos.html"><i class="bi bi-calendar"></i> Eventos</a></li>
        <li class="nav-item"><a class="nav-link" href="faq.html"><i class="bi bi-question-circle"></i> FAQ</a></li>
        <li class="nav-item"><a class="nav-link" href="contacto.html"><i class="bi bi-envelope"></i> Contacto</a></li>
      </ul>
    </div>
  </div>
</nav>

<header class="bg-primary text-white py-3 text-center">
  <h1 class="h4">Agenda de Eventos · PC Puma 2025</h1>
</header>

<main class="container py-5">
  <ul class="nav nav-tabs justify-content-center mb-4" id="eventoTabs" role="tablist">
    <li class="nav-item">
      <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#proximos" type="button">Próximos</button>
    </li>
    <li class="nav-item">
      <button class="nav-link" data-bs-toggle="tab" data-bs-target="#pasados" type="button">Pasados</button>
    </li>
  </ul>
  <div class="tab-content">
    <div class="tab-pane fade show active" id="proximos">
      <div class="row">
        {generar_html_eventos(df[df["es_pasado"] == False])}
      </div>
    </div>
    <div class="tab-pane fade" id="pasados">
      <div class="row">
        {generar_html_eventos(df[df["es_pasado"] == True])}
      </div>
    </div>
  </div>
</main>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
<script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
<script>AOS.init();</script>
</body>
</html>
""")
