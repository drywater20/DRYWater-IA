document.addEventListener('DOMContentLoaded', () => {
    const galleryContainer = document.getElementById('art-gallery');
    const styleFilter = document.getElementById('style-filter');
    const languageSelect = document.getElementById('language-select');
    const listenButton = document.getElementById('listen-button');
    const modal = document.getElementById('art-modal');
    const closeButton = document.querySelector('.close-button');
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    const commentsInput = document.getElementById('comments-input');
    const saveCommentButton = document.getElementById('save-comment-button');

    let allArtworks = [];
    let filteredArtworks = [];
    let currentArtworkIndex = 0;
    
    // Traducciones
    const translations = {
        es: {
            title: "Galería de Arte Web",
            description: "Descubre una colección de arte digital. 🐟🦑",
            filterLabel: "Filtrar por estilo:",
            allStyles: "todos",
            commentsLabel: "Comentarios:",
            sendButton: "Enviar",
            loading: "Cargando obras...",
            style_peces: "peces",
            style_calamares: "calamares",
            style_varios: "varios",
            style_otros: "otros"
        },
        en: {
            title: "Web Art Gallery",
            description: "Discover a collection of digital art. 🐟🦑",
            filterLabel: "Filter by style:",
            allStyles: "all",
            commentsLabel: "Comments:",
            sendButton: "Submit",
            loading: "Loading artworks...",
            style_peces: "fish",
            style_calamares: "squids",
            style_varios: "various",
            style_otros: "others"
        },
        fr: {
            title: "Galerie d'Art Web",
            description: "Découvrez une collection d'art numérique. 🐟🦑",
            filterLabel: "Filtrer par style:",
            allStyles: "tous",
            commentsLabel: "Commentaires:",
            sendButton: "Envoyer",
            loading: "Chargement des œuvres...",
            style_peces: "poissons",
            style_calamares: "calmars",
            style_varios: "divers",
            style_otros: "autres"
        },
        ja: {
            title: "ウェブアートギャラリー",
            description: "デジタルアートのコレクションをご覧ください。 🐟🦑",
            filterLabel: "スタイルでフィルタリング:",
            allStyles: "すべて",
            commentsLabel: "コメント:",
            sendButton: "送信",
            loading: "作品を読み込み中...",
            style_peces: "魚",
            style_calamares: "イカ",
            style_varios: "様々な",
            style_otros: "その他"
        }
    };

    // Estilos y sus traducciones
    const stylesMap = {
        peces: { es: 'peces', en: 'fish', fr: 'poissons', ja: '魚' },
        calamares: { es: 'calamares', en: 'squids', fr: 'calmars', ja: 'イカ' },
        varios: { es: 'varios', en: 'various', fr: 'divers', ja: '様々な' },
        otros: { es: 'otros', en: 'others', fr: 'autres', ja: 'その他' }
    };
    
    // Carga inicial del idioma
    let currentLang = localStorage.getItem('lang') || 'es';
    languageSelect.value = currentLang;

    // Función para traducir el texto de la interfaz
    const translateUI = (lang) => {
        document.getElementById('title-main').textContent = translations[lang].title;
        document.getElementById('main-heading').textContent = translations[lang].title;
        document.getElementById('main-description').textContent = translations[lang].description;
        document.getElementById('filter-label').textContent = translations[lang].filterLabel;
        document.getElementById('comments-label').textContent = translations[lang].commentsLabel;
        document.getElementById('save-comment-button').textContent = translations[lang].sendButton;
        document.getElementById('loading-message').textContent = translations[lang].loading;
        
        // Actualizar opciones del filtro de estilo
        const filterOptions = styleFilter.options;
        filterOptions[0].textContent = translations[lang].allStyles;
        for (let i = 1; i < filterOptions.length; i++) {
            const styleKey = filterOptions[i].value;
            filterOptions[i].textContent = stylesMap[styleKey][lang];
        }
    };

    // Cargar los datos de las obras
    const fetchArtworks = async () => {
        try {
            const response = await fetch('obras.json');
            if (!response.ok) {
                throw new Error('Error al cargar obras.json');
            }
            allArtworks = await response.json();
            document.getElementById('loading-message').style.display = 'none';
            populateStylesFilter();
            filterAndDisplayArtworks();
        } catch (error) {
            console.error('No se pudo cargar obras.json:', error);
            galleryContainer.innerHTML = `<p class="error-message">Error: No se pudieron cargar las obras. Asegúrate de que "obras.json" exista y esté bien formado. 🧐</p>`;
        }
    };
    
    // Crea las opciones del filtro de estilos
    const populateStylesFilter = () => {
        styleFilter.innerHTML = '';
        const allOption = document.createElement('option');
        allOption.value = 'all';
        styleFilter.appendChild(allOption);
        
        const styles = new Set(allArtworks.map(obra => obra.estilo));
        styles.forEach(style => {
            const option = document.createElement('option');
            option.value = style;
            styleFilter.appendChild(option);
        });
        translateUI(currentLang);
    };

    // Renderiza las obras en la galería
    const renderGallery = (artworks) => {
        galleryContainer.innerHTML = '';
        if (artworks.length === 0) {
            galleryContainer.innerHTML = `<p class="no-results-message">No se encontraron obras para este estilo. 🤷</p>`;
            return;
        }
        
        const favorites = JSON.parse(localStorage.getItem('favorites')) || {};
        
        artworks.forEach(artwork => {
            const card = document.createElement('div');
            card.className = 'artwork-card';
            card.dataset.id = artwork.id;
            
            const isFavorite = favorites[artwork.id] || false;
            
            card.innerHTML = `
                <img src="${artwork.imagen}" alt="${artwork.titulo[currentLang]}">
                <div class="artwork-info">
                    <h3>${artwork.titulo[currentLang]}</h3>
                    <p>${stylesMap[artwork.estilo][currentLang]}</p>
                </div>
                <button class="favorite-button ${isFavorite ? 'is-favorite' : ''}" data-id="${artwork.id}">★</button>
            `;
            
            galleryContainer.appendChild(card);
        });
        addEventListenersToCards();
        addEventListenersToFavorites();
    };

    // Añade listeners a las tarjetas para abrir el modal
    const addEventListenersToCards = () => {
        document.querySelectorAll('.artwork-card').forEach(card => {
            card.addEventListener('click', (e) => {
                // Evita que el clic en el botón de favorito propague al modal
                if (e.target.closest('.favorite-button')) return;
                
                const artworkId = card.dataset.id;
                const index = filteredArtworks.findIndex(obra => obra.id === artworkId);
                if (index !== -1) {
                    currentArtworkIndex = index;
                    openModal(filteredArtworks[currentArtworkIndex]);
                }
            });
        });
    };
    
    // Añade listeners a los botones de favorito
    const addEventListenersToFavorites = () => {
        document.querySelectorAll('.favorite-button').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation(); // Evita que se abra el modal
                const artworkId = button.dataset.id;
                let favorites = JSON.parse(localStorage.getItem('favorites')) || {};
                
                if (favorites[artworkId]) {
                    delete favorites[artworkId];
                    button.classList.remove('is-favorite');
                } else {
                    favorites[artworkId] = true;
                    button.classList.add('is-favorite');
                }
                localStorage.setItem('favorites', JSON.stringify(favorites));
            });
        });
    };

    // Filtra y muestra las obras
    const filterAndDisplayArtworks = () => {
        const selectedStyle = styleFilter.value;
        if (selectedStyle === 'all') {
            filteredArtworks = allArtworks;
        } else {
            filteredArtworks = allArtworks.filter(obra => obra.estilo === selectedStyle);
        }
        renderGallery(filteredArtworks);
    };

    // Abre el modal con los detalles de una obra
    const openModal = (artwork) => {
        const comments = JSON.parse(localStorage.getItem(`comments_${artwork.id}`)) || '';
        
        modalImage.src = artwork.imagen;
        modalImage.alt = artwork.titulo[currentLang];
        modalTitle.textContent = artwork.titulo[currentLang];
        modalDescription.textContent = artwork.descripcion[currentLang];
        commentsInput.value = comments;
        commentsInput.placeholder = translations[currentLang].commentsLabel;
        modal.style.display = 'block';
    };

    // Navega a la obra anterior/siguiente en el modal
    const navigateModal = (direction) => {
        if (filteredArtworks.length <= 1) return;
        
        currentArtworkIndex += direction;
        
        if (currentArtworkIndex < 0) {
            currentArtworkIndex = filteredArtworks.length - 1;
        } else if (currentArtworkIndex >= filteredArtworks.length) {
            currentArtworkIndex = 0;
        }
        
        openModal(filteredArtworks[currentArtworkIndex]);
    };

    // Función para leer un texto con la voz de síntesis
    const readText = (text) => {
        const speech = new SpeechSynthesisUtterance(text);
        speech.lang = currentLang;
        window.speechSynthesis.speak(speech);
    };
    
    // Event Listeners
    languageSelect.addEventListener('change', (e) => {
        currentLang = e.target.value;
        localStorage.setItem('lang', currentLang);
        translateUI(currentLang);
        renderGallery(filteredArtworks);
    });

    styleFilter.addEventListener('change', filterAndDisplayArtworks);

    listenButton.addEventListener('click', () => {
        const textToSpeak = `${translations[currentLang].title}. ${translations[currentLang].description}`;
        readText(textToSpeak);
    });

    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Nuevo: Listeners para leer título y descripción en el modal
    modalTitle.addEventListener('click', () => {
        readText(modalTitle.textContent);
    });
    
    modalDescription.addEventListener('click', () => {
        readText(modalDescription.textContent);
    });

    prevButton.addEventListener('click', () => navigateModal(-1));
    nextButton.addEventListener('click', () => navigateModal(1));

    saveCommentButton.addEventListener('click', () => {
        if (commentsInput.value) {
            const artworkId = filteredArtworks[currentArtworkIndex].id;
            localStorage.setItem(`comments_${artworkId}`, JSON.stringify(commentsInput.value));
            alert('Comentario guardado. ✅');
        }
    });
    
    // Inicia la carga de datos
    fetchArtworks();
});