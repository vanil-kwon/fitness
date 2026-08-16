// ================================================================
//  KWON FITNESS – ОСНОВНАЯ ЛОГИКА И ИНИЦИАЛИЗАЦИЯ
// ================================================================

// ================================================================
//  ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ
// ================================================================
let currentLang = localStorage.getItem('lang') || 'ru';
let currentUser = null;
let timerInterval = null;
let seconds = 0;
let isRunning = false;
let minTime = 45, maxTime = 90;
let currentTask = null;
let isFinished = false;
let chartInstance = null;
let workoutChartInstance = null;
let adminUnlocked = false;
let shopItems = [];

// ================================================================
//  ФУНКЦИИ ПЕРЕВОДА
// ================================================================
function t(key, vars) {
    let str = LANG[currentLang]?.[key] || LANG['ru'][key] || key;
    if (vars) for (let k in vars) str = str.replace(new RegExp('{' + k + '}', 'g'), vars[k]);
    return str;
}

function updateUI() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (key) el.textContent = t(key);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (key) el.placeholder = t(key);
    });
    document.title = t('app_title');
    const normInfoSpan = document.querySelector('#normInfo [data-i18n="norm_info"]');
    if (normInfoSpan) normInfoSpan.textContent = t('norm_info');
    if (currentUser) {
        loadShop();
        loadInventory();
        loadLeaderboard();
        loadBoss();
        loadChallenge();
        updateRankDisplay();
        loadAchievements();
        loadCustomExercises();
        loadChart();
        toggleAdminPanel();
        updateHeaderAvatar();
    }
}

function setLanguage(lang) {
    if (LANG[lang]) {
        currentLang = lang;
        localStorage.setItem('lang', lang);
        document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
        document.getElementById('langSelect').value = lang;
        updateUI();
    }
}

// ================================================================
//  ЭКРАНЫ
// ================================================================
function showLoginScreen() {
    document.getElementById('loginScreen').style.display = 'block';
    document.getElementById('registerScreen').style.display = 'none';
    document.getElementById('mainScreen').style.display = 'none';
}

function showRegisterScreen() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('registerScreen').style.display = 'block';
}

function showMainScreen() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('registerScreen').style.display = 'none';
    document.getElementById('mainScreen').style.display = 'block';
    document.getElementById('userNameDisplay').textContent = currentUser.nickname;
    document.getElementById('avatarDisplay').textContent = currentUser.nickname.charAt(0).toUpperCase();
    document.getElementById('userPointsDisplay').textContent = currentUser.points || 0;
    document.getElementById('headerNick').textContent = currentUser.nickname;
    document.getElementById('headerPoints').textContent = '🪙 ' + (currentUser.points || 0);
    if (currentUser.role && currentUser.role !== 'user') {
        document.getElementById('roleDisplay').style.display = 'block';
        document.getElementById('roleDisplay').textContent = currentUser.role.toUpperCase();
    } else {
        document.getElementById('roleDisplay').style.display = 'none';
    }
    loadShopItems();
    initTrainScreen();
    loadShop();
    loadInventory();
    loadLeaderboard();
    loadBoss();
    loadChallenge();
    updateRankDisplay();
    loadAchievements();
    loadCustomExercises();
    loadChart();
    checkDailyBonus();
    toggleAdminPanel();
    updateUI();
}

// ================================================================
//  ТРЕНИРОВКИ
// ================================================================
function generateTask() {
    try {
        if (!currentUser) return { name: 'отжимания', count: 20, min: 45, max: 90 };
        const age = currentUser.age || 25;
        let groupId = 'adults_20_plus';
        for (const g of CONFIG.AGE_GROUPS) {
            if (age >= g.min && age < g.max) {
                groupId = g.id;
                break;
            }
        }
        let pool = CONFIG.AGE_EXERCISES[groupId] || [];
        if (pool.length === 0) {
            const path = currentUser.path || 'Фитнес';
            const level = currentUser.fitnessLevel || 'medium';
            pool = CONFIG.EXERCISES[path]?.[level] || CONFIG.EXERCISES['Фитнес']['medium'];
        }
        const custom = currentUser.customExercises || [];
        const all = [...pool, ...custom];
        if (all.length === 0) return { name: 'отжимания', count: 20, min: 45, max: 90 };
        const task = all[Math.floor(Math.random() * all.length)];
        if (!task.min) task.min = 30;
        if (!task.max) task.max = 90;
        return task;
    } catch (e) {
        return { name: 'отжимания', count: 20, min: 45, max: 90 };
    }
}

