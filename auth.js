// ================================================================
//  KWON FITNESS – АВТОРИЗАЦИЯ И РЕГИСТРАЦИЯ
// ================================================================

document.addEventListener('DOMContentLoaded', function() {
    // Обработчик входа
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            const username = document.getElementById('loginUsername').value.trim();
            const password = document.getElementById('loginPassword').value.trim();
            const err = document.getElementById('loginError');

            if (!username || !password) {
                err.textContent = 'Введите ник и пароль';
                err.style.display = 'block';
                return;
            }

            const users = getUsers();
            if (!users[username]) {
                err.textContent = 'Пользователь не найден';
                err.style.display = 'block';
                return;
            }
            if (users[username].password !== hashPassword(password)) {
                err.textContent = 'Неверный пароль';
                err.style.display = 'block';
                return;
            }

            err.style.display = 'none';
            currentUser = users[username];
            localStorage.setItem('currentUser', username);
            showMainScreen();
            showToast(t('auth_success_login'), 'success');
        });
    }

    // Кнопка перехода к регистрации
    const goToRegisterLink = document.getElementById('goToRegisterLink');
    if (goToRegisterLink) {
        goToRegisterLink.addEventListener('click', showRegisterScreen);
    }

    // Кнопка перехода ко входу
    const goToLoginLink = document.getElementById('goToLoginLink');
    if (goToLoginLink) {
        goToLoginLink.addEventListener('click', showLoginScreen);
    }

    // Обработчик регистрации
    const registerSubmitBtn = document.getElementById('registerSubmitBtn');
    if (registerSubmitBtn) {
        registerSubmitBtn.addEventListener('click', function() {
            const username = document.getElementById('regUsername').value.trim();
            const password = document.getElementById('regPassword').value.trim();
            const confirm = document.getElementById('regConfirmPassword').value.trim();
            const refCode = document.getElementById('regRefCode').value.trim();
            const err = document.getElementById('regError');

            // Валидация
            if (!username) {
                err.textContent = t('register_error_username_empty');
                err.style.display = 'block';
                return;
            }
            if (password.length < 6) {
                err.textContent = t('register_error_password_short');
                err.style.display = 'block';
                return;
            }
            if (password !== confirm) {
                err.textContent = t('register_error_password_mismatch');
                err.style.display = 'block';
                return;
            }

            const users = getUsers();
            if (users[username]) {
                err.textContent = t('register_error_username_exists');
                err.style.display = 'block';
                return;
            }

            // Сбор данных
            const age = parseInt(document.getElementById('regAge').value) || 25;
            const weight = parseInt(document.getElementById('regWeight').value) || 75;
            const gender = document.getElementById('regGender').value;
            const fitnessLevel = document.getElementById('regFitnessLevel').value;
            const path = document.querySelector('#regPathSelector .path-btn.active')?.dataset.path || 'Фитнес';
            const goal = document.querySelector('#regGoalSelector .goal-btn.active')?.dataset.goal || 'lose';

            // Стартовые предметы (бесплатные)
            const starterItems = [
                { id: 'frame_red',   type: 'frame',  name: 'Красная рамка', icon: '🟥', price: 0 },
                { id: 'banner_blue', type: 'banner', name: 'Синий баннер',   icon: '🔵', price: 0 },
                { id: 'title_bronze',type: 'title',  name: 'Бронзовый',      icon: '🥉', price: 0 }
            ];

            const newUser = {
                nickname: username,
                password: hashPassword(password),
                role: 'user',
                age,
                weight,
                gender,
                fitnessLevel,
                path,
                goal,
                points: 0,
                dailyDone: false,
                streak: 0,
                streakDays: 0,
                inventory: [...starterItems],
                totalWorkouts: 0,
                bossFights: 0,
                usedPromoCodes: [],
                customExercises: [],
                achievements: {},
                lastLoginDate: null,
                avatar: '',          // пусто => первая буква ника
                frame: 'frame_red',
                banner: 'banner_blue',
                title: 'title_bronze'
            };

            // Реферальный бонус
            if (refCode && users[refCode]) {
                newUser.points += 10;
                users[refCode].points += 20;
                saveUsers(users);
                showToast('Реферальный бонус!', 'success');
            }

            users[username] = newUser;
            saveUsers(users);

            err.style.display = 'none';
            alert(t('auth_success_reg'));
            showLoginScreen();
            document.getElementById('loginUsername').value = username;
        });
    }

    // Обработчик выхода
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm(t('alert_logout'))) {
                localStorage.removeItem('currentUser');
                currentUser = null;
                showLoginScreen();
            }
        });
    }

    console.log('🔐 auth.js загружен');
});