// ================================================================
//  KWON FITNESS – GAME SYSTEM V2.0
//  Магазин • Инвентарь • XP • Уровни • Боссы • Промокоды
//  Простые задания • Лидерборд • Лутбоксы • Редкость предметов
// ================================================================


// ================================================================
//  ЛОКАЛЬНЫЕ УТИЛИТЫ
// ================================================================

function escapeHTMLGame(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}


function getGameText(key, fallback) {
    try {
        const value = t(key);
        return value && value !== key ? value : fallback;
    } catch (e) {
        return fallback;
    }
}


function saveUserDataGame() {
    if (!currentUser) return;

    try {
        const users = getUsers();
        users[currentUser.nickname] = currentUser;
        saveUsers(users);
    } catch (error) {
        console.error(
            'KWON: ошибка сохранения пользователя:',
            error
        );
    }
}


function updatePointsUI() {
    if (!currentUser) return;

    const pointsDisplay =
        document.getElementById('userPointsDisplay');

    const headerPoints =
        document.getElementById('headerPoints');

    if (pointsDisplay) {
        pointsDisplay.textContent =
            currentUser.points || 0;
    }

    if (headerPoints) {
        headerPoints.textContent =
            '🪙 ' + (currentUser.points || 0);
    }
}


function updateLevelUI() {
    if (!currentUser) return;

    if (typeof getLevelFromXP === 'function') {
        currentUser.level =
            getLevelFromXP(currentUser.xp || 0);
    } else {
        currentUser.level =
            currentUser.level || 1;
    }

    if (typeof updateLevelDisplay === 'function') {
        try {
            updateLevelDisplay(currentUser);
        } catch (error) {
            console.warn(
                'KWON: updateLevelDisplay error',
                error
            );
        }
    }
}


function saveAndRefreshGame() {
    saveUserDataGame();
    updatePointsUI();
    updateLevelUI();

    if (typeof updateAchievements === 'function') {
        updateAchievements();
    }

    if (typeof updateRankDisplay === 'function') {
        updateRankDisplay();
    }
}


// ================================================================
//  XP SYSTEM
// ================================================================

function getCurrentLevel() {
    if (!currentUser) return 1;

    if (typeof getLevelFromXP === 'function') {
        return getLevelFromXP(
            currentUser.xp || 0
        );
    }

    return currentUser.level || 1;
}


function awardXP(amount, source = 'unknown', showMessage = true) {
    if (!currentUser) return false;

    amount = Number(amount);

    if (!Number.isFinite(amount) || amount <= 0) {
        return false;
    }

    const oldXP =
        Number(currentUser.xp) || 0;

    const oldLevel =
        typeof getLevelFromXP === 'function'
            ? getLevelFromXP(oldXP)
            : (currentUser.level || 1);

    currentUser.xp =
        oldXP + Math.floor(amount);

    const newLevel =
        typeof getLevelFromXP === 'function'
            ? getLevelFromXP(currentUser.xp)
            : oldLevel;

    currentUser.level = newLevel;

    saveUserDataGame();

    updateLevelUI();

    if (newLevel > oldLevel) {

        fireConfetti();
        playSound('finish');

        showToast(
            `🎉 LEVEL UP! ${oldLevel} → ${newLevel}`,
            'success'
        );

        if (
            typeof updateAchievements ===
            'function'
        ) {
            updateAchievements();
        }

        // 👇 НОВОЕ: браузерное уведомление
        if (typeof sendNotification === 'function') {
            sendNotification('🎉 Повышение уровня!', `Ты достиг ${newLevel} уровня!`);
        }

    } else if (showMessage) {

        const label =
            source === 'workout'
                ? 'тренировка'
                : source === 'challenge'
                    ? 'челлендж'
                    : source === 'boss'
                        ? 'босс'
                        : source === 'simple'
                            ? 'задание'
                            : 'активность';

        showToast(
            `⭐ +${Math.floor(amount)} XP • ${label}`,
            'success'
        );
    }

    return true;
}


function rewardUser(points, xp, message) {
    if (!currentUser) return;

    points = Number(points) || 0;
    xp = Number(xp) || 0;

    if (points > 0) {
        currentUser.points =
            (Number(currentUser.points) || 0) +
            Math.floor(points);
    }

    saveUserDataGame();
    updatePointsUI();

    if (xp > 0) {
        awardXP(
            xp,
            'reward',
            false
        );
    }

    if (message) {
        showToast(
            message,
            'success'
        );
    }

    if (
        typeof updateAchievements ===
        'function'
    ) {
        updateAchievements();
    }

    if (
        typeof updateRankDisplay ===
        'function'
    ) {
        updateRankDisplay();
    }
}


// ================================================================
//  РЕДКОСТЬ ПРЕДМЕТОВ
// ================================================================

function getRarityData(rarity) {

    const safeRarity =
        rarity || 'common';

    if (
        CONFIG &&
        CONFIG.RARITIES &&
        CONFIG.RARITIES[safeRarity]
    ) {
        return CONFIG.RARITIES[safeRarity];
    }

    return {
        key: 'common',
        name: 'Обычный',
        color: '#a0a0b0',
        multiplier: 1
    };
}