function initTrainScreen() {
    if (!currentUser) return;
    const task = generateTask();
    currentTask = task;
    document.getElementById('taskName').textContent = task.count + ' ' + task.name;
    const factor = calculateFactor(currentUser);
    minTime = Math.round(task.min * factor);
    maxTime = Math.round(task.max * factor);
    document.getElementById('normMin').textContent = formatTime(minTime);
    document.getElementById('normMax').textContent = formatTime(maxTime);
    document.getElementById('userPointsDisplay').textContent = currentUser.points || 0;
    document.getElementById('startBtn').style.display = 'inline-block';
    document.getElementById('finishBtn').classList.add('hidden');
    document.getElementById('timerDisplay').textContent = '00:00';
    document.getElementById('result').textContent = '';
    document.getElementById('shareContainer').style.display = 'none';
    if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
    isRunning = false; isFinished = false; seconds = 0;
    if (currentUser.dailyDone) {
        document.getElementById('result').textContent = t('result_already_done');
        document.getElementById('startBtn').style.display = 'none';
        document.getElementById('finishBtn').classList.add('hidden');
    }
    loadChallenge();
    updateRankDisplay();
}

document.getElementById('startBtn').addEventListener('click', function() {
    if (isRunning) return;
    if (!currentUser || currentUser.dailyDone) {
        document.getElementById('result').textContent = t('result_already_done');
        return;
    }
    if (timerInterval) clearInterval(timerInterval);
    seconds = 0;
    document.getElementById('timerDisplay').textContent = '00:00';
    isRunning = true;
    isFinished = false;
    this.style.display = 'none';
    document.getElementById('finishBtn').classList.remove('hidden');
    document.getElementById('result').textContent = '⏳ Выполняй...';
    currentTask = generateTask();
    document.getElementById('taskName').textContent = currentTask.count + ' ' + currentTask.name;
    const factor = calculateFactor(currentUser);
    minTime = Math.round(currentTask.min * factor);
    maxTime = Math.round(currentTask.max * factor);
    document.getElementById('normMin').textContent = formatTime(minTime);
    document.getElementById('normMax').textContent = formatTime(maxTime);
    timerInterval = setInterval(() => {
        seconds++;
        document.getElementById('timerDisplay').textContent = formatTime(seconds);
    }, 1000);
    playSound('start');
});

document.getElementById('finishBtn').addEventListener('click', function() {
    if (!isRunning || isFinished) return;
    clearInterval(timerInterval);
    timerInterval = null;
    isRunning = false;
    isFinished = true;
    this.classList.add('hidden');
    document.getElementById('startBtn').style.display = 'inline-block';
    const elapsed = seconds;
    const result = document.getElementById('result');
    if (elapsed < 2) {
        result.textContent = '⏳ Подожди хотя бы 2 секунды!';
        result.style.color = '#f39c12';
        document.getElementById('startBtn').style.display = 'inline-block';
        document.getElementById('finishBtn').classList.add('hidden');
        isRunning = false; isFinished = false;
        return;
    }
    if (elapsed < minTime * 0.7) {
        result.textContent = t('result_too_fast', { elapsed, min: minTime, max: maxTime });
        result.style.color = '#e74c3c';
        playSound('error');
        document.getElementById('startBtn').style.display = 'inline-block';
        return;
    }
    if (elapsed > maxTime * 1.5) {
        result.textContent = t('result_too_slow', { elapsed, min: minTime, max: maxTime });
        result.style.color = '#f39c12';
        playSound('error');
        document.getElementById('startBtn').style.display = 'inline-block';
        return;
    }
    const reward = CONFIG.REWARD_BASE + (currentUser.fitnessLevel === 'elite' ? 5 : 0);
    let challengeBonus = 0;
    const challenge = getDailyChallenge();
    if (challenge && !currentUser.dailyChallengeDone) {
        challengeBonus = CONFIG.CHALLENGE_BONUS;
        currentUser.dailyChallengeDone = true;
        showToast(t('challenge_done', { bonus: challengeBonus }), 'success');
    }
    const totalReward = reward + challengeBonus;
    currentUser.points += totalReward;
    currentUser.dailyDone = true;
    currentUser.streak = (currentUser.streak || 0) + 1;
    currentUser.totalWorkouts = (currentUser.totalWorkouts || 0) + 1;
    const historyKey = 'history_' + currentUser.nickname;
    let history = JSON.parse(localStorage.getItem(historyKey) || '[]');
    history.push({ date: new Date().toISOString().slice(0,10), points: currentUser.points, workout: currentTask.name, time: elapsed });
    if (history.length > 30) history = history.slice(-30);
    localStorage.setItem(historyKey, JSON.stringify(history));
    updateAchievements();
    const users = getUsers();
    users[currentUser.nickname] = currentUser;
    saveUsers(users);
    localStorage.setItem('currentUser', currentUser.nickname);
    document.getElementById('userPointsDisplay').textContent = currentUser.points;
    document.getElementById('headerPoints').textContent = '🪙 ' + currentUser.points;
    updateRankDisplay();
    const oldRank = getRank(currentUser.points - totalReward);
    const newRank = getRank(currentUser.points);
    if (oldRank.key !== newRank.key && newRank.key !== 'novice') {
        fireConfetti();
        playSound('finish');
    }
    result.textContent = t('result_success', { elapsed, reward: totalReward, streak: currentUser.streak, rank: t('rank_' + newRank.key) });
    result.style.color = '#2ecc71';
    playSound('finish');
    showLootBox(currentUser);
    document.getElementById('shareContainer').style.display = 'block';
    document.getElementById('shareBtn').dataset.task = currentTask.name;
    document.getElementById('shareBtn').dataset.time = elapsed;
    document.getElementById('shareBtn').dataset.reward = totalReward;
    document.getElementById('startBtn').style.display = 'none';
    document.getElementById('finishBtn').style.display = 'none';
    checkDailyBonus();
    loadChallenge();
    loadAchievements();
    loadChart();
});

