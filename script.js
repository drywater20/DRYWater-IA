// Traducciones
const traducciones = {
  es: {
    titulo: "Galería de Arte",
    descripcion: "Disfruta de una colección única de arte marino.",
    filtro: "Filtrar por estilo:",
    comentarios: "Comentarios:",
    enviar: "Enviar",
    estilos: {
      peces: "peces",
      calamares: "calamares",
      varios: "varios",
      otros: "otros",
      todos: "todos"
    }
  },
  en: {
    titulo: "Art Gallery",
    descripcion: "Enjoy a unique collection of marine art.",
    filtro: "Filter by style:",
    comentarios: "Comments:",
    enviar: "Send",
    estilos: {
      peces: "fish",
      calamares: "squids",
      varios: "various",
      otros: "others",
      todos: "all"
    }
  },
  fr: {
    titulo: "Galerie d'Art",
    descripcion: "Profitez d'une collection unique d'art marin.",
    filtro: "Filtrer par style :",
    comentarios: "Commentaires :",
    enviar: "Envoyer",
    estilos: {
      peces: "poissons",
      calamares: "calmars",
      varios: "divers",
      otros: "autres",
      todos: "tous"
    }
  },
  ja: {
    titulo: "アートギャラリー",
    descripcion: "海洋アートのユニークなコレクションをお楽しみください。",
    filtro: "スタイルでフィルター:",
    comentarios: "コメント:",
    enviar: "送信",
    estilos: {
      peces: "魚",
      calamares: "イカ",
      varios: "様々な",
      otros: "その他",
      todos: "すべて"
    }
  }
};

let obras = [];
let currentLang = 'es';
let currentIndex = 0;

// Cargar obras
async function cargarObras() {
  try {
    const res = await fetch('obras.json');
    obras = await res.json();
    if (!Array.isArray(obras)) {
      console.error('obras.json no contiene un array');
      obras = [];
    }
  } catch (err) {
    console.error('Error cargando obras.json:', err);
    obras = [];
  }
}

// Inicializar
async function init() {
  await cargarObras();
  await traducirInterfaz();
  crearOpcionesFiltro();
  mostrarGaleria();
  configurarEventos();
}

// Traducir interfaz
function traducirInterfaz() {
  const t = traducciones[currentLang];
  document.getElementById('titulo').textContent = t.titulo;
  document.getElementById('descripcion').textContent = t.descripcion;
  document.getElementById('label-filtro').textContent = t.filtro;
  document.getElementById('label-comentarios').textContent = t.comentarios;
  document.getElementById('guardar-comentarios').textContent = t.enviar;

  // Traducir opción "todos" en el filtro
  const optionTodos = document.getElementById('option-todos');
  if (optionTodos) optionTodos.textContent = t.estilos.todos;

  // Traducir opciones de estilo
  document.querySelectorAll('[data-estilo]').forEach(opt => {
    const estilo = opt.getAttribute('data-estilo');
    opt.textContent = t.estilos[estilo] || estilo;
  });
}

// Crear opciones de filtro
function crearOpcionesFiltro() {
  const filtro = document.getElementById('filtro-estilo');
  filtro.innerHTML = `<option value="todos" id="option-todos">todos</option>`;
  const estilos = ['peces', 'calamares', 'varios', 'otros'];
  const t = traducciones[currentLang];
  estilos.forEach(estilo => {
    const opt = document.createElement('option');
    opt.value = estilo;
    opt.textContent = t.estilos[estilo];
    opt.setAttribute('data-estilo', estilo);
    filtro.appendChild(opt);
  });
}

// Mostrar galería
function mostrarGaleria() {
  const galeria = document.getElementById('galeria');
  galeria.innerHTML = '';

  const filtro = document.getElementById('filtro-estilo').value;
  const t = traducciones[currentLang];

  obras.forEach((obra, index) => {
    if (filtro !== 'todos' && obra.estilo !== filtro) return;

    const div = document.createElement('div');
    div.className = 'obra';
    div.innerHTML = `
      <img src="${obra.imagen}" alt="${obra.titulo[currentLang]}">
      <div class="obra-info">
        <h3>${obra.titulo[currentLang]}</h3>
        <div class="style">${t.estilos[obra.estilo] || obra.estilo}</div>
      </div>
    `;
    div.addEventListener('click', () => abrirModal(index));
    galeria.appendChild(div);
  });
}

// Modal
const modal = document.getElementById('modal');
const closeModal = () => modal.style.display = 'none';

function abrirModal(index) {
  currentIndex = index;
  const obra = obras[currentIndex];
  const t = traducciones[currentLang];

  document.getElementById('modal-img').src = obra.imagen;
  document.getElementById('modal-titulo').textContent = obra.titulo[currentLang];
  document.getElementById('modal-descripcion').textContent = obra.descripcion[currentLang];
  document.getElementById('modal-comentarios').value = obtenerComentario(obra.id) || '';

  // Favorito
  const fav = document.getElementById('btn-favorito');
  fav.textContent = esFavorito(obra.id) ? '★' : '☆';
  fav.classList.toggle('fav', esFavorito(obra.id));

  modal.style.display = 'block';
}

// Navegación modal
document.querySelector('.close').addEventListener('click', closeModal);
document.querySelector('.nav.prev').addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + obras.length) % obras.length;
  abrirModal(currentIndex);
});
document.querySelector('.nav.next').addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % obras.length;
  abrirModal(currentIndex);
});

// Comentarios y favoritos
function obtenerComentario(id) {
  return localStorage.getItem(`comentario_${id}`) || '';
}

function guardarComentario(id, texto) {
  localStorage.setItem(`comentario_${id}`, texto);
}

function esFavorito(id) {
  return localStorage.getItem(`favorito_${id}`) === 'true';
}

function toggleFavorito(id) {
  const esFav = !esFavorito(id);
  localStorage.setItem(`favorito_${id}`, esFav);
  return esFav;
}

// Eventos
function configurarEventos() {
  document.getElementById('idioma-select').addEventListener('change', (e) => {
    currentLang = e.target.value;
    traducirInterfaz();
    mostrarGaleria();
  });

  document.getElementById('filtro-estilo').addEventListener('change', () => {
    mostrarGaleria();
  });

  document.getElementById('guardar-comentarios').addEventListener('click', () => {
    const obra = obras[currentIndex];
    const texto = document.getElementById('modal-comentarios').value;
    guardarComentario(obra.id, texto);
  });

  document.getElementById('btn-favorito').addEventListener('click', () => {
    const obra = obras[currentIndex];
    const esFav = toggleFavorito(obra.id);
    const btn = document.getElementById('btn-favorito');
    btn.textContent = esFav ? '★' : '☆';
    btn.classList.toggle('fav', esFav);
  });

  document.getElementById('leer-texto').addEventListener('click', () => {
    const texto = document.getElementById('descripcion').textContent;
    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = currentLang === 'ja' ? 'ja-JP' :
                     currentLang === 'fr' ? 'fr-FR' :
                     currentLang === 'en' ? 'en-US' : 'es-ES';
    speechSynthesis.speak(utterance);
  });
}

// Iniciar
init();