function getRarityName(rarity) {

    const data =
        getRarityData(rarity);

    const langKey =
        'loot_' + data.key;

    try {
        const translated =
            t(langKey);

        if (
            translated &&
            translated !== langKey
        ) {
            return translated;
        }
    } catch (e) {}

    return data.name;
}


function getRarityColor(rarity) {
    return getRarityData(rarity).color;
}


function getRarityBadge(rarity) {

    const data =
        getRarityData(rarity);

    return `
        <span
            style="
                color:${data.color};
                font-weight:700;
                text-shadow:0 0 8px ${data.color};
            "
        >
            ${escapeHTMLGame(getRarityName(data.key))}
        </span>
    `;
}


// ================================================================
//  МАГАЗИН
// ================================================================

function loadShop() {

    if (!currentUser) return;

    const list =
        document.getElementById(
            'shopList'
        );

    if (!list) return;

    list.innerHTML = '';

    const grouped = {
        avatar: [],
        frame: [],
        banner: [],
        title: []
    };

    (shopItems || []).forEach(
        item => {

            if (
                item &&
                grouped[item.type]
            ) {
                grouped[item.type].push(item);
            }

        }
    );

    const typeNames = {
        avatar: 'Аватары',
        frame: 'Рамки',
        banner: 'Баннеры',
        title: 'Титулы'
    };

    Object.keys(grouped).forEach(
        type => {

            const items =
                grouped[type];

            if (!items.length) return;

            const groupDiv =
                document.createElement(
                    'div'
                );

            groupDiv.className =
                'inventory-group';

            const heading =
                document.createElement(
                    'h4'
                );

            heading.textContent =
                typeNames[type] || type;

            groupDiv.appendChild(
                heading
            );

            items.forEach(
                item => {

                    const owned =
                        isItemOwned(
                            currentUser,
                            item.id
                        );

                    const isActive =
                        currentUser[type] ===
                        item.id;

                    const rarity =
                        item.rarity ||
                        'common';

                    const rarityColor =
                        getRarityColor(
                            rarity
                        );

                    const div =
                        document.createElement(
                            'div'
                        );

                    div.className =
                        'shop-item' +
                        (
                            owned
                                ? ' owned'
                                : ''
                        ) +
                        (
                            isActive
                                ? ' active'
                                : ''
                        );

                    div.style.borderColor =
                        rarityColor;

                    const info =
                        document.createElement(
                            'div'
                        );

                    info.className =
                        'item-info';

                    info.innerHTML = `
                        <span class="item-icon">
                            ${escapeHTMLGame(item.icon || '🎁')}
                        </span>

                        <div>
                            <div>
                                <strong>
                                    ${escapeHTMLGame(item.name)}
                                </strong>
                            </div>

                            <div
                                class="item-type"
                                style="color:${rarityColor};"
                            >
                                ${escapeHTMLGame(
                                    getRarityName(rarity)
                                )}
                                •
                                ${escapeHTMLGame(
                                    getGameText(
                                        'type_' + type,
                                        type
                                    )
                                )}
                            </div>
                        </div>
                    `;

                    const actions =
                        document.createElement(
                            'div'
                        );

                    actions.className =
                        'item-actions';

                    if (owned) {

                        actions.innerHTML =
                            isActive
                                ? `
                                    <span
                                        style="
                                            color:#2ecc71;
                                            font-weight:700;
                                        "
                                    >
                                        ✅ ${escapeHTMLGame(
                                            getGameText(
                                                'active_label',
                                                'Активно'
                                            )
                                        )}
                                    </span>
                                `
                                : `
                                    <span
                                        style="
                                            color:#2ecc71;
                                        "
                                    >
                                        ✅ ${escapeHTMLGame(
                                            getGameText(
                                                'owned_label',
                                                'Куплено'
                                            )
                                        )}
                                    </span>
                                `;

                    } else {

                        actions.innerHTML = `
                            <button
                                class="btn btn-sm buy-btn"
                                data-id="${escapeHTMLGame(item.id)}"
                            >
                                ${Number(item.price) || 0}
                                🪙
                                ${escapeHTMLGame(
                                    getGameText(
                                        'buy_btn',
                                        'Купить'
                                    )
                                )}
                            </button>
                        `;
                    }

                    div.appendChild(info);
                    div.appendChild(actions);

                    groupDiv.appendChild(div);
                }
            );

            list.appendChild(groupDiv);
        }
    );
}


// ================================================================
//  ПОКУПКА ПРЕДМЕТА
// ================================================================