// ================================================================
//  ДОСТИЖЕНИЯ
// ================================================================
function loadAchievements() {
    if (!currentUser) return;
    const list = document.getElementById('achievementsList');
    list.innerHTML = '';
    const progress = currentUser.achievements || {};
    CONFIG.ACHIEVEMENTS.forEach(ach => {
        const cur = progress[ach.id] || 0;
        const done = cur >= ach.target;
        const percent = Math.min(100, (cur / ach.target) * 100);
        const div = document.createElement('div');
        div.className = 'achievement-item';
        div.innerHTML = `
            <div><strong>${ach.icon} ${ach.name}</strong> <span style="color:${done ? '#2ecc71' : 'var(--text-secondary)'};">${done ? '✅' : Math.round(percent) + '%'}</span></div>
            <div style="font-size:12px;color:var(--text-secondary);">${cur} / ${ach.target}</div>
            <div class="ach-bar"><div class="ach-fill" style="width:${percent}%; background:${done ? '#2ecc71' : 'var(--kwon-purple)'};"></div></div>
        `;
        list.appendChild(div);
    });
}

function updateAchievements() {
    if (!currentUser) return;
    const progress = currentUser.achievements || {};
    let updated = false;
    const inv = getUserInventory(currentUser);
    const avatarCount = inv.filter(i => i.type === 'avatar').length;
    const frameCount = inv.filter(i => i.type === 'frame').length;
    const bannerCount = inv.filter(i => i.type === 'banner').length;
    const titleCount = inv.filter(i => i.type === 'title').length;
    const totalItems = inv.length;

    CONFIG.ACHIEVEMENTS.forEach(ach => {
        let val = 0;
        switch(ach.type) {
            case 'workout': val = currentUser.totalWorkouts || 0; break;
            case 'boss': val = currentUser.bossFights || 0; break;
            case 'points': val = currentUser.points || 0; break;
            case 'streak': val = currentUser.streak || 0; break;
            case 'collection':
                if (ach.id === 'collector_5') val = totalItems;
                else if (ach.id === 'collector_10') val = totalItems;
                else if (ach.id === 'collector_20') val = totalItems;
                break;
            case 'avatars': val = avatarCount; break;
            case 'frames': val = frameCount; break;
            case 'banners': val = bannerCount; break;
            case 'titles': val = titleCount; break;
            case 'all_titles':
                val = titleCount >= CONFIG.ITEMS.filter(i => i.type === 'title').length ? 1 : 0;
                break;
            default: return;
        }
        if (val > (progress[ach.id] || 0)) {
            progress[ach.id] = Math.min(val, ach.target);
            updated = true;
        }
    });

    if (updated) {
        currentUser.achievements = progress;
        const users = getUsers();
        users[currentUser.nickname] = currentUser;
        saveUsers(users);
        loadAchievements();
    }
}

// ================================================================
//  ПОЛЬЗОВАТЕЛЬСКИЕ УПРАЖНЕНИЯ
// ================================================================
function loadCustomExercises() {
    if (!currentUser) return;
    const list = document.getElementById('customExercisesList');
    list.innerHTML = '';
    (currentUser.customExercises || []).forEach((ex, i) => {
        const div = document.createElement('div');
        div.className = 'shop-item';
        div.innerHTML = `<span><strong>${ex.name}</strong> (${ex.count} раз)</span>
            <button class="btn btn-sm" style="background:#e74c3c;padding:2px 8px;" onclick="deleteCustomExercise(${i})"><i class="fas fa-trash"></i></button>`;
        list.appendChild(div);
    });
}

function deleteCustomExercise(index) {
    if (!currentUser || !confirm('Удалить?')) return;
    currentUser.customExercises.splice(index, 1);
    const users = getUsers();
    users[currentUser.nickname] = currentUser;
    saveUsers(users);
    loadCustomExercises();
}

