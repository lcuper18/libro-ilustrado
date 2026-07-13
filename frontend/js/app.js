/**
 * app.js - Lógica del libro ilustrado interactivo
 */

const API_BASE = 'http://localhost:8000/api';

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

// ===== WEB AUDIO API - GENERADOR DE SONIDOS =====
class SoundGenerator {
    constructor() { this.audioContext = null; }

    init() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }

    playSound(type) {
        this.init();
        switch (type) {
            case 'bird': this.playBird(); break;
            case 'water': this.playWater(); break;
            case 'dog': this.playDog(); break;
            case 'owl': this.playOwl(); break;
            case 'music': this.playMusic(); break;
            case 'applause': this.playApplause(); break;
        }
    }

    playBird() {
        const ctx = this.audioContext;
        const now = ctx.currentTime;
        for (let i = 0; i < 3; i++) {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1800 + Math.random() * 400, now + i * 0.3);
            osc.frequency.exponentialRampToValueAtTime(2400, now + i * 0.3 + 0.1);
            gain.gain.setValueAtTime(0, now + i * 0.3);
            gain.gain.linearRampToValueAtTime(0.3, now + i * 0.3 + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.3 + 0.15);
            osc.connect(gain).connect(ctx.destination);
            osc.start(now + i * 0.3);
            osc.stop(now + i * 0.3 + 0.2);
        }
    }

    playWater() {
        const ctx = this.audioContext;
        const now = ctx.currentTime;
        const duration = 1.5;
        const bufferSize = ctx.sampleRate * duration;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) { data[i] = Math.random() * 2 - 1; }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, now);
        filter.frequency.linearRampToValueAtTime(400, now + duration);
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.4, now + 0.1);
        gain.gain.setValueAtTime(0.4, now + duration - 0.3);
        gain.gain.linearRampToValueAtTime(0, now + duration);
        noise.connect(filter).connect(gain).connect(ctx.destination);
        noise.start(now);
        noise.stop(now + duration);
    }

    playDog() {
        const ctx = this.audioContext;
        const now = ctx.currentTime;
        for (let i = 0; i < 2; i++) {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(400, now + i * 0.4);
            osc.frequency.exponentialRampToValueAtTime(250, now + i * 0.4 + 0.15);
            gain.gain.setValueAtTime(0, now + i * 0.4);
            gain.gain.linearRampToValueAtTime(0.3, now + i * 0.4 + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.4 + 0.2);
            osc.connect(gain).connect(ctx.destination);
            osc.start(now + i * 0.4);
            osc.stop(now + i * 0.4 + 0.25);
        }
    }

    playOwl() {
        const ctx = this.audioContext;
        const now = ctx.currentTime;
        for (let i = 0; i < 2; i++) {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(500, now + i * 0.6);
            osc.frequency.setValueAtTime(400, now + i * 0.6 + 0.2);
            osc.frequency.setValueAtTime(450, now + i * 0.6 + 0.35);
            osc.frequency.exponentialRampToValueAtTime(300, now + i * 0.6 + 0.5);
            gain.gain.setValueAtTime(0, now + i * 0.6);
            gain.gain.linearRampToValueAtTime(0.35, now + i * 0.6 + 0.1);
            gain.gain.setValueAtTime(0.35, now + i * 0.6 + 0.35);
            gain.gain.linearRampToValueAtTime(0, now + i * 0.6 + 0.55);
            osc.connect(gain).connect(ctx.destination);
            osc.start(now + i * 0.6);
            osc.stop(now + i * 0.6 + 0.6);
        }
    }

    playMusic() {
        const ctx = this.audioContext;
        const now = ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + i * 0.15);
            gain.gain.setValueAtTime(0, now + i * 0.15);
            gain.gain.linearRampToValueAtTime(0.25, now + i * 0.15 + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.15 + 0.4);
            osc.connect(gain).connect(ctx.destination);
            osc.start(now + i * 0.15);
            osc.stop(now + i * 0.15 + 0.5);
        });
    }

    playApplause() {
        const ctx = this.audioContext;
        const now = ctx.currentTime;
        for (let burst = 0; burst < 8; burst++) {
            const bufferSize = ctx.sampleRate * 0.1;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) { data[i] = Math.random() * 2 - 1; }
            const noise = ctx.createBufferSource();
            noise.buffer = buffer;
            const filter = ctx.createBiquadFilter();
            filter.type = 'highpass';
            filter.frequency.value = 2000;
            const gain = ctx.createGain();
            const startTime = now + burst * 0.2 + Math.random() * 0.1;
            gain.gain.setValueAtTime(0.4, startTime);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15);
            noise.connect(filter).connect(gain).connect(ctx.destination);
            noise.start(startTime);
        }
    }
}

const soundGenerator = new SoundGenerator();

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
    elements.storyList.innerHTML = stories.map(s => `
        <li onclick="selectStory(${s.id})">
            📚 ${s.title}
            <span class="story-page-count">(${s.page_count} páginas)</span>
        </li>
    `).join('');
}

function renderPage(page, pageNum, totalPages) {
    const soundsHTML = page.sounds.map(sound => `
        <div class="sound-icon" style="left: ${sound.position_x}%; top: ${sound.position_y}%;"
             data-sound-type="${sound.sound_type}" title="Toca para escuchar">
            ${getSoundEmoji(sound.sound_type)}
        </div>
    `).join('');

    elements.pageContent.innerHTML = `
        <div class="page-emoji">${page.image_emoji}</div>
        <div class="page-text">${page.text}</div>
        ${soundsHTML}
    `;
    elements.pageContent.style.backgroundColor = page.background_color;
    elements.pageIndicator.textContent = `${pageNum} / ${totalPages}`;
    elements.btnPrev.disabled = pageNum <= 1;
    elements.btnNext.disabled = pageNum >= totalPages;
    attachSoundListeners();
}

function getSoundEmoji(type) {
    const map = { bird: '🐦', water: '💧', dog: '🐕', owl: '🦉', music: '🎵', applause: '👏' };
    return map[type] || '🔊';
}

function attachSoundListeners() {
    document.querySelectorAll('.sound-icon').forEach(icon => {
        icon.addEventListener('click', e => {
            e.stopPropagation();
            icon.classList.add('playing');
            soundGenerator.playSound(icon.dataset.soundType);
            setTimeout(() => icon.classList.remove('playing'), 1000);
        });
    });
}

// ===== NAVEGACIÓN =====
function selectStory(storyId) {
    showLoading();
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

function goToNextPage() {
    if (state.currentPage >= state.totalPages || state.isFlipping) return;
    state.isFlipping = true;
    elements.pageRight.classList.add('flipped');
    setTimeout(() => {
        state.currentPage++;
        renderPage(state.currentStory.pages[state.currentPage - 1], state.currentPage, state.totalPages);
        elements.pageRight.classList.remove('flipped');
        state.isFlipping = false;
    }, 400);
}

function goToPrevPage() {
    if (state.currentPage <= 1 || state.isFlipping) return;
    state.isFlipping = true;
    elements.pageRight.classList.add('flipped');
    setTimeout(() => {
        state.currentPage--;
        renderPage(state.currentStory.pages[state.currentPage - 1], state.currentPage, state.totalPages);
        elements.pageRight.classList.remove('flipped');
        state.isFlipping = false;
    }, 400);
}

function openBook() {
    elements.bookCover.classList.add('hidden');
    elements.book.classList.remove('hidden');
    showLoading();
    getStories().then(renderStoryList).catch(() => selectStory(1));
    hideLoading();
}

function closeBook() {
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
