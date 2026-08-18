// ================================================================
//  KWON FITNESS – DAILY QUESTS SYSTEM (FORCED GENERATION)
// ================================================================

console.log('dailyQuests.js загружен!');

const DAILY_QUESTS = {
    TYPES: {
        WORKOUT: 'workout',
        BOSS: 'boss',
        SHOP: 'shop',
        CHALLENGE: 'challenge',
        POINTS: 'points',
        LEVEL_UP: 'level_up'
    },
    DAILY_CONFIG: [
        {
            id: 'daily_workout_3',
            type: 'workout',
            title: 'daily_quest_workout',
            description: 'daily_quest_workout_desc',
            goal: 3,
            reward: { points: 50, xp: 100 },
            icon: '💪'
        },
        {
            id: 'daily_boss_fight',
            type: 'boss',
            title: 'daily_quest_boss',
            description: 'daily_quest_boss_desc',
            goal: 1,
            reward: { points: 100, xp: 150 },
            icon: '⚔️'
        },
        {
            id: 'daily_shop_item',
            type: 'shop',
            title: 'daily_quest_shop',
            description: 'daily_quest_shop_desc',
            goal: 1,
            reward: { points: 30, xp: 75 },
            icon: '🛍️'
        },
        {
            id: 'daily_challenge',
            type: 'challenge',
            title: 'daily_quest_challenge',
            description: 'daily_quest_challenge_desc',
            goal: 1,
            reward: { points: 75, xp: 125 },
            icon: '🏆'
        },
        {
            id: 'daily_points_200',
            type: 'points',
            title: 'daily_quest_points',
            description: 'daily_quest_points_desc',
            goal: 200,
            reward: { points: 40, xp: 100 },
            icon: '🪙'
        }
    ]
};

function getDateKey() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
}

function generateNewDailyQuests(dateKey) {
    if (!currentUser) return;
    currentUser.dailyQuests = {};
    DAILY_QUESTS.DAILY_CONFIG.forEach(cfg => {
        currentUser.dailyQuests[cfg.id] = {
            id: cfg.id,
            type: cfg.type,
            title: cfg.title,
            description: cfg.description,
            goal: cfg.goal,
            progress: 0,
            completed: false,
            reward: cfg.reward,
            icon: cfg.icon,
            createdAt: new Date().toISOString()
        };
    });
    localStorage.setItem('lastQuestDate_' + currentUser.nickname, dateKey);
    saveUserDataGame();
    // 🔁 Принудительно перезагружаем пользователя из хранилища
    const users = getUsers();
    if (users[currentUser.nickname]) {
        currentUser = users[currentUser.nickname];
        localStorage.setItem('currentUser', currentUser.nickname);
    }
    console.log('✅ Квесты созданы принудительно');
}

function initializeDailyQuests() {
    if (!currentUser) return;
    // Всегда пересоздаём квесты при загрузке (для отладки)
    generateNewDailyQuests(getDateKey());
}