document.getElementById('addCustomExBtn').addEventListener('click', function() {
    const name = document.getElementById('customExName').value.trim();
    const count = parseInt(document.getElementById('customExCount').value);
    if (!name || !count) { showToast('Введите название и количество', 'error'); return; }
    if (!currentUser) { showToast(t('alert_no_user'), 'error'); return; }
    currentUser.customExercises = currentUser.customExercises || [];
    currentUser.customExercises.push({ name, count, min: 30, max: 90 });
    const users = getUsers();
    users[currentUser.nickname] = currentUser;
    saveUsers(users);
    loadCustomExercises();
    showToast('Добавлено', 'success');
    updateAchievements();
});

// ================================================================
//  ЧЕЛЛЕНДЖИ
// ================================================================
function getDailyChallenge() {
    if (!currentUser) return null;
    const today = new Date().toISOString().slice(0,10);
    const key = 'challenge_' + currentUser.nickname;
    let ch = JSON.parse(localStorage.getItem(key) || 'null');
    if (!ch || ch.date !== today) {
        const picked = CONFIG.CHALLENGES[Math.floor(Math.random() * CONFIG.CHALLENGES.length)];
        ch = { date: today, task: picked.task, bonus: picked.bonus };
        localStorage.setItem(key, JSON.stringify(ch));
    }
    return ch;
}

function loadChallenge() {
    if (!currentUser) return;
    const ch = getDailyChallenge();
    if (!ch) return;
    const display = document.getElementById('challengeDisplay');
    display.textContent = '🔥 ' + t('challenge_today', { task: ch.task }) + (currentUser.dailyChallengeDone ? ' ✅' : '');
}

