/**
 * app.js - Lógica del libro ilustrado interactivo
 */

const API_BASE = 'http://localhost:7000/api';

const state = {
    currentStory: null,
    currentPage: 1,
    totalPages: 0,
    isFlipping: false
};

const elements = {
    bookCover: document.getElementById('book-cover'),
    book: document.getElementById('book'),
    pageRight: document.getElementById('page-right'),
    pageContent: document.getElementById('page-content'),
    storyList: document.getElementById('story-list'),
    pageIndicator: document.getElementById('page-indicator'),
    btnPrev: document.getElementById('btn-prev'),
    btnNext: document.getElementById('btn-next'),
    btnOpenBook: document.getElementById('btn-open-book'),
    btnBackToCover: document.getElementById('btn-back-to-cover'),
    loading: document.getElementById('loading')
};

// ===== AUDIO PLAYER CON ARCHIVOS =====
class SoundPlayer {
    constructor() { this.current = null; }

    playSound(url) {
        if (!url) return;
        this.stop();
        this.current = new Audio(url);
        this.current.play().catch(err => console.warn('No se pudo reproducir:', url, err));
    }

    stop() {
        if (this.current) {
            this.current.pause();
            this.current.currentTime = 0;
            this.current = null;
        }
    }
}

const soundPlayer = new SoundPlayer();

// ===== API =====
async function fetchJSON(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
}

async function getStories() { return fetchJSON(`${API_BASE}/stories`); }
async function getStory(id) { return fetchJSON(`${API_BASE}/stories/${id}`); }

// ===== RENDER =====
function showLoading() { elements.loading.classList.remove('hidden'); }
function hideLoading() { elements.loading.classList.add('hidden'); }

function renderStoryList(stories) {
    elements.storyList.innerHTML = '';
    for (const story of stories) {
        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'story-btn';
        btn.dataset.storyId = String(story.id);
        btn.textContent = `📚 ${story.title} (${story.page_count} páginas)`;
        btn.addEventListener('click', () => selectStory(Number(btn.dataset.storyId)));
        li.appendChild(btn);
        elements.storyList.appendChild(li);
    }
}

function isDarkColor(hex) {
    if (!hex || !hex.startsWith('#')) return false;
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return lum < 0.35;
}

function calculateSoundPositions(count) {
    const positions = [];
    const startX = 80;
    const startY = 8;
    const spacingX = 0;
    const spacingY = 14;

    for (let i = 0; i < count; i++) {
        positions.push({ x: startX, y: startY + i * spacingY });
    }

    return positions;
}

function renderPage(page, pageNum, totalPages) {
    elements.pageContent.innerHTML = '';
    elements.pageContent.setAttribute('data-bg', page.background_color);

    if (page.image_url) {
        const illustration = document.createElement('img');
        illustration.className = 'page-illustration';
        illustration.src = page.image_url;
        illustration.alt = `Ilustración de la página ${pageNum}`;
        illustration.loading = 'lazy';
        elements.pageContent.appendChild(illustration);
    }

    const emoji = document.createElement('div');
    emoji.className = 'page-emoji';
    emoji.textContent = page.image_emoji;
    emoji.setAttribute('role', 'img');
    emoji.setAttribute('aria-label', `Ilustración de la página ${pageNum}`);

    const text = document.createElement('p');
    text.className = 'page-text';
    text.textContent = page.text;

    elements.pageContent.appendChild(emoji);
    elements.pageContent.appendChild(text);
    
    const sounds = page.sounds || [];
    const positions = calculateSoundPositions(sounds.length);
    
    for (let i = 0; i < sounds.length; i++) {
        const sound = sounds[i];
        const pos = positions[i] || { x: 50, y: 50 };
        
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'sound-icon';
        btn.dataset.soundType = sound.sound_type;
        btn.dataset.soundUrl = sound.sound_url || '';
        btn.setAttribute('aria-label', `Reproducir sonido: ${sound.sound_type}`);
        btn.textContent = getSoundEmoji(sound.sound_type);

        const x = Math.min(90, Math.max(5, pos.x));
        const y = Math.min(85, Math.max(5, pos.y));
        btn.style.left = `${x}%`;
        btn.style.top = `${y}%`;

        btn.addEventListener('click', e => {
            e.stopPropagation();
            btn.classList.add('playing');
            soundPlayer.playSound(btn.dataset.soundUrl);
            setTimeout(() => btn.classList.remove('playing'), 1200);
        });
        
        elements.pageContent.appendChild(btn);
    }
    
    elements.pageIndicator.textContent = `Página ${pageNum} de ${totalPages}`;
    elements.btnPrev.disabled = pageNum <= 1;
    elements.btnNext.disabled = pageNum >= totalPages;
}

