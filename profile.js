// ================================================================
//  KWON FITNESS – ПРОФИЛЬ ПОЛЬЗОВАТЕЛЯ
//  Аватар, рамки, баннеры, титулы, отображение профиля
// ================================================================

// ---------- Цвет рамки ----------
function getFrameColor(frameId) {
    const colorMap = {
        'frame_red': '#e74c3c',
        'frame_green': '#2ecc71',
        'frame_blue': '#3498db',
        'frame_yellow': '#f1c40f',
        'frame_purple': '#9b59b6',
        'frame_pink': '#e84393',
        'frame_gold': '#f39c12',
        'frame_silver': '#bdc3c7',
        'frame_rainbow': 'linear-gradient(45deg, red, orange, yellow, green, blue, indigo, violet)',
        'frame_neon': '#00ffcc',
        'frame_diamond': '#00d2ff',
        'frame_glow': '#ffd700'
    };
    return colorMap[frameId] || '#6c5ce7';
}

// ---------- Стиль баннера ----------
function getBannerStyle(bannerId) {
    const bannerStyles = {
        'banner_red': 'linear-gradient(135deg, #e74c3c, #c0392b)',
        'banner_blue': 'linear-gradient(135deg, #3498db, #2980b9)',
        'banner_green': 'linear-gradient(135deg, #2ecc71, #27ae60)',
        'banner_yellow': 'linear-gradient(135deg, #f1c40f, #f39c12)',
        'banner_purple': 'linear-gradient(135deg, #9b59b6, #8e44ad)',
        'banner_pink': 'linear-gradient(135deg, #e84393, #d63384)',
        'banner_sunset': 'linear-gradient(135deg, #ff6b6b, #feca57)',
        'banner_space': 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
        'banner_ocean': 'linear-gradient(135deg, #2980b9, #6dd5fa)',
        'banner_fire': 'linear-gradient(135deg, #e74c3c, #f39c12)',
        'banner_rainbow': 'linear-gradient(45deg, red, orange, yellow, green, blue, indigo, violet)',
        'banner_gold': 'linear-gradient(135deg, #f1c40f, #d4af37)',
        'banner_neon': 'linear-gradient(135deg, #00ffcc, #ff00cc)'
    };
    return bannerStyles[bannerId] || 'linear-gradient(135deg, #6c5ce7, #a29bfe)';
}

// ---------- Обновление аватара в шапке ----------
function updateHeaderAvatar() {
    if (!currentUser) return;
    const avatarEl = document.getElementById('avatarDisplay');

    // Устанавливаем аватар (эмодзи или первая буква ника)
    if (currentUser.avatar) {
        const item = findItemById(currentUser.avatar);
        if (item && item.type === 'avatar') {
            avatarEl.textContent = item.icon;
        } else {
            avatarEl.textContent = currentUser.nickname.charAt(0).toUpperCase();
        }
    } else {
        avatarEl.textContent = currentUser.nickname.charAt(0).toUpperCase();
    }

    // Применяем рамку (если есть)
    const frameItem = findItemById(currentUser.frame);
    if (frameItem) {
        avatarEl.style.border = '2px solid ' + getFrameColor(frameItem.id);
    } else {
        avatarEl.style.border = 'none';
    }
}