// ================================================================
//  ГРАФИКИ
// ================================================================
function loadChart() {
    if (!currentUser) return;
    const historyKey = 'history_' + currentUser.nickname;
    const history = JSON.parse(localStorage.getItem(historyKey) || '[]');
    const emptyMsg = document.getElementById('chartEmptyMessage');
    if (history.length === 0) {
        emptyMsg.style.display = 'block';
        if (chartInstance) { chartInstance.destroy(); chartInstance = null; }
        if (workoutChartInstance) { workoutChartInstance.destroy(); workoutChartInstance = null; }
        return;
    }
    emptyMsg.style.display = 'none';
    history.sort((a, b) => new Date(a.date) - new Date(b.date));
    const dates = history.map(h => h.date);
    const points = history.map(h => h.points);
    const ctx1 = document.getElementById('progressChart').getContext('2d');
    if (chartInstance) chartInstance.destroy();
    chartInstance = new Chart(ctx1, {
        type: 'line',
        data: { labels: dates, datasets: [{ label: t('chart_title'), data: points, borderColor: '#6c5ce7', backgroundColor: 'rgba(108,92,231,0.2)', fill: true, tension: 0.2 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#a7a9be' } } }, scales: { x: { ticks: { color: '#a7a9be', maxTicksLimit: 6 } }, y: { ticks: { color: '#a7a9be' } } } }
    });
    const counts = {};
    history.forEach(h => { counts[h.date] = (counts[h.date] || 0) + 1; });
    const wDates = Object.keys(counts).sort();
    const wCounts = wDates.map(d => counts[d]);
    const ctx2 = document.getElementById('workoutChart').getContext('2d');
    if (workoutChartInstance) workoutChartInstance.destroy();
    workoutChartInstance = new Chart(ctx2, {
        type: 'bar',
        data: { labels: wDates, datasets: [{ label: 'Тренировок', data: wCounts, backgroundColor: '#6c5ce7' }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#a7a9be' } } }, scales: { x: { ticks: { color: '#a7a9be', maxTicksLimit: 6 } }, y: { ticks: { color: '#a7a9be' } } } }
    });
}

// ================================================================
//  ЕЖЕДНЕВНЫЙ БОНУС
// ================================================================
function checkDailyBonus() {
    if (!currentUser) return;
    const today = new Date().toISOString().slice(0,10);
    if (currentUser.lastLoginDate === today) return;
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
    const yStr = yesterday.toISOString().slice(0,10);
    if (currentUser.lastLoginDate === yStr) {
        currentUser.streakDays = (currentUser.streakDays || 0) + 1;
    } else {
        currentUser.streakDays = 1;
    }
    if (currentUser.streakDays >= 7) {
        const item = CONFIG.LOOT[Math.floor(Math.random() * CONFIG.LOOT.length)];
        currentUser.inventory = currentUser.inventory || [];
        currentUser.inventory.push(item);
        currentUser.streakDays = 0;
        showToast('🎁 Сундук за 7-дневную серию!', 'success');
        playSound('loot');
    }
    currentUser.lastLoginDate = today;
    const users = getUsers();
    users[currentUser.nickname] = currentUser;
    saveUsers(users);
}

// ================================================================
//  РАНГИ
// ================================================================
function getRank(points) {
    let result = CONFIG.RANKS[0];
    for (let i = 0; i < CONFIG.RANKS.length; i++) {
        if (points >= CONFIG.RANKS[i].min) result = CONFIG.RANKS[i];
        else break;
    }
    return result;
}

function updateRankDisplay() {
    if (!currentUser) return;
    const rank = getRank(currentUser.points);
    const idx = CONFIG.RANKS.indexOf(rank);
    const next = CONFIG.RANKS[idx + 1];
    document.getElementById('rankDisplay').textContent = '🏅 ' + (t('rank_' + rank.key) || rank.name);
    const prev = CONFIG.RANKS[Math.max(0, idx - 1)];
    const current = currentUser.points - (prev?.min || 0);
    const needed = next ? next.min - (prev?.min || 0) : 1;
    const percent = Math.min(100, (current / needed) * 100);
    document.getElementById('rankProgress').style.width = percent + '%';
    const pointsToNext = next ? next.min - currentUser.points : 0;
    document.getElementById('rankNext').innerHTML = t('rank_progress', { points: pointsToNext });
    document.getElementById('rankNextPoints').textContent = pointsToNext;
}

// ================================================================
//  ЛИДЕРБОРД (заглушка, реальная в game.js)
// ================================================================
function loadLeaderboard() {
    // Функция определена в game.js, здесь вызывается из updateUI
    if (typeof loadLeaderboard === 'function') {
        // уже есть
    }
}

// ================================================================
//  АДМИН-ПАНЕЛЬ
// ================================================================
function toggleAdminPanel() {
    const panel = document.getElementById('adminPanel');
    if (!currentUser) {
        panel.style.display = 'none';
        return;
    }
    panel.style.display = 'block';
    if (adminUnlocked) {
        document.getElementById('adminContent').style.display = 'block';
        document.getElementById('adminAuthRow').style.display = 'none';
        renderActiveAdminTab();
    } else {
        document.getElementById('adminContent').style.display = 'none';
        document.getElementById('adminAuthRow').style.display = 'flex';
    }
}

document.getElementById('adminUnlockBtn').addEventListener('click', function() {
    const pass = document.getElementById('adminMasterPassword').value;
    if (pass === CONFIG.ADMIN_PASSWORD) {
        adminUnlocked = true;
        toggleAdminPanel();
        showToast('Админ-панель разблокирована', 'success');
    } else {
        showToast('Неверный пароль', 'error');
    }
});

document.querySelectorAll('.admin-tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        renderActiveAdminTab();
    });
});

function renderActiveAdminTab() {
    const activeBtn = document.querySelector('.admin-tab-btn.active');
    if (!activeBtn) return;
    const tab = activeBtn.dataset.admintab;
    document.getElementById('adminStaff').style.display = 'none';
    document.getElementById('adminShop').style.display = 'none';
    document.getElementById('adminPromo').style.display = 'none';
    document.getElementById('adminAnalytics').style.display = 'none';
    if (tab === 'staff') {
        document.getElementById('adminStaff').style.display = 'block';
        renderAdminStaff();
    } else if (tab === 'shop') {
        document.getElementById('adminShop').style.display = 'block';
        renderAdminShop();
    } else if (tab === 'promo') {
        document.getElementById('adminPromo').style.display = 'block';
        renderAdminPromo();
    } else if (tab === 'analytics') {
        document.getElementById('adminAnalytics').style.display = 'block';
        renderAdminAnalytics();
    }
}

function renderAdminStaff() {
    const container = document.getElementById('adminStaff');
    const users = getUsers();
    const sorted = Object.values(users).sort((a, b) => (b.points || 0) - (a.points || 0));
    container.innerHTML = '<h5>Пользователи:</h5>';
    sorted.forEach(u => {
        const div = document.createElement('div');
        div.style.cssText = 'display:flex; justify-content:space-between; align-items:center; padding:4px 0; border-bottom:1px solid var(--glass-border); font-size:13px;';
        div.innerHTML = `
            <span><strong>${u.nickname}</strong> — ${u.points || 0} очков, тренировок: ${u.totalWorkouts || 0}, предметов: ${u.inventory ? u.inventory.length : 0}</span>
            <div>
                <button class="btn btn-sm" style="background:#3498db;padding:2px 8px;" onclick="grantItemToUser('${u.nickname}')"><i class="fas fa-gift"></i> Выдать предмет</button>
            </div>
        `;
        container.appendChild(div);
    });
    if (!sorted.length) container.innerHTML += '<p>Нет пользователей</p>';
}

function grantItemToUser(nick) {
    const users = getUsers();
    const user = users[nick];
    if (!user) return;
    const itemId = prompt('Введите ID предмета для выдачи:');
    if (!itemId) return;
    const item = findItemById(itemId);
    if (!item) { showToast('Предмет не найден', 'error'); return; }
    if (isItemOwned(user, itemId)) { showToast('У пользователя уже есть этот предмет', 'error'); return; }
    addItemToInventory(user, itemId);
    saveUsers(users);
    renderAdminStaff();
    showToast(`Предмет ${item.name} выдан пользователю ${nick}`, 'success');
}

function renderAdminShop() {
    const container = document.getElementById('adminShop');
    container.innerHTML = '<h5>Управление предметами магазина:</h5>';
    shopItems.forEach(item => {
        const div = document.createElement('div');
        div.style.cssText = 'display:flex; justify-content:space-between; align-items:center; padding:4px 0; border-bottom:1px solid var(--glass-border); font-size:13px;';
        div.innerHTML = `
            <span>${item.icon} <strong>${item.name}</strong> (${t('type_' + item.type)}) — ${item.price} 🪙</span>
            <div>
                <button class="btn btn-sm" style="background:#f39c12;padding:2px 8px;" onclick="editAdminShopItemPrice('${item.id}')"><i class="fas fa-edit"></i></button>
                <button class="btn btn-sm" style="background:#e74c3c;padding:2px 8px;" onclick="deleteAdminShopItem('${item.id}')"><i class="fas fa-trash"></i></button>
            </div>
        `;
        container.appendChild(div);
    });
    const formDiv = document.createElement('div');
    formDiv.style.cssText = 'margin-top:8px; display:flex; gap:4px; flex-wrap:wrap;';
    formDiv.innerHTML = `
        <input type="text" id="newItemName" placeholder="Название" style="flex:2; min-width:100px;">
        <input type="text" id="newItemIcon" placeholder="Иконка (эмодзи)" style="flex:1; min-width:60px;">
        <input type="number" id="newItemPrice" placeholder="Цена" style="flex:1; min-width:60px;">
        <select id="newItemType">
            <option value="avatar">Аватар</option>
            <option value="frame">Рамка</option>
            <option value="banner">Баннер</option>
            <option value="title">Титул</option>
        </select>
        <button class="btn btn-sm" onclick="addAdminShopItem()"><i class="fas fa-plus"></i></button>
    `;
    container.appendChild(formDiv);
}

function addAdminShopItem() {
    const name = document.getElementById('newItemName').value.trim();
    const icon = document.getElementById('newItemIcon').value.trim();
    const price = parseInt(document.getElementById('newItemPrice').value);
    const type = document.getElementById('newItemType').value;
    if (!name || !icon || !price || price <= 0) {
        showToast('Заполните все поля корректно', 'error');
        return;
    }
    const id = type + '_' + Date.now();
    shopItems.push({ id, name, icon, price, type });
    saveShopItems();
    renderAdminShop();
    showToast('Предмет добавлен', 'success');
}

function editAdminShopItemPrice(id) {
    const item = findItemById(id);
    if (!item) return;
    const newPrice = prompt('Введите новую цену:', item.price);
    if (newPrice === null) return;
    const price = parseInt(newPrice);
    if (isNaN(price) || price < 0) { showToast('Некорректная цена', 'error'); return; }
    item.price = price;
    saveShopItems();
    renderAdminShop();
    showToast('Цена обновлена', 'success');
}

function deleteAdminShopItem(id) {
    if (!confirm('Удалить предмет?')) return;
    shopItems = shopItems.filter(i => i.id !== id);
    saveShopItems();
    renderAdminShop();
    showToast('Предмет удалён', 'success');
}

function renderAdminPromo() {
    const container = document.getElementById('adminPromo');
    const promos = JSON.parse(localStorage.getItem('promoCodes') || '[]');
    container.innerHTML = '<h5>Промокоды:</h5>';
    if (promos.length === 0) {
        container.innerHTML += '<p>Нет промокодов</p>';
    } else {
        promos.forEach(p => {
            const div = document.createElement('div');
            div.style.cssText = 'display:flex; justify-content:space-between; align-items:center; padding:4px 0; border-bottom:1px solid var(--glass-border); font-size:13px;';
            div.innerHTML = `
                <span><strong>${p.code}</strong> — бонус: ${p.bonus}, использовано: ${p.used}/${p.maxUses}</span>
                <button class="btn btn-sm" style="background:#e74c3c;padding:2px 8px;" onclick="deleteAdminPromo('${p.code}')"><i class="fas fa-trash"></i></button>
            `;
            container.appendChild(div);
        });
    }
    const formDiv = document.createElement('div');
    formDiv.style.cssText = 'margin-top:8px; display:flex; gap:4px; flex-wrap:wrap;';
    formDiv.innerHTML = `
        <input type="text" id="newPromoCode" placeholder="Код" style="flex:1; min-width:70px;">
        <input type="number" id="newPromoBonus" placeholder="Бонус" style="flex:1; min-width:60px;">
        <input type="number" id="newPromoMaxUses" placeholder="Макс. исп." style="flex:1; min-width:60px;">
        <button class="btn btn-sm" onclick="addAdminPromo()"><i class="fas fa-plus"></i></button>
    `;
    container.appendChild(formDiv);
}

function addAdminPromo() {
    const code = document.getElementById('newPromoCode').value.trim().toUpperCase();
    const bonus = parseInt(document.getElementById('newPromoBonus').value);
    const maxUses = parseInt(document.getElementById('newPromoMaxUses').value);
    if (!code || !bonus || !maxUses || bonus <= 0 || maxUses <= 0) {
        showToast('Заполните все поля корректно', 'error');
        return;
    }
    let promos = JSON.parse(localStorage.getItem('promoCodes') || '[]');
    if (promos.some(p => p.code === code)) {
        showToast('Такой код уже существует', 'error');
        return;
    }
    promos.push({ code, bonus, maxUses, used: 0 });
    localStorage.setItem('promoCodes', JSON.stringify(promos));
    renderAdminPromo();
    showToast('Промокод создан', 'success');
}

function deleteAdminPromo(code) {
    if (!confirm('Удалить промокод?')) return;
    let promos = JSON.parse(localStorage.getItem('promoCodes') || '[]');
    promos = promos.filter(p => p.code !== code);
    localStorage.setItem('promoCodes', JSON.stringify(promos));
    renderAdminPromo();
    showToast('Промокод удалён', 'success');
}

function renderAdminAnalytics() {
    const container = document.getElementById('adminAnalytics');
    const users = Object.values(getUsers());
    const totalPoints = users.reduce((sum, u) => sum + (u.points || 0), 0);
    const totalWorkouts = users.reduce((sum, u) => sum + (u.totalWorkouts || 0), 0);
    const totalBossFights = users.reduce((sum, u) => sum + (u.bossFights || 0), 0);
    container.innerHTML = `
        <h5>Аналитика:</h5>
        <div style="font-size:13px; line-height:1.6;">
            <p>👥 Пользователей: <strong>${users.length}</strong></p>
            <p>🪙 Всего очков: <strong>${totalPoints}</strong></p>
            <p>🏋️ Всего тренировок: <strong>${totalWorkouts}</strong></p>
            <p>⚔️ Всего боёв с боссами: <strong>${totalBossFights}</strong></p>
        </div>
    `;
}

// ================================================================
//  ПЕРЕКЛЮЧЕНИЕ ВКЛАДОК
// ================================================================
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const id = this.dataset.tab;
        document.querySelectorAll('#trainTab,#shopTab,#inventoryTab,#simpleTasksTab,#leaderTab,#chartTab,#fightTab,#achievementsTab,#settingsTab').forEach(el => el.style.display = 'none');
        document.getElementById(id).style.display = 'block';
        if (id === 'chartTab') loadChart();
        if (id === 'fightTab') { loadBoss(); updateRankDisplay(); }
        if (id === 'achievementsTab') loadAchievements();
        if (id === 'leaderTab') loadLeaderboard();
        if (id === 'shopTab') loadShop();
        if (id === 'inventoryTab') loadInventory();
        if (id === 'simpleTasksTab') loadSimpleTasks();
        if (id === 'settingsTab') toggleAdminPanel();
    });
});

