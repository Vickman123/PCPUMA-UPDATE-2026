
function agregarEntidadesAlMapa(lista) {
  lista.forEach(function(entidad) {
    let clase = "otro-icon";
    const n = entidad.nombre.toLowerCase();
    if (n.includes("fes")) clase = "fes-icon";
    else if (n.includes("facultad")) clase = "facultad-icon";
    else if (n.includes("enes")) clase = "enes-icon";
    else if (n.includes("preparatoria") || n.includes("enp")) clase = "enp-icon";
    else if (n.includes("cch")) clase = "cch-icon";
    else if (n.includes("instituto")) clase = "instituto-icon";

    const icono = L.icon({
      iconUrl: entidad.logo,
      iconSize: [60, 60],
      iconAnchor: [30, 60],
      popupAnchor: [0, -60],
      className: 'map-logo-icon ' + clase
    });

    L.marker(entidad.coords, { icon: icono })
      .addTo(map)
      .bindPopup(`<strong>${entidad.nombre}</strong>`);
  });
}

const nuevasEntidades = [
  { nombre: "Instituto de Física", coords: [19.326, -99.182], logo: "img/logos/IFISICA.png" },
  { nombre: "Instituto de Biología", coords: [19.313, -99.176], logo: "img/IBIOLOGÍA.png" },
  { nombre: "FES Zaragoza", coords: [19.3878, -99.0472], logo: "img/logos/FESZARAGOZA.png" },
  { nombre: "FES Iztacala", coords: [19.531, -99.215], logo: "img/logos/FESIZTACALA.png" },
  { nombre: "FES Cuautitlán", coords: [19.6922, -99.1902], logo: "img/logos/FESCUAUTITLAN.png" },
  { nombre: "FES Aragón", coords: [19.4757, -99.0446], logo: "img/logos/FESARAGON.png" },
  { nombre: "FES Acatlán", coords: [19.5117, -99.2394], logo: "img/logos/FESACATLAN.png" },
  { nombre: "Facultad de Psicología", coords: [19.3325, -99.182], logo: "img/logos/FPSICOLOGIA.png" },
  { nombre: "Facultad de Odontología", coords: [19.325, -99.184], logo: "img/FODONTOLOGÍA.JPG" },
  { nombre: "Facultad de Música", coords: [19.3546, -99.1561], logo: "img/logos/FMUSICA.png" },
  { nombre: "Facultad de Medicina Veterinaria y Zootecnia", coords: [19.3136, -99.186], logo: "img/logos/FMVZ.png" },
  { nombre: "Facultad de Medicina", coords: [19.3331, -99.1801], logo: "img/logos/FMEDICINA.png" },
  { nombre: "Facultad de Ingeniería", coords: [19.326, -99.184], logo: "img/FINGENIERÍA.png" },
  { nombre: "Facultad de Filosofía y Letras", coords: [19.334, -99.1869], logo: "img/logos/FFYL.png" },
  { nombre: "Facultad de Economía", coords: [19.3369, -99.1828], logo: "img/logos/FECONOMIA.png" },
  { nombre: "Facultad de Derecho", coords: [19.327, -99.182], logo: "img/logos/DERECHO.png" },
  { nombre: "Facultad de Ciencias Políticas y Sociales", coords: [19.3187, -99.1781], logo: "img/logos/FCPYS.png" },
  { nombre: "Facultad de Ciencias", coords: [19.3264, -99.1815], logo: "img/logos/FCIENCIAS.png" },
  { nombre: "Facultad de Artes y Diseño", coords: [19.4331, -99.1289], logo: "img/logos/FAD.png" },
  { nombre: "Facultad de Arquitectura", coords: [19.3306, -99.1873], logo: "img/logos/FARQUITECTURA.png" },
  { nombre: "ENES Oaxaca", coords: [17.0689, -96.7198], logo: "img/logos/ENESO.png" },
  { nombre: "ENES Morelia", coords: [19.6953, -101.1844], logo: "img/logos/ENESMORELIA.png" },
  { nombre: "ENES Mérida", coords: [21.0365, -89.6392], logo: "img/logos/ENESMERIDA.png" },
  { nombre: "ENES León", coords: [21.1526, -101.7116], logo: "img/logos/ENESLEON.png" },
  { nombre: "ENES Juriquilla", coords: [20.7036, -100.4436], logo: "img/logos/ENESJURIQUILLA.png" },
  { nombre: "Coordinación Mixta de Posgrado", coords: [19.3329, -99.1866], logo: "img/logos/POSGRADO.png" },
  { nombre: "CCH Vallejo", coords: [19.4828, -99.1477], logo: "img/logos/CCH.png" },
  { nombre: "CCH Sur", coords: [19.2905, -99.1617], logo: "img/logos/CCH.png" },
  { nombre: "CCH Oriente", coords: [19.4, -99.04], logo: "img/logos/CCH.png" },
  { nombre: "CCH Naucalpan", coords: [19.475, -99.239], logo: "img/logos/CCH.png" },
  { nombre: "CCH Azcapotzalco", coords: [19.489, -99.185], logo: "img/logos/CCH.png" },
  { nombre: "Unidad de Extensión Universitaria Oaxaca", coords: [17.0615, -96.725], logo: "img/logos/UEUO.png" },
];
agregarEntidadesAlMapa(nuevasEntidades);