// ---------- Открытие профиля ----------
function openProfile(user, isSelf = false) {
    if (!user) return;

    const modal = document.getElementById('profileModal');
    if (!modal) return;

    // Баннер
    document.getElementById('profileBanner').style.background = getBannerStyle(user.banner);

    // Аватар
    const avatarEl = document.getElementById('profileAvatar');
    if (user.avatar) {
        const item = findItemById(user.avatar);
        avatarEl.textContent = item ? item.icon : user.nickname.charAt(0).toUpperCase();
    } else {
        avatarEl.textContent = user.nickname.charAt(0).toUpperCase();
    }

    // Рамка аватара
    const frameColor = getFrameColor(user.frame);
    avatarEl.style.border = `4px solid ${frameColor}`;

    // Имя и титул
    document.getElementById('profileNickname').textContent = user.nickname;
    const titleItem = user.title ? findItemById(user.title) : null;
    document.getElementById('profileTitle').textContent = titleItem ? titleItem.name : '';

    // Статистика
    const stats = document.getElementById('profileStats');
    stats.innerHTML = `
        <div class="stat-item"><div class="stat-value">${user.points || 0}</div>🪙 ${t('profile_stats_points')}</div>
        <div class="stat-item"><div class="stat-value">${t('rank_' + getRank(user.points).key)}</div>🏅 ${t('profile_stats_rank')}</div>
        <div class="stat-item"><div class="stat-value">${user.totalWorkouts || 0}</div>🏋️ ${t('profile_stats_workouts')}</div>
        <div class="stat-item"><div class="stat-value">${user.streak || 0}</div>🔥 ${t('profile_stats_streak')}</div>
        <div class="stat-item"><div class="stat-value">${user.age || '-'}</div>👤 ${t('profile_stats_age')}</div>
        <div class="stat-item"><div class="stat-value">${user.weight || '-'} кг</div>⚖️ ${t('profile_stats_weight')}</div>
        <div class="stat-item"><div class="stat-value">${user.gender === 'male' ? 'М' : 'Ж'}</div>🧑 ${t('profile_stats_gender')}</div>
        <div class="stat-item"><div class="stat-value">${user.path || '-'}</div>🛤️ ${t('profile_stats_path')}</div>
        <div class="stat-item"><div class="stat-value">${user.goal === 'lose' ? 'Похудеть' : user.goal === 'bulk' ? 'Накачаться' : 'Сила'}</div>🎯 ${t('profile_stats_goal')}</div>
        <div class="stat-item"><div class="stat-value">${user.fitnessLevel || '-'}</div>📊 ${t('profile_stats_level')}</div>
        <div class="stat-item"><div class="stat-value">${user.bossFights || 0}</div>⚔️ ${t('profile_stats_boss')}</div>
        <div class="stat-item"><div class="stat-value">${user.inventory ? user.inventory.length : 0}</div>📦 ${t('profile_stats_inventory')}</div>
    `;

    // Кнопки действий
    const actions = document.getElementById('profileActions');
    if (isSelf) {
        actions.innerHTML = `<button class="btn btn-sm" onclick="openAvatarPicker()"><i class="fas fa-user-circle"></i> ${t('change_avatar_btn')}</button>`;
    } else {
        actions.innerHTML = '';
    }

    modal.style.display = 'flex';
}

// ---------- Закрытие профиля ----------
function closeProfileModal() {
    document.getElementById('profileModal').style.display = 'none';
}

// ---------- Выбор аватарки ----------
function openAvatarPicker() {
    const modal = document.getElementById('avatarPickerModal');
    const list = document.getElementById('avatarPickerList');
    list.innerHTML = '';

    const avatars = currentUser.inventory.filter(i => i.type === 'avatar');
    if (avatars.length === 0) {
        list.innerHTML = '<p style="color:var(--text-secondary);">Нет купленных аватарок</p>';
    } else {
        avatars.forEach(item => {
            const div = document.createElement('div');
            div.className = 'avatar-picker-item';
            div.textContent = item.icon;
            div.onclick = () => {
                setActiveItem(currentUser, 'avatar', item.id);
                const users = getUsers();
                users[currentUser.nickname] = currentUser;
                saveUsers(users);
                updateHeaderAvatar();
                updateUI();
                closeAvatarPicker();
                openProfile(currentUser, true);
                showToast('Аватар обновлён', 'success');
            };
            list.appendChild(div);
        });
    }
    modal.style.display = 'flex';
}

function closeAvatarPicker() {
    document.getElementById('avatarPickerModal').style.display = 'none';
}

console.log('👤 profile.js загружен');