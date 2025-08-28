let currentLang = "es";

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
    send: "Enviar",
    speak: "Escuchar"
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
    send: "Send",
    speak: "Listen"
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
    send: "Envoyer",
    speak: "Écouter"
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
    send: "送信",
    speak: "聞く"
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

// === Actualizar interfaz al cambiar idioma ===
function changeLanguage() {
  const langSelect = document.getElementById('lang-select');
  if (!langSelect) return;
  currentLang = langSelect.value;

  const t = translations[currentLang];
  if (document.getElementById('main-title')) document.getElementById('main-title').textContent = t.title;
  if (document.getElementById('main-subtitle')) document.getElementById('main-subtitle').textContent = t.subtitle;
  if (document.getElementById('description-text')) document.getElementById('description-text').textContent = t.description;
  if (document.getElementById('filter-label')) document.getElementById('filter-label').textContent = t.filterLabel;
  if (document.getElementById('comment-title')) document.getElementById('comment-title').textContent = t.comments;
  if (document.getElementById('send-btn')) document.getElementById('send-btn').textContent = t.send;
  if (document.getElementById('speak-all')) document.getElementById('speak-all').textContent = "🔊 " + t.speak;

  if (document.getElementById('option-all')) document.getElementById('option-all').textContent = t.optionAll;
  if (document.getElementById('option-peces')) document.getElementById('option-peces').textContent = t.optionPeces;
  if (document.getElementById('option-calamares')) document.getElementById('option-calamares').textContent = t.optionCalamares;
  if (document.getElementById('option-varios')) document.getElementById('option-varios').textContent = t.optionVarios;
  if (document.getElementById('option-otros')) document.getElementById('option-otros').textContent = t.optionOtros;

  localStorage.setItem('selected-lang', currentLang);
  if (typeof renderizarGaleria === 'function') renderizarGaleria();
}

// === Inicialización ===
document.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('selected-lang') || 'es';
  const langSelect = document.getElementById('lang-select');
  if (langSelect) langSelect.value = savedLang;
  currentLang = savedLang;

  // Al hacer clic en el texto descriptivo → leer en voz alta
  const descText = document.getElementById('description-text');
  if (descText) {
    descText.addEventListener('click', speakDescription);
  }

  changeLanguage();
});