// ================================================================
//  ПРОЧИЕ ОБРАБОТЧИКИ
// ================================================================
document.getElementById('shareBtn').addEventListener('click', function() {
    const task = this.dataset.task || 'тренировку';
    const time = this.dataset.time || '0 сек';
    const pts = this.dataset.reward || '10';
    const text = t('share_text', { task, time, points: pts }) + ' ' + window.location.href;
    if (navigator.share) {
        navigator.share({ title: 'KWON Fitness', text }).catch(() => {});
    } else {
        navigator.clipboard.writeText(text).then(() => showToast('Ссылка скопирована', 'success'))
            .catch(() => { const i = document.createElement('input'); i.value = text; document.body.appendChild(i); i.select(); document.execCommand('copy'); document.body.removeChild(i); showToast('Ссылка скопирована', 'success'); });
    }
});

document.getElementById('calc1RMbtn').addEventListener('click', function() {
    const w = parseInt(document.getElementById('weightInput').value);
    const r = parseInt(document.getElementById('repsInput').value);
    const res = document.getElementById('result1RM');
    if (w > 0 && r > 0) {
        const rm = Math.round(w * (1 + 0.0333 * r));
        res.textContent = t('result_1rm', { rm });
        res.style.color = 'var(--kwon-purple)';
    } else {
        res.textContent = t('result_1rm_error');
        res.style.color = '#e74c3c';
    }
});