function loadDailyQuests() {
    try {
        console.log('loadDailyQuests вызвана');
        if (!currentUser) {
            console.warn('loadDailyQuests: нет пользователя');
            return;
        }
        // Инициализация (безопасная)
        if (!currentUser.dailyQuests || typeof currentUser.dailyQuests !== 'object') {
            currentUser.dailyQuests = {};
        }
        // Проверяем наличие квестов
        let needSave = false;
        QUESTS_DATA.forEach(q => {
            if (!currentUser.dailyQuests[q.id]) {
                currentUser.dailyQuests[q.id] = { id: q.id, progress: 0, completed: false };
                needSave = true;
            }
        });
        if (needSave) {
            saveUserDataGame();
        }

        const container = document.getElementById('dailyQuestsContainer');
        if (!container) {
            console.error('Контейнер dailyQuestsContainer не найден!');
            return;
        }

        const quests = Object.values(currentUser.dailyQuests || {});
        if (quests.length === 0) {
            container.innerHTML = '<p style="text-align:center;color:#999;padding:20px;">Нет квестов</p>';
            return;
        }

        let html = '<div class="quests-list">';
        quests.forEach(q => {
            const config = QUESTS_DATA.find(c => c.id === q.id);
            if (!config) return;
            const progress = Math.min(q.progress || 0, config.goal);
            const percent = (progress / config.goal) * 100;
            const done = q.completed;
            const status = done ? '<span class="quest-completed">✓ Выполнено</span>' : `<span class="quest-progress">${progress}/${config.goal}</span>`;
            html += `
                <div class="quest-card ${done ? 'quest-completed-card' : ''}">
                    <div class="quest-header">
                        <span class="quest-icon">${config.icon}</span>
                        <div class="quest-title-block">
                            <h3 class="quest-title">${config.title}</h3>
                            <p class="quest-desc">${config.desc}</p>
                        </div>
                        ${status}
                    </div>
                    <div class="quest-progress-bar"><div class="quest-progress-fill" style="width:${percent}%"></div></div>
                    <div class="quest-reward">
                        ${config.reward.points ? `<span>🪙 +${config.reward.points}</span>` : ''}
                        ${config.reward.xp ? `<span>⭐ +${config.reward.xp} XP</span>` : ''}
                    </div>
                </div>
            `;
        });
        html += '</div>';
        container.innerHTML = html;

        // Добавляем CSS (если его нет)
        if (!document.getElementById('questsCSS')) {
            const style = document.createElement('style');
            style.id = 'questsCSS';
            style.textContent = `
                .quests-list{display:flex;flex-direction:column;gap:12px}
                .quest-card{background:linear-gradient(135deg,rgba(147,112,219,0.1),rgba(75,0,130,0.1));border:2px solid rgba(147,112,219,0.3);border-radius:12px;padding:16px;transition:all .3s ease}
                .quest-completed-card{background:linear-gradient(135deg,rgba(46,213,115,0.1),rgba(39,174,96,0.1));border-color:rgba(46,213,115,0.3);opacity:.85}
                .quest-header{display:flex;gap:12px;align-items:flex-start;margin-bottom:12px}
                .quest-icon{font-size:28px;min-width:32px;text-align:center}
                .quest-title-block{flex:1}
                .quest-title{margin:0;font-size:14px;font-weight:600;color:var(--kwon-text)}
                .quest-desc{margin:4px 0 0;font-size:12px;color:#999}
                .quest-progress,.quest-completed{font-size:12px;font-weight:600;padding:4px 8px;border-radius:6px;white-space:nowrap}
                .quest-progress{background:rgba(147,112,219,0.2);color:#9370db}
                .quest-completed{background:rgba(46,213,115,0.2);color:#2ed573}
                .quest-progress-bar{width:100%;height:8px;background:rgba(0,0,0,0.2);border-radius:4px;overflow:hidden;margin-bottom:10px}
                .quest-progress-fill{height:100%;background:linear-gradient(90deg,#9370db,#7b68ee);transition:width .3s ease}
                .quest-reward{display:flex;gap:12px;font-size:12px;font-weight:600;color:#ffd700}
            `;
            document.head.appendChild(style);
        }
    } catch (error) {
        console.error('Ошибка в loadDailyQuests:', error);
        // Показываем сообщение об ошибке в контейнере, чтобы не было белого экрана
        const container = document.getElementById('dailyQuestsContainer');
        if (container) {
            container.innerHTML = `<p style="color:#e74c3c;padding:10px;">Ошибка загрузки квестов: ${error.message}</p>`;
        }
    }
}

function updateQuestProgress(type, amount = 1) {
    if (!currentUser || !currentUser.dailyQuests) return;
    Object.values(currentUser.dailyQuests).forEach(q => {
        if (q.completed) return;
        if (q.type === type) {
            q.progress += amount;
            if (q.progress >= q.goal && !q.completed) {
                q.completed = true;
                if (q.reward.points) currentUser.points = (currentUser.points || 0) + q.reward.points;
                if (q.reward.xp) currentUser.xp = (currentUser.xp || 0) + q.reward.xp;
                currentUser.totalQuestsCompleted = (currentUser.totalQuestsCompleted || 0) + 1;
                showToast(`${q.icon} Квест выполнен!`, 'success');
                if (typeof fireConfetti === 'function') fireConfetti();
                if (typeof updateAchievements === 'function') updateAchievements();
                saveUserDataGame();
                loadDailyQuests();
            }
        }
    });
    saveUserDataGame();
}

// Автозапуск
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        if (currentUser) {
            loadDailyQuests();
        }
    }, 600);
});

function forceRefreshQuests() {
    if (!currentUser) {
        alert('Войдите в аккаунт');
        return;
    }
    localStorage.removeItem('lastQuestDate_' + currentUser.nickname);
    currentUser.dailyQuests = {};
    saveUserDataGame();
    // Перезагружаем пользователя
    const users = getUsers();
    if (users[currentUser.nickname]) {
        currentUser = users[currentUser.nickname];
        localStorage.setItem('currentUser', currentUser.nickname);
    }
    loadDailyQuests();
    alert('Квесты пересозданы!');
}

window.forceRefreshQuests = forceRefreshQuests;

console.log('✅ dailyQuests.js (FORCED) загружен');

window.loadDailyQuests = loadDailyQuests;