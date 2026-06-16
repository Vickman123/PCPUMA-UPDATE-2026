import pandas as pd
import re
import os

# Cargar Excel y HTML en la misma carpeta
EXCEL_FILE = "plantilla_entidades_pc_puma.xlsx"
HTML_FILE = "../index.html"

# Leer Excel
df = pd.read_excel(EXCEL_FILE)

# Generar secciones
logo_cards_html = '<div class="row justify-content-center g-4 mt-4" data-aos="fade-up">\n'
modals_html = ''

for i, row in df.iterrows():
    entidad = row['Entidad']
    nombre_completo = row['Nombre Completo']
    fecha = row['Fecha Integración']
    director = row['Director(a)']
    secretario = row['Secretario(a) General']
    ti = row['Responsable de TI']
    logo = row['Archivo Logo']
    modal_id = f"modal{i+1}"

    logo_cards_html += f"""  <div class="col-4 col-md-2">
    <div class="entidad-logo" data-bs-toggle="modal" data-bs-target="#{modal_id}">
      <img src="img/logos/{logo}" alt="{entidad}">
    </div>
    <div class="entidad-nombre">{entidad}</div>
  </div>\n"""

    modals_html += f"""
<!-- Modal {entidad} -->
<div class="modal fade" id="{modal_id}" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header bg-pcpuma text-white">
        <h5 class="modal-title">{nombre_completo}</h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        <p><strong>Fecha de integración:</strong> {fecha}</p>
        <p><strong>Director(a):</strong> {director}</p>
        <p><strong>Secretario(a) General:</strong> {secretario}</p>
        <p><strong>Responsable de TI:</strong> {ti}</p>
      </div>
    </div>
  </div>
</div>\n"""

logo_cards_html += '</div>'

bloque_html_final = f"""
<!-- SECCIÓN INTERACTIVA DE LOGOTIPOS -->
<section class="container-fluid py-5 text-center text-white" style="background-color: #005BA8; background-image: url('img/fotos/network-pattern.svg'); background-size: cover;">
  <h2 data-aos="fade-down">Entidades que integran el programa</h2>
  {logo_cards_html}
</section>

{modals_html}
"""

# Leer HTML
with open(HTML_FILE, "r", encoding="utf-8") as f:
    html = f.read()

# Eliminar sección anterior si existe
html = re.sub(r"<!-- SECCIÓN INTERACTIVA DE LOGOTIPOS -->.*?</section>\s*(<div class=\"modal fade.*?</div>\s*)*", "", html, flags=re.DOTALL)

# Insertar después de la primera sección (tarjetas)
html = html.replace("</section>", "</section>\n" + bloque_html_final, 1)

# Guardar el nuevo archivo
with open(HTML_FILE, "w", encoding="utf-8") as f:
    f.write(html)

print("✅ Sección de entidades insertada con éxito en index.html")
