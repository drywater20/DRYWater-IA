// Variables
let obras = [];
let obrasFiltradas = [];
let currentLang = 'es';
let utterance = null;
let currentIndex = 0;
let modalVisible = false;

// Traducciones para textos estáticos
const traducciones = {
  'es': {
    'filtro_label': 'Filtrar por estilo:',
    'todos': 'Todos los estilos',
    'comentarios': 'Comentarios',
    'placeholder': 'Escribe un comentario...',
    'enviar': 'Enviar'
  },
  'en': {
    'filtro_label': 'Filter by style:',
    'todos': 'All styles',
    'comentarios': 'Comments',
    'placeholder': 'Write a comment...',
    'enviar': 'Send'
  },
  'fr': {
    'filtro_label': 'Filtrer par style :',
    'todos': 'Tous les styles',
    'comentarios': 'Commentaires',
    'placeholder': 'Écrivez un commentaire...',
    'enviar': 'Envoyer'
  },
  'ja': {
    'filtro_label': 'スタイルでフィルター:',
    'todos': 'すべてのスタイル',
    'comentarios': 'コメント',
    'placeholder': 'コメントを書いてください...',
    'enviar': '送信'
  }
};

// Mapeo de estilos traducidos
const estiloTraducido = {
  'peces': { es: 'peces', en: 'fish', fr: 'poissons', ja: '魚' },
  'calamares': { es: 'calamares', en: 'squids', fr: 'calmars', ja: 'イカ' },
  'varios': { es: 'varios', en: 'various', fr: 'divers', ja: '様々な' },
  'otros': { es: 'otros', en: 'others', fr: 'autres', ja: 'その他' }
};

// Inicializar favoritos
window.favoritos = [];

// Cargar obras.json
fetch('obras.json')
  .then(res => {
    if (!res.ok) throw new Error('No se pudo cargar obras.json');
    return res.json();
  })
  .then(data => {
    // Filtrar obras: quitar fondo, header, etc.
    const excluidas = ['fondo', 'header', 'cabecera', 'horizontal'];
    obras = data.obras.filter(obra => {
      const nombre = obra.imagen.toLowerCase();
      return !excluidas.some(palabra => nombre.includes(palabra));
    });

    obrasFiltradas = [...obras];

    // Inicializar UI
    mostrarFiltros(data.estilos);
    cambiarIdioma(currentLang);
    cargarFavoritos();
    mostrarGaleria();
    utterance = new SpeechSynthesisUtterance();
  })
  .catch(err => {
    console.error('❌ Error al cargar obras.json:', err);
    alert('Error al cargar los datos. Revisa la consola (F12).');
  });

// Cambiar idioma
function cambiarIdioma(lang) {
  currentLang = lang;

  fetch('obras.json')
    .then(res => res.json())
    .then(data => {
      const textoInicio = document.getElementById('texto-inicio');
      if (textoInicio && data.texto_inicio) {
        textoInicio.textContent = data.texto_inicio.descripcion_inicio[lang];
      }

      // Actualizar textos estáticos
      document.getElementById('label-filtro').textContent = traducciones[lang].filtro_label;
      document.getElementById('titulo-comentarios').textContent = traducciones[lang].comentarios;
      document.getElementById('nuevo-comentario').placeholder = traducciones[lang].placeholder;
      document.getElementById('btn-enviar').textContent = traducciones[lang].enviar;

      // Actualizar opción "Todos"
      const selector = document.getElementById('selector-estilo');
      const primeraOpcion = selector.querySelector('option[value="todos"]');
      if (primeraOpcion) {
        primeraOpcion.textContent = traducciones[lang].todos;
      }

      // Actualizar estilos en el desplegable
      Array.from(selector.options).forEach(opt => {
        if (opt.value !== 'todos' && estiloTraducido[opt.value]) {
          opt.textContent = estiloTraducido[opt.value][currentLang];
        }
      });

      mostrarGaleria();
    })
    .catch(console.error);
}

// Mostrar filtros
function mostrarFiltros(estilos) {
  const selector = document.getElementById('selector-estilo');
  selector.innerHTML = `<option value="todos">${traducciones[currentLang].todos}</option>`;

  estilos.forEach(estilo => {
    const option = document.createElement('option');
    option.value = estilo;
    option.textContent = estiloTraducido[estilo]?.[currentLang] || estilo;
    selector.appendChild(option);
  });
}

// Filtrar obras
function filtrarObras() {
  const estilo = document.getElementById('selector-estilo').value;
  if (estilo === 'todos') {
    obrasFiltradas = [...obras];
  } else {
    obrasFiltradas = obras.filter(obra => obra.estilo === estilo);
  }
  mostrarGaleria();
}

