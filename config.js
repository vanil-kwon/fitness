// ================================================================
//  KWON FITNESS – CONFIGURATION V2.1
//  Игровые данные, XP, уровни, ранги, предметы, задания,
//  боссы, достижения, возрастные группы
// ================================================================

const CONFIG = {

    // ============================================================
    // SYSTEM
    // ============================================================

    VERSION: '2.1.0',

    APP_NAME: 'KWON Fitness',

    // ============================================================
    // АДМИНИСТРАТИВНАЯ СИСТЕМА
    // ============================================================

    // ВАЖНО:
    // Здесь хранится SHA-256 хеш пароля администратора.
    // Хеш '9478f92150abda0f4c0846871a3556779a1f2518e11be0744fc41a7746816568' соответствует паролю 'FitMaster2024!'
    // Для полной безопасности в production проверку стоит перенести на backend.
    ADMIN_PASSWORD_HASH: '498757eaa5f6e0042154d7996c3a3e12770eff827cd4b1c4865dc0246df8bd1c',

    // ============================================================
    // ЭКОНОМИКА
    // ============================================================

    REWARD_BASE: 10,

    CHALLENGE_BONUS: 10,

    BOSS_WIN: 10,

    BOSS_LOSE: 2,

    SIMPLE_TASK_REWARD: 2,

    // Максимальное количество простых заданий в день
    SIMPLE_TASKS_DAILY_LIMIT: 10,

    // Шанс получить предмет из обычной тренировки
    LOOT_DROP_CHANCE: 0.25,

    // ============================================================
    // XP SYSTEM
    // ============================================================

    XP: {

        // Базовый XP для перехода с Level 1
        BASE_XP: 100,

        // Рост необходимого XP на каждый следующий уровень
        MULTIPLIER: 1.35,

        // Максимальный уровень
        MAX_LEVEL: 100,

        // XP за разные действия
        REWARDS: {

            WORKOUT: 50,

            DAILY_CHALLENGE: 75,

            SIMPLE_TASK: 10,

            BOSS_WIN: 100,

            BOSS_LOSE: 25,

            DAILY_LOGIN: 10,

            REFERRAL_NEW_USER: 50,

            REFERRAL_OWNER: 100
        }
    },

    // ============================================================
    // ФУНКЦИИ XP / LEVEL
    // ============================================================

    getLevelFromXP(xp) {

        let currentXP = Math.max(
            0,
            Number(xp) || 0
        );

        let level = 1;

        let requiredXP = this.XP.BASE_XP;

        while (
            currentXP >= requiredXP &&
            level < this.XP.MAX_LEVEL
        ) {

            currentXP -= requiredXP;

            level++;

            requiredXP = Math.floor(
                requiredXP * this.XP.MULTIPLIER
            );
        }

        return level;
    },

    getXPProgress(xp) {

        let remainingXP = Math.max(
            0,
            Number(xp) || 0
        );

        let level = 1;

        let requiredXP = this.XP.BASE_XP;

        while (
            remainingXP >= requiredXP &&
            level < this.XP.MAX_LEVEL
        ) {

            remainingXP -= requiredXP;

            level++;

            requiredXP = Math.floor(
                requiredXP * this.XP.MULTIPLIER
            );
        }

        if (level >= this.XP.MAX_LEVEL) {

            return {
                level: this.XP.MAX_LEVEL,
                current: requiredXP,
                required: requiredXP,
                percent: 100,
                isMaxLevel: true
            };
        }

        return {
            level,
            current: remainingXP,
            required: requiredXP,
            percent: Math.min(
                100,
                Math.round(
                    (remainingXP / requiredXP) * 100
                )
            ),
            isMaxLevel: false
        };
    },

    getTotalXPForLevel(level) {

        const targetLevel = Math.max(
            1,
            Math.min(
                this.XP.MAX_LEVEL,
                Number(level) || 1
            )
        );

        let totalXP = 0;

        let requiredXP = this.XP.BASE_XP;

        for (
            let currentLevel = 1;
            currentLevel < targetLevel;
            currentLevel++
        ) {

            totalXP += requiredXP;

            requiredXP = Math.floor(
                requiredXP * this.XP.MULTIPLIER
            );
        }

        return totalXP;
    },

    // ============================================================
    // РАНГИ
    // ============================================================

    RANKS: [
        {
            key: 'novice',
            name: 'Новичок',
            min: 0,
            color: '#a0a0b0'
        },

        {
            key: 'fighter',
            name: 'Боец',
            min: 50,
            color: '#6c5ce7'
        },

        {
            key: 'veteran',
            name: 'Ветеран',
            min: 150,
            color: '#3498db'
        },

        {
            key: 'hero',
            name: 'Герой',
            min: 300,
            color: '#e74c3c'
        },

        {
            key: 'legend',
            name: 'Легенда',
            min: 600,
            color: '#ffd700'
        }
    ],

    // ============================================================
    // РЕДКОСТИ ПРЕДМЕТОВ
    // ============================================================

    RARITIES: {

        common: {
            key: 'common',
            name: 'Обычный',
            color: '#a0a0b0',
            multiplier: 1
        },

        rare: {
            key: 'rare',
            name: 'Редкий',
            color: '#3498db',
            multiplier: 1.5
        },

        epic: {
            key: 'epic',
            name: 'Эпический',
            color: '#9b59b6',
            multiplier: 2
        },

        legendary: {
            key: 'legendary',
            name: 'Легендарный',
            color: '#f1c40f',
            multiplier: 3
        }
    },

    // ============================================================
    // ПРЕДМЕТЫ МАГАЗИНА
    // ============================================================

    ITEMS: [

        // --------------------------------------------------------
        // АВАТАРЫ
        // --------------------------------------------------------

        {
            id: 'lion',
            name: 'Лев',
            icon: '🦁',
            price: 30,
            type: 'avatar',
            rarity: 'common'
        },

        {
            id: 'dragon',
            name: 'Дракон',
            icon: '🐉',
            price: 75,
            type: 'avatar',
            rarity: 'epic'
        },

        {
            id: 'rocket',
            name: 'Космос',
            icon: '🚀',
            price: 40,
            type: 'avatar',
            rarity: 'rare'
        },

        {
            id: 'star',
            name: 'Звезда',
            icon: '🌟',
            price: 25,
            type: 'avatar',
            rarity: 'common'
        },

        {
            id: 'fox',
            name: 'Лиса',
            icon: '🦊',
            price: 20,
            type: 'avatar',
            rarity: 'common'
        },

        {
            id: 'wolf',
            name: 'Волк',
            icon: '🐺',
            price: 35,
            type: 'avatar',
            rarity: 'rare'
        },

        {
            id: 'eagle',
            name: 'Орёл',
            icon: '🦅',
            price: 55,
            type: 'avatar',
            rarity: 'rare'
        },

        {
            id: 'fire',
            name: 'Огонь',
            icon: '🔥',
            price: 60,
            type: 'avatar',
            rarity: 'epic'
        },

        {
            id: 'alien',
            name: 'Инопланетянин',
            icon: '👾',
            price: 55,
            type: 'avatar',
            rarity: 'rare'
        },

        {
            id: 'gamer',
            name: 'Геймер',
            icon: '🎮',
            price: 30,
            type: 'avatar',
            rarity: 'common'
        },

        {
            id: 'ninja',
            name: 'Ниндзя',
            icon: '🥷',
            price: 70,
            type: 'avatar',
            rarity: 'epic'
        },

        {
            id: 'wizard',
            name: 'Волшебник',
            icon: '🧙',
            price: 70,
            type: 'avatar',
            rarity: 'epic'
        },

        // --------------------------------------------------------
        // РАМКИ
        // --------------------------------------------------------

        {
            id: 'frame_red',
            name: 'Красная рамка',
            icon: '🟥',
            price: 10,
            type: 'frame',
            rarity: 'common'
        },

        {
            id: 'frame_green',
            name: 'Зелёная рамка',
            icon: '🟩',
            price: 10,
            type: 'frame',
            rarity: 'common'
        },

        {
            id: 'frame_blue',
            name: 'Синяя рамка',
            icon: '🟦',
            price: 10,
            type: 'frame',
            rarity: 'common'
        },

        {
            id: 'frame_yellow',
            name: 'Жёлтая рамка',
            icon: '🟨',
            price: 10,
            type: 'frame',
            rarity: 'common'
        },

        {
            id: 'frame_purple',
            name: 'Фиолетовая рамка',
            icon: '🟪',
            price: 15,
            type: 'frame',
            rarity: 'rare'
        },

        {
            id: 'frame_pink',
            name: 'Розовая рамка',
            icon: '🩰',
            price: 15,
            type: 'frame',
            rarity: 'rare'
        },

        {
            id: 'frame_gold',
            name: 'Золотая рамка',
            icon: '🏆',
            price: 45,
            type: 'frame',
            rarity: 'epic'
        },

        {
            id: 'frame_silver',
            name: 'Серебряная рамка',
            icon: '⚪',
            price: 25,
            type: 'frame',
            rarity: 'rare'
        },

        {
            id: 'frame_rainbow',
            name: 'Радужная рамка',
            icon: '🌈',
            price: 70,
            type: 'frame',
            rarity: 'epic'
        },

        {
            id: 'frame_neon',
            name: 'Неоновая рамка',
            icon: '💡',
            price: 65,
            type: 'frame',
            rarity: 'epic'
        },

        {
            id: 'frame_diamond',
            name: 'Алмазная рамка',
            icon: '💎',
            price: 150,
            type: 'frame',
            rarity: 'legendary'
        },

        {
            id: 'frame_glow',
            name: 'Светящаяся рамка',
            icon: '✨',
            price: 80,
            type: 'frame',
            rarity: 'epic'
        },

        {
            id: 'frame_legendary',
            name: 'Легендарная рамка',
            icon: '💜',
            price: 200,
            type: 'frame',
            rarity: 'legendary'
        },

        // --------------------------------------------------------
        // БАННЕРЫ
        // --------------------------------------------------------

        {
            id: 'banner_red',
            name: 'Красный баннер',
            icon: '🔴',
            price: 15,
            type: 'banner',
            rarity: 'common'
        },

        {
            id: 'banner_blue',
            name: 'Синий баннер',
            icon: '🔵',
            price: 15,
            type: 'banner',
            rarity: 'common'
        },

        {
            id: 'banner_green',
            name: 'Зелёный баннер',
            icon: '🟢',
            price: 15,
            type: 'banner',
            rarity: 'common'
        },

        {
            id: 'banner_yellow',
            name: 'Жёлтый баннер',
            icon: '🟡',
            price: 15,
            type: 'banner',
            rarity: 'common'
        },

        {
            id: 'banner_purple',
            name: 'Фиолетовый баннер',
            icon: '🟣',
            price: 25,
            type: 'banner',
            rarity: 'rare'
        },

        {
            id: 'banner_pink',
            name: 'Розовый баннер',
            icon: '🩷',
            price: 25,
            type: 'banner',
            rarity: 'rare'
        },

        {
            id: 'banner_sunset',
            name: 'Закат',
            icon: '🌅',
            price: 40,
            type: 'banner',
            rarity: 'rare'
        },

        {
            id: 'banner_space',
            name: 'Космос',
            icon: '🌌',
            price: 65,
            type: 'banner',
            rarity: 'epic'
        },

        {
            id: 'banner_ocean',
            name: 'Океан',
            icon: '🌊',
            price: 40,
            type: 'banner',
            rarity: 'rare'
        },

        {
            id: 'banner_fire',
            name: 'Огонь',
            icon: '🔥',
            price: 60,
            type: 'banner',
            rarity: 'epic'
        },

        {
            id: 'banner_rainbow',
            name: 'Радуга',
            icon: '🌈',
            price: 90,
            type: 'banner',
            rarity: 'epic'
        },

        {
            id: 'banner_gold',
            name: 'Золотой',
            icon: '⭐',
            price: 80,
            type: 'banner',
            rarity: 'epic'
        },

        {
            id: 'banner_neon',
            name: 'Неоновый',
            icon: '💫',
            price: 90,
            type: 'banner',
            rarity: 'legendary'
        },

        // --------------------------------------------------------
        // ТИТУЛЫ
        // --------------------------------------------------------

        {
            id: 'title_bronze',
            name: 'Бронзовый',
            icon: '🥉',
            price: 20,
            type: 'title',
            rarity: 'common'
        },

        {
            id: 'title_silver',
            name: 'Серебряный',
            icon: '🥈',
            price: 30,
            type: 'title',
            rarity: 'rare'
        },

        {
            id: 'title_gold',
            name: 'Золотой',
            icon: '🥇',
            price: 50,
            type: 'title',
            rarity: 'rare'
        },

        {
            id: 'title_diamond',
            name: 'Алмазный',
            icon: '💎',
            price: 100,
            type: 'title',
            rarity: 'epic'
        },

        {
            id: 'title_rainbow',
            name: 'Радужный',
            icon: '🌈',
            price: 90,
            type: 'title',
            rarity: 'epic'
        },

        {
            id: 'title_purple',
            name: 'Фиолетовый',
            icon: '🟣',
            price: 40,
            type: 'title',
            rarity: 'rare'
        },

        {
            id: 'title_neon',
            name: 'Неоновый',
            icon: '🟢',
            price: 70,
            type: 'title',
            rarity: 'epic'
        },

        {
            id: 'title_legend',
            name: 'Легенда',
            icon: '👑',
            price: 200,
            type: 'title',
            rarity: 'legendary'
        },

        {
            id: 'title_master',
            name: 'Мастер',
            icon: '⚡',
            price: 140,
            type: 'title',
            rarity: 'epic'
        },

        {
            id: 'title_champion',
            name: 'Чемпион',
            icon: '🏆',
            price: 170,
            type: 'title',
            rarity: 'legendary'
        },

        {
            id: 'title_star',
            name: 'Звёздный',
            icon: '🌟',
            price: 110,
            type: 'title',
            rarity: 'epic'
        },

        {
            id: 'title_flame',
            name: 'Пламенный',
            icon: '🔥',
            price: 150,
            type: 'title',
            rarity: 'legendary'
        },

        {
            id: 'title_ghost',
            name: 'Призрачный',
            icon: '👻',
            price: 100,
            type: 'title',
            rarity: 'epic'
        },

        {
            id: 'title_shadow',
            name: 'Теневой',
            icon: '🌑',
            price: 110,
            type: 'title',
            rarity: 'epic'
        }
    ],

    // ============================================================
    // СТАРЫЕ ПРЕДМЕТЫ
    // ============================================================
    // Оставлены для совместимости со старыми версиями.

    SHOP: [

        {
            id: 'frame1',
            name: '🖼️ Серая рамка',
            price: 20
        },

        {
            id: 'frame2',
            name: '🖼️ Золотая рамка',
            price: 50
        },

        {
            id: 'skin1',
            name: '🎨 Скин "Космос"',
            price: 100
        },

        {
            id: 'title1',
            name: '🏅 Титул "Новичок"',
            price: 30
        }
    ],

    // ============================================================
    // ЛУТ
    // ============================================================

    LOOT: [

        {
            id: 'loot_tiger',
            name: 'Скин "Тигр"',
            rarity: 'legendary',
            emoji: '🐯',
            chance: 5
        },

        {
            id: 'loot_dragon',
            name: 'Скин "Дракон"',
            rarity: 'legendary',
            emoji: '🐉',
            chance: 5
        },

        {
            id: 'loot_machine',
            name: 'Фраза "Ты машина!"',
            rarity: 'common',
            emoji: '💪',
            chance: 60
        },

        {
            id: 'loot_space',
            name: 'Скин "Космос"',
            rarity: 'rare',
            emoji: '🚀',
            chance: 30
        }
    ],

    // ============================================================
    // ЕЖЕДНЕВНЫЕ ЧЕЛЛЕНДЖИ
    // ============================================================

    CHALLENGES: [

        {
            id: 'challenge_squats',
            task: '50 приседаний за 1 минуту',
            bonus: 10,
            xp: 75
        },

        {
            id: 'challenge_plank',
            task: '3 подхода планки по 1 минуте',
            bonus: 15,
            xp: 100
        },

        {
            id: 'challenge_clap_pushups',
            task: '20 отжиманий с хлопком',
            bonus: 12,
            xp: 90
        }
    ],

    // ============================================================
    // БОССЫ
    // ============================================================

    BOSS_NAMES: [

        'Мистер Сталь',

        'Железный Дракон',

        'Король Льдов',

        'Теневой Властелин',

        'Кибер-Титан',

        'Фантом Силы',

        'KWON Destroyer'
    ],

    BOSS: {

        MIN_POWER: 50,

        MAX_POWER: 150,

        XP_WIN: 100,

        XP_LOSE: 25
    },

    // ============================================================
    // ДОСТИЖЕНИЯ
    // ============================================================

    ACHIEVEMENTS: [

        {
            id: 'first',
            name: 'Первая тренировка',
            target: 1,
            icon: '🏋️',
            type: 'workout'
        },

        {
            id: '10_w',
            name: '10 тренировок',
            target: 10,
            icon: '💪',
            type: 'workout'
        },

        {
            id: '100_w',
            name: '100 тренировок',
            target: 100,
            icon: '🔥',
            type: 'workout'
        },

        {
            id: '5_boss',
            name: '5 побед над боссами',
            target: 5,
            icon: '⚔️',
            type: 'boss'
        },

        {
            id: '1000_pts',
            name: '1000 очков',
            target: 1000,
            icon: '🌟',
            type: 'points'
        },

        {
            id: '7_streak',
            name: 'Серия 7 дней',
            target: 7,
            icon: '🔥',
            type: 'streak'
        },

        {
            id: '30_streak',
            name: 'Серия 30 дней',
            target: 30,
            icon: '👑',
            type: 'streak'
        },

        {
            id: 'collector_5',
            name: 'Коллекционер',
            target: 5,
            icon: '📦',
            type: 'collection'
        },

        {
            id: 'collector_10',
            name: 'Стиляга',
            target: 10,
            icon: '🕶️',
            type: 'collection'
        },

        {
            id: 'collector_20',
            name: 'Икона стиля',
            target: 20,
            icon: '👗',
            type: 'collection'
        },

        {
            id: 'avatar_master',
            name: 'Аватар-мастер',
            target: 3,
            icon: '🧑‍🎨',
            type: 'avatars'
        },

        {
            id: 'frame_master',
            name: 'Рамщик',
            target: 5,
            icon: '🖼️',
            type: 'frames'
        },

        {
            id: 'banner_king',
            name: 'Баннерный король',
            target: 5,
            icon: '👑',
            type: 'banners'
        },

        {
            id: 'title_master',
            name: 'Титулованный',
            target: 5,
            icon: '🏅',
            type: 'titles'
        },

        {
            id: 'all_titles',
            name: 'Легендарный коллекционер',
            target: 14,
            icon: '🌟',
            type: 'all_titles'
        },

        // --------------------------------------------------------
        // ДОСТИЖЕНИЯ ЗА КВЕСТЫ
        // --------------------------------------------------------

        {
            id: 'quest_novice',
            name: 'Искатель приключений',
            target: 10,
            icon: '📜',
            type: 'quests'
        },

        {
            id: 'quest_master',
            name: 'Мастер квестов',
            target: 50,
            icon: '🗺️',
            type: 'quests'
        },

        // --------------------------------------------------------
        // НОВЫЕ XP / LEVEL ДОСТИЖЕНИЯ
        // --------------------------------------------------------

        {
            id: 'level_5',
            name: 'Level 5',
            target: 5,
            icon: '⭐',
            type: 'level'
        },

        {
            id: 'level_10',
            name: 'Level 10',
            target: 10,
            icon: '⚡',
            type: 'level'
        },

        {
            id: 'level_25',
            name: 'Level 25',
            target: 25,
            icon: '🔥',
            type: 'level'
        },

        {
            id: 'level_50',
            name: 'Level 50',
            target: 50,
            icon: '💎',
            type: 'level'
        },

        {
            id: 'level_100',
            name: 'MAX LEVEL',
            target: 100,
            icon: '👑',
            type: 'level'
        }
    ],

    // ============================================================
    // ОСНОВНЫЕ УПРАЖНЕНИЯ
    // ============================================================

    EXERCISES: {

        'Фитнес': {

            beginner: [
                {
                    name: 'отжимания от стены',
                    count: 15,
                    min: 30,
                    max: 60
                }
            ],

            medium: [
                {
                    name: 'классические отжимания',
                    count: 20,
                    min: 45,
                    max: 90
                }
            ],

            advanced: [
                {
                    name: 'отжимания с хлопком',
                    count: 15,
                    min: 40,
                    max: 80
                }
            ],

            pro: [
                {
                    name: 'отжимания на одной руке',
                    count: 10,
                    min: 50,
                    max: 100
                }
            ],

            elite: [
                {
                    name: 'отжимания в стойке',
                    count: 8,
                    min: 60,
                    max: 110
                }
            ]
        },

        'Качек': {

            beginner: [
                {
                    name: 'отжимания от стены',
                    count: 15,
                    min: 30,
                    max: 60
                }
            ],

            medium: [
                {
                    name: 'классические отжимания',
                    count: 25,
                    min: 50,
                    max: 100
                }
            ],

            advanced: [
                {
                    name: 'отжимания с весом',
                    count: 20,
                    min: 55,
                    max: 105
                }
            ],

            pro: [
                {
                    name: 'отжимания на брусьях',
                    count: 15,
                    min: 60,
                    max: 110
                }
            ],

            elite: [
                {
                    name: 'отжимания в стойке',
                    count: 10,
                    min: 70,
                    max: 120
                }
            ]
        },

        'Йога': {

            beginner: [
                {
                    name: 'планка на коленях',
                    count: 1,
                    min: 40,
                    max: 80
                }
            ],

            medium: [
                {
                    name: 'планка',
                    count: 1,
                    min: 60,
                    max: 120
                }
            ],

            advanced: [
                {
                    name: 'планка на одной руке',
                    count: 1,
                    min: 80,
                    max: 150
                }
            ],

            pro: [
                {
                    name: 'планка с подъемом ноги',
                    count: 1,
                    min: 100,
                    max: 180
                }
            ],

            elite: [
                {
                    name: 'планка с отягощением',
                    count: 1,
                    min: 140,
                    max: 220
                }
            ]
        },

        'Силовой': {

            beginner: [
                {
                    name: 'отжимания от стены',
                    count: 15,
                    min: 30,
                    max: 60
                }
            ],

            medium: [
                {
                    name: 'классические отжимания',
                    count: 25,
                    min: 50,
                    max: 100
                }
            ],

            advanced: [
                {
                    name: 'отжимания с хлопком',
                    count: 15,
                    min: 50,
                    max: 90
                }
            ],

            pro: [
                {
                    name: 'отжимания на одной руке',
                    count: 10,
                    min: 60,
                    max: 110
                }
            ],

            elite: [
                {
                    name: 'отжимания в стойке',
                    count: 8,
                    min: 70,
                    max: 120
                }
            ]
        }
    },

    // ============================================================
    // ВОЗРАСТНЫЕ ГРУППЫ
    // ============================================================

    AGE_GROUPS: [

        {
            id: 'kids_1_5',
            min: 1,
            max: 5,
            label: 'Малыши 1-5 лет'
        },

        {
            id: 'kids_5_10',
            min: 5,
            max: 10,
            label: 'Дети 5-10 лет'
        },

        {
            id: 'teens_10_15',
            min: 10,
            max: 15,
            label: 'Подростки 10-15 лет'
        },

        {
            id: 'youth_15_20',
            min: 15,
            max: 20,
            label: 'Юниоры 15-20 лет'
        },

        {
            id: 'adults_20_plus',
            min: 20,
            max: 150,
            label: 'Взрослые 20+'
        }
    ],

    // ============================================================
    // ПРОСТЫЕ ЗАДАНИЯ
    // ============================================================

    SIMPLE_TASKS: [

        {
            id: 'simple_jump',
            name: 'Прыжки на месте',
            icon: '🤸',
            ageMin: 1,
            ageMax: 5,
            reward: 2,
            xp: 10
        },

        {
            id: 'simple_clap',
            name: 'Хлопки в ладоши',
            icon: '👏',
            ageMin: 1,
            ageMax: 5,
            reward: 2,
            xp: 10
        },

        {
            id: 'simple_wall_push',
            name: 'Отжимания от стены',
            icon: '🧱',
            ageMin: 5,
            ageMax: 10,
            reward: 2,
            xp: 10
        },

        {
            id: 'simple_balance',
            name: 'Стойка на одной ноге',
            icon: '🦩',
            ageMin: 5,
            ageMax: 10,
            reward: 2,
            xp: 10
        },

        {
            id: 'simple_squat',
            name: 'Приседания',
            icon: '🏋️',
            ageMin: 10,
            ageMax: 15,
            reward: 2,
            xp: 10
        },

        {
            id: 'simple_crunch',
            name: 'Скручивания',
            icon: '🤸',
            ageMin: 10,
            ageMax: 15,
            reward: 2,
            xp: 10
        },

        {
            id: 'simple_lunge',
            name: 'Выпады',
            icon: '🦵',
            ageMin: 15,
            ageMax: 20,
            reward: 2,
            xp: 10
        },

        {
            id: 'simple_jumping_jack',
            name: 'Джампинг Джек',
            icon: '⭐',
            ageMin: 15,
            ageMax: 20,
            reward: 2,
            xp: 10
        },

        {
            id: 'simple_plank_30',
            name: 'Планка 30 сек',
            icon: '⏱️',
            ageMin: 20,
            ageMax: 150,
            reward: 2,
            xp: 10
        },

        {
            id: 'simple_bridge',
            name: 'Ягодичный мостик',
            icon: '🌉',
            ageMin: 20,
            ageMax: 150,
            reward: 2,
            xp: 10
        },

        {
            id: 'simple_stretch',
            name: 'Потягивания',
            icon: '🤲',
            ageMin: 1,
            ageMax: 150,
            reward: 2,
            xp: 10
        },

        {
            id: 'simple_walk',
            name: 'Ходьба на месте',
            icon: '🚶',
            ageMin: 1,
            ageMax: 150,
            reward: 2,
            xp: 10
        }
    ],

    // ============================================================
    // УПРАЖНЕНИЯ ПО ВОЗРАСТУ
    // ============================================================

    AGE_EXERCISES: {

        kids_1_5: [

            {
                name: 'прыжки на месте',
                count: 20,
                min: 30,
                max: 60
            },

            {
                name: 'хлопки над головой',
                count: 15,
                min: 30,
                max: 50
            },

            {
                name: 'наклоны в стороны',
                count: 10,
                min: 25,
                max: 45
            }
        ],

        kids_5_10: [

            {
                name: 'приседания с опорой',
                count: 15,
                min: 40,
                max: 80
            },

            {
                name: 'отжимания от стены',
                count: 20,
                min: 35,
                max: 70
            },

            {
                name: 'планка на коленях',
                count: 1,
                min: 30,
                max: 60
            }
        ],

        teens_10_15: [

            {
                name: 'приседания',
                count: 25,
                min: 50,
                max: 100
            },

            {
                name: 'отжимания',
                count: 15,
                min: 45,
                max: 90
            },

            {
                name: 'скручивания',
                count: 30,
                min: 40,
                max: 80
            }
        ],

        youth_15_20: [

            {
                name: 'выпады',
                count: 20,
                min: 55,
                max: 110
            },

            {
                name: 'отжимания',
                count: 25,
                min: 50,
                max: 100
            },

            {
                name: 'планка',
                count: 1,
                min: 60,
                max: 120
            }
        ],

        adults_20_plus: [

            {
                name: 'отжимания',
                count: 30,
                min: 60,
                max: 120
            },

            {
                name: 'приседания',
                count: 40,
                min: 60,
                max: 120
            },

            {
                name: 'планка',
                count: 1,
                min: 90,
                max: 180
            }
        ]
    },

    // ============================================================
    // КАСТОМНЫЕ ДИЗАЙНЫ
    // ============================================================

    CUSTOM_DESIGNS: {
        frames: {
            'frame_legendary': 'https://i.ibb.co/GQpGBwQb/file-00000000fec081f4853f14702dfdc671.png'
        }
    }
};

// ================================================================
// ГЛОБАЛЬНЫЕ ФУНКЦИИ XP
// ================================================================

function getLevelFromXP(xp) {
    return CONFIG.getLevelFromXP(xp);
}

function getXPProgress(xp) {
    return CONFIG.getXPProgress(xp);
}

function getTotalXPForLevel(level) {
    return CONFIG.getTotalXPForLevel(level);
}

function getXPReward(type) {

    return (
        CONFIG.XP.REWARDS[type] || 0
    );
}

// ================================================================
// ЭКСПОРТ В WINDOW
// ================================================================

if (typeof window !== 'undefined') {

    window.CONFIG = CONFIG;

    window.getLevelFromXP =
        getLevelFromXP;

    window.getXPProgress =
        getXPProgress;

    window.getTotalXPForLevel =
        getTotalXPForLevel;

    window.getXPReward =
        getXPReward;
}

console.log(
    '⚙️ KWON config.js V2.1 загружен'
);
