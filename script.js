// script.js
import { obras } from './obras.json' assert { type: 'json' };

const idiomaDefault = 'es';
let obrasFiltradas = [];
let obraActualIndex = 0;
let comentariosGuardados = JSON.parse(localStorage.getItem('comentarios')) || {};
let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];

const textos = {
  es: {
    tituloPrincipal: "Galería de Arte Marítimo",
    descripcionPrincipal: "Descubre el arte inspirado en el océano.",
    filtroLabel: "Filtrar por estilo:",
    idiomaLabel: "Idioma:",
    comentarios: "Comentarios",
    enviar: "Enviar",
    todos: "todos"
  },
  en: {
    tituloPrincipal: "Marine Art Gallery",
    descripcionPrincipal: "Discover art inspired by the ocean.",
    filtroLabel: "Filter by style:",
    idiomaLabel: "Language:",
    comentarios: "Comments",
    enviar: "Send",
    todos: "all"
  },
  fr: {
    tituloPrincipal: "Galerie d'art marin",
    descriptionPrincipal: "Découvrez l'art inspiré par l'océan.",
    filtroLabel: "Filtrer par style :",
    idiomaLabel: "Langue :",
    comentarios: "Commentaires",
    enviar: "Envoyer",
    todos: "tous"
  },
  ja: {
    tituloPrincipal: "海洋アートギャラリー",
    descripcionPrincipal: "海にインスパイアされたアートを発見してください。",
    filtroLabel: "スタイルでフィルター:",
    idiomaLabel: "言語:",
    comentarios: "コメント",
    enviar: "送信",
    todos: "すべて"
  }
};

const estilos = {
  peces: { es: "peces", en: "fish", fr: "poissons", ja: "魚" },
  calamares: { es: "calamares", en: "squids", fr: "calmars", ja: "イカ" },
  varios: { es: "varios", en: "various", fr: "divers", ja: "様々な" },
  otros: { es: "otros", en: "others", fr: "autres", ja: "その他" }
};

let idiomaActual = localStorage.getItem('idioma') || idiomaDefault;

function traducir(key) {
  return textos[idiomaActual]?.[key] || key;
}

function traducirEstilo(estilo) {
  return estilos[estilo]?.[idiomaActual] || estilo;
}

function actualizarInterfaz() {
  document.getElementById('tituloPrincipal').textContent = traducir('tituloPrincipal');
  document.getElementById('descripcionPrincipal').textContent = traducir('descripcionPrincipal');
  document.getElementById('labelFiltro').textContent = traducir('filtroLabel');
  document.getElementById('labelIdioma').textContent = traducir('idiomaLabel');
  document.getElementById('labelComentarios').textContent = traducir('comentarios');
  document.getElementById('btnEnviar').textContent = traducir('enviar');
  const filtro = document.getElementById('filtroEstilo');
  if (filtro) {
    const selected = filtro.value;
    filtro.innerHTML = '';
    const option = document.createElement('option');
    option.value = 'todos';
    option.textContent = traducir('todos');
    filtro.appendChild(option);
    Object.keys(estilos).forEach(estilo => {
      const opt = document.createElement('option');
      opt.value = estilo;
      opt.textContent = traducirEstilo(estilo);
      filtro.appendChild(opt);
    });
    filtro.value = selected;
  }
}

function cargarGaleria(obras) {
  const galeria = document.getElementById('galeria');
  galeria.innerHTML = '';
  obras.forEach(obra => {
    const div = document.createElement('div');
    div.className = 'obra';
    div.innerHTML = `
      <img src="${obra.imagen}" alt="${obra.titulo[idiomaActual]}">
      <div class="obra-info">
        <h3>${obra.titulo[idiomaActual]}</h3>
        <button class="favorite-btn ${favoritos.includes(obra.id) ? 'favorito' : ''}" data-id="${obra.id}">★</button>
      </div>
    `;
    div.addEventListener('click', () => abrirModal(obra));
    galeria.appendChild(div);
  });

  // Añadir eventos a los botones de favoritos
  document.querySelectorAll('.favorite-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      const index = favoritos.indexOf(id);
      if (index === -1) {
        favoritos.push(id);
        btn.classList.add('favorito');
      } else {
        favoritos.splice(index, 1);
        btn.classList.remove('favorito');
      }
      localStorage.setItem('favoritos', JSON.stringify(favoritos));
    });
  });
}

