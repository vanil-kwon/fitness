// ================================================================
//  KWON FITNESS – АВТОРИЗАЦИЯ И РЕГИСТРАЦИЯ V2.0
//  Login / Register / Email / Referral / XP / Level / Migration
// ================================================================

document.addEventListener('DOMContentLoaded', function () {

    // ================================================================
    // ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
    // ================================================================

    function safeText(value, fallback = '') {
        return typeof value === 'string' ? value.trim() : fallback;
    }

    function clampNumber(value, min, max, fallback) {
        const num = Number(value);

        if (!Number.isFinite(num)) {
            return fallback;
        }

        return Math.max(min, Math.min(max, num));
    }

    function calculateUserLevel(user) {
        const xp = Math.max(0, Number(user?.xp) || 0);

        if (typeof window.getLevelFromXP === 'function') {
            return Math.max(1, Number(window.getLevelFromXP(xp)) || 1);
        }

        // Резервная система, пока новая config.js ещё не подключена
        let level = 1;
        let required = 100;
        let remainingXP = xp;

        while (remainingXP >= required && level < 100) {
            remainingXP -= required;
            level++;
            required = Math.floor(required * 1.35);
        }

        return level;
    }

    function getStarterItems() {
        return [
            {
                id: 'frame_red',
                type: 'frame',
                name: 'Красная рамка',
                icon: '🟥',
                price: 0,
                rarity: 'common'
            },
            {
                id: 'banner_blue',
                type: 'banner',
                name: 'Синий баннер',
                icon: '🔵',
                price: 0,
                rarity: 'common'
            },
            {
                id: 'title_bronze',
                type: 'title',
                name: 'Бронзовый',
                icon: '🥉',
                price: 0,
                rarity: 'common'
            }
        ];
    }

    // ================================================================
    // МИГРАЦИЯ ПОЛЬЗОВАТЕЛЯ
    // ================================================================

    function migrateUser(user) {
        if (!user || typeof user !== 'object') {
            return user;
        }

        // ------------------------------------------------------------
        // Основные данные
        // ------------------------------------------------------------

        user.nickname = safeText(user.nickname, 'User');

        user.password = safeText(user.password, '');

        user.email = safeText(user.email, '');

        user.role = safeText(user.role, 'user');

        // ------------------------------------------------------------
        // Профиль
        // ------------------------------------------------------------

        user.age = clampNumber(
            user.age,
            1,
            150,
            25
        );

        user.weight = clampNumber(
            user.weight,
            1,
            500,
            75
        );

        user.gender = safeText(
            user.gender,
            'male'
        );

        user.fitnessLevel = safeText(
            user.fitnessLevel,
            'beginner'
        );

        user.path = safeText(
            user.path,
            'Фитнес'
        );

        user.goal = safeText(
            user.goal,
            'lose'
        );

        // ------------------------------------------------------------
        // Экономика
        // ------------------------------------------------------------

        user.points = Math.max(
            0,
            Number(user.points) || 0
        );

        // ------------------------------------------------------------
        // XP / LEVEL
        // ------------------------------------------------------------

        user.xp = Math.max(
            0,
            Number(user.xp) || 0
        );

        user.level = calculateUserLevel(user);

        // ------------------------------------------------------------
        // Daily
        // ------------------------------------------------------------

        if (typeof user.dailyDone !== 'boolean') {
            user.dailyDone = false;
        }

        if (typeof user.dailyChallengeDone !== 'boolean') {
            user.dailyChallengeDone = false;
        }

        // ------------------------------------------------------------
        // Streak
        // ------------------------------------------------------------

        user.streak = Math.max(
            0,
            Number(user.streak) || 0
        );

        user.streakDays = Math.max(
            0,
            Number(user.streakDays) || 0
        );

        // ------------------------------------------------------------
        // Statistics
        // ------------------------------------------------------------

        user.totalWorkouts = Math.max(
            0,
            Number(user.totalWorkouts) || 0
        );

        user.bossFights = Math.max(
            0,
            Number(user.bossFights) || 0
        );

        // ------------------------------------------------------------
        // Inventory
        // ------------------------------------------------------------

        if (!Array.isArray(user.inventory)) {
            user.inventory = [];
        }

        // Старый loot из старой системы может иметь rarity,
        // но не иметь стандартного item structure.
        user.inventory = user.inventory.filter(Boolean);

        // ------------------------------------------------------------
        // Промокоды
        // ------------------------------------------------------------

        if (!Array.isArray(user.usedPromoCodes)) {
            user.usedPromoCodes = [];
        }

        // ------------------------------------------------------------
        // Custom exercises
        // ------------------------------------------------------------

        if (!Array.isArray(user.customExercises)) {
            user.customExercises = [];
        }

        // ------------------------------------------------------------
        // Achievements
        // ------------------------------------------------------------

        if (
            !user.achievements ||
            typeof user.achievements !== 'object' ||
            Array.isArray(user.achievements)
        ) {
            user.achievements = {};
        }

        // ------------------------------------------------------------
        // Cosmetics
        // ------------------------------------------------------------

        user.avatar = safeText(user.avatar, '');

        user.frame = safeText(
            user.frame,
            'frame_red'
        );

        user.banner = safeText(
            user.banner,
            'banner_blue'
        );

        user.title = safeText(
            user.title,
            'title_bronze'
        );

        // ------------------------------------------------------------
        // Даты
        // ------------------------------------------------------------

        if (!Object.prototype.hasOwnProperty.call(user, 'lastLoginDate')) {
            user.lastLoginDate = null;
        }

        if (!user.createdAt) {
            user.createdAt = Date.now();
        }

        // ------------------------------------------------------------
        // Версия профиля
        // ------------------------------------------------------------

        user.dataVersion = 2;

        return user;
    }

    // ================================================================
    // МИГРАЦИЯ ВСЕХ ПОЛЬЗОВАТЕЛЕЙ
    // ================================================================

    function migrateAllUsers() {
        let users;

        try {
            users = getUsers();
        } catch (error) {
            console.error(
                'KWON: ошибка чтения пользователей:',
                error
            );
            return;
        }

        let changed = false;

        Object.keys(users).forEach(username => {
            if (!users[username]) {
                delete users[username];
                changed = true;
                return;
            }

            const before = JSON.stringify(
                users[username]
            );

            users[username] =
                migrateUser(users[username]);

            const after = JSON.stringify(
                users[username]
            );

            if (before !== after) {
                changed = true;
            }
        });

        if (changed) {
            saveUsers(users);
        }
    }

    migrateAllUsers();

    // ================================================================
    // ПЕРЕХОД: LOGIN → REGISTER
    // ================================================================

    const goToRegisterLink =
        document.getElementById(
            'goToRegisterLink'
        );

    if (goToRegisterLink) {
        goToRegisterLink.addEventListener(
            'click',
            function () {
                showRegisterScreen();
            }
        );
    }

    // ================================================================
    // ПЕРЕХОД: REGISTER → LOGIN
    // ================================================================

    const goToLoginLink =
        document.getElementById(
            'goToLoginLink'
        );

    if (goToLoginLink) {
        goToLoginLink.addEventListener(
            'click',
            function () {
                showLoginScreen();
            }
        );
    }

    // ================================================================
    // LOGIN
    // ================================================================

    const loginBtn =
        document.getElementById(
            'loginBtn'
        );

    if (loginBtn) {
        loginBtn.addEventListener(
            'click',
            async function () {

                const usernameInput =
                    document.getElementById(
                        'loginUsername'
                    );

                const passwordInput =
                    document.getElementById(
                        'loginPassword'
                    );

                const err =
                    document.getElementById(
                        'loginError'
                    );

                const username =
                    usernameInput
                        ? usernameInput.value.trim()
                        : '';

                const password =
                    passwordInput
                        ? passwordInput.value
                        : '';

                // ------------------------------------------------
                // Валидация
                // ------------------------------------------------

                if (!username || !password) {
                    if (err) {
                        err.textContent =
                            currentLang === 'en'
                                ? 'Enter username and password'
                                : 'Введите ник и пароль';

                        err.style.display =
                            'block';
                    }

                    return;
                }

                let users;

                try {
                    users = getUsers();
                } catch (error) {
                    console.error(
                        'KWON: ошибка загрузки пользователей:',
                        error
                    );

                    if (err) {
                        err.textContent =
                            currentLang === 'en'
                                ? 'Storage error'
                                : 'Ошибка хранилища';

                        err.style.display =
                            'block';
                    }

                    return;
                }

                // ------------------------------------------------
                // Проверка пользователя
                // ------------------------------------------------

                if (!users[username]) {
                    if (err) {
                        err.textContent =
                            currentLang === 'en'
                                ? 'User not found'
                                : 'Пользователь не найден';

                        err.style.display =
                            'block';
                    }

                    return;
                }

                const user =
                    migrateUser(
                        users[username]
                    );

                // ------------------------------------------------
                // Проверка пароля
                // ------------------------------------------------

                try {

                    const passwordHash =
                        await hashPassword(
                            password
                        );

                    if (
                        user.password !==
                        passwordHash
                    ) {
                        if (err) {
                            err.textContent =
                                currentLang === 'en'
                                    ? 'Wrong password'
                                    : 'Неверный пароль';

                            err.style.display =
                                'block';
                        }

                        return;
                    }

                } catch (error) {

                    console.error(
                        'KWON: ошибка хеширования:',
                        error
                    );

                    if (err) {
                        err.textContent =
                            currentLang === 'en'
                                ? 'Authentication error'
                                : 'Ошибка авторизации';

                        err.style.display =
                            'block';
                    }

                    return;
                }

                // ------------------------------------------------
                // Обновление профиля
                // ------------------------------------------------

                user.level =
                    calculateUserLevel(user);

                user.lastLoginDate =
                    new Date()
                        .toISOString()
                        .slice(0, 10);

                users[username] = user;

                try {
                    saveUsers(users);
                } catch (error) {
                    console.error(
                        'KWON: ошибка сохранения:',
                        error
                    );
                }

                // ------------------------------------------------
                // Авторизация
                // ------------------------------------------------

                if (err) {
                    err.style.display = 'none';
                }

                currentUser = user;

                localStorage.setItem(
                    'currentUser',
                    username
                );

                showMainScreen();

                showToast(
                    t('auth_success_login'),
                    'success'
                );

            }
        );
    }

    // ================================================================
    // REGISTER
    // ================================================================

    const registerSubmitBtn =
        document.getElementById(
            'registerSubmitBtn'
        );

    if (registerSubmitBtn) {

        registerSubmitBtn.addEventListener(
            'click',
            async function () {

                const usernameEl =
                    document.getElementById(
                        'regUsername'
                    );

                const passwordEl =
                    document.getElementById(
                        'regPassword'
                    );

                const confirmEl =
                    document.getElementById(
                        'regConfirmPassword'
                    );

                const emailEl =
                    document.getElementById(
                        'regEmail'
                    );

                const refCodeEl =
                    document.getElementById(
                        'regRefCode'
                    );

                const err =
                    document.getElementById(
                        'regError'
                    );

                const username =
                    usernameEl
                        ? usernameEl.value.trim()
                        : '';

                const password =
                    passwordEl
                        ? passwordEl.value
                        : '';

                const confirm =
                    confirmEl
                        ? confirmEl.value
                        : '';

                const email =
                    emailEl
                        ? emailEl.value.trim()
                        : '';

                const refCode =
                    refCodeEl
                        ? refCodeEl.value.trim()
                        : '';

                // ------------------------------------------------
                // Валидация ника
                // ------------------------------------------------

                if (!username) {
                    if (err) {
                        err.textContent =
                            t(
                                'register_error_username_empty'
                            );

                        err.style.display =
                            'block';
                    }

                    return;
                }

                if (
                    username.length < 3 ||
                    username.length > 20
                ) {
                    if (err) {
                        err.textContent =
                            currentLang === 'en'
                                ? 'Username must be 3–20 characters'
                                : 'Никнейм должен содержать от 3 до 20 символов';

                        err.style.display =
                            'block';
                    }

                    return;
                }

                if (
                    !/^[a-zA-Z0-9_]+$/.test(
                        username
                    )
                ) {
                    if (err) {
                        err.textContent =
                            currentLang === 'en'
                                ? 'Username can contain only letters, numbers and _'
                                : 'Никнейм может содержать только буквы, цифры и _';

                        err.style.display =
                            'block';
                    }

                    return;
                }

                // ------------------------------------------------
                // Валидация пароля
                // ------------------------------------------------

                if (password.length < 6) {
                    if (err) {
                        err.textContent =
                            t(
                                'register_error_password_short'
                            );

                        err.style.display =
                            'block';
                    }

                    return;
                }

                if (password.length > 128) {
                    if (err) {
                        err.textContent =
                            currentLang === 'en'
                                ? 'Password is too long'
                                : 'Пароль слишком длинный';

                        err.style.display =
                            'block';
                    }

                    return;
                }

                if (password !== confirm) {
                    if (err) {
                        err.textContent =
                            t(
                                'register_error_password_mismatch'
                            );

                        err.style.display =
                            'block';
                    }

                    return;
                }

                // ------------------------------------------------
                // Валидация Email
                // ------------------------------------------------

                if (
                    !email ||
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                        email
                    )
                ) {
                    if (err) {
                        err.textContent =
                            currentLang === 'en'
                                ? 'Enter a valid email'
                                : 'Введите корректный email';

                        err.style.display =
                            'block';
                    }

                    return;
                }

                // ------------------------------------------------
                // Получение пользователей
                // ------------------------------------------------

                let users;

                try {
                    users = getUsers();
                } catch (error) {
                    console.error(
                        'KWON: ошибка чтения пользователей:',
                        error
                    );

                    if (err) {
                        err.textContent =
                            currentLang === 'en'
                                ? 'Storage error'
                                : 'Ошибка хранилища';

                        err.style.display =
                            'block';
                    }

                    return;
                }

                // ------------------------------------------------
                // Проверка username
                // ------------------------------------------------

                if (users[username]) {
                    if (err) {
                        err.textContent =
                            t(
                                'register_error_username_exists'
                            );

                        err.style.display =
                            'block';
                    }

                    return;
                }

                // ------------------------------------------------
                // Проверка email
                // ------------------------------------------------

                const normalizedEmail =
                    email.toLowerCase();

                const emailExists =
                    Object.values(users).some(
                        user => {
                            if (
                                !user ||
                                typeof user.email !==
                                    'string'
                            ) {
                                return false;
                            }

                            return (
                                user.email
                                    .trim()
                                    .toLowerCase() ===
                                normalizedEmail
                            );
                        }
                    );

                if (emailExists) {
                    if (err) {
                        err.textContent =
                            currentLang === 'en'
                                ? 'This email is already in use'
                                : 'Этот email уже используется';

                        err.style.display =
                            'block';
                    }

                    return;
                }

                // ------------------------------------------------
                // Профиль
                // ------------------------------------------------

                const ageInput =
                    document.getElementById(
                        'regAge'
                    );

                const weightInput =
                    document.getElementById(
                        'regWeight'
                    );

                const genderInput =
                    document.getElementById(
                        'regGender'
                    );

                const fitnessLevelInput =
                    document.getElementById(
                        'regFitnessLevel'
                    );

                const age =
                    clampNumber(
                        ageInput
                            ? ageInput.value
                            : 25,
                        1,
                        150,
                        25
                    );

                const weight =
                    clampNumber(
                        weightInput
                            ? weightInput.value
                            : 75,
                        1,
                        500,
                        75
                    );

                const gender =
                    genderInput
                        ? genderInput.value
                        : 'male';

                const fitnessLevel =
                    fitnessLevelInput
                        ? fitnessLevelInput.value
                        : 'beginner';

                const pathBtn =
                    document.querySelector(
                        '#regPathSelector .path-btn.active'
                    );

                const goalBtn =
                    document.querySelector(
                        '#regGoalSelector .goal-btn.active'
                    );

                const path =
                    pathBtn?.dataset.path ||
                    'Фитнес';

                const goal =
                    goalBtn?.dataset.goal ||
                    'lose';

                // ------------------------------------------------
                // Хеширование
                // ------------------------------------------------

                let passwordHash;

                try {
                    passwordHash =
                        await hashPassword(
                            password
                        );
                } catch (error) {

                    console.error(
                        'KWON: ошибка хеширования пароля:',
                        error
                    );

                    if (err) {
                        err.textContent =
                            currentLang === 'en'
                                ? 'Could not create account'
                                : 'Не удалось создать аккаунт';

                        err.style.display =
                            'block';
                    }

                    return;
                }

                // ------------------------------------------------
                // Стартовые предметы
                // ------------------------------------------------

                const starterItems =
                    getStarterItems();

                // ------------------------------------------------
                // Новый пользователь
                // ------------------------------------------------

                const newUser = {

                    // ACCOUNT
                    nickname: username,
                    password: passwordHash,
                    email: email,
                    role: 'user',

                    // ACCOUNT META
                    dataVersion: 2,
                    createdAt: Date.now(),
                    lastLoginDate: null,

                    // PROFILE
                    age: age,
                    weight: weight,
                    gender: gender,
                    fitnessLevel: fitnessLevel,
                    path: path,
                    goal: goal,

                    // ECONOMY
                    points: 0,

                    // RPG
                    xp: 0,
                    level: 1,

                    // DAILY
                    dailyDone: false,
                    dailyChallengeDone: false,

                    // STREAK
                    streak: 0,
                    streakDays: 0,

                    // STATS
                    totalWorkouts: 0,
                    bossFights: 0,

                    // INVENTORY
                    inventory: starterItems,

                    // COSMETICS
                    avatar: '',
                    frame: 'frame_red',
                    banner: 'banner_blue',
                    title: 'title_bronze',

                    // SYSTEM
                    usedPromoCodes: [],
                    customExercises: [],
                    achievements: {}
                };

                // ------------------------------------------------
                // РЕФЕРАЛ
                // ------------------------------------------------

                const normalizedRef =
                    refCode.trim();

                if (
                    normalizedRef &&
                    normalizedRef !== username &&
                    users[normalizedRef]
                ) {

                    users[normalizedRef] =
                        migrateUser(
                            users[normalizedRef]
                        );

                    // Новый пользователь
                    newUser.points += 10;
                    newUser.xp += 50;

                    // Реферер
                    users[normalizedRef].points =
                        (
                            users[normalizedRef]
                                .points || 0
                        ) + 20;

                    users[normalizedRef].xp =
                        (
                            users[normalizedRef]
                                .xp || 0
                        ) + 100;

                    users[normalizedRef].level =
                        calculateUserLevel(
                            users[normalizedRef]
                        );

                    showToast(
                        currentLang === 'en'
                            ? '🎁 Referral bonus received!'
                            : '🎁 Реферальный бонус получен!',
                        'success'
                    );
                }

                // ------------------------------------------------
                // Рассчитываем стартовый уровень
                // ------------------------------------------------

                newUser.level =
                    calculateUserLevel(
                        newUser
                    );

                // ------------------------------------------------
                // Сохранение
                // ------------------------------------------------

                users[username] =
                    migrateUser(
                        newUser
                    );

                try {
                    saveUsers(users);
                } catch (error) {

                    console.error(
                        'KWON: ошибка сохранения аккаунта:',
                        error
                    );

                    if (err) {
                        err.textContent =
                            currentLang === 'en'
                                ? 'Could not save account'
                                : 'Не удалось сохранить аккаунт';

                        err.style.display =
                            'block';
                    }

                    return;
                }

                // ------------------------------------------------
                // Успешная регистрация
                // ------------------------------------------------

                if (err) {
                    err.style.display =
                        'none';
                }

                alert(
                    t('auth_success_reg')
                );

                // Возвращаем на Login
                showLoginScreen();

                // Заполняем username
                const loginUsername =
                    document.getElementById(
                        'loginUsername'
                    );

                if (loginUsername) {
                    loginUsername.value =
                        username;
                }

                // Пароль не сохраняем
                const loginPassword =
                    document.getElementById(
                        'loginPassword'
                    );

                if (loginPassword) {
                    loginPassword.value =
                        '';
                }

                // Очищаем регистрационные поля
                if (passwordEl) {
                    passwordEl.value = '';
                }

                if (confirmEl) {
                    confirmEl.value = '';
                }

                if (emailEl) {
                    emailEl.value = '';
                }

            }
        );
    }

    // ================================================================
    // LOGOUT
    // ================================================================

    const logoutBtn =
        document.getElementById(
            'logoutBtn'
        );

    if (logoutBtn) {

        logoutBtn.addEventListener(
            'click',
            function () {

                if (
                    !confirm(
                        t('alert_logout')
                    )
                ) {
                    return;
                }

                // Останавливаем активный таймер
                if (
                    typeof timerInterval !==
                    'undefined' &&
                    timerInterval
                ) {
                    clearInterval(
                        timerInterval
                    );

                    timerInterval = null;
                }

                if (
                    typeof isRunning !==
                    'undefined'
                ) {
                    isRunning = false;
                }

                if (
                    typeof isFinished !==
                    'undefined'
                ) {
                    isFinished = false;
                }

                localStorage.removeItem(
                    'currentUser'
                );

                currentUser = null;

                showLoginScreen();

                // Очистка форм
                const loginUsername =
                    document.getElementById(
                        'loginUsername'
                    );

                const loginPassword =
                    document.getElementById(
                        'loginPassword'
                    );

                if (loginUsername) {
                    loginUsername.value = '';
                }

                if (loginPassword) {
                    loginPassword.value = '';
                }

                const loginError =
                    document.getElementById(
                        'loginError'
                    );

                if (loginError) {
                    loginError.textContent = '';
                    loginError.style.display =
                        'none';
                }

            }
        );
    }

    // ================================================================
    // АВТОВОССТАНОВЛЕНИЕ СЕССИИ
    // ================================================================

    const savedUsername =
        localStorage.getItem(
            'currentUser'
        );

    if (savedUsername) {

        let users = {};

        try {
            users = getUsers();
        } catch (error) {
            console.error(
                'KWON: не удалось восстановить пользователя:',
                error
            );
        }

        if (users[savedUsername]) {

            const restoredUser =
                migrateUser(
                    users[savedUsername]
                );

            restoredUser.level =
                calculateUserLevel(
                    restoredUser
                );

            users[savedUsername] =
                restoredUser;

            saveUsers(users);

            currentUser =
                restoredUser;

            // app.js тоже содержит инициализацию.
            // Запускаем экран после текущего цикла событий,
            // чтобы остальные обработчики успели установиться.
            setTimeout(
                function () {
                    if (currentUser) {
                        showMainScreen();
                    }
                },
                0
            );
        } else {

            // Сессия указывает на несуществующего пользователя
            localStorage.removeItem(
                'currentUser'
            );
        }
    }

    // ================================================================
    // ПУБЛИЧНЫЙ API
    // ================================================================

    window.KWON_AUTH = {
        migrateUser,
        migrateAllUsers,
        calculateUserLevel
    };

    console.log(
        '🔐 KWON Fitness auth.js V2.0 загружен'
    );

});