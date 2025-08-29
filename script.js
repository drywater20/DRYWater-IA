let idiomaActual = 'es';
let obras = [];

async function cargarObras() {
  const respuesta = await fetch('obras.json');
  obras = await respuesta.json();
  renderizarGaleria();
}

function renderizarGaleria() {
  const contenedor = document.getElementById('galeria');
  contenedor.innerHTML = '';

  obras.forEach((obra, index) => {
    const div = document.createElement('div');
    div.className = 'obra';
    div.innerHTML = `<img src="${obra.ruta}" alt="${obra.titulo[idiomaActual]}" />`;
    div.addEventListener('click', () => mostrarModal(index));
    contenedor.appendChild(div);
  });

  document.getElementById('titulo').innerText =
    idiomaActual === 'es' ? 'Galería de Arte' :
    idiomaActual === 'en' ? 'Art Gallery' :
    idiomaActual === 'fr' ? 'Galerie d\'Art' :
    '????????';
}

function cambiarIdioma(nuevoIdioma) {
  idiomaActual = nuevoIdioma;
  renderizarGaleria();
  cerrarModal(); // por si estaba abierto
}

function mostrarModal(index) {
  const obra = obras[index];
  document.getElementById('modal-img').src = obra.ruta;
  document.getElementById('modal-titulo').innerText = obra.titulo[idiomaActual];
  document.getElementById('modal-descripcion').innerText = obra.descripcion[idiomaActual];
  document.getElementById('modal').classList.remove('hidden');
}

function cerrarModal() {
  document.getElementById('modal').classList.add('hidden');
}

cargarObras();
