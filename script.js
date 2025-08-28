// === Variables globales ===
let obras = [];
let currentImageIndex = 0;
let currentLang = 'es';

// === Función para leer texto en voz alta ===
function leerTexto(texto) {
  if (!texto || typeof texto !== 'string') return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(texto);
  
  const voices = window.speechSynthesis.getVoices();
  const langVoice = {
    es: voices.find(v => v.lang.includes('es')),
    en: voices.find(v => v.lang.includes('en')),
    fr: voices.find(v => v.lang.includes('fr')),
    ja: voices.find(v => v.lang.includes('ja'))
  };
  
  if (langVoice[currentLang]) {
    utterance.voice = langVoice[currentLang];
  }
  
  utterance.rate = 0.9;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

// === Hacer que un elemento sea leído al hacer clic ===
function hacerClicable(element, texto) {
  if (!element || !texto) return;
  element.style.cursor = 'pointer';
  element.addEventListener('click', (e) => {
    e.stopPropagation();
    leerTexto(texto);
  });
}

// === Cargar obras ===
async function cargarObras() {
  try {
    const response = await fetch('obras.json');
    if (!response.ok) throw new Error('No se pudo cargar obras.json: ' + response.status);
    obras = await response.json();
    renderizarGaleria();
  } catch (error) {
    console.error('❌ Error al cargar las obras:', error);
    document.getElementById('gallery').innerHTML = `
      <p style="color: red; text-align: center; margin: 20px;">
        ⚠️ No se pudieron cargar las imágenes.<br>
        Revisa la consola para más detalles.
      </p>
    `;
  }
}

// === Cambiar idioma ===
function changeLanguage() {
  const langSelect = document.getElementById('lang-select');
  if (!langSelect) return;
  currentLang = langSelect.value;

  const translations = {
    es: {
      title: "Galería de Arte",
      subtitle: "Disfruta de una colección única de arte marino.",
      intro: "Descubre un mundo fascinante y tridimensional en cada una de mis obras. Mis pinturas son una exploración innovadora del volumen y la perspectiva, realizadas dentro de grandes latas. Utilizando capas de resina y acrílico, pinto cada parte de un pez o calamar en distintas capas, creando una asombrosa sensación de profundidad y movimiento. Cada capa de resina encapsula una etapa del proceso creativo, permitiendo que las figuras marinas emerjan con realismo y vitalidad. A través de esta técnica, mis obras no solo invitan a ser observadas, sino también exploradas visualmente, ofreciendo una experiencia artística única que trasciende los límites del lienzo tradicional. Sumérgete en mi mundo submarino y déjate sorprender por la magia del volumen y la tridimensionalidad que cobra vida en cada una de mis latas.",
      filterLabel: "Filtrar por estilo:",
      optionAll: "todos",
      optionPeces: "peces",
      optionCalamares: "calamares",
      optionVarios: "varios",
      optionOtros: "otros",
      comments: "Comentarios:",
      send: "Enviar",
      speak: "Escuchar"
    },
    en: {
      title: "Art Gallery",
      subtitle: "Enjoy a unique collection of marine art.",
      intro: "Discover a fascinating and three-dimensional world in each of my works. My paintings are an innovative exploration of volume and perspective, made inside large cans. Using layers of resin and acrylic, I paint each part of a fish or squid in different layers, creating an amazing sense of depth and movement. Each layer of resin encapsulates a stage of the creative process, allowing the marine figures to emerge with realism and vitality. Through this technique, my works not only invite to be observed, but also visually explored, offering a unique artistic experience that transcends the limits of the traditional canvas. Immerse yourself in my underwater world and let yourself be surprised by the magic of volume and three-dimensionality that comes to life in each of my cans.",
      filterLabel: "Filter by style:",
      optionAll: "all",
      optionPeces: "fish",
      optionCalamares: "squid",
      optionVarios: "various",
      optionOtros: "others",
      comments: "Comments:",
      send: "Send",
      speak: "Listen"
    },
    fr: {
      title: "Galerie d'Art",
      subtitle: "Profitez d'une collection unique d'art marin.",
      intro: "Découvrez un monde fascinant et tridimensionnel dans chacune de mes œuvres. Mes peintures sont une exploration innovante du volume et de la perspective, réalisées dans de grandes boîtes de conserve. En utilisant des couches de résine et d'acrylique, je peins chaque partie d'un poisson ou d'un calmar en différentes couches, créant une incroyable sensation de profondeur et de mouvement. Chaque couche de résine encapsule une étape du processus créatif, permettant aux figures marines d'émerger avec réalisme et vitalité. Grâce à cette technique, mes œuvres invitent non seulement à être observées, mais aussi à être explorées visuellement, offrant une expérience artistique unique qui transcende les limites de la toile traditionnelle. Plongez-vous dans mon monde sous-marin et laissez-vous surprendre par la magie du volume et de la tridimensionnalité qui prend vie dans chacune de mes canettes.",
      filterLabel: "Filtrer par style :",
      optionAll: "tous",
      optionPeces: "poissons",
      optionCalamares: "calmars",
      optionVarios: "divers",
      optionOtros: "autres",
      comments: "Commentaires :",
      send: "Envoyer",
      speak: "Écouter"
    },
    ja: {
      title: "アートギャラリー",
      subtitle: "ユニークなマリンアートのコレクションをお楽しみください。",
      intro: "私の各作品の魅力的で三次元の世界を発見してください。私の絵画は、大きな缶の中で制作された、ボリュームと遠近感の革新的な探求です。樹脂とアクリルの層を使用して、魚やイカの各部分を異なる層でペイントし、驚くほどの奥行きと動きの感覚を生み出します。樹脂の各層は創造的なプロセスの段階をカプセル化し、海洋の人物をリアルかつ活力をもって浮かび上がらせることができます。この技術を通じて、私の作品は観察されるだけでなく、視覚的に探求されるようになり、従来のキャンバスの限界を超えたユニークな芸術的体験を提供します。 私の水中世界に浸って、私の缶のそれぞれに命が吹き込まれるボリュームと立体感の魔法に驚かれてください。",
      filterLabel: "スタイルでフィルター：",
      optionAll: "すべて",
      optionPeces: "魚",
      optionCalamares: "イカ",
      optionVarios: "その他",
      optionOtros: "その他",
      comments: "コメント：",
      send: "送信",
      speak: "聞く"
    }
  };

  const t = translations[currentLang];
  document.getElementById('main-title').textContent = t.title;
  document.getElementById('main-subtitle').textContent = t.subtitle;
  document.getElementById('intro-paragraph').textContent = t.intro;
  document.getElementById('filter-label').textContent = t.filterLabel;
  document.getElementById('comment-title').textContent = t.comments;
  document.getElementById('send-btn').textContent = t.send;
  document.getElementById('speak-all').textContent = t.speak;
  document.getElementById('option-all').textContent = t.optionAll;
  document.getElementById('option-peces').textContent = t.optionPeces;
  document.getElementById('option-calamares').textContent = t.optionCalamares;
  document.getElementById('option-varios').textContent = t.optionVarios;
  document.getElementById('option-otros').textContent = t.optionOtros;

  localStorage.setItem('selected-lang', currentLang);
  renderizarGaleria();
}

// === Renderizar galería (sin botones de compra ni precios) ===
function renderizarGaleria() {
  const gallery = document.getElementById('gallery');
  gallery.innerHTML = '';

  obras.forEach((obra, index) => {
    const titulo = obra.titulo[currentLang];
    const descripcion = obra.descripcion[currentLang];

    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-style', obra.estilo);

    card.innerHTML = `
      <div class="product-info">
        <h3>${titulo}</h3>
        <p class="description">${descripcion}</p>
      </div>
      <img src="${obra.imagen}" alt="${titulo}" loading="lazy">
    `;
    gallery.appendChild(card);

    hacerClicable(card.querySelector('h3'), titulo);
    hacerClicable(card.querySelector('.description'), descripcion);
    card.querySelector('img').onclick = () => openLightbox(index);
  });
}

// === Lightbox ===
function openLightbox(index) {
  currentImageIndex = index;
  actualizarLightbox();
  document.getElementById('lightbox').style.display = 'flex';
}

function closeLightbox() {
  document.getElementById('lightbox').style.display = 'none';
}

function changeImage(direction) {
  currentImageIndex = (currentImageIndex + direction + obras.length) % obras.length;
  actualizarLightbox();
}

function actualizarLightbox() {
  const obra = obras[currentImageIndex];
  const titulo = obra.titulo[currentLang];
  const descripcion = obra.descripcion[currentLang];

  document.getElementById('lightbox-img').src = obra.imagen;
  document.getElementById('lightbox-title').textContent = titulo;
  document.getElementById('lightbox-desc').textContent = descripcion;

  hacerClicable(document.getElementById('lightbox-title'), titulo);
  hacerClicable(document.getElementById('lightbox-desc'), descripcion);
}

// === Filtros ===
function filterProducts() {
  const filter = document.getElementById('style-filter').value;
  const cards = document.querySelectorAll('.product-card');
  cards.forEach((card, index) => {
    const style = obras[index].estilo;
    card.style.display = (filter === 'all' || style === filter) ? 'block' : 'none';
  });
}

// === Inicialización ===
document.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('selected-lang') || 'es';
  document.getElementById('lang-select').value = savedLang;
  currentLang = savedLang;

  // Botón "Escuchar todo" ahora incluye el título, subtítulo e intro
  document.getElementById('speak-all').addEventListener('click', () => {
    const textToSpeak = [
      document.getElementById('main-title').textContent,
      document.getElementById('main-subtitle').textContent,
      document.getElementById('intro-paragraph').textContent
    ].join('. ');
    leerTexto(textToSpeak);
  });

  changeLanguage();
  document.getElementById('style-filter').addEventListener('change', filterProducts);
  document.getElementById('lang-select').addEventListener('change', changeLanguage);
  cargarObras();

  document.addEventListener('keydown', (e) => {
    const lightbox = document.getElementById('lightbox');
    if (lightbox && lightbox.style.display === 'flex') {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') changeImage(1);
      if (e.key === 'ArrowLeft') changeImage(-1);
    }
  });
});

// === Cargar voces ===
let voicesLoaded = false;
function cargarVoces() {
  if (typeof speechSynthesis !== 'undefined' && !voicesLoaded) {
    speechSynthesis.getVoices();
    voicesLoaded = true;
  }
}
cargarVoces();
if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = cargarVoces;
}