function buyItem(itemId) {

    if (!currentUser) {
        showToast(
            t('alert_no_user'),
            'error'
        );
        return;
    }

    const item =
        findItemById(itemId);

    if (!item) {
        showToast(
            'Предмет не найден',
            'error'
        );
        return;
    }

    if (
        isItemOwned(
            currentUser,
            itemId
        )
    ) {
        showToast(
            'Уже куплено',
            'error'
        );
        return;
    }

    const price =
        Math.max(
            0,
            Number(item.price) || 0
        );

    const currentPoints =
        Number(currentUser.points) || 0;

    if (currentPoints < price) {
        showToast(
            t('alert_no_points'),
            'error'
        );
        return;
    }

    const btn =
        document.querySelector(
            `.buy-btn[data-id="${CSS.escape(itemId)}"]`
        );

    if (btn) {
        btn.disabled = true;
    }

    const added =
        addItemToInventory(
            currentUser,
            itemId
        );

    if (!added) {

        if (btn) {
            btn.disabled = false;
        }

        showToast(
            'Не удалось приобрести предмет',
            'error'
        );

        return;
    }

    currentUser.points =
        currentPoints - price;

    // ============================================================
    //  ИНТЕГРАЦИЯ С КВЕСТАМИ (ПОКУПКА)
    // ============================================================
    if (typeof updateQuestProgress === 'function') {
        updateQuestProgress('shop', 1);
    }

    saveAndRefreshGame();

    loadShop();
    loadInventory();

    if (
        typeof updateHeaderAvatar ===
        'function'
    ) {
        updateHeaderAvatar();
    }

    showToast(
        t('alert_purchase_success'),
        'success'
    );

    playSound('buy');

    if (btn) {
        btn.disabled = false;
    }
}


// ================================================================
//  ИНВЕНТАРЬ
// ================================================================

function loadInventory() {

    if (!currentUser) return;

    const container =
        document.getElementById(
            'inventoryList'
        );

    if (!container) return;

    container.innerHTML = '';

    const inventory =
        Array.isArray(
            currentUser.inventory
        )
            ? currentUser.inventory
            : [];

    const grouped = {
        avatar: [],
        frame: [],
        banner: [],
        title: []
    };

    inventory.forEach(
        item => {

            if (
                item &&
                grouped[item.type]
            ) {
                grouped[item.type].push(item);
            }

        }
    );

    const typeNames = {
        avatar: 'Аватары',
        frame: 'Рамки',
        banner: 'Баннеры',
        title: 'Титулы'
    };

    Object.keys(grouped).forEach(
        type => {

            const items =
                grouped[type];

            if (!items.length) return;

            const groupDiv =
                document.createElement(
                    'div'
                );

            groupDiv.className =
                'inventory-group';

            const title =
                document.createElement(
                    'h4'
                );

            title.textContent =
                typeNames[type] || type;

            groupDiv.appendChild(title);

            items.forEach(
                item => {

                    const isActive =
                        currentUser[type] ===
                        item.id;

                    const rarity =
                        item.rarity ||
                        'common';

                    const rarityColor =
                        getRarityColor(
                            rarity
                        );

                    const div =
                        document.createElement(
                            'div'
                        );

                    div.className =
                        'inventory-item' +
                        (
                            isActive
                                ? ' active'
                                : ''
                        );

                    div.style.borderColor =
                        rarityColor;

                    div.innerHTML = `
                        <div class="item-info">

                            <span class="item-icon">
                                ${escapeHTMLGame(
                                    item.icon || '🎁'
                                )}
                            </span>

                            <div>

                                <div>
                                    <strong>
                                        ${escapeHTMLGame(
                                            item.name ||
                                            'Предмет'
                                        )}
                                    </strong>
                                </div>

                                <div
                                    style="
                                        font-size:11px;
                                        color:${rarityColor};
                                    "
                                >
                                    ${escapeHTMLGame(
                                        getRarityName(
                                            rarity
                                        )
                                    )}
                                    •
                                    ${escapeHTMLGame(
                                        getGameText(
                                            'type_' + type,
                                            type
                                        )
                                    )}
                                </div>

                            </div>

                        </div>

                        <div class="item-actions">

                            ${
                                isActive

                                ?

                                `
                                <span
                                    style="
                                        color:#2ecc71;
                                        font-weight:700;
                                    "
                                >
                                    ✅ ${escapeHTMLGame(
                                        getGameText(
                                            'active_label',
                                            'Активно'
                                        )
                                    )}
                                </span>
                                `

                                :

                                `
                                <button
                                    class="btn btn-sm use-btn"
                                    data-id="${escapeHTMLGame(item.id)}"
                                    data-type="${escapeHTMLGame(type)}"
                                >
                                    ${escapeHTMLGame(
                                        getGameText(
                                            'use_btn',
                                            'Использовать'
                                        )
                                    )}
                                </button>
                                `
                            }

                        </div>
                    `;

                    groupDiv.appendChild(
                        div
                    );
                }
            );

            container.appendChild(
                groupDiv
            );
        }
    );

    if (!inventory.length) {

        container.innerHTML = `
            <p
                style="
                    color:var(--text-secondary);
                    text-align:center;
                    padding:20px;
                "
            >
                ${escapeHTMLGame(
                    currentLang === 'en'
                        ? 'No items'
                        : 'Нет предметов'
                )}
            </p>
        `;
    }
}


