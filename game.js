// ================================================================
//  ИГРОВАЯ МЕХАНИКА: МАГАЗИН, ИНВЕНТАРЬ, ПРОФИЛИ, БОССЫ, ПРОМОКОДЫ
// ================================================================

// --- МАГАЗИН ---
function loadShop() {
    if (!currentUser) return;
    const list = document.getElementById('shopList');
    list.innerHTML = '';
    const grouped = { avatar: [], frame: [], banner: [], title: [] };
    shopItems.forEach(item => {
        if (grouped[item.type]) grouped[item.type].push(item);
    });

    const typeNames = { avatar: 'Аватарки', frame: 'Рамки', banner: 'Баннеры', title: 'Титулы' };

    Object.keys(grouped).forEach(type => {
        const items = grouped[type];
        if (items.length === 0) return;
        const groupDiv = document.createElement('div');
        groupDiv.className = 'inventory-group';
        groupDiv.innerHTML = `<h4>${typeNames[type]}</h4>`;
        items.forEach(item => {
            const owned = isItemOwned(currentUser, item.id);
            const isActive = (currentUser.avatar === item.id && type === 'avatar') ||
                             (currentUser.frame === item.id && type === 'frame') ||
                             (currentUser.banner === item.id && type === 'banner') ||
                             (currentUser.title === item.id && type === 'title');
            const div = document.createElement('div');
            div.className = 'shop-item' + (owned ? ' owned' : '') + (isActive ? ' active' : '');
            div.innerHTML = `
                <div class="item-info">
                    <span class="item-icon">${item.icon}</span>
                    <div>
                        <div><strong>${item.name}</strong></div>
                        <div class="item-type">${t('type_' + type)}</div>
                    </div>
                </div>
                <div class="item-actions">
                    ${owned ? 
                        (isActive ? `<span style="color:#2ecc71;">✅ ${t('active_label')}</span>` : `<span style="color:#2ecc71;">✅ ${t('owned_label')}</span>`) :
                        `<button class="btn btn-sm buy-btn" data-id="${item.id}">${item.price} 🪙 ${t('buy_btn')}</button>`
                    }
                </div>
            `;
            groupDiv.appendChild(div);
        });
        list.appendChild(groupDiv);
    });
}

document.addEventListener('click', function(e) {
    if (e.target.closest('.buy-btn')) {
        const btn = e.target.closest('.buy-btn');
        const itemId = btn.dataset.id;
        buyItem(itemId);
    }
});

function buyItem(itemId) {
    if (!currentUser) { showToast(t('alert_no_user'), 'error'); return; }
    const item = findItemById(itemId);
    if (!item) return;
    if (isItemOwned(currentUser, itemId)) { showToast('Уже куплено', 'error'); return; }
    if (currentUser.points < item.price) { showToast(t('alert_no_points'), 'error'); return; }
    
    const btn = document.querySelector(`.buy-btn[data-id="${itemId}"]`);
    if (btn) btn.disabled = true;
    
    currentUser.points -= item.price;
    addItemToInventory(currentUser, itemId);
    
    const users = getUsers();
    users[currentUser.nickname] = currentUser;
    saveUsers(users);
    
    document.getElementById('userPointsDisplay').textContent = currentUser.points;
    document.getElementById('headerPoints').textContent = '🪙 ' + currentUser.points;
    
    loadShop();
    loadInventory();
    updateHeaderAvatar();
    updateAchievements();
    showToast(t('alert_purchase_success'), 'success');
    playSound('buy');
    
    if (btn) btn.disabled = false;
}