document.getElementById('exportDataBtn').addEventListener('click', function() {
    if (!currentUser) { showToast(t('alert_no_user'), 'error'); return; }
    const data = { user: currentUser };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'kwon_fitness_data_' + currentUser.nickname + '.json';
    a.click();
    showToast('Экспортировано', 'success');
});

document.getElementById('importDataBtn').addEventListener('click', () => document.getElementById('importFileInput').click());

document.getElementById('importFileInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(ev) {
        try {
            const data = JSON.parse(ev.target.result);
            if (!currentUser) { showToast(t('alert_no_user'), 'error'); return; }
            Object.assign(currentUser, data.user);
            const users = getUsers();
            users[currentUser.nickname] = currentUser;
            saveUsers(users);
            localStorage.setItem('currentUser', currentUser.nickname);
            showToast('Импортировано', 'success');
            location.reload();
        } catch(err) {
            showToast('Ошибка: ' + err.message, 'error');
        }
    };
    reader.readAsText(file);
    this.value = '';
});

document.getElementById('exportBtn').addEventListener('click', function() {
    if (!currentUser) { showToast(t('alert_no_user'), 'error'); return; }
    const historyKey = 'history_' + currentUser.nickname;
    const history = JSON.parse(localStorage.getItem(historyKey) || '[]');
    let csv = 'Date,Points,Level,Streak\n';
    csv += new Date().toISOString().slice(0,10) + ',' + currentUser.points + ',' + (currentUser.fitnessLevel || '') + ',' + (currentUser.streak || 0) + '\n';
    history.forEach(h => { csv += h.date + ',' + h.points + ',,\n'; });
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'kwon_fitness_data.csv';
    a.click();
    showToast('CSV экспортирован', 'success');
});