// ================================================================
//  ИСПОЛЬЗОВАНИЕ ПРЕДМЕТА
// ================================================================

function useItem(itemId, type) {

    if (!currentUser) return;

    if (
        !isItemOwned(
            currentUser,
            itemId
        )
    ) {
        showToast(
            'Предмет не куплен',
            'error'
        );
        return;
    }

    setActiveItem(
        currentUser,
        type,
        itemId
    );

    saveUserDataGame();

    loadInventory();
    loadShop();

    if (
        typeof updateHeaderAvatar ===
        'function'
    ) {
        updateHeaderAvatar();
    }

    showToast(
        'Предмет применён',
        'success'
    );

    if (
        type === 'avatar' &&
        typeof openProfile ===
        'function'
    ) {
        openProfile(
            currentUser,
            true
        );
    }
}


// ================================================================
//  ПРОСТЫЕ ЗАДАНИЯ
// ================================================================

let simpleTaskTimers = {};

function getTodayGameDate() {
    return new Date()
        .toISOString()
        .slice(0, 10);
}


function resetSimpleTaskCounterIfNeeded() {

    if (!currentUser) return;

    const today =
        getTodayGameDate();

    if (
        currentUser.simpleTasksDate !==
        today
    ) {

        currentUser.simpleTasksDate =
            today;

        currentUser.simpleTasksDone =
            0;

        saveUserDataGame();
    }
}


function loadSimpleTasks() {

    if (!currentUser) return;

    const container =
        document.getElementById(
            'simpleTasksList'
        );

    if (!container) return;

    resetSimpleTaskCounterIfNeeded();

    container.innerHTML = '';

    const age =
        Number(currentUser.age) || 25;

    const tasks =
        Array.isArray(
            CONFIG.SIMPLE_TASKS
        )
            ? CONFIG.SIMPLE_TASKS.filter(
                task =>
                    age >= task.ageMin &&
                    age <= task.ageMax
            )
            : [];

    if (!tasks.length) {

        container.innerHTML = `
            <p
                style="
                    color:var(--text-secondary);
                    text-align:center;
                "
            >
                Нет доступных заданий
            </p>
        `;

        return;
    }

    const limit =
        Number(
            CONFIG.SIMPLE_TASKS_DAILY_LIMIT
        ) || 10;

    const completed =
        Number(
            currentUser.simpleTasksDone
        ) || 0;

    const counter =
        document.createElement(
            'div'
        );

    counter.style.cssText =
        `
            color:var(--text-secondary);
            font-size:12px;
            margin-bottom:8px;
            text-align:center;
        `;

    counter.textContent =
        `Сегодня: ${completed}/${limit}`;

    container.appendChild(counter);

    tasks.forEach(
        task => {

            const div =
                document.createElement(
                    'div'
                );

            div.className =
                'shop-item';

            const taskXP =
                Number(task.xp) ||
                Number(
                    CONFIG?.XP?.REWARDS?.SIMPLE_TASK
                ) ||
                10;

            const disabled =
                completed >= limit;

            div.innerHTML = `

                <div class="item-info">

                    <span class="item-icon">
                        ${escapeHTMLGame(
                            task.icon || '⚡'
                        )}
                    </span>

                    <div>

                        <div>
                            <strong>
                                ${escapeHTMLGame(
                                    task.name
                                )}
                            </strong>
                        </div>

                        <div
                            class="item-type"
                        >
                            +${Number(task.reward) || 0}
                            🪙
                            •
                            +${taskXP} XP
                        </div>

                    </div>

                </div>

                <div class="item-actions">

                    <button
                        class="btn btn-sm simple-task-btn"
                        data-id="${escapeHTMLGame(task.id)}"
                        data-reward="${Number(task.reward) || 0}"
                        data-xp="${taskXP}"
                        ${disabled ? 'disabled' : ''}
                    >
                        ${
                            disabled
                                ? '🔒 Лимит'
                                : '<i class="fas fa-play"></i> Выполнить'
                        }
                    </button>

                </div>
            `;

            container.appendChild(
                div
            );
        }
    );
}


