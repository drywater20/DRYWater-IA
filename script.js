// Cambiar idioma (ejemplo básico)
function changeLanguage() {
  const lang = document.getElementById('lang-select').value;
  const translations = {
    es: { title: "Galería de Arte", subtitle: "Disfruta de una colección única de arte marino.", comment: "Comentarios:", send: "Enviar" },
    en: { title: "Art Gallery", subtitle: "Enjoy a unique collection of marine art.", comment: "Comments:", send: "Send" },
    fr: { title: "Galerie d'Art", subtitle: "Profitez d'une collection unique d'art marin.", comment: "Commentaires :", send: "Envoyer" },
    ja: { title: "アートギャラリー", subtitle: "ユニークなマリンアートのコレクションをお楽しみください。", comment: "コメント：", send: "送信" }
  };

  const t = translations[lang];
  if (t) {
    document.querySelector('header h1').textContent = t.title;
    document.querySelector('header p').textContent = t.subtitle;
    document.querySelector('.comments-section h2').textContent = t.comment;
    document.querySelector('.comments-section button').textContent = t.send;
  }
}

// Filtrar productos por estilo
function filterProducts() {
  const filter = document.getElementById('style-filter').value;
  const products = document.querySelectorAll('.product-card');

  products.forEach(product => {
    if (filter === 'all' || product.getAttribute('data-style') === filter) {
      product.style.display = 'block';
    } else {
      product.style.display = 'none';
    }
  });
}

// Simulación de envío de comentarios
function submitComment() {
  const comment = document.getElementById('comment').value;
  if (comment.trim()) {
    alert("Gracias por tu comentario. ¡Lo tendremos en cuenta!");
    document.getElementById('comment').value = '';
  } else {
    alert("Por favor, escribe un comentario.");
  }
}

// Inicializar al cargar
document.addEventListener('DOMContentLoaded', () => {
  // Aquí puedes cargar productos desde API si lo deseas
});