function abrirModal(obra) {
  const modal = document.getElementById('modal');
  const obrasList = obrasFiltradas;
  obraActualIndex = obrasList.findIndex(o => o.id === obra.id);
  actualizarModal(obra);
  modal.style.display = 'block';
}

function actualizarModal(obra) {
  document.getElementById('modalImagen').src = obra.imagen;
  document.getElementById('modalTitulo').textContent = obra.titulo[idiomaActual];
  document.getElementById('modalDescripcion').textContent = obra.descripcion[idiomaActual];
  document.getElementById('inputComentarios').value = comentariosGuardados[obra.id] || '';
  document.getElementById('btnFavorito').dataset.id = obra.id;
  document.getElementById('btnFavorito').classList.toggle('favorito', favoritos.includes(obra.id));
}

function cerrarModal() {
  document.getElementById('modal').style.display = 'none';
}

function cambiarObra(delta) {
  const obrasList = obrasFiltradas;
  obraActualIndex = (obraActualIndex + delta + obrasList.length) % obrasList.length;
  actualizarModal(obrasList[obraActualIndex]);
}

function guardarComentario() {
  const id = document.getElementById('btnFavorito').dataset.id;
  const texto = document.getElementById('inputComentarios').value;
  comentariosGuardados[id] = texto;
  localStorage.setItem('comentarios', JSON.stringify(comentariosGuardados));
}

function aplicarFiltro() {
  const filtro = document.getElementById('filtroEstilo').value;
  obrasFiltradas = filtro === 'todos' ? obras : obras.filter(o => o.estilo === filtro);
  cargarGaleria(obrasFiltradas);
}

function escucharTexto() {
  const texto = traducir('descripcionPrincipal');
  const utterance = new SpeechSynthesisUtterance(texto);
  const voices = speechSynthesis.getVoices();
  const langMap = { es: 'es-ES', en: 'en-US', fr: 'fr-FR', ja: 'ja-JP' };
  const voice = voices.find(v => v.lang.startsWith(langMap[idiomaActual])) || null;
  if (voice) utterance.voice = voice;
  utterance.lang = langMap[idiomaActual] || 'es-ES';
  speechSynthesis.speak(utterance);
}

// Eventos
document.getElementById('selectorIdioma').addEventListener('change', (e) => {
  idiomaActual = e.target.value;
  localStorage.setItem('idioma', idiomaActual);
  actualizarInterfaz();
  aplicarFiltro();
  if (document.getElementById('modal').style.display === 'block') {
    const obrasList = obrasFiltradas;
    actualizarModal(obrasList[obraActualIndex]);
  }
});

document.getElementById('filtroEstilo').addEventListener('change', aplicarFiltro);

document.getElementById('btnEnviar').addEventListener('click', guardarComentario);

document.querySelector('.close').addEventListener('click', cerrarModal);

document.getElementById('btnFavorito').addEventListener('click', (e) => {
  e.stopPropagation();
  const id = e.target.dataset.id;
  const btn = e.target;
  if (favoritos.includes(id)) {
    favoritos = favoritos.filter(f => f !== id);
    btn.classList.remove('favorito');
  } else {
    favoritos.push(id);
    btn.classList.add('favorito');
  }
  localStorage.setItem('favoritos', JSON.stringify(favoritos));
});

document.querySelector('.prev').addEventListener('click', () => cambiarObra(-1));
document.querySelector('.next').addEventListener('click', () => cambiarObra(1));

document.getElementById('btnEscuchar').addEventListener('click', escucharTexto);

// Inicialización
window.addEventListener('load', () => {
  speechSynthesis.getVoices(); // precargar voces
  actualizarInterfaz();
  aplicarFiltro();
});

window.onclick = function(event) {
  const modal = document.getElementById('modal');
  if (event.target === modal) {
    cerrarModal();
  }
};