// --- ИНВЕНТАРЬ ---
function loadInventory() {
    if (!currentUser) return;
    const container = document.getElementById('inventoryList');
    container.innerHTML = '';
    const inv = currentUser.inventory || [];
    const grouped = { avatar: [], frame: [], banner: [], title: [] };
    inv.forEach(item => {
        if (grouped[item.type]) grouped[item.type].push(item);
    });

    const typeNames = { avatar: 'Аватарки', frame: 'Рамки', banner: 'Баннеры', title: 'Титулы' };

    Object.keys(grouped).forEach(type => {
        const items = grouped[type];
        if (items.length === 0) return;
        const groupDiv = document.createElement('div');
        groupDiv.className = 'inventory-group';
        groupDiv.innerHTML = `<h4>${typeNames[type]}</h4>`;
        items.forEach(item => {
            const isActive = (currentUser.avatar === item.id && type === 'avatar') ||
                             (currentUser.frame === item.id && type === 'frame') ||
                             (currentUser.banner === item.id && type === 'banner') ||
                             (currentUser.title === item.id && type === 'title');
            const div = document.createElement('div');
            div.className = 'inventory-item' + (isActive ? ' active' : '');
            div.innerHTML = `
                <div class="item-info">
                    <span class="item-icon">${item.icon}</span>
                    <div>
                        <div><strong>${item.name}</strong></div>
                        <div style="font-size:11px;color:var(--text2);">${t('type_' + type)}</div>
                    </div>
                </div>
                <div class="item-actions">
                    ${isActive ? 
                        `<span style="color:#2ecc71;">✅ ${t('active_label')}</span>` :
                        `<button class="btn btn-sm use-btn" data-id="${item.id}" data-type="${type}">${t('use_btn')}</button>`
                    }
                </div>
            `;
            groupDiv.appendChild(div);
        });
        container.appendChild(groupDiv);
    });
    if (inv.length === 0) {
        container.innerHTML = '<p style="color:var(--text2); text-align:center;">Нет предметов</p>';
    }
}

document.addEventListener('click', function(e) {
    if (e.target.closest('.use-btn')) {
        const btn = e.target.closest('.use-btn');
        const itemId = btn.dataset.id;
        const type = btn.dataset.type;
        useItem(itemId, type);
    }
});

function useItem(itemId, type) {
    if (!currentUser) return;
    if (!isItemOwned(currentUser, itemId)) { showToast('Предмет не куплен', 'error'); return; }
    setActiveItem(currentUser, type, itemId);
    const users = getUsers();
    users[currentUser.nickname] = currentUser;
    saveUsers(users);
    loadInventory();
    loadShop();
    updateHeaderAvatar();
    showToast('Предмет применён', 'success');
    if (type === 'avatar') {
        openProfile(currentUser, true);
    }
}

// --- ЛИДЕРБОРД (кликабельные имена) ---
function loadLeaderboard() {
    const list = document.getElementById('leaderList');
    list.innerHTML = '';
    const users = getUsers();
    const sorted = Object.values(users).sort((a, b) => (b.points || 0) - (a.points || 0));
    sorted.slice(0, 10).forEach((u, i) => {
        const rank = getRank(u.points || 0);
        const div = document.createElement('div');
        div.className = 'leaderboard-item';
        div.innerHTML = `
            <span>#${i+1} <span class="leader-name" data-nick="${u.nickname}" style="cursor:pointer; color:var(--primary); text-decoration:underline;">${u.nickname}</span></span>
            <span>💪 ${u.points || 0} ${t('points_short')} • ${t('rank_' + rank.key)}</span>
        `;
        list.appendChild(div);
    });
    if (!sorted.length) list.innerHTML = '<p style="color:var(--text2);">' + t('no_data') + '</p>';
}

document.addEventListener('click', function(e) {
    if (e.target.closest('.leader-name')) {
        const nick = e.target.closest('.leader-name').dataset.nick;
        const users = getUsers();
        const user = users[nick];
        if (user) {
            openProfile(user, user.nickname === currentUser?.nickname);
        }
    }
});

