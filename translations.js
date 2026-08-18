// ================================================================
//  KWON FITNESS – ПЕРЕВОДЫ ИНТЕРФЕЙСА
//  Полный набор ключей (русский и английский)
// ================================================================

const LANG = {
    ru: {
        // Общие
        app_title: 'KWON Fitness',

        // Вход
        login_sub: 'Войди в аккаунт',
        login_username: 'Никнейм',
        login_password: 'Пароль',
        login_btn: 'Войти',
        login_register_link_btn: 'Регистрация',

        // Регистрация
        register_title: 'Регистрация',
        register_sub: 'Создай аккаунт',
        register_username: 'Никнейм',
        register_password: 'Пароль',
        register_confirm_password: 'Подтверди пароль',
        register_ref_code: 'Реферальный код',
        register_email: 'Email',
        register_btn: 'Зарегистрироваться',
        register_login_link_btn: 'Войти',

        // Ошибки регистрации
        register_error_username_empty: 'Введи никнейм!',
        register_error_username_exists: 'Никнейм занят!',
        register_error_password_short: 'Пароль минимум 6 символов!',
        register_error_password_mismatch: 'Пароли не совпадают!',

        // Сообщения
        auth_success_login: 'Добро пожаловать!',
        auth_success_reg: 'Аккаунт создан!',
        logout_btn: 'Выйти',

        // Вкладки
        tab_train: 'Трен',
        tab_shop: 'Маг',
        tab_inventory: 'Инв',
        tab_simple: 'Лёгкие',
        tab_leader: 'Лидеры',
        tab_chart: 'Граф',
        tab_fight: 'Босс',
        tab_achievements: 'Дост',
        tab_settings: 'Наст',
        tab_quests: 'Квесты', // 👈 НОВОЕ

        // Инвентарь и простые задания
        inventory_title: 'Инвентарь',
        simple_tasks_title: 'Лёгкие задания',
        simple_tasks_desc: 'Выполняй бесконечно, получай по +2 монеты',

        // Квесты
        quests_title: 'Ежедневные квесты',
        quests_desc: 'Выполняй задания и получай награды каждый день!',
        daily_quest_workout: '3 тренировки',
        daily_quest_workout_desc: 'Выполни 3 тренировки за день',
        daily_quest_boss: 'Победи босса',
        daily_quest_boss_desc: 'Победи босса сегодня',
        daily_quest_shop: 'Покупка в магазине',
        daily_quest_shop_desc: 'Купи предмет в магазине',
        daily_quest_challenge: 'Выполни челлендж',
        daily_quest_challenge_desc: 'Выполни ежедневный челлендж',
        daily_quest_points: '200 очков',
        daily_quest_points_desc: 'Заработай 200 очков за день',
        no_quests: 'Сегодня нет квестов. Загляни завтра!',

        // Тренировка
        task_name: 'отжиманий',
        task_desc: 'Выполни и нажми "Готово"',
        start_btn: 'Начать',
        finish_btn: 'Готово',
        norm_info: 'Норматив: ',

        // Магазин
        shop_title: 'Магазин',
        buy_btn: 'Купить',

        // Лидерборд
        leader_title: 'Лидерборд',

        // График
        chart_title: 'Прогресс',

        // Настройки
        settings_title: 'Настройки',
        settings_theme: 'Тёмная тема',
        settings_sound: 'Звук',
        settings_lang: 'Язык',
        settings_goal_title: 'Цель',
        settings_export_data: 'Экспорт данных',
        settings_import_data: 'Импорт данных',
        settings_export_csv: 'CSV экспорт',
        settings_reset: 'Сбросить прогресс',
        reset_warning: 'Удалит все данные безвозвратно',

        // Босс
        fight_title: 'Битва с боссом',
        fight_btn: 'Сразиться',
        boss_power: 'Сила: {power}',
        fight_win: 'Победа! +{reward} очков!',
        fight_lose: 'Поражение... +{reward} очков.',
        fight_already: 'Ты уже сражался сегодня!',

        // Ранги
        rank_novice: 'Новичок',
        rank_fighter: 'Боец',
        rank_veteran: 'Ветеран',
        rank_hero: 'Герой',
        rank_legend: 'Легенда',
        rank_progress: 'До следующего ранга: {points} очков',
        max_rank: 'Максимальный ранг',

        // Челлендж
        challenge_today: 'Челлендж: {task}',
        challenge_done: 'Челлендж выполнен! +{bonus} очков!',

        // Лутбокс
        loot_title: 'Тебе выпало:',
        loot_close: 'Круто!',
        loot_common: 'Обычный',
        loot_rare: 'Редкий',
        loot_legendary: 'Легендарный',

        // Уведомления
        alert_no_user: 'Войди в аккаунт',
        alert_no_points: 'Не хватает очков!',
        alert_purchase_success: 'Покупка успешна!',
        alert_logout: 'Выйти из аккаунта?',
        alert_reset_confirm: 'Сбросить прогресс навсегда? Введите слово "СБРОС"',
        alert_reset_done: 'Прогресс сброшен!',

        // Результаты тренировки
        result_too_fast: 'Слишком быстро! ({elapsed} сек). Норматив: {min}–{max} сек.',
        result_too_slow: 'Слишком медленно ({elapsed} сек). Норматив: {min}–{max} сек.',
        result_success: 'Молодец! Время: {elapsed} сек. +{reward} очков. Серия: {streak} дней. Ранг: {rank}',
        result_already_done: 'Ты уже выполнил сегодня!',

        // Общие
        no_data: 'Нет данных',
        points_short: 'оч.',

        // Поделиться
        share_text: 'Я сделал {task} за {time} и получил {points} очков! Присоединяйся!',
        share_btn: 'Поделиться',

        // Админ-панель
        admin_title: 'Админ-панель',
        admin_tab_staff: 'Сотрудники',
        admin_tab_shop: 'Магазин',
        admin_tab_promo: 'Промокоды',
        admin_tab_analytics: 'Аналитика',
        admin_no_access: 'Нет доступа',
        delete_user: 'Удалить пользователя',
        confirm_delete_user: 'Точно удалить пользователя {nick}? Это действие необратимо.',

        // Промокоды
        promo_activate: 'Активировать',
        promo_ph: 'Введите код',
        promo_title: 'Промокод',

        // Покупки
        bought: 'Куплено',

        // Достижения
        achievements_title: 'Достижения',

        // Пользовательские упражнения
        custom_exercises: 'Мои упражнения',
        custom_ex_name: 'Название',
        custom_ex_count: 'Кол-во',

        // 1ПМ
        '1rm_title': '1ПМ (одноповторный максимум)',
        '1rm_weight_ph': 'Вес (кг)',
        '1rm_reps_ph': 'Повторы',
        '1rm_calc_btn': '1RM',
        result_1rm: '1ПМ: {rm} кг',
        result_1rm_error: 'Введи вес и повторения',

        // Профиль
        avatar_picker_title: 'Выберите аватар',
        profile_stats_points: 'Очки',
        profile_stats_rank: 'Ранг',
        profile_stats_workouts: 'Тренировок',
        profile_stats_streak: 'Серия',
        profile_stats_age: 'Возраст',
        profile_stats_weight: 'Вес',
        profile_stats_gender: 'Пол',
        profile_stats_path: 'Путь',
        profile_stats_goal: 'Цель',
        profile_stats_level: 'Уровень',
        profile_stats_boss: 'Побед над боссами',
        profile_stats_inventory: 'Предметов',
        change_avatar_btn: 'Сменить аватар',
        change_frame: 'Сменить рамку',
        change_banner: 'Сменить баннер',
        change_title: 'Сменить титул',
        item_picker_title: 'Выберите {type}',

        // Кнопки инвентаря
        use_btn: 'Использовать',
        active_label: 'Активно',
        owned_label: 'Куплено',
        not_owned_label: 'Купить',

        // Типы предметов
        type_avatar: 'Аватар',
        type_frame: 'Рамка',
        type_banner: 'Баннер',
        type_title: 'Титул'
    },

    en: {
        // General
        app_title: 'KWON Fitness',

        // Login
        login_sub: 'Sign in',
        login_username: 'Username',
        login_password: 'Password',
        login_btn: 'Login',
        login_register_link_btn: 'Register',

        // Register
        register_title: 'Register',
        register_sub: 'Create account',
        register_username: 'Username',
        register_password: 'Password',
        register_confirm_password: 'Confirm password',
        register_ref_code: 'Referral code',
        register_email: 'Email',
        register_btn: 'Register',
        register_login_link_btn: 'Login',

        // Registration errors
        register_error_username_empty: 'Enter username!',
        register_error_username_exists: 'Username taken!',
        register_error_password_short: 'Password min 6 chars!',
        register_error_password_mismatch: 'Passwords do not match!',

        // Messages
        auth_success_login: 'Welcome!',
        auth_success_reg: 'Account created!',
        logout_btn: 'Logout',

        // Tabs
        tab_train: 'Train',
        tab_shop: 'Shop',
        tab_inventory: 'Inv',
        tab_simple: 'Easy',
        tab_leader: 'Leaders',
        tab_chart: 'Chart',
        tab_fight: 'Boss',
        tab_achievements: 'Achieve',
        tab_settings: 'Settings',
        tab_quests: 'Quests', // 👈 НОВОЕ

        // Inventory & simple tasks
        inventory_title: 'Inventory',
        simple_tasks_title: 'Easy tasks',
        simple_tasks_desc: 'Do them endlessly, get +2 coins',

        // Quests
        quests_title: 'Daily quests',
        quests_desc: 'Complete tasks and earn rewards every day!',
        daily_quest_workout: '3 workouts',
        daily_quest_workout_desc: 'Complete 3 workouts today',
        daily_quest_boss: 'Defeat boss',
        daily_quest_boss_desc: 'Defeat the boss today',
        daily_quest_shop: 'Shop purchase',
        daily_quest_shop_desc: 'Buy an item from the shop',
        daily_quest_challenge: 'Complete challenge',
        daily_quest_challenge_desc: 'Complete daily challenge',
        daily_quest_points: '200 points',
        daily_quest_points_desc: 'Earn 200 points today',
        no_quests: 'No quests today. Check back tomorrow!',

        // Workout
        task_name: 'push-ups',
        task_desc: 'Complete and press "Done"',
        start_btn: 'Start',
        finish_btn: 'Done',
        norm_info: 'Norm: ',

        // Shop
        shop_title: 'Shop',
        buy_btn: 'Buy',

        // Leaderboard
        leader_title: 'Leaderboard',

        // Chart
        chart_title: 'Progress',

        // Settings
        settings_title: 'Settings',
        settings_theme: 'Dark theme',
        settings_sound: 'Sound',
        settings_lang: 'Language',
        settings_goal_title: 'Goal',
        settings_export_data: 'Export data',
        settings_import_data: 'Import data',
        settings_export_csv: 'CSV export',
        settings_reset: 'Reset progress',
        reset_warning: 'Deletes all data permanently',

        // Boss
        fight_title: 'Boss battle',
        fight_btn: 'Fight',
        boss_power: 'Power: {power}',
        fight_win: 'Victory! +{reward} points!',
        fight_lose: 'Defeat... +{reward} points.',
        fight_already: 'You already fought today!',

        // Ranks
        rank_novice: 'Novice',
        rank_fighter: 'Fighter',
        rank_veteran: 'Veteran',
        rank_hero: 'Hero',
        rank_legend: 'Legend',
        rank_progress: 'Next rank: {points} points',
        max_rank: 'Max rank',

        // Challenge
        challenge_today: 'Challenge: {task}',
        challenge_done: 'Challenge completed! +{bonus} points!',

        // Lootbox
        loot_title: 'You got:',
        loot_close: 'Cool!',
        loot_common: 'Common',
        loot_rare: 'Rare',
        loot_legendary: 'Legendary',

        // Notifications
        alert_no_user: 'Login required',
        alert_no_points: 'Not enough points!',
        alert_purchase_success: 'Purchase successful!',
        alert_logout: 'Logout?',
        alert_reset_confirm: 'Reset progress forever? Type "RESET"',
        alert_reset_done: 'Progress reset!',

        // Workout results
        result_too_fast: 'Too fast! ({elapsed} sec). Norm: {min}–{max} sec.',
        result_too_slow: 'Too slow ({elapsed} sec). Norm: {min}–{max} sec.',
        result_success: 'Well done! Time: {elapsed} sec. +{reward} pts. Streak: {streak} days. Rank: {rank}',
        result_already_done: 'Already done today!',

        // Common
        no_data: 'No data',
        points_short: 'pts.',

        // Share
        share_text: 'I did {task} in {time} and got {points} points! Join now!',
        share_btn: 'Share',

        // Admin panel
        admin_title: 'Admin panel',
        admin_tab_staff: 'Staff',
        admin_tab_shop: 'Shop',
        admin_tab_promo: 'Promocodes',
        admin_tab_analytics: 'Analytics',
        admin_no_access: 'Access denied',
        delete_user: 'Delete user',
        confirm_delete_user: 'Are you sure you want to delete user {nick}? This is irreversible.',

        // Promo
        promo_activate: 'Activate',
        promo_ph: 'Enter code',
        promo_title: 'Promocode',

        // Purchases
        bought: 'Bought',

        // Achievements
        achievements_title: 'Achievements',

        // Custom exercises
        custom_exercises: 'My exercises',
        custom_ex_name: 'Name',
        custom_ex_count: 'Count',

        // 1RM
        '1rm_title': '1RM (one rep max)',
        '1rm_weight_ph': 'Weight (kg)',
        '1rm_reps_ph': 'Reps',
        '1rm_calc_btn': '1RM',
        result_1rm: '1RM: {rm} kg',
        result_1rm_error: 'Enter weight and reps',

        // Profile
        avatar_picker_title: 'Choose avatar',
        profile_stats_points: 'Points',
        profile_stats_rank: 'Rank',
        profile_stats_workouts: 'Workouts',
        profile_stats_streak: 'Streak',
        profile_stats_age: 'Age',
        profile_stats_weight: 'Weight',
        profile_stats_gender: 'Gender',
        profile_stats_path: 'Path',
        profile_stats_goal: 'Goal',
        profile_stats_level: 'Level',
        profile_stats_boss: 'Boss wins',
        profile_stats_inventory: 'Items',
        change_avatar_btn: 'Change avatar',
        change_frame: 'Change frame',
        change_banner: 'Change banner',
        change_title: 'Change title',
        item_picker_title: 'Choose {type}',

        // Inventory buttons
        use_btn: 'Use',
        active_label: 'Active',
        owned_label: 'Owned',
        not_owned_label: 'Buy',

        // Item types
        type_avatar: 'Avatar',
        type_frame: 'Frame',
        type_banner: 'Banner',
        type_title: 'Title'
    }
};

// Экспортируем в глобальную область видимости
if (typeof window !== 'undefined') {
    window.LANG = LANG;
}