
import pandas as pd
from bs4 import BeautifulSoup

def integrar_entidades_a_index(excel_path, html_path, output_path):
    # Leer HTML
    with open(html_path, "r", encoding="utf-8") as f:
        soup = BeautifulSoup(f, "html.parser")

    # Leer Excel
    df = pd.read_excel(excel_path)
    df["Entidad"] = df["Entidad"].str.strip().str.upper()
    df["Archivo Logo"] = df["Archivo Logo"].str.strip()

    # Detectar ya integradas
    ya_presentes = {
        img["alt"].strip().upper()
        for img in soup.select("div.entidad-logo img[alt]")
    }

    # Filtrar nuevas y ordenar
    df_nuevas = df[~df["Entidad"].isin(ya_presentes)].sort_values("Entidad")

    # Contenedor de tarjetas
    grid = soup.select_one(".row.justify-content-center.g-4.mt-4")

    for _, row in df_nuevas.iterrows():
        nombre = row["Entidad"]
        logo = row["Archivo Logo"]
        modal_id = "modal-" + nombre.replace(" ", "").replace(".", "")

        tarjeta = BeautifulSoup(f"""
        <div class="col-4 col-md-2">
          <div class="entidad-logo" data-bs-toggle="modal" data-bs-target="#{modal_id}">
            <img src="img/logos/{logo}" alt="{nombre}"/>
          </div>
          <div class="entidad-nombre">{nombre}</div>
        </div>
        """, "html.parser")
        grid.append(tarjeta)

        modal = BeautifulSoup(f"""
        <!-- Modal {nombre} -->
        <div class="modal fade" id="{modal_id}" tabindex="-1">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header bg-pcpuma text-white">
                <h5 class="modal-title">{row['Nombre Completo']}</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
              </div>
              <div class="modal-body" style="color:#000;">
                <p><strong>Fecha de integración:</strong> {row['Fecha Integración']}</p>
                <p><strong>Director(a):</strong> {row['Director(a)']}</p>
                <p><strong>Secretario(a) General:</strong> {row['Secretario(a) General']}</p>
                <p><strong>Responsable de TI:</strong> {row['Responsable de TI']}</p>
              </div>
            </div>
          </div>
        </div>
        """, "html.parser")
        soup.body.append(modal)

    # Actualizar cifra
    span_cifra = soup.find("span", {"id": "cifra_entidades"})
    if span_cifra:
        span_cifra.string = str(df["Entidad"].nunique())

    # Guardar nuevo HTML
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(str(soup))

    print("✔ Proceso completado: entidades agregadas y contador actualizado.")

# Ejemplo de uso:
# integrar_entidades_a_index("plantilla_entidades_pc_puma.xlsx", "index.html", "index_actualizado.html")
