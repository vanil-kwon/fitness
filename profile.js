// ================================================================
// KWON FITNESS – PROFILE SYSTEM V2.1
// Профиль • Аватар • Рамка • Баннер • Титул • XP • Level
// Совместимость со старой структурой KWON FITNESS
// ================================================================


// ================================================================
// SAFE HELPERS
// ================================================================

function profileEscape(value) {
    return String(value == null ? '' : value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}


function saveCurrentUser() {
    if (!currentUser) return false;

    try {
        const users = getUsers();

        users[currentUser.nickname] = currentUser;

        saveUsers(users);

        localStorage.setItem(
            'currentUser',
            currentUser.nickname
        );

        return true;
    } catch (error) {
        console.error(
            'KWON profile save error:',
            error
        );

        return false;
    }
}


// ================================================================
// FRAME COLORS
// ================================================================

function getFrameColor(frameId) {

    const colors = {

        frame_red: '#e74c3c',

        frame_green: '#2ecc71',

        frame_blue: '#3498db',

        frame_yellow: '#f1c40f',

        frame_purple: '#9b59b6',

        frame_pink: '#e84393',

        frame_gold: '#f39c12',

        frame_silver: '#bdc3c7',

        frame_rainbow:
            'linear-gradient(45deg,#ff1744,#ff9800,#ffeb3b,#00c853,#2196f3,#7c4dff)',

        frame_neon:
            'linear-gradient(135deg,#00ffcc,#6c5ce7,#ff1744)',

        frame_diamond:
            'linear-gradient(135deg,#00d2ff,#6c5ce7,#ffffff)',

        frame_glow:
            'linear-gradient(135deg,#ffd700,#ff8c00,#e74c3c)'
    };

    return colors[frameId] || '#6c5ce7';
}


// ================================================================
// BANNER
// ================================================================

function getBannerStyle(bannerId) {

    const banners = {

        banner_red:
            'linear-gradient(135deg,#e74c3c,#c0392b)',

        banner_blue:
            'linear-gradient(135deg,#3498db,#2980b9)',

        banner_green:
            'linear-gradient(135deg,#2ecc71,#27ae60)',

        banner_yellow:
            'linear-gradient(135deg,#f1c40f,#f39c12)',

        banner_purple:
            'linear-gradient(135deg,#9b59b6,#8e44ad)',

        banner_pink:
            'linear-gradient(135deg,#e84393,#d63384)',

        banner_sunset:
            'linear-gradient(135deg,#ff6b6b,#feca57)',

        banner_space:
            'linear-gradient(135deg,#0f0c29,#302b63,#24243e)',

        banner_ocean:
            'linear-gradient(135deg,#2980b9,#6dd5fa)',

        banner_fire:
            'linear-gradient(135deg,#e74c3c,#f39c12)',

        banner_rainbow:
            'linear-gradient(45deg,#ff1744,#ff9800,#ffeb3b,#00c853,#2196f3,#7c4dff)',

        banner_gold:
            'linear-gradient(135deg,#f1c40f,#d4af37)',

        banner_neon:
            'linear-gradient(135deg,#00ffcc,#6c5ce7,#ff00cc)'
    };

    return banners[bannerId] ||
        'linear-gradient(135deg,#6c5ce7,#e74c3c)';
}


// ================================================================
// RARITY
// ================================================================

function profileGetRarity(rarity) {

    if (
        typeof CONFIG !== 'undefined' &&
        CONFIG.RARITIES &&
        CONFIG.RARITIES[rarity]
    ) {
        return CONFIG.RARITIES[rarity];
    }

    const fallback = {
        common: {
            name: 'Обычный',
            color: '#a0a0b0'
        },

        rare: {
            name: 'Редкий',
            color: '#3498db'
        },

        epic: {
            name: 'Эпический',
            color: '#9b59b6'
        },

        legendary: {
            name: 'Легендарный',
            color: '#f1c40f'
        }
    };

    return fallback[rarity] || fallback.common;
}


// ================================================================
// LEVEL
// ================================================================

function getProfileLevel(user) {

    if (!user) {
        return {
            level: 1,
            current: 0,
            required: 100,
            percent: 0,
            isMaxLevel: false
        };
    }

    const xp = Math.max(
        0,
        Number(user.xp) || 0
    );

    // Новая система из config.js
    if (
        typeof getXPProgress === 'function'
    ) {

        try {

            const data =
                getXPProgress(xp);

            user.level =
                Number(data.level) || 1;

            return data;

        } catch (error) {
            console.warn(
                'KWON XP system error:',
                error
            );
        }
    }

    // Совместимость со старой системой
    return {
        level:
            Number(user.level) || 1,

        current: 0,

        required: 100,

        percent: 0,

        isMaxLevel: false
    };
}


function updateLevelDisplay(user) {

    if (!user) return;

    const data =
        getProfileLevel(user);

    const box =
        document.getElementById(
            'levelDisplay'
        );

    if (!box) {
        return;
    }

    const percent = Math.max(
        0,
        Math.min(
            100,
            Number(data.percent) || 0
        )
    );

    box.innerHTML = `

        <div
            style="
                display:flex;
                justify-content:space-between;
                align-items:center;
                margin-bottom:8px;
            "
        >

            <strong
                style="
                    font-family:var(--font-heading);
                    font-size:18px;
                "
            >
                ⭐ LEVEL ${data.level}
            </strong>

            <span
                style="
                    color:var(--kwon-purple-light);
                    font-size:12px;
                "
            >
                ${
                    data.isMaxLevel
                        ? 'MAX'
                        : percent + '%'
                }
            </span>

        </div>

        <div
            style="
                width:100%;
                height:9px;
                background:rgba(255,255,255,.08);
                border-radius:20px;
                overflow:hidden;
            "
        >

            <div
                style="
                    width:${percent}%;
                    height:100%;
                    background:var(--brand-gradient);
                    border-radius:20px;
                    box-shadow:0 0 14px rgba(108,92,231,.7);
                    transition:width .5s ease;
                "
            ></div>

        </div>

        <div
            style="
                display:flex;
                justify-content:space-between;
                margin-top:6px;
                color:var(--text-secondary);
                font-size:11px;
            "
        >

            <span>
                ${
                    data.isMaxLevel
                        ? 'MAX LEVEL'
                        : `${data.current} / ${data.required} XP`
                }
            </span>

            <span>
                ${xpSafe(user.xp)} XP
            </span>

        </div>
    `;
}


function xpSafe(value) {
    return Math.max(
        0,
        Number(value) || 0
    );
}


// ================================================================
// HEADER AVATAR
// ================================================================

function updateHeaderAvatar() {

    if (!currentUser) return;

    const avatar =
        document.getElementById(
            'avatarDisplay'
        );

    if (!avatar) return;


    // ------------------------------------------------------------
    // Аватар
    // ------------------------------------------------------------

    let icon =
        currentUser.nickname
            ? currentUser.nickname
                .charAt(0)
                .toUpperCase()
            : '👤';


    if (currentUser.avatar) {

        try {

            const item =
                findItemById(
                    currentUser.avatar
                );

            if (
                item &&
                item.type === 'avatar'
            ) {
                icon =
                    item.icon;
            }

        } catch (error) {
            console.warn(
                'KWON avatar error:',
                error
            );
        }
    }


    avatar.textContent =
        icon;


    // ------------------------------------------------------------
    // Рамка
    // ------------------------------------------------------------

    const frame =
        getFrameColor(
            currentUser.frame
        );


    if (
        frame.indexOf('gradient') !== -1
    ) {

        avatar.style.border =
            '3px solid transparent';

        avatar.style.backgroundImage =
            `
            linear-gradient(
                var(--kwon-black),
                var(--kwon-black)
            ),
            ${frame}
            `;

        avatar.style.backgroundOrigin =
            'border-box';

        avatar.style.backgroundClip =
            'padding-box,border-box';

    } else {

        avatar.style.border =
            '3px solid ' + frame;

        avatar.style.backgroundImage =
            '';

        avatar.style.backgroundOrigin =
            '';

        avatar.style.backgroundClip =
            '';

    }


    avatar.style.boxShadow =
        '0 0 15px rgba(108,92,231,.6)';
}


// ================================================================
// OPEN PROFILE
// ================================================================

function openProfile(
    user,
    isSelf
) {

    if (!user) return;

    const modal =
        document.getElementById(
            'profileModal'
        );

    if (!modal) return;


    isSelf =
        Boolean(isSelf);


    // ------------------------------------------------------------
    // Banner
    // ------------------------------------------------------------

    const banner =
        document.getElementById(
            'profileBanner'
        );

    if (banner) {

        banner.style.background =
            getBannerStyle(
                user.banner
            );
    }


    // ------------------------------------------------------------
    // Avatar
    // ------------------------------------------------------------

    const avatar =
        document.getElementById(
            'profileAvatar'
        );

    if (avatar) {

        let icon =
            user.nickname
                ? user.nickname
                    .charAt(0)
                    .toUpperCase()
                : '👤';


        if (user.avatar) {

            try {

                const avatarItem =
                    findItemById(
                        user.avatar
                    );

                if (
                    avatarItem &&
                    avatarItem.type ===
                    'avatar'
                ) {
                    icon =
                        avatarItem.icon;
                }

            } catch (error) {}
        }


        avatar.textContent =
            icon;


        const frame =
            getFrameColor(
                user.frame
            );


        if (
            frame.indexOf('gradient') !== -1
        ) {

            avatar.style.border =
                '4px solid transparent';

            avatar.style.backgroundImage =
                `
                linear-gradient(
                    var(--kwon-black),
                    var(--kwon-black)
                ),
                ${frame}
                `;

            avatar.style.backgroundOrigin =
                'border-box';

            avatar.style.backgroundClip =
                'padding-box,border-box';

            avatar.style.boxShadow =
                '0 0 25px rgba(108,92,231,.8)';

        } else {

            avatar.style.border =
                '4px solid ' + frame;

            avatar.style.backgroundImage =
                '';

            avatar.style.backgroundOrigin =
                '';

            avatar.style.backgroundClip =
                '';

            avatar.style.boxShadow =
                '0 0 25px ' + frame;
        }
    }


    // ------------------------------------------------------------
    // Nickname
    // ------------------------------------------------------------

    const nickname =
        document.getElementById(
            'profileNickname'
        );

    if (nickname) {

        nickname.textContent =
            user.nickname || 'User';
    }


    // ------------------------------------------------------------
    // Title
    // ------------------------------------------------------------

    const title =
        document.getElementById(
            'profileTitle'
        );

    if (title) {

        let titleItem = null;

        if (user.title) {

            try {
                titleItem =
                    findItemById(
                        user.title
                    );
            } catch (error) {}
        }


        if (titleItem) {

            title.textContent =
                titleItem.name;

            const rarity =
                profileGetRarity(
                    titleItem.rarity
                );

            title.style.color =
                rarity.color;

            title.style.textShadow =
                `0 0 10px ${rarity.color}`;

        } else {

            title.textContent =
                'KWON ATHLETE';

            title.style.color =
                'var(--kwon-red-bright)';

            title.style.textShadow =
                '0 0 8px rgba(231,76,60,.5)';
        }
    }


    // ------------------------------------------------------------
    // Level
    // ------------------------------------------------------------

    const levelData =
        getProfileLevel(
            user
        );


    // ------------------------------------------------------------
    // Level box
    // ------------------------------------------------------------

    const profileBox =
        document.getElementById(
            'profileStats'
        );


    if (profileBox) {

        let rankName = '-';


        try {

            if (
                typeof getRank ===
                'function'
            ) {

                const rank =
                    getRank(
                        Number(user.points) || 0
                    );

                rankName =
                    t(
                        'rank_' +
                        rank.key
                    );
            }

        } catch (error) {}


        let goalName = '-';


        if (user.goal === 'lose') {
            goalName = 'Похудеть';
        }

        if (user.goal === 'bulk') {
            goalName = 'Накачаться';
        }

        if (user.goal === 'strength') {
            goalName = 'Стать сильнее';
        }


        let genderName = '-';


        if (user.gender === 'male') {
            genderName = 'М';
        }

        if (user.gender === 'female') {
            genderName = 'Ж';
        }


        const inventoryCount =
            Array.isArray(
                user.inventory
            )
                ? user.inventory.length
                : 0;


        profileBox.innerHTML = `

            <div class="stat-item">

                <div class="stat-value">
                    ${Number(user.points) || 0}
                </div>

                🪙
                ${profileEscape(
                    t('profile_stats_points')
                )}

            </div>


            <div class="stat-item">

                <div class="stat-value">
                    ${profileEscape(
                        rankName
                    )}
                </div>

                🏅
                ${profileEscape(
                    t('profile_stats_rank')
                )}

            </div>


            <div class="stat-item">

                <div class="stat-value">
                    ${Number(user.totalWorkouts) || 0}
                </div>

                🏋️
                ${profileEscape(
                    t('profile_stats_workouts')
                )}

            </div>


            <div class="stat-item">

                <div class="stat-value">
                    ${Number(user.streak) || 0}
                </div>

                🔥
                ${profileEscape(
                    t('profile_stats_streak')
                )}

            </div>


            <div
                class="stat-item"
                style="border-color:var(--kwon-purple);"
            >

                <div
                    class="stat-value"
                    style="
                        color:var(--kwon-purple-light);
                    "
                >
                    ${levelData.level}
                </div>

                ⭐
                ${profileEscape(
                    t('profile_stats_level')
                )}

            </div>


            <div class="stat-item">

                <div class="stat-value">
                    ${xpSafe(user.xp)}
                </div>

                ⚡ XP

            </div>


            <div class="stat-item">

                <div class="stat-value">
                    ${user.age || '-'}
                </div>

                👤
                ${profileEscape(
                    t('profile_stats_age')
                )}

            </div>


            <div class="stat-item">

                <div class="stat-value">
                    ${user.weight || '-'} кг
                </div>

                ⚖️
                ${profileEscape(
                    t('profile_stats_weight')
                )}

            </div>


            <div class="stat-item">

                <div class="stat-value">
                    ${genderName}
                </div>

                🧑
                ${profileEscape(
                    t('profile_stats_gender')
                )}

            </div>


            <div class="stat-item">

                <div class="stat-value">
                    ${profileEscape(
                        user.path || '-'
                    )}
                </div>

                🛤️
                ${profileEscape(
                    t('profile_stats_path')
                )}

            </div>


            <div class="stat-item">

                <div class="stat-value">
                    ${profileEscape(
                        goalName
                    )}
                </div>

                🎯
                ${profileEscape(
                    t('profile_stats_goal')
                )}

            </div>


            <div class="stat-item">

                <div class="stat-value">
                    ${profileEscape(
                        user.fitnessLevel || '-'
                    )}
                </div>

                📊
                ${profileEscape(
                    t('profile_stats_level')
                )}

            </div>


            <div class="stat-item">

                <div class="stat-value">
                    ${Number(user.bossFights) || 0}
                </div>

                ⚔️
                ${profileEscape(
                    t('profile_stats_boss')
                )}

            </div>


            <div class="stat-item">

                <div class="stat-value">
                    ${inventoryCount}
                </div>

                📦
                ${profileEscape(
                    t('profile_stats_inventory')
                )}

            </div>
        `;
    }


    // ------------------------------------------------------------
    // XP block
    // ------------------------------------------------------------

    updateLevelDisplay(
        user
    );


    // ------------------------------------------------------------
    // Actions
    // ------------------------------------------------------------

    const actions =
        document.getElementById(
            'profileActions'
        );


    if (actions) {

        if (isSelf) {

            actions.innerHTML = `

                <button
                    class="btn btn-sm"
                    type="button"
                    onclick="openAvatarPicker()"
                >
                    <i class="fas fa-user-circle"></i>
                    ${profileEscape(
                        t('change_avatar_btn')
                    )}
                </button>


                <button
                    class="btn btn-sm"
                    type="button"
                    onclick="openItemPicker('frame')"
                >
                    <i class="fas fa-border-all"></i>
                    ${profileEscape(
                        t('change_frame')
                    )}
                </button>


                <button
                    class="btn btn-sm"
                    type="button"
                    onclick="openItemPicker('banner')"
                >
                    <i class="fas fa-image"></i>
                    ${profileEscape(
                        t('change_banner')
                    )}
                </button>


                <button
                    class="btn btn-sm"
                    type="button"
                    onclick="openItemPicker('title')"
                >
                    <i class="fas fa-tag"></i>
                    ${profileEscape(
                        t('change_title')
                    )}
                </button>
            `;

        } else {

            actions.innerHTML =
                '';
        }
    }


    modal.style.display =
        'flex';
}


// ================================================================
// CLOSE PROFILE
// ================================================================

function closeProfileModal() {

    const modal =
        document.getElementById(
            'profileModal'
        );

    if (modal) {
        modal.style.display =
            'none';
    }
}


// ================================================================
// AVATAR PICKER
// ================================================================

function openAvatarPicker() {

    if (!currentUser) return;

    openItemPicker(
        'avatar'
    );
}


// ================================================================
// UNIVERSAL ITEM PICKER
// ================================================================

function openItemPicker(type) {

    if (!currentUser) return;

    const modal =
        document.getElementById(
            'avatarPickerModal'
        );

    const list =
        document.getElementById(
            'avatarPickerList'
        );

    if (!modal || !list) return;


    const validTypes = [
        'avatar',
        'frame',
        'banner',
        'title'
    ];


    if (
        !validTypes.includes(type)
    ) {
        return;
    }


    list.innerHTML =
        '';


    const typeNames = {

        avatar:
            currentLang === 'en'
                ? 'Avatar'
                : 'Аватар',

        frame:
            currentLang === 'en'
                ? 'Frame'
                : 'Рамка',

        banner:
            currentLang === 'en'
                ? 'Banner'
                : 'Баннер',

        title:
            currentLang === 'en'
                ? 'Title'
                : 'Титул'
    };


    const modalTitle =
        modal.querySelector(
            'h3 span'
        );


    if (modalTitle) {

        const translation =
            t(
                'item_picker_title',
                {
                    type:
                        typeNames[type]
                }
            );

        modalTitle.textContent =
            translation;
    }


    const inventory =
        Array.isArray(
            currentUser.inventory
        )
            ? currentUser.inventory
            : [];


    const items =
        inventory.filter(
            item =>
                item &&
                item.type === type
        );


    if (!items.length) {

        list.innerHTML = `

            <p
                style="
                    grid-column:1/-1;
                    color:var(--text-secondary);
                    padding:15px;
                "
            >
                ${
                    currentLang === 'en'
                        ? `No ${typeNames[type].toLowerCase()}s available`
                        : `Нет доступных предметов`
                }
            </p>
        `;

    } else {

        items.forEach(
            item => {

                const div =
                    document.createElement(
                        'div'
                    );


                div.className =
                    'avatar-picker-item';


                const rarity =
                    profileGetRarity(
                        item.rarity
                    );


                div.style.borderColor =
                    rarity.color;


                div.title =
                    item.name || '';


                const selected =
                    currentUser[type] ===
                    item.id;


                if (selected) {

                    div.style.boxShadow =
                        `
                            0 0 15px
                            ${rarity.color}
                        `;

                    div.style.transform =
                        'scale(1.05)';
                }


                div.innerHTML = `

                    <div
                        style="
                            font-size:28px;
                            line-height:1;
                        "
                    >
                        ${profileEscape(
                            item.icon ||
                            '🎁'
                        )}
                    </div>

                    <div
                        style="
                            margin-top:5px;
                            font-size:9px;
                            color:${rarity.color};
                            font-weight:700;
                        "
                    >
                        ${profileEscape(
                            rarity.name
                        )}
                    </div>
                `;


                div.addEventListener(
                    'click',
                    function () {

                        try {

                            setActiveItem(
                                currentUser,
                                type,
                                item.id
                            );


                            saveCurrentUser();


                            updateHeaderAvatar();


                            if (
                                typeof updateUI ===
                                'function'
                            ) {
                                updateUI();
                            }


                            closeAvatarPicker();


                            openProfile(
                                currentUser,
                                true
                            );


                            showToast(
                                currentLang === 'en'
                                    ? 'Item applied'
                                    : 'Предмет применён',
                                'success'
                            );

                        } catch (error) {

                            console.error(
                                'KWON item error:',
                                error
                            );

                            showToast(
                                currentLang === 'en'
                                    ? 'Could not apply item'
                                    : 'Не удалось применить предмет',
                                'error'
                            );
                        }
                    }
                );


                list.appendChild(
                    div
                );
            }
        );
    }


    modal.style.display =
        'flex';
}


// ================================================================
// REFRESH PROFILE
// ================================================================

function refreshProfile() {

    if (!currentUser) return;

    updateHeaderAvatar();

    updateLevelDisplay(
        currentUser
    );
}


// ================================================================
// GLOBAL EXPORT
// ================================================================

if (
    typeof window !== 'undefined'
) {

    window.getFrameColor =
        getFrameColor;

    window.getBannerStyle =
        getBannerStyle;

    window.updateHeaderAvatar =
        updateHeaderAvatar;

    window.updateLevelDisplay =
        updateLevelDisplay;

    window.openProfile =
        openProfile;

    window.closeProfileModal =
        closeProfileModal;

    window.openAvatarPicker =
        openAvatarPicker;

    window.closeAvatarPicker =
        closeAvatarPicker;

    window.openItemPicker =
        openItemPicker;

    window.saveCurrentUser =
        saveCurrentUser;

    window.refreshProfile =
        refreshProfile;
}


console.log(
    '👤 KWON Fitness profile.js V2.1 загружен'
);