function startSimpleTask(
    btn,
    taskId,
    reward
) {

    if (!currentUser) return;

    if (!btn || btn.disabled) {
        return;
    }

    resetSimpleTaskCounterIfNeeded();

    const limit =
        Number(
            CONFIG.SIMPLE_TASKS_DAILY_LIMIT
        ) || 10;

    const done =
        Number(
            currentUser.simpleTasksDone
        ) || 0;

    if (done >= limit) {

        showToast(
            'Лимит заданий на сегодня достигнут',
            'error'
        );

        loadSimpleTasks();

        return;
    }

    if (
        simpleTaskTimers[taskId]
    ) {
        return;
    }

    const task =
        (
            CONFIG.SIMPLE_TASKS || []
        ).find(
            item =>
                item.id === taskId
        );

    const xp =
        Number(
            btn.dataset.xp
        ) ||
        Number(task?.xp) ||
        Number(
            CONFIG?.XP?.REWARDS?.SIMPLE_TASK
        ) ||
        10;

    btn.disabled = true;

    const originalText =
        btn.innerHTML;

    let remaining = 10;

    btn.innerHTML =
        `<i class="fas fa-spinner fa-spin"></i> ${remaining}...`;

    playSound('start');

    const interval =
        setInterval(
            () => {

                remaining--;

                if (remaining <= 0) {

                    clearInterval(
                        interval
                    );

                    delete simpleTaskTimers[
                        taskId
                    ];

                    try {

                        if (!currentUser) {
                            return;
                        }

                        resetSimpleTaskCounterIfNeeded();

                        const currentDone =
                            Number(
                                currentUser.simpleTasksDone
                            ) || 0;

                        if (
                            currentDone >=
                            limit
                        ) {
                            return;
                        }

                        currentUser.points =
                            (
                                Number(
                                    currentUser.points
                                ) || 0
                            ) +
                            (
                                Number(reward) || 0
                            );

                        currentUser.simpleTasksDone =
                            currentDone + 1;

                        awardXP(
                            xp,
                            'simple',
                            true
                        );

                        saveAndRefreshGame();

                        playSound(
                            'buy'
                        );

                        loadSimpleTasks();

                    } catch (error) {

                        console.error(
                            'KWON simple task error:',
                            error
                        );

                    } finally {

                        if (
                            btn &&
                            document.body.contains(
                                btn
                            )
                        ) {
                            btn.innerHTML =
                                originalText;

                            btn.disabled =
                                false;
                        }
                    }

                } else {

                    btn.innerHTML =
                        `<i class="fas fa-spinner fa-spin"></i> ${remaining}...`;
                }

            },
            1000
        );

    simpleTaskTimers[taskId] =
        interval;
}


// ================================================================
//  БОССЫ
// ================================================================

function loadBoss() {

    if (!currentUser) return;

    const bossNameEl =
        document.getElementById(
            'bossName'
        );

    const bossPowerEl =
        document.getElementById(
            'bossPowerValue'
        );

    const bossPowerTextEl =
        document.getElementById(
            'bossPower'
        );

    const fightResult =
        document.getElementById(
            'fightResult'
        );

    const fightBtn =
        document.getElementById(
            'fightBtn'
        );

    if (
        !bossNameEl ||
        !bossPowerEl ||
        !fightBtn
    ) {
        return;
    }

    const today =
        getTodayGameDate();

    const bossKey =
        'boss_' +
        currentUser.nickname;

    let bossData = null;

    try {
        bossData =
            JSON.parse(
                localStorage.getItem(
                    bossKey
                ) || 'null'
            );
    } catch (error) {
        bossData = null;
    }

    if (
        !bossData ||
        bossData.date !== today
    ) {

        const names =
            Array.isArray(
                CONFIG.BOSS_NAMES
            )
                ? CONFIG.BOSS_NAMES
                : ['Мистер Сталь'];

        const name =
            names[
                Math.floor(
                    Math.random() *
                    names.length
                )
            ];

        const minPower =
            Number(
                CONFIG?.BOSS?.MIN_POWER
            ) || 50;

        const maxPower =
            Number(
                CONFIG?.BOSS?.MAX_POWER
            ) || 150;

        const power =
            minPower +
            Math.floor(
                Math.random() *
                (
                    maxPower -
                    minPower +
                    1
                )
            );

        bossData = {
            date: today,
            name,
            power,
            fought: false
        };

        localStorage.setItem(
            bossKey,
            JSON.stringify(
                bossData
            )
        );

        // 👇 НОВОЕ: браузерное уведомление
        if (typeof sendNotification === 'function') {
            sendNotification('👹 Новый босс!', `Сегодня ты можешь сразиться с ${bossData.name} (сила: ${bossData.power})`);
        }
    }

    bossNameEl.textContent =
        '👹 ' +
        bossData.name;

    bossPowerEl.textContent =
        bossData.power;

    if (bossPowerTextEl) {
        bossPowerTextEl.innerHTML =
            escapeHTMLGame(
                getGameText(
                    'boss_power',
                    'Сила: {power}'
                ).replace(
                    '{power}',
                    bossData.power
                )
            );
    }

    if (fightResult) {
        fightResult.textContent =
            '';
    }

    if (bossData.fought) {

        fightBtn.disabled =
            true;

        fightBtn.innerHTML =
            '⏳ Завтра';

        if (fightResult) {
            fightResult.textContent =
                t('fight_already');
        }

    } else {

        fightBtn.disabled =
            false;

        fightBtn.innerHTML =
            `<i class="fas fa-skull"></i> ${
                escapeHTMLGame(
                    getGameText(
                        'fight_btn',
                        'Сразиться'
                    )
                )
            }`;
    }

    window._bossData =
        bossData;
}


// ================================================================
//  БИТВА С БОССОМ
// ================================================================

const fightButton =
    document.getElementById(
        'fightBtn'
    );