// Mostrar galería
function mostrarGaleria() {
  const galeria = document.getElementById('galeria');
  if (!galeria) return;
  galeria.innerHTML = '';

  obrasFiltradas.forEach((obra, idx) => {
    const obraIndex = obras.indexOf(obra);
    const div = document.createElement('div');
    div.className = 'obra';
    div.onclick = () => abrirModal(obraIndex);

    const img = document.createElement('img');
    img.src = obra.imagen;
    img.alt = obra.titulo[currentLang] || 'Obra de arte';

    // Botón de favorito
    const btnFav = document.createElement('button');
    btnFav.className = 'favorito';
    btnFav.innerHTML = '★';
    btnFav.dataset.index = obraIndex;
    if (esFavorito(obraIndex)) btnFav.classList.add('favorito-activo');
    btnFav.onclick = (e) => {
      e.stopPropagation();
      toggleFavorito(obraIndex, btnFav);
    };

    // Etiqueta de estilo traducido
    const etiqueta = document.createElement('div');
    etiqueta.className = 'etiqueta-estilo';
    etiqueta.textContent = estiloTraducido[obra.estilo]?.[currentLang] || obra.estilo;

    div.appendChild(img);
    div.appendChild(btnFav);
    div.appendChild(etiqueta);
    galeria.appendChild(div);
  });
}

// Favoritos
function cargarFavoritos() {
  try {
    const saved = localStorage.getItem('favoritos');
    window.favoritos = saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.error('Error al cargar favoritos:', e);
    window.favoritos = [];
  }
}

function esFavorito(index) {
  return window.favoritos.includes(index);
}

function toggleFavorito(index, btn) {
  const i = window.favoritos.indexOf(index);
  if (i === -1) {
    window.favoritos.push(index);
    btn.classList.add('favorito-activo');
  } else {
    window.favoritos.splice(i, 1);
    btn.classList.remove('favorito-activo');
  }
  localStorage.setItem('favoritos', JSON.stringify(window.favoritos));
}

// Modal
const modal = document.getElementById('modal');
const imgModal = document.getElementById('img-modal');
const tituloModal = document.getElementById('titulo-modal');
const descripcionModal = document.getElementById('descripcion-modal');
const btnCerrar = document.getElementById('btn-cerrar');
const btnAnterior = document.getElementById('anterior');
const btnSiguiente = document.getElementById('siguiente');

function abrirModal(index) {
  currentIndex = index;
  actualizarModal(index);
  cargarComentarios(index);
  modal.style.display = 'block';
  modalVisible = true;
}

function actualizarModal(index) {
  const obra = obras[index];
  imgModal.src = obra.imagen;
  imgModal.onerror = () => imgModal.src = 'https://picsum.photos/800/600?art';
  tituloModal.textContent = obra.titulo[currentLang];
  descripcionModal.textContent = obra.descripcion[currentLang];
}

function cargarComentarios(index) {
  const lista = document.getElementById('lista-comentarios');
  try {
    const comentarios = JSON.parse(localStorage.getItem(`comentarios_${index}`) || '[]');
    lista.innerHTML = comentarios.length === 0
      ? `<p style="color: #aaa;">${traducciones[currentLang].comentarios}: no hay aún.</p>`
      : comentarios.map(c => `<div class="comentario">${c}</div>`).join('');
  } catch (e) {
    console.error('Error al cargar comentarios:', e);
    lista.innerHTML = '<p style="color: red;">Error al cargar comentarios.</p>';
  }
}

function agregarComentario() {
  const input = document.getElementById('nuevo-comentario');
  const texto = input.value.trim();
  if (!texto) return;

  try {
    const comentarios = JSON.parse(localStorage.getItem(`comentarios_${currentIndex}`) || '[]');
    comentarios.push(texto);
    localStorage.setItem(`comentarios_${currentIndex}`, JSON.stringify(comentarios));
    input.value = '';
    cargarComentarios(currentIndex);
  } catch (e) {
    console.error('Error al guardar comentario:', e);
    alert('No se pudo guardar el comentario.');
  }
}

// Cerrar modal
btnCerrar.onclick = () => {
  modal.style.display = 'none';
  modalVisible = false;
};

btnAnterior.onclick = () => {
  currentIndex = (currentIndex - 1 + obras.length) % obras.length;
  actualizarModal(currentIndex);
  cargarComentarios(currentIndex);
};

btnSiguiente.onclick = () => {
  currentIndex = (currentIndex + 1) % obras.length;
  actualizarModal(currentIndex);
  cargarComentarios(currentIndex);
};

// Reproducir texto
function leerTexto() {
  const texto = document.getElementById('texto-inicio').textContent;
  if (!utterance) utterance = new SpeechSynthesisUtterance();
  utterance.text = texto;
  utterance.lang = { 'es': 'es-ES', 'en': 'en-US', 'fr': 'fr-FR', 'ja': 'ja-JP' }[currentLang];
  speechSynthesis.speak(utterance);
}

// Teclado
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') modal.style.display = 'none';
  if (modalVisible) {
    if (e.key === 'ArrowLeft') btnAnterior.click();
    if (e.key === 'ArrowRight') btnSiguiente.click();
  }
});