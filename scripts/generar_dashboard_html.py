import pandas as pd

def generar_html_dashboard_desde_excel(ruta_excel, ruta_salida_html):
    df = pd.read_excel(ruta_excel)

    buscador = """
<section class='container my-4'>
  <div class='row'>
    <div class='col-md-6 mx-auto text-center'>
      <input type='text' id='buscadorEntidades' class='form-control form-control-lg' placeholder='Buscar entidad...' onkeyup='filtrarEntidades()'>
    </div>
  </div>
</section>
"""

    tarjetas = '<section class="container my-5"><div class="row g-4" id="listaEntidades">\n'
    modales = ""

    for i, row in df.iterrows():
        id_modal = f"modalEntidad{i}"
        tarjetas += f'''
        <div class="col-md-4 col-lg-3 entidad-item">
          <div class="card shadow h-100 border-0" data-aos="fade-up">
            <div class="card-body text-center">
              <img src="{row["Archivo Logo (ubicado en /img)"]}" alt="{row["Entidad"]}" class="mb-3" style="width:60px;height:60px;border-radius:50%;object-fit:contain;box-shadow:0 0 6px rgba(0,0,0,0.3);">
              <h6 class="fw-bold">{row["Entidad"]}</h6>
              <button class="btn btn-outline-primary btn-sm mt-2" data-bs-toggle="modal" data-bs-target="#{id_modal}">Ver detalle</button>
            </div>
          </div>
        </div>
        '''

        modales += f'''
        <div class="modal fade" id="{id_modal}" tabindex="-1" aria-labelledby="{id_modal}Label" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header bg-primary text-white">
                <h5 class="modal-title" id="{id_modal}Label">{row["Entidad"]}</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Cerrar"></button>
              </div>
              <div class="modal-body text-center">
                <img src="{row["Archivo Logo (ubicado en /img)"]}" alt="{row["Entidad"]}" style="width:80px;height:80px;border-radius:50%;object-fit:contain;" class="mb-3">
                <ul class="list-group text-start">
                  <li class="list-group-item">📶 Antenas antes: <strong>{row["Antenas antes"]}</strong></li>
                  <li class="list-group-item">📶 Antenas PC Puma: <strong>{row["Antenas PC Puma"]}</strong></li>
                  <li class="list-group-item">💻 Laptops: <strong>{row["Laptops"]}</strong></li>
                  <li class="list-group-item">🔎 Chromebooks: <strong>{row["Chromebooks"]}</strong></li>
                  <li class="list-group-item">📱 iPads: <strong>{row["iPads"]}</strong></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        '''

    tarjetas += "</div></section>"

    script_filtro = """
<script>
function filtrarEntidades() {
  const input = document.getElementById('buscadorEntidades').value.toLowerCase();
  const tarjetas = document.querySelectorAll('.entidad-item');

  tarjetas.forEach(card => {
    const nombre = card.querySelector('h6').innerText.toLowerCase();
    card.style.display = nombre.includes(input) ? 'block' : 'none';
  });
}
</script>
"""

    html_completo = f"""
<!DOCTYPE html>
<html lang='es'>
<head>
  <meta charset='UTF-8'>
  <meta name='viewport' content='width=device-width, initial-scale=1'>
  <title>Dashboard TI - PC Puma</title>
  <link href='https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css' rel='stylesheet'>
  <script src='https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js'></script>
</head>
<body>
<header class='bg-primary text-white text-center py-4'>
  <h1 class='h4'>Dashboard Interactivo - PC Puma</h1>
</header>
<main class='container py-4'>
  {buscador}
  {tarjetas}
  {modales}
</main>
{script_filtro}
</body>
</html>
"""

    with open(ruta_salida_html, 'w', encoding='utf-8') as f:
        f.write(html_completo)