if (fightButton) {

    fightButton.addEventListener(
        'click',
        function () {

            if (!currentUser) {

                showToast(
                    t('alert_no_user'),
                    'error'
                );

                return;
            }

            const boss =
                window._bossData;

            if (
                !boss ||
                boss.fought
            ) {

                showToast(
                    t('fight_already'),
                    'error'
                );

                return;
            }

            const result =
                document.getElementById(
                    'fightResult'
                );

            // Сила игрока
            const playerPower =
                (
                    Number(
                        currentUser.points
                    ) || 0
                ) / 10;

            let rewardPoints;
            let rewardXP;
            let victory;

            if (
                playerPower >=
                Number(boss.power)
            ) {

                victory = true;

                rewardPoints =
                    Number(
                        CONFIG.BOSS_WIN
                    ) || 10;

                rewardXP =
                    Number(
                        CONFIG?.BOSS?.XP_WIN
                    ) ||
                    Number(
                        CONFIG?.XP?.REWARDS?.BOSS_WIN
                    ) ||
                    100;

            } else {

                victory = false;

                rewardPoints =
                    Number(
                        CONFIG.BOSS_LOSE
                    ) || 2;

                rewardXP =
                    Number(
                        CONFIG?.BOSS?.XP_LOSE
                    ) ||
                    Number(
                        CONFIG?.XP?.REWARDS?.BOSS_LOSE
                    ) ||
                    25;
            }

            if (victory) {

                if (result) {
                    result.textContent =
                        t(
                            'fight_win',
                            {
                                reward:
                                    rewardPoints
                            }
                        );

                    result.style.color =
                        '#2ecc71';
                }

                fireConfetti();
                playSound('finish');

            } else {

                if (result) {
                    result.textContent =
                        t(
                            'fight_lose',
                            {
                                reward:
                                    rewardPoints
                            }
                        );

                    result.style.color =
                        '#e74c3c';
                }

                playSound('boss');
            }

            currentUser.points =
                (
                    Number(
                        currentUser.points
                    ) || 0
                ) +
                rewardPoints;

            // ============================================================
            //  ИНТЕГРАЦИЯ С КВЕСТАМИ (ПОБЕДА НАД БОССОМ)
            // ============================================================
            if (typeof updateQuestProgress === 'function') {
                updateQuestProgress('boss', 1);
            }

            currentUser.bossFights =
                (
                    Number(
                        currentUser.bossFights
                    ) || 0
                ) + 1;

            boss.fought = true;

            const bossKey =
                'boss_' +
                currentUser.nickname;

            localStorage.setItem(
                bossKey,
                JSON.stringify(boss)
            );

            saveUserDataGame();

            awardXP(
                rewardXP,
                'boss',
                true
            );

            updatePointsUI();

            loadBoss();

            if (
                typeof updateAchievements ===
                'function'
            ) {
                updateAchievements();
            }

            if (
                typeof updateRankDisplay ===
                'function'
            ) {
                updateRankDisplay();
            }

        }
    );
}


// ================================================================
//  ПРОМОКОДЫ
// ================================================================

const activatePromoBtn =
    document.getElementById(
        'activatePromoBtn'
    );

if (activatePromoBtn) {

    activatePromoBtn.addEventListener(
        'click',
        function () {

            const input =
                document.getElementById(
                    'promoInput'
                );

            const result =
                document.getElementById(
                    'promoResult'
                );

            const code =
                input
                    ? input.value.trim().toUpperCase()
                    : '';

            if (!result) return;

            if (!code) {
                result.textContent =
                    currentLang === 'en'
                        ? 'Enter a code'
                        : 'Введите код';
                return;
            }

            if (!currentUser) {
                result.textContent =
                    t('alert_no_user');
                return;
            }

            let promos = [];

            try {
                promos =
                    JSON.parse(
                        localStorage.getItem(
                            'promoCodes'
                        ) || '[]'
                    );
            } catch (error) {
                promos = [];
            }

            if (!Array.isArray(promos)) {
                promos = [];
            }

            const promo =
                promos.find(
                    item =>
                        item &&
                        String(item.code)
                            .toUpperCase() ===
                        code
                );

            if (!promo) {

                result.textContent =
                    currentLang === 'en'
                        ? 'Invalid code'
                        : 'Неверный код';

                return;
            }

            promo.used =
                Number(promo.used) || 0;

            promo.maxUses =
                Number(promo.maxUses) || 0;

            promo.bonus =
                Number(promo.bonus) || 0;

            if (
                promo.used >=
                promo.maxUses
            ) {

                result.textContent =
                    currentLang === 'en'
                        ? 'Code exhausted'
                        : 'Код исчерпан';

                return;
            }

            currentUser.usedPromoCodes =
                Array.isArray(
                    currentUser.usedPromoCodes
                )
                    ? currentUser.usedPromoCodes
                    : [];

            if (
                currentUser.usedPromoCodes
                    .includes(code)
            ) {

                result.textContent =
                    currentLang === 'en'
                        ? 'Already used'
                        : 'Уже использован';

                return;
            }

            currentUser.points =
                (
                    Number(
                        currentUser.points
                    ) || 0
                ) +
                promo.bonus;

            currentUser.usedPromoCodes.push(
                code
            );

            promo.used++;

            localStorage.setItem(
                'promoCodes',
                JSON.stringify(
                    promos
                )
            );

            saveUserDataGame();

            updatePointsUI();

            if (
                typeof updateRankDisplay ===
                'function'
            ) {
                updateRankDisplay();
            }

            result.textContent =
                '✅ +' +
                promo.bonus +
                ' очков!';

            showToast(
                '✅ +' +
                promo.bonus +
                ' очков!',
                'success'
            );

            playSound('buy');

            if (input) {
                input.value = '';
            }
        }
    );
}


