let currentLang = "es";
let obras = [];

// === Traducciones extendidas ===
const translations = {
  es: {
    title: "Galería de Arte",
    subtitle: "Disfruta de una colección única de arte marino.",
    description: "Aquí encontrarás una colección de obras de arte marino digital, creadas con inteligencia artificial.",
    filterLabel: "Filtrar por estilo:",
    optionAll: "todos",
    optionPeces: "peces",
    optionCalamares: "calamares",
    optionVarios: "varios",
    optionOtros: "otros",
    comments: "Comentarios:",
    send: "Enviar"
  },
  en: {
    title: "Art Gallery",
    subtitle: "Enjoy a unique collection of marine art.",
    description: "Here you will find a collection of digital marine artworks, created with artificial intelligence.",
    filterLabel: "Filter by style:",
    optionAll: "all",
    optionPeces: "fish",
    optionCalamares: "squid",
    optionVarios: "various",
    optionOtros: "others",
    comments: "Comments:",
    send: "Send"
  },
  fr: {
    title: "Galerie d'Art",
    subtitle: "Profitez d'une collection unique d'art marin.",
    description: "Vous trouverez ici une collection d'œuvres d'art marines numériques, créées avec l'intelligence artificielle.",
    filterLabel: "Filtrer par style :",
    optionAll: "tous",
    optionPeces: "poissons",
    optionCalamares: "calmars",
    optionVarios: "divers",
    optionOtros: "autres",
    comments: "Commentaires :",
    send: "Envoyer"
  },
  ja: {
    title: "アートギャラリー",
    subtitle: "ユニークなマリンアートのコレクションをお楽しみください。",
    description: "ここでは、人工知能によって作成されたデジタルマリンアート作品のコレクションをご覧いただけます。",
    filterLabel: "スタイルでフィルター：",
    optionAll: "すべて",
    optionPeces: "魚",
    optionCalamares: "イカ",
    optionVarios: "その他",
    optionOtros: "その他",
    comments: "コメント：",
    send: "送信"
  }
};

// === Asociación de idioma con código de voz (para TTS) ===
const langVoices = {
  es: "es-ES",
  en: "en-US",
  fr: "fr-FR",
  ja: "ja-JP"
};

// === Función para leer el texto descriptivo ===
function speakDescription() {
  const text = document.getElementById('description-text')?.textContent || "";
  if (!text) return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = langVoices[currentLang] || "es-ES";
  speechSynthesis.cancel(); // detener lectura previa
  speechSynthesis.speak(utterance);
}

// === Renderizar la galería de imágenes ===
function renderizarGaleria() {
  const galeria = document.getElementById("gallery");
  galeria.innerHTML = "";

  const filtro = document.getElementById("filter")?.value || "todos";

  const obrasFiltradas = obras.filter(
    (obra) => filtro === "todos" || obra.estilo === filtro
  );

  obrasFiltradas.forEach((obra) => {
    const card = document.createElement("div");
    card.className = "obra-card";

    const img = document.createElement("img");
    img.src = obra.imagen;
    img.alt = obra.descripcion[currentLang] || obra.descripcion["es"];

    const caption = document.createElement("p");
    caption.textContent = obra.descripcion[currentLang] || obra.descripcion["es"];

    card.appendChild(img);
    card.appendChild(caption);
    galeria.appendChild(card);
  });
}

// === Filtrar las obras ===
function filtrarObras() {
  renderizarGaleria();
}

// === Actualizar interfaz al cambiar idioma ===
function changeLanguage() {
  const langSelect = document.getElementById('lang-select');
  if (!langSelect) return;
  currentLang = langSelect.value;

  const t = translations[currentLang];
  document.getElementById('main-title').textContent = t.title;
  document.getElementById('main-subtitle').textContent = t.subtitle;
  document.getElementById('description-text').textContent = t.description;
  document.getElementById('filter-label').textContent = t.filterLabel;
  document.getElementById('comment-title').textContent = t.comments;
  document.getElementById('send-btn').textContent = t.send;

  document.getElementById('option-all').textContent = t.optionAll;
  document.getElementById('option-peces').textContent = t.optionPeces;
  document.getElementById('option-calamares').textContent = t.optionCalamares;
  document.getElementById('option-varios').textContent = t.optionVarios;
  document.getElementById('option-otros').textContent = t.optionOtros;

  localStorage.setItem('selected-lang', currentLang);
  renderizarGaleria();
}

// === Inicialización ===
document.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('selected-lang') || 'es';
  document.getElementById('lang-select').value = savedLang;
  currentLang = savedLang;

  // Click en el texto descriptivo → leerlo
  document.getElementById('description-text').addEventListener('click', speakDescription);

  // Cargar obras
  fetch("obras.json")
    .then((res) => res.json())
    .then((data) => {
      obras = data;
      changeLanguage();
    });
});
