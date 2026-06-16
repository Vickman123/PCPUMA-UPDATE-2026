
import pandas as pd
from bs4 import BeautifulSoup

index_path = "../index.html"
excel_path = "plantilla_entidades_pc_puma.xlsx"
output_path = "../index.html"

with open(index_path, "r", encoding="utf-8") as f:
    soup = BeautifulSoup(f, "html.parser")

df = pd.read_excel(excel_path)

id_map = {row['Entidad'].strip(): row['Entidad'].strip().lower().replace(" ", "_").replace(".", "") for _, row in df.iterrows()}

# Crear sección visual
entidades_section = soup.new_tag("section", attrs={"class": "bg-azul text-white py-5 position-relative"})
entidades_section["style"] = "background-color: #004a99; overflow: hidden;"
container = soup.new_tag("div", attrs={"class": "container text-center position-relative"})
title = soup.new_tag("h2", attrs={"class": "text-white mb-4"})
title.string = "Entidades que integran el programa"
container.append(title)

logos_row = soup.new_tag("div", attrs={"class": "d-flex justify-content-center flex-wrap gap-4"})

for _, row in df.iterrows():
    entidad = row["Entidad"].strip()
    logo_path = f"img/logos/{row['Archivo Logo'].strip()}"
    modal_id = id_map[entidad]

    div = soup.new_tag("div", attrs={
        "class": "text-center entidad-logo",
        "data-bs-toggle": "modal",
        "data-bs-target": f"#{modal_id}"
    })
    img = soup.new_tag("img", src=logo_path, alt=entidad, attrs={"class": "rounded-circle", "style": "width:100px; height:100px;"})
    label = soup.new_tag("p", attrs={"class": "fw-bold text-white mt-2"})
    label.string = entidad
    div.append(img)
    div.append(label)
    logos_row.append(div)

container.append(logos_row)
entidades_section.append(container)
particle_div = soup.new_tag("div", attrs={"id": "particles-js", "style": "position:absolute;top:0;left:0;width:100%;height:100%;z-index:0;"})
entidades_section.insert(0, particle_div)

# Insertar sección
for s in soup.find_all("section"):
    if s.find("h2", string="Entidades que integran el programa"):
        s.decompose()
footer = soup.find("footer")
footer.insert_before(entidades_section)

# Insertar modales
for _, row in df.iterrows():
    id_modal = id_map[row['Entidad'].strip()]
    nombre = row['Entidad'].strip()
    descripcion = f'''
    <p><strong>Nombre completo:</strong> {row["Nombre Completo"]}</p>
    <p><strong>Fecha de integración:</strong> {row["Fecha Integración"]}</p>
    <p><strong>Director(a):</strong> {row["Director(a)"]}</p>
    <p><strong>Secretario(a) General:</strong> {row["Secretario(a) General"]}</p>
    <p><strong>Responsable de TI:</strong> {row["Responsable de TI"]}</p>
    '''

    modal = soup.new_tag("div", attrs={
        "class": "modal fade", "id": id_modal, "tabindex": "-1",
        "aria-labelledby": f"{id_modal}Label", "aria-hidden": "true"
    })
    modal_dialog = soup.new_tag("div", attrs={"class": "modal-dialog modal-dialog-centered"})
    modal_content = soup.new_tag("div", attrs={"class": "modal-content"})
    modal_header = soup.new_tag("div", attrs={"class": "modal-header"})
    modal_title = soup.new_tag("h5", attrs={"class": "modal-title", "id": f"{id_modal}Label"})
    modal_title.string = nombre
    close_btn = soup.new_tag("button", attrs={"type": "button", "class": "btn-close", "data-bs-dismiss": "modal", "aria-label": "Cerrar"})
    modal_body = soup.new_tag("div", attrs={"class": "modal-body"})
    modal_body.append(BeautifulSoup(descripcion, "html.parser"))

    modal_header.append(modal_title)
    modal_header.append(close_btn)
    modal_content.append(modal_header)
    modal_content.append(modal_body)
    modal_dialog.append(modal_content)
    modal.append(modal_dialog)
    soup.body.append(modal)

# Partículas
script_tag = soup.new_tag("script", src="https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js")
init_script = soup.new_tag("script")
init_script.string = '''
particlesJS("particles-js", {
  particles: {
    number: { value: 40 }, color: { value: "#ffffff" },
    shape: { type: "circle" }, opacity: { value: 0.5 }, size: { value: 3 },
    line_linked: { enable: true, distance: 150, color: "#ffffff", opacity: 0.4, width: 1 },
    move: { enable: true, speed: 2 }
  },
  interactivity: { events: { onhover: { enable: true, mode: "repulse" } } },
  retina_detect: true
});
'''
soup.body.append(script_tag)
soup.body.append(init_script)

with open(output_path, "w", encoding="utf-8") as f:
    f.write(str(soup))
print("Entidades integradas correctamente.")
