// ================================================================
//  KWON FITNESS – КОНФИГУРАЦИЯ ПРИЛОЖЕНИЯ
//  Все игровые данные, предметы, упражнения, возрастные группы
// ================================================================

const CONFIG = {
    // Административный пароль
    ADMIN_PASSWORD: 'FitMaster2024!',

    // Награды за действия
    REWARD_BASE: 10,          // Базовая награда за тренировку
    CHALLENGE_BONUS: 10,      // Бонус за выполнение ежедневного задания
    BOSS_WIN: 10,             // Награда за победу над боссом
    BOSS_LOSE: 2,             // Утешительная награда при поражении

    // Ранги (пороги очков)
    RANKS: [
        { key: 'novice',   name: 'Новичок',  min: 0 },
        { key: 'fighter',  name: 'Боец',     min: 50 },
        { key: 'veteran',  name: 'Ветеран',  min: 150 },
        { key: 'hero',     name: 'Герой',    min: 300 },
        { key: 'legend',   name: 'Легенда',  min: 600 }
    ],

    // Все предметы магазина (аватарки, рамки, баннеры, титулы)
    ITEMS: [
        // ----- АВАТАРКИ -----
        { id: 'lion',       name: 'Лев',           icon: '🦁', price: 30, type: 'avatar' },
        { id: 'dragon',     name: 'Дракон',        icon: '🐉', price: 50, type: 'avatar' },
        { id: 'rocket',     name: 'Космос',        icon: '🚀', price: 40, type: 'avatar' },
        { id: 'star',       name: 'Звезда',        icon: '🌟', price: 25, type: 'avatar' },
        { id: 'fox',        name: 'Лиса',          icon: '🦊', price: 20, type: 'avatar' },
        { id: 'wolf',       name: 'Волк',          icon: '🐺', price: 35, type: 'avatar' },
        { id: 'eagle',      name: 'Орёл',          icon: '🦅', price: 45, type: 'avatar' },
        { id: 'fire',       name: 'Огонь',         icon: '🔥', price: 60, type: 'avatar' },
        { id: 'alien',      name: 'Инопланетянин', icon: '👾', price: 55, type: 'avatar' },
        { id: 'gamer',      name: 'Геймер',        icon: '🎮', price: 30, type: 'avatar' },
        { id: 'ninja',      name: 'Ниндзя',        icon: '🥷', price: 50, type: 'avatar' },
        { id: 'wizard',     name: 'Волшебник',     icon: '🧙', price: 55, type: 'avatar' },

        // ----- РАМКИ -----
        { id: 'frame_red',      name: 'Красная рамка',    icon: '🟥', price: 10, type: 'frame' },
        { id: 'frame_green',    name: 'Зелёная рамка',    icon: '🟩', price: 10, type: 'frame' },
        { id: 'frame_blue',     name: 'Синяя рамка',      icon: '🟦', price: 10, type: 'frame' },
        { id: 'frame_yellow',   name: 'Жёлтая рамка',     icon: '🟨', price: 10, type: 'frame' },
        { id: 'frame_purple',   name: 'Фиолетовая рамка', icon: '🟪', price: 15, type: 'frame' },
        { id: 'frame_pink',     name: 'Розовая рамка',    icon: '🩰', price: 15, type: 'frame' },
        { id: 'frame_gold',     name: 'Золотая рамка',    icon: '🏆', price: 30, type: 'frame' },
        { id: 'frame_silver',   name: 'Серебряная рамка', icon: '⚪', price: 25, type: 'frame' },
        { id: 'frame_rainbow',  name: 'Радужная рамка',   icon: '🌈', price: 50, type: 'frame' },
        { id: 'frame_neon',     name: 'Неоновая рамка',   icon: '💡', price: 40, type: 'frame' },
        { id: 'frame_diamond',  name: 'Алмазная рамка',   icon: '💎', price: 100, type: 'frame' },
        { id: 'frame_glow',     name: 'Светящаяся рамка', icon: '✨', price: 45, type: 'frame' },

        // ----- БАННЕРЫ -----
        { id: 'banner_red',      name: 'Красный баннер',    icon: '🔴', price: 15, type: 'banner' },
        { id: 'banner_blue',     name: 'Синий баннер',      icon: '🔵', price: 15, type: 'banner' },
        { id: 'banner_green',    name: 'Зелёный баннер',    icon: '🟢', price: 15, type: 'banner' },
        { id: 'banner_yellow',   name: 'Жёлтый баннер',     icon: '🟡', price: 15, type: 'banner' },
        { id: 'banner_purple',   name: 'Фиолетовый баннер', icon: '🟣', price: 20, type: 'banner' },
        { id: 'banner_pink',     name: 'Розовый баннер',    icon: '🩷', price: 20, type: 'banner' },
        { id: 'banner_sunset',   name: 'Закат',             icon: '🌅', price: 35, type: 'banner' },
        { id: 'banner_space',    name: 'Космос',            icon: '🌌', price: 45, type: 'banner' },
        { id: 'banner_ocean',    name: 'Океан',             icon: '🌊', price: 35, type: 'banner' },
        { id: 'banner_fire',     name: 'Огонь',             icon: '🔥', price: 40, type: 'banner' },
        { id: 'banner_rainbow',  name: 'Радуга',            icon: '🌈', price: 60, type: 'banner' },
        { id: 'banner_gold',     name: 'Золотой',           icon: '⭐', price: 50, type: 'banner' },
        { id: 'banner_neon',     name: 'Неоновый',          icon: '💫', price: 45, type: 'banner' },

        // ----- ТИТУЛЫ -----
        { id: 'title_bronze',    name: 'Бронзовый',   icon: '🥉', price: 20, type: 'title' },
        { id: 'title_silver',    name: 'Серебряный',  icon: '🥈', price: 30, type: 'title' },
        { id: 'title_gold',      name: 'Золотой',     icon: '🥇', price: 50, type: 'title' },
        { id: 'title_diamond',   name: 'Алмазный',    icon: '💎', price: 80, type: 'title' },
        { id: 'title_rainbow',   name: 'Радужный',    icon: '🌈', price: 70, type: 'title' },
        { id: 'title_purple',    name: 'Фиолетовый',  icon: '🟣', price: 40, type: 'title' },
        { id: 'title_neon',      name: 'Неоновый',    icon: '🟢', price: 45, type: 'title' },
        { id: 'title_legend',    name: 'Легенда',     icon: '👑', price: 150, type: 'title' },
        { id: 'title_master',    name: 'Мастер',      icon: '⚡', price: 100, type: 'title' },
        { id: 'title_champion',  name: 'Чемпион',     icon: '🏆', price: 120, type: 'title' },
        { id: 'title_star',      name: 'Звёздный',    icon: '🌟', price: 90, type: 'title' },
        { id: 'title_flame',     name: 'Пламенный',   icon: '🔥', price: 110, type: 'title' },
        { id: 'title_ghost',     name: 'Призрачный',  icon: '👻', price: 80, type: 'title' },
        { id: 'title_shadow',    name: 'Теневой',     icon: '🌑', price: 85, type: 'title' },
    ],

    // Дополнительные предметы (старые, но оставлены для совместимости)
    SHOP: [
        { id: 'frame1', name: '🖼️ Серая рамка', price: 20 },
        { id: 'frame2', name: '🖼️ Золотая рамка', price: 50 },
        { id: 'skin1',  name: '🎨 Скин "Космос"', price: 100 },
        { id: 'title1', name: '🏅 Титул "Новичок"', price: 30 }
    ],

    // Лутбоксы (случайные награды)
    LOOT: [
        { name: 'Скин "Тигр"',           rarity: 'legendary', emoji: '🐯' },
        { name: 'Скин "Дракон"',         rarity: 'legendary', emoji: '🐉' },
        { name: 'Фраза "Ты машина!"',    rarity: 'common',    emoji: '💪' },
        { name: 'Скин "Космос"',         rarity: 'rare',      emoji: '🚀' }
    ],

    // Ежедневные задания (челленджи)
    CHALLENGES: [
        { task: '50 приседаний за 1 минуту',           bonus: 10 },
        { task: '3 подхода планки по 1 минуте',        bonus: 15 },
        { task: '20 отжиманий с хлопком',              bonus: 12 }
    ],

    // Имена боссов
    BOSS_NAMES: [
        'Мистер Сталь',
        'Железный Дракон',
        'Король Льдов',
        'Теневой Властелин'
    ],

    // Достижения
    ACHIEVEMENTS: [
        { id: 'first',           name: 'Первая тренировка',        target: 1,    icon: '🏋️', type: 'workout' },
        { id: '10_w',            name: '10 тренировок',            target: 10,   icon: '💪', type: 'workout' },
        { id: '100_w',           name: '100 тренировок',           target: 100,  icon: '🔥', type: 'workout' },
        { id: '5_boss',          name: '5 побед над боссами',      target: 5,    icon: '⚔️', type: 'boss' },
        { id: '1000_pts',        name: '1000 очков',               target: 1000, icon: '🌟', type: 'points' },
        { id: '7_streak',        name: 'Серия 7 дней',             target: 7,    icon: '🔥', type: 'streak' },
        { id: '30_streak',       name: 'Серия 30 дней',            target: 30,   icon: '👑', type: 'streak' },
        { id: 'collector_5',     name: 'Коллекционер',             target: 5,    icon: '📦', type: 'collection' },
        { id: 'collector_10',    name: 'Стиляга',                  target: 10,   icon: '🕶️', type: 'collection' },
        { id: 'collector_20',    name: 'Икона стиля',              target: 20,   icon: '👗', type: 'collection' },
        { id: 'avatar_master',   name: 'Аватар-мастер',            target: 3,    icon: '🧑‍🎨', type: 'avatars' },
        { id: 'frame_master',    name: 'Рамщик',                   target: 5,    icon: '🖼️', type: 'frames' },
        { id: 'banner_king',     name: 'Баннерный король',         target: 5,    icon: '👑', type: 'banners' },
        { id: 'title_master',    name: 'Титулованный',             target: 5,    icon: '🏅', type: 'titles' },
        { id: 'all_titles',      name: 'Легендарный коллекционер', target: 14,   icon: '🌟', type: 'all_titles' }
    ],

    // Упражнения для основных тренировок (по пути и уровню)
    EXERCISES: {
        'Фитнес': {
            beginner:   [ { name: 'отжимания от стены',      count: 15, min: 30, max: 60 } ],
            medium:     [ { name: 'классические отжимания', count: 20, min: 45, max: 90 } ],
            advanced:   [ { name: 'отжимания с хлопком',    count: 15, min: 40, max: 80 } ],
            pro:        [ { name: 'отжимания на одной руке',count: 10, min: 50, max: 100 } ],
            elite:      [ { name: 'отжимания в стойке',     count: 8,  min: 60, max: 110 } ]
        },
        'Качек': {
            beginner:   [ { name: 'отжимания от стены',      count: 15, min: 30, max: 60 } ],
            medium:     [ { name: 'классические отжимания', count: 25, min: 50, max: 100 } ],
            advanced:   [ { name: 'отжимания с весом',      count: 20, min: 55, max: 105 } ],
            pro:        [ { name: 'отжимания на брусьях',   count: 15, min: 60, max: 110 } ],
            elite:      [ { name: 'отжимания в стойке',     count: 10, min: 70, max: 120 } ]
        },
        'Йога': {
            beginner:   [ { name: 'планка на коленях',      count: 1, min: 40, max: 80 } ],
            medium:     [ { name: 'планка',                 count: 1, min: 60, max: 120 } ],
            advanced:   [ { name: 'планка на одной руке',   count: 1, min: 80, max: 150 } ],
            pro:        [ { name: 'планка с подъемом ноги', count: 1, min: 100, max: 180 } ],
            elite:      [ { name: 'планка с отягощением',   count: 1, min: 140, max: 220 } ]
        },
        'Силовой': {
            beginner:   [ { name: 'отжимания от стены',      count: 15, min: 30, max: 60 } ],
            medium:     [ { name: 'классические отжимания', count: 25, min: 50, max: 100 } ],
            advanced:   [ { name: 'отжимания с хлопком',    count: 15, min: 50, max: 90 } ],
            pro:        [ { name: 'отжимания на одной руке',count: 10, min: 60, max: 110 } ],
            elite:      [ { name: 'отжимания в стойке',     count: 8,  min: 70, max: 120 } ]
        }
    },

    // Возрастные группы
    AGE_GROUPS: [
        { id: 'kids_1_5',       min: 1,   max: 5,   label: 'Малыши 1-5 лет' },
        { id: 'kids_5_10',      min: 5,   max: 10,  label: 'Дети 5-10 лет' },
        { id: 'teens_10_15',    min: 10,  max: 15,  label: 'Подростки 10-15 лет' },
        { id: 'youth_15_20',    min: 15,  max: 20,  label: 'Юниоры 15-20 лет' },
        { id: 'adults_20_plus', min: 20,  max: 150, label: 'Взрослые 20+' }
    ],

    // Простые задания (бесконечные, +2 монеты)
    SIMPLE_TASKS: [
        // 1-5 лет
        { id: 'simple_jump',         name: 'Прыжки на месте',       icon: '🤸', ageMin: 1, ageMax: 5, reward: 2 },
        { id: 'simple_clap',         name: 'Хлопки в ладоши',       icon: '👏', ageMin: 1, ageMax: 5, reward: 2 },
        // 5-10 лет
        { id: 'simple_wall_push',    name: 'Отжимания от стены',    icon: '🧱', ageMin: 5, ageMax: 10, reward: 2 },
        { id: 'simple_balance',      name: 'Стойка на одной ноге',  icon: '🦩', ageMin: 5, ageMax: 10, reward: 2 },
        // 10-15 лет
        { id: 'simple_squat',        name: 'Приседания',            icon: '🏋️', ageMin: 10, ageMax: 15, reward: 2 },
        { id: 'simple_crunch',       name: 'Скручивания',           icon: '🤸', ageMin: 10, ageMax: 15, reward: 2 },
        // 15-20 лет
        { id: 'simple_lunge',        name: 'Выпады',                icon: '🦵', ageMin: 15, ageMax: 20, reward: 2 },
        { id: 'simple_jumping_jack', name: 'Джампинг Джек',         icon: '⭐', ageMin: 15, ageMax: 20, reward: 2 },
        // 20+ лет
        { id: 'simple_plank_30',     name: 'Планка 30 сек',         icon: '⏱️', ageMin: 20, ageMax: 150, reward: 2 },
        { id: 'simple_bridge',       name: 'Ягодичный мостик',      icon: '🌉', ageMin: 20, ageMax: 150, reward: 2 },
        // Универсальные
        { id: 'simple_stretch',      name: 'Потягивания',           icon: '🤲', ageMin: 1, ageMax: 150, reward: 2 },
        { id: 'simple_walk',         name: 'Ходьба на месте',       icon: '🚶', ageMin: 1, ageMax: 150, reward: 2 },
    ],

    // Упражнения для основной тренировки по возрастным группам
    AGE_EXERCISES: {
        kids_1_5: [
            { name: 'прыжки на месте',       count: 20, min: 30, max: 60 },
            { name: 'хлопки над головой',   count: 15, min: 30, max: 50 },
            { name: 'наклоны в стороны',    count: 10, min: 25, max: 45 }
        ],
        kids_5_10: [
            { name: 'приседания с опорой',  count: 15, min: 40, max: 80 },
            { name: 'отжимания от стены',   count: 20, min: 35, max: 70 },
            { name: 'планка на коленях',    count: 1,  min: 30, max: 60 }
        ],
        teens_10_15: [
            { name: 'приседания',           count: 25, min: 50, max: 100 },
            { name: 'отжимания',            count: 15, min: 45, max: 90 },
            { name: 'скручивания',          count: 30, min: 40, max: 80 }
        ],
        youth_15_20: [
            { name: 'выпады',               count: 20, min: 55, max: 110 },
            { name: 'отжимания',            count: 25, min: 50, max: 100 },
            { name: 'планка',               count: 1,  min: 60, max: 120 }
        ],
        adults_20_plus: [
            { name: 'отжимания',            count: 30, min: 60, max: 120 },
            { name: 'приседания',           count: 40, min: 60, max: 120 },
            { name: 'планка',               count: 1,  min: 90, max: 180 }
        ]
    }
};

// Экспортируем для доступа из других файлов (в браузере это глобальная переменная)
if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
}