// ================================================================
//  ЛИДЕРБОРД
// ================================================================

function loadLeaderboard() {

    const list =
        document.getElementById(
            'leaderList'
        );

    if (!list) return;

    list.innerHTML = '';

    // Skeleton
    for (
        let i = 0;
        i < 5;
        i++
    ) {

        const item =
            document.createElement(
                'div'
            );

        item.className =
            'leaderboard-item skeleton-item';

        item.innerHTML = `
            <div
                class="skeleton skeleton-avatar"
            ></div>

            <div
                class="skeleton skeleton-text"
                style="width:60%;"
            ></div>

            <div
                class="skeleton skeleton-text"
                style="width:20%;"
            ></div>
        `;

        list.appendChild(item);
    }

    setTimeout(
        function () {
            renderLeaderboardList(
                list
            );
        },
        300
    );
}


function renderLeaderboardList(list) {

    if (!list) return;

    list.innerHTML = '';

    let users;

    try {
        users = getUsers();
    } catch (error) {
        users = {};
    }

    const sorted =
        Object.values(users)
            .filter(
                user =>
                    user &&
                    user.nickname
            )
            .sort(
                (a, b) =>
                    (
                        Number(b.points) || 0
                    ) -
                    (
                        Number(a.points) || 0
                    )
            );

    const top =
        sorted.slice(0, 10);

    top.forEach(
        (user, index) => {

            const rank =
                typeof getRank ===
                'function'
                    ? getRank(
                        Number(
                            user.points
                        ) || 0
                    )
                    : null;

            const rankText =
                rank
                    ? t(
                        'rank_' +
                        rank.key
                    )
                    : '';

            const div =
                document.createElement(
                    'div'
                );

            div.className =
                'leaderboard-item';

            const isCurrent =
                currentUser &&
                user.nickname ===
                currentUser.nickname;

            if (isCurrent) {
                div.style.borderColor =
                    'var(--kwon-purple)';
            }

            div.innerHTML = `

                <span>

                    #${index + 1}

                    <span
                        class="leader-name"
                        data-nick="${escapeHTMLGame(
                            user.nickname
                        )}"
                        style="
                            cursor:pointer;
                            color:var(--kwon-purple-light);
                            text-decoration:underline;
                            font-weight:700;
                        "
                    >
                        ${escapeHTMLGame(
                            user.nickname
                        )}
                    </span>

                    ${
                        isCurrent
                            ? ' ⭐'
                            : ''
                    }

                </span>

                <span>
                    💪
                    ${Number(user.points) || 0}
                    ${escapeHTMLGame(
                        t('points_short')
                    )}
                    ${
                        rankText
                            ? ' • ' +
                              escapeHTMLGame(
                                  rankText
                              )
                            : ''
                    }
                </span>
            `;

            list.appendChild(div);
        }
    );

    if (!top.length) {

        list.innerHTML = `
            <p
                style="
                    color:var(--text-secondary);
                "
            >
                ${escapeHTMLGame(
                    t('no_data')
                )}
            </p>
        `;
    }
}


// ================================================================
//  ЛУТБОКС
// ================================================================

function getRandomLoot() {

    const loot =
        Array.isArray(CONFIG.LOOT)
            ? CONFIG.LOOT
            : [];

    if (!loot.length) {
        return null;
    }

    // Используем шанс из конфигурации,
    // но сохраняем старое поведение,
    // если функция вызвана напрямую.
    let totalChance = 0;

    loot.forEach(
        item => {
            totalChance +=
                Number(item.chance) || 0;
        }
    );

    if (totalChance <= 0) {

        return loot[
            Math.floor(
                Math.random() *
                loot.length
            )
        ];

    }

    let roll =
        Math.random() *
        totalChance;

    for (
        const item of loot
    ) {

        roll -=
            Number(item.chance) || 0;

        if (roll <= 0) {
            return item;
        }
    }

    return loot[loot.length - 1];
}