function getSoundEmoji(type) {
    const map = { bird: '🐦', water: '💧', dog: '🐕', owl: '🦉', music: '🎵', applause: '👏' };
    return map[type] || '🔊';
}

// ===== NAVEGACIÓN =====
function waitForAnimation(el) {
    return new Promise(resolve => {
        el.addEventListener('animationend', resolve, { once: true });
    });
}

let navId = 0;

async function goToNextPage() {
    const currentNavId = ++navId;
    if (state.currentPage >= state.totalPages || state.isFlipping || !state.currentStory) return;
    if (currentNavId !== navId) return; // descartar si cambió
    soundPlayer.stop();
    
    state.isFlipping = true;
    
    elements.pageRight.style.animation = 'flipPageRight 0.4s ease-in forwards';
    await waitForAnimation(elements.pageRight);
    
    state.currentPage++;
    renderPage(state.currentStory.pages[state.currentPage - 1], state.currentPage, state.totalPages);
    
    elements.pageRight.style.animation = 'flipPageIn 0.4s ease-out forwards';
    await waitForAnimation(elements.pageRight);
    
    elements.pageRight.style.animation = '';
    state.isFlipping = false;
}

async function goToPrevPage() {
    const currentNavId = ++navId;
    if (state.currentPage <= 1 || state.isFlipping || !state.currentStory) return;
    if (currentNavId !== navId) return; // descartar si cambió
    soundPlayer.stop();
    
    state.isFlipping = true;
    
    elements.pageRight.style.animation = 'flipPageRight 0.4s ease-in forwards';
    await waitForAnimation(elements.pageRight);
    
    state.currentPage--;
    renderPage(state.currentStory.pages[state.currentPage - 1], state.currentPage, state.totalPages);
    
    elements.pageRight.style.animation = 'flipPageIn 0.4s ease-out forwards';
    await waitForAnimation(elements.pageRight);
    
    elements.pageRight.style.animation = '';
    state.isFlipping = false;
}

function selectStory(storyId) {
    showLoading();
    soundPlayer.stop();
    getStory(storyId).then(story => {
        state.currentStory = story;
        state.currentPage = 1;
        state.totalPages = story.pages.length;
        renderPage(story.pages[0], 1, state.totalPages);
        elements.pageRight.classList.remove('flipped');
        hideLoading();
    }).catch(() => {
        hideLoading();
        alert('Error al cargar. Asegúrate de que el servidor esté corriendo.');
    });
}

async function openBook() {
    elements.bookCover.classList.add('hidden');
    elements.book.classList.remove('hidden');
    showLoading();
    try {
        const stories = await getStories();
        if (!stories || stories.length === 0) throw new Error('No hay cuentos');
        renderStoryList(stories);
    } catch (err) {
        console.error(err);
        // Intentar con ID 1 como fallback
        try { selectStory(1); } 
        catch { alert('No se pudo cargar. Asegúrate de que el servidor esté corriendo.'); }
    } finally {
        hideLoading();
    }
}

function closeBook() {
    soundPlayer.stop();
    elements.book.classList.add('hidden');
    elements.bookCover.classList.remove('hidden');
    state.currentStory = null;
    state.currentPage = 1;
}

// ===== EVENT LISTENERS =====
elements.btnOpenBook.addEventListener('click', openBook);
elements.btnBackToCover.addEventListener('click', closeBook);
elements.btnNext.addEventListener('click', goToNextPage);
elements.btnPrev.addEventListener('click', goToPrevPage);

document.addEventListener('keydown', e => {
    if (!state.currentStory) return;
    if (e.key === 'ArrowRight' || e.key === ' ') goToNextPage();
    else if (e.key === 'ArrowLeft') goToPrevPage();
});

// Auto-check server
setTimeout(() => {
    fetch(`${API_BASE}/health`).catch(() =>
        console.warn('⚠ Servidor no disponible. Ejecuta: cd backend && uvicorn main:app --reload')
    );
}, 500);
