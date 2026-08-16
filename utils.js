// ================================================================
//  KWON FITNESS – УТИЛИТЫ И ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ================================================================

// ---------- Форматирование времени ----------
function formatTime(sec) {
    const m = String(Math.floor(sec / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    return m + ':' + s;
}

// ---------- Коэффициент сложности тренировки ----------
function calculateFactor(user) {
    try {
        let f = 1.0;
        if (user.weight > 90) f += 0.3;
        else if (user.weight > 75) f += 0.15;
        else if (user.weight < 60) f -= 0.1;
        if (user.gender === 'female') f += 0.2;
        if (user.age > 50) f += 0.3;
        else if (user.age > 40) f += 0.15;
        if (user.fitnessLevel === 'beginner') f += 0.3;
        else if (user.fitnessLevel === 'advanced') f -= 0.2;
        else if (user.fitnessLevel === 'pro') f -= 0.35;
        else if (user.fitnessLevel === 'elite') f -= 0.5;
        return Math.max(0.4, Math.min(2.0, f));
    } catch (e) {
        return 1.0;
    }
}

// ---------- Уведомления (тосты) ----------
function showToast(msg, type = 'info') {
    const container = document.querySelector('.toast-container') || (() => {
        const c = document.createElement('div');
        c.className = 'toast-container';
        document.body.appendChild(c);
        return c;
    })();
    const toast = document.createElement('div');
    toast.className = 'toast' + (type === 'success' ? ' toast-success' : type === 'error' ? ' toast-error' : '');
    toast.textContent = msg;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

// ---------- Звуковые эффекты ----------
function playSound(type) {
    if (!document.getElementById('soundToggle').checked) return;
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        gain.gain.value = 0.12;
        let freq = 600, dur = 0.2;
        if (type === 'start') { freq = 800; dur = 0.1; }
        else if (type === 'finish') { freq = 1000; dur = 0.3; }
        else if (type === 'error') { freq = 300; dur = 0.4; }
        else if (type === 'loot') { freq = 1200; dur = 0.15; gain.gain.value = 0.08; }
        else if (type === 'boss') { freq = 150; dur = 0.6; }
        else if (type === 'buy') { freq = 500; dur = 0.15; gain.gain.value = 0.1; }
        osc.frequency.value = freq;
        osc.type = type === 'boss' ? 'sawtooth' : 'square';
        osc.start();
        setTimeout(() => osc.stop(), dur * 1000);
    } catch (e) {}
}

// ---------- Конфетти ----------
function fireConfetti() {
    if (typeof confetti !== 'undefined') {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    }
}

// ---------- Закрытие модалки лута ----------
function closeLootModal() {
    document.getElementById('lootModal').style.display = 'none';
}

// ---------- Хранилище пользователей ----------
function getUsers() {
    return JSON.parse(localStorage.getItem('users') || '{}');
}

function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

// ---------- Хеширование пароля ----------
function hashPassword(pw) {
    return btoa(pw);
}

// ---------- Магазин предметов ----------
function loadShopItems() {
    const stored = localStorage.getItem('shopItems_v2');
    if (stored) {
        shopItems = JSON.parse(stored);
    } else {
        shopItems = [...CONFIG.ITEMS];
        saveShopItems();
    }
}

function saveShopItems() {
    localStorage.setItem('shopItems_v2', JSON.stringify(shopItems));
}

// ---------- Работа с предметами ----------
function findItemById(id) {
    return shopItems.find(i => i.id === id) || null;
}

function getUserInventory(user) {
    return user.inventory || [];
}

function isItemOwned(user, itemId) {
    return (user.inventory || []).some(i => i.id === itemId);
}

function addItemToInventory(user, itemId) {
    const item = findItemById(itemId);
    if (!item) return false;
    if (isItemOwned(user, itemId)) return false;
    if (!user.inventory) user.inventory = [];
    user.inventory.push({ ...item });
    return true;
}

function setActiveItem(user, type, itemId) {
    const item = findItemById(itemId);
    if (!item || item.type !== type) return;
    if (!isItemOwned(user, itemId)) return;
    switch (type) {
        case 'avatar': user.avatar = itemId; break;
        case 'frame': user.frame = itemId; break;
        case 'banner': user.banner = itemId; break;
        case 'title': user.title = itemId; break;
        default: return;
    }
}

// ---------- Экспорт в глобальную область ----------
if (typeof window !== 'undefined') {
    window.formatTime = formatTime;
    window.calculateFactor = calculateFactor;
    window.showToast = showToast;
    window.playSound = playSound;
    window.fireConfetti = fireConfetti;
    window.closeLootModal = closeLootModal;
    window.getUsers = getUsers;
    window.saveUsers = saveUsers;
    window.hashPassword = hashPassword;
    window.loadShopItems = loadShopItems;
    window.saveShopItems = saveShopItems;
    window.findItemById = findItemById;
    window.getUserInventory = getUserInventory;
    window.isItemOwned = isItemOwned;
    window.addItemToInventory = addItemToInventory;
    window.setActiveItem = setActiveItem;
}