function showLootBox(user) {

    if (!user) return;

    const item =
        getRandomLoot();

    if (!item) return;

    if (!Array.isArray(user.inventory)) {
        user.inventory = [];
    }

    // У лут-предмета отдельный тип,
    // чтобы он не ломал категории магазина.
    const lootItem = {
        id:
            item.id ||
            'loot_' +
            Date.now(),

        name:
            item.name ||
            'Случайная награда',

        icon:
            item.emoji ||
            '🎁',

        emoji:
            item.emoji ||
            '🎁',

        rarity:
            item.rarity ||
            'common',

        type: 'loot',

        price: 0,

        obtainedAt:
            Date.now()
    };

    user.inventory.push(
        lootItem
    );

    saveUserDataGame();

    const lootEmoji =
        document.getElementById(
            'lootEmoji'
        );

    const lootName =
        document.getElementById(
            'lootName'
        );

    const lootRarity =
        document.getElementById(
            'lootRarity'
        );

    const lootModal =
        document.getElementById(
            'lootModal'
        );

    if (lootEmoji) {
        lootEmoji.textContent =
            lootItem.emoji;
    }

    if (lootName) {
        lootName.textContent =
            lootItem.name;
    }

    if (lootRarity) {

        const rarityData =
            getRarityData(
                lootItem.rarity
            );

        lootRarity.innerHTML = `
            ${escapeHTMLGame(
                getRarityName(
                    lootItem.rarity
                )
            )}
        `;

        lootRarity.style.color =
            rarityData.color;

        lootRarity.style.fontWeight =
            '700';

        lootRarity.style.textShadow =
            `0 0 10px ${rarityData.color}`;
    }

    if (lootModal) {
        lootModal.style.display =
            'flex';
    }

    playSound('loot');

    if (
        lootItem.rarity ===
        'legendary'
    ) {
        fireConfetti();

        showToast(
            '🔥 ЛЕГЕНДАРНАЯ НАГРАДА!',
            'success'
        );
    }

    if (
        typeof loadInventory ===
        'function'
    ) {
        loadInventory();
    }

    if (
        typeof updateAchievements ===
        'function'
    ) {
        updateAchievements();
    }
}


// ================================================================
//  БРОСОК ЛУТА ПОСЛЕ ТРЕНИРОВКИ
// ================================================================

function tryWorkoutLoot() {

    const chance =
        Math.max(
            0,
            Math.min(
                1,
                Number(
                    CONFIG.LOOT_DROP_CHANCE
                ) || 0
            )
        );

    if (
        Math.random() >
        chance
    ) {
        return false;
    }

    if (!currentUser) {
        return false;
    }

    showLootBox(
        currentUser
    );

    return true;
}


// ================================================================
//  ОБЩЕЕ ДЕЛЕГИРОВАНИЕ КЛИКОВ
// ================================================================

document.addEventListener(
    'click',
    function (event) {

        // --------------------------------------------------------
        // BUY
        // --------------------------------------------------------

        const buyBtn =
            event.target.closest(
                '.buy-btn'
            );

        if (buyBtn) {

            buyItem(
                buyBtn.dataset.id
            );

            return;
        }

        // --------------------------------------------------------
        // USE ITEM
        // --------------------------------------------------------

        const useBtn =
            event.target.closest(
                '.use-btn'
            );

        if (useBtn) {

            useItem(
                useBtn.dataset.id,
                useBtn.dataset.type
            );

            return;
        }

        // --------------------------------------------------------
        // SIMPLE TASK
        // --------------------------------------------------------

        const simpleBtn =
            event.target.closest(
                '.simple-task-btn'
            );

        if (simpleBtn) {

            const taskId =
                simpleBtn.dataset.id;

            const reward =
                Number(
                    simpleBtn.dataset.reward
                ) || 0;

            startSimpleTask(
                simpleBtn,
                taskId,
                reward
            );

            return;
        }

        // --------------------------------------------------------
        // LEADERBOARD PROFILE
        // --------------------------------------------------------

        const leaderName =
            event.target.closest(
                '.leader-name'
            );

        if (leaderName) {

            const nick =
                leaderName.dataset.nick;

            let users = {};

            try {
                users = getUsers();
            } catch (error) {
                return;
            }

            const user =
                users[nick];

            if (
                user &&
                typeof openProfile ===
                'function'
            ) {

                openProfile(
                    user,
                    Boolean(
                        currentUser &&
                        currentUser.nickname ===
                        user.nickname
                    )
                );
            }

            return;
        }
    }
);


// ================================================================
//  ЗАКРЫТИЕ/ПЕРЕЗАГРУЗКА ДЛЯ ОЧИСТКИ ТАЙМЕРОВ
// ================================================================

window.addEventListener(
    'beforeunload',
    function () {

        Object.values(
            simpleTaskTimers
        ).forEach(
            timer => {
                if (timer) {
                    clearInterval(timer);
                }
            }
        );

        simpleTaskTimers = {};
    }
);


// ================================================================
//  ПУБЛИЧНЫЙ GAME API
// ================================================================

window.KWON_GAME = {

    loadShop,

    buyItem,

    loadInventory,

    useItem,

    loadSimpleTasks,

    startSimpleTask,

    loadBoss,

    loadLeaderboard,

    renderLeaderboardList,

    showLootBox,

    tryWorkoutLoot,

    awardXP,

    rewardUser,

    getCurrentLevel,

    getRarityData,

    getRarityColor,

    getRandomLoot
};


// ================================================================
//  ГОТОВО
// ================================================================

console.log(
    '🎮 KWON Fitness game.js V2.0 загружен'
);