document.getElementById('resetProgressBtn').addEventListener('click', function() {
    if (!currentUser) { showToast(t('alert_no_user'), 'error'); return; }
    const input = prompt(t('alert_reset_confirm'));
    if (input && input.trim().toUpperCase() === 'СБРОС') {
        currentUser.points = 0;
        currentUser.dailyDone = false;
        currentUser.streak = 0;
        currentUser.inventory = [];
        currentUser.totalWorkouts = 0;
        currentUser.usedPromoCodes = [];
        currentUser.dailyChallengeDone = false;
        currentUser.bossFights = 0;
        currentUser.streakDays = 0;
        currentUser.customExercises = [];
        currentUser.achievements = {};
        const historyKey = 'history_' + currentUser.nickname;
        localStorage.removeItem(historyKey);
        const users = getUsers();
        users[currentUser.nickname] = currentUser;
        saveUsers(users);
        localStorage.setItem('currentUser', currentUser.nickname);
        showToast(t('alert_reset_done'), 'success');
        location.reload();
    } else {
        showToast('Сброс отменён', 'info');
    }
});

document.getElementById('goalSelect').addEventListener('change', function() {
    if (!currentUser) return;
    currentUser.goal = this.value;
    const users = getUsers();
    users[currentUser.nickname] = currentUser;
    saveUsers(users);
    showToast('Цель изменена', 'success');
});

document.getElementById('darkTheme').addEventListener('change', function() {
    document.body.classList.toggle('light', !this.checked);
    localStorage.setItem('darkTheme', this.checked);
});

document.getElementById('langSelect').addEventListener('change', function() {
    setLanguage(this.value);
});

document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        setLanguage(this.dataset.lang);
    });
});

// Делегирование для кнопок выбора пути и цели
document.getElementById('regPathSelector').addEventListener('click', function(event) {
    const btn = event.target.closest('.path-btn');
    if (!btn) return;
    document.querySelectorAll('#regPathSelector .path-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
});

document.getElementById('regGoalSelector').addEventListener('click', function(event) {
    const btn = event.target.closest('.goal-btn');
    if (!btn) return;
    document.querySelectorAll('#regGoalSelector .goal-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
});

// ================================================================
//  ИНИЦИАЛИЗАЦИЯ
// ================================================================
document.addEventListener('DOMContentLoaded', function() {
    const dark = localStorage.getItem('darkTheme') !== 'false';
    document.body.classList.toggle('light', !dark);
    document.getElementById('darkTheme').checked = dark;
    const lang = localStorage.getItem('lang') || 'ru';
    document.getElementById('langSelect').value = lang;
    document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
    setLanguage(lang);
    loadShopItems();

    const saved = localStorage.getItem('currentUser');
    if (saved) {
        const users = getUsers();
        if (users[saved]) {
            currentUser = users[saved];
            showMainScreen();
            return;
        }
    }
    showLoginScreen();
});

console.log('🏋️ KWON Fitness загружена (app.js)');