// --- БОССЫ ---
function loadBoss() {
    if (!currentUser) return;
    const today = new Date().toISOString().slice(0,10);
    const bossKey = 'boss_' + currentUser.nickname;
    let bossData = JSON.parse(localStorage.getItem(bossKey) || 'null');
    if (!bossData || bossData.date !== today) {
        const name = CONFIG.BOSS_NAMES[Math.floor(Math.random() * CONFIG.BOSS_NAMES.length)];
        const power = 50 + Math.floor(Math.random() * 100);
        bossData = { date: today, name, power, fought: false };
        localStorage.setItem(bossKey, JSON.stringify(bossData));
    }
    document.getElementById('bossName').textContent = '👹 ' + bossData.name;
    document.getElementById('bossPowerValue').textContent = bossData.power;
    document.getElementById('bossPower').innerHTML = t('boss_power', { power: bossData.power });
    document.getElementById('fightResult').textContent = '';
    const btn = document.getElementById('fightBtn');
    if (bossData.fought) {
        btn.disabled = true;
        btn.textContent = '⏳ Завтра';
        document.getElementById('fightResult').textContent = t('fight_already');
    } else {
        btn.disabled = false;
        btn.textContent = t('fight_btn');
    }
    window._bossData = bossData;
}

document.getElementById('fightBtn').addEventListener('click', function() {
    if (!currentUser) { showToast(t('alert_no_user'), 'error'); return; }
    const boss = window._bossData;
    if (!boss || boss.fought) { showToast(t('fight_already'), 'error'); return; }
    const power = currentUser.points / 10;
    const result = document.getElementById('fightResult');
    let reward;
    if (power >= boss.power) {
        reward = CONFIG.BOSS_WIN;
        result.textContent = t('fight_win', { reward });
        result.style.color = '#2ecc71';
        playSound('finish');
    } else {
        reward = CONFIG.BOSS_LOSE;
        result.textContent = t('fight_lose', { reward });
        result.style.color = '#e74c3c';
        playSound('boss');
    }
    currentUser.points += reward;
    currentUser.bossFights = (currentUser.bossFights || 0) + 1;
    boss.fought = true;
    const bossKey = 'boss_' + currentUser.nickname;
    localStorage.setItem(bossKey, JSON.stringify(boss));
    const users = getUsers();
    users[currentUser.nickname] = currentUser;
    saveUsers(users);
    document.getElementById('userPointsDisplay').textContent = currentUser.points;
    document.getElementById('headerPoints').textContent = '🪙 ' + currentUser.points;
    loadBoss();
    updateAchievements();
    updateRankDisplay();
});

// --- ПРОМОКОДЫ ---
document.getElementById('activatePromoBtn').addEventListener('click', function() {
    const code = document.getElementById('promoInput').value.trim().toUpperCase();
    const result = document.getElementById('promoResult');
    if (!code) { result.textContent = 'Введите код'; return; }
    if (!currentUser) { result.textContent = t('alert_no_user'); return; }
    const promos = JSON.parse(localStorage.getItem('promoCodes') || '[]');
    const promo = promos.find(p => p.code === code);
    if (!promo) { result.textContent = 'Неверный код'; return; }
    if (promo.used >= promo.maxUses) { result.textContent = 'Код исчерпан'; return; }
    if (currentUser.usedPromoCodes?.includes(code)) { result.textContent = 'Уже использован'; return; }
    currentUser.points += promo.bonus;
    currentUser.usedPromoCodes = currentUser.usedPromoCodes || [];
    currentUser.usedPromoCodes.push(code);
    promo.used++;
    localStorage.setItem('promoCodes', JSON.stringify(promos));
    const users = getUsers();
    users[currentUser.nickname] = currentUser;
    saveUsers(users);
    document.getElementById('userPointsDisplay').textContent = currentUser.points;
    document.getElementById('headerPoints').textContent = '🪙 ' + currentUser.points;
    result.textContent = '✅ +' + promo.bonus + ' очков!';
    showToast('✅ +' + promo.bonus + ' очков!', 'success');
});

console.log('🎮 game.js загружен');