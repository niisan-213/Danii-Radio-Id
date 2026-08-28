// ==================================================
// Roblox Radio Memo
// ==================================================
//
// mp3
// → サイト内で試聴するMP3
//
// soundSourceUrl
// → サウンドを見つけた場所
//
// officialUrl
// → 本家URL
//
// ID
// → RobloxのサウンドID
//
// メモ
// → 各自のブラウザだけに保存
//
// お気に入り
// → 各自のブラウザだけに保存
// ==================================================


// ==================================================
// サウンドデータ
// ==================================================

const radios = [

    {
        name: "MESMERIZER / メズマライザー (Clown Remix)",
        id: "71934965392436",
        type: "music",

        addedAt: "2026-08-20",

        mp3: "sounds/71934965392436.mp3",

        soundSourceUrl:
            "https://create.roblox.com/store/asset/71934965392436/MESMERIZER-Clown-Remix",

        officialUrl:
            "https://youtu.be/ZMtrVf3ncmA",

        tags: [
            "日本",
            "ボカロ"
        ]
    },


    {
        name: "nMisaki - Dubidubidu (Uptempo Remix)",
        id: "16190783444",
        type: "music",

        addedAt: "2026-08-20",

        mp3: "sounds/16190783444.mp3",

        soundSourceUrl:
            "https://create.roblox.com/store/asset/16190783444/nMisaki-Dubidubidu-Uptempo-Remix",

        officialUrl:
            "https://youtu.be/ld9rLLLBYmI?si=B5YdQwmz5Jm3RDuA",

        tags: [
            "ミーム"
        ]
    },


    {
        name: "F-L-Y | Hatsune Miku【Vocaloid Reimagined】Day 1",
        id: "76819270320985",
        type: "music",

        addedAt: "2026-08-20",

        mp3: "sounds/.mp3",

        soundSourceUrl:
            "https://create.roblox.com/store/asset/76819270320985/FLY-Hatsune-MikuVocaloid-ReimaginedDay-1",

        officialUrl:
            "https://youtu.be/6t4qe1ZcmKI?si=nvEwxJyD1jPrDOuw",

        tags: [
            "ボカロ"
        ]
    },


    {
        name: "Monitoring Remix (inspired by Deco27)",
        id: "92292285830973",
        type: "music",

        addedAt: "2026-08-20",

        mp3: "sounds/.mp3",

        soundSourceUrl:
            "https://create.roblox.com/store/asset/92292285830973/Monitoring-Remix-inspired-by-Deco27",

        officialUrl:
            "https://youtu.be/8M8sJINVlAQ?si=Gi-mVunCoyIBHms0",

        tags: [
            "日本",
            "ボカロ"
        ]
    },


    {
        name: "CUTEMAKMAKFUNK (Slowed)",
        id: "120871403922972",
        type: "music",

        addedAt: "2026-08-20",

        mp3: "sounds/.mp3",

        soundSourceUrl:
            "https://create.roblox.com/store/asset/120871403922972/CUTEMAKMAKFUNK-Slowed",

        officialUrl:
            "https://youtu.be/abwf-BdPFsQ?si=oS-r8xhUNXreV9On",

        tags: [
            "日本",
            "ボカロ"
        ]
    },


    {
        name: "Parry Gripp - Raining Tacos",
        id: "142376088",
        type: "music",

        addedAt: "2026-08-20",

        mp3: "sounds/.mp3",

        soundSourceUrl:
            "https://create.roblox.com/store/asset/142376088/Parry-Gripp-Raining-Tacos",

        officialUrl:
            "https://youtu.be/npjF032TDDQ?si=RWPLV-2XdcH5KjBN",

        tags: []
    },


    {
        name: "RainTemple",
        id: "110829045185545",
        type: "music",

        addedAt: "2026-08-20",

        mp3: "sounds/.mp3",

        soundSourceUrl:
            "https://create.roblox.com/store/asset/110829045185545/RainTemple",

        officialUrl: "",

        tags: [
            "日本"
        ]
    },

    {
        name: "Looping In The Backrooms (Remix)",
        id: "76580060470689",
        type: "music",

        addedAt: "2026-08-20",

        mp3: "sounds/.mp3",

        soundSourceUrl:
            "https://create.roblox.com/store/asset/76580060470689/Looping-In-The-Backrooms-Remix",

        officialUrl: "",

        tags: [
            "日本",
            "ボカロ"
        ]
    },

    {
        name: "melodia de verão (tiktok edit)",
        id: "118507373399694",
        type: "music",

        addedAt: "2026-08-20",

        mp3: "sounds/.mp3",

        soundSourceUrl:
            "https://create.roblox.com/store/asset/118507373399694/melodia-de-vero-tiktok-edit",

        officialUrl:
            "https://youtu.be/eN54PQhfRc8?si=XGSKeZ2asyL4cMAN",

        tags: [
            "Phonk"
        ]
    },

    {
        name: "Monet",
        id: "88583608079509",
        type: "music",

        addedAt: "2026-08-20",

        mp3: "sounds/.mp3",

        soundSourceUrl:
            "https://create.roblox.com/store/asset/88583608079509/Monet",

        officialUrl: "",

        tags: [
            "日本",
            "ボカロ"
        ]
    },

    {
        name: "kyu-kurarin64",
        id: "114087038177872",
        type: "music",

        addedAt: "2026-08-20",

        mp3: "sounds/.mp3",

        soundSourceUrl:
            "https://create.roblox.com/store/asset/114087038177872/kyukurarin64",

        officialUrl: "",

        tags: [
            "日本",
            "ボカロ"
        ]
    },

];


// ==================================================
// ローカル保存
// ==================================================

const NOTE_STORAGE_KEY =
    "roblox_radio_personal_notes";

const FAVORITE_STORAGE_KEY =
    "roblox_radio_favorites";


let personalNotes = {};

let favorites = new Set();


try {

    personalNotes = JSON.parse(
        localStorage.getItem(
            NOTE_STORAGE_KEY
        ) || "{}"
    );

} catch {

    personalNotes = {};

}


try {

    const savedFavorites =
        JSON.parse(
            localStorage.getItem(
                FAVORITE_STORAGE_KEY
            ) || "[]"
        );

    favorites =
        new Set(
            savedFavorites.map(
                id => String(id)
            )
        );

} catch {

    favorites = new Set();

}


// ==================================================
// HTMLエスケープ
// ==================================================

function escapeHTML(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


// ==================================================
// URLチェック
// ==================================================

function safeURL(url) {

    if (!url) {
        return "";
    }


    if (
        url.startsWith("./") ||
        url.startsWith("../") ||
        url.startsWith("sounds/")
    ) {

        return url;

    }


    try {

        const parsed =
            new URL(url);


        if (
            parsed.protocol === "http:" ||
            parsed.protocol === "https:"
        ) {

            return parsed.href;

        }

    } catch {

    }


    return "";

}


// ==================================================
// DOM
// ==================================================

const radioList =
    document.getElementById(
        "radioList"
    );


const noResult =
    document.getElementById(
        "noResult"
    );


const searchInput =
    document.getElementById(
        "searchInput"
    );


const tagFilters =
    document.getElementById(
        "tagFilters"
    );


const typeButtons =
    document.querySelectorAll(
        ".type-filter"
    );


const favoriteFilter =
    document.getElementById(
        "favoriteFilter"
    );


const sortSelect =
    document.getElementById(
        "sortSelect"
    );


// ==================================================
// 選択中フィルター
// ==================================================

const selectedTypes =
    new Set();


const selectedTags =
    new Set();


let favoriteOnly = false;


// ==================================================
// 現在再生中
// ==================================================

let currentAudio = null;

let currentButton = null;

let currentProgress = null;

let currentTimeElement = null;


// ==================================================
// IDをキーにする
// ==================================================

function getRadioKey(radio) {

    return String(radio.id);

}


// ==================================================
// お気に入り保存
// ==================================================

function saveFavorites() {

    localStorage.setItem(
        FAVORITE_STORAGE_KEY,
        JSON.stringify(
            Array.from(favorites)
        )
    );

}


// ==================================================
// お気に入り切り替え
// ==================================================

function toggleFavorite(id) {

    id = String(id);


    if (favorites.has(id)) {

        favorites.delete(id);

    } else {

        favorites.add(id);

    }


    saveFavorites();

}


// ==================================================
// 時間表示
// ==================================================

function formatTime(seconds) {

    if (
        !Number.isFinite(seconds)
    ) {

        return "0:00";

    }


    const minutes =
        Math.floor(
            seconds / 60
        );


    const remaining =
        Math.floor(
            seconds % 60
        );


    return (
        minutes +
        ":" +
        String(
            remaining
        ).padStart(2, "0")
    );

}


// ==================================================
// 全タグ取得
// ==================================================

function getAllTags() {

    const tags = new Set();


    radios.forEach(
        radio => {

            (
                radio.tags || []
            ).forEach(
                tag => {

                    tag =
                        String(tag).trim();


                    if (tag) {

                        tags.add(tag);

                    }

                }
            );

        }
    );


    return Array.from(tags).sort(
        (a, b) =>
            a.localeCompare(
                b,
                "ja"
            )
    );

}


// ==================================================
// タグボタン生成
// ==================================================

function createTagFilters() {

    tagFilters.innerHTML = "";


    getAllTags().forEach(
        tag => {

            const button =
                document.createElement(
                    "button"
                );


            button.type = "button";

            button.className =
                "tag-filter";

            button.textContent =
                tag;

            button.dataset.tag =
                tag;


            button.addEventListener(
                "click",
                () => {

                    if (
                        selectedTags.has(tag)
                    ) {

                        selectedTags.delete(
                            tag
                        );

                    } else {

                        selectedTags.add(
                            tag
                        );

                    }


                    updateTagButtons();

                    applyFilters();

                }
            );


            tagFilters.appendChild(
                button
            );

        }
    );

}


// ==================================================
// 音楽・効果音
// ==================================================

typeButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                const type =
                    button.dataset.type;


                if (
                    selectedTypes.has(type)
                ) {

                    selectedTypes.delete(
                        type
                    );

                } else {

                    selectedTypes.add(
                        type
                    );

                }


                button.classList.toggle(
                    "active",
                    selectedTypes.has(type)
                );


                applyFilters();

            }
        );

    }
);


// ==================================================
// お気に入りフィルター
// ==================================================

if (favoriteFilter) {

    favoriteFilter.addEventListener(
        "click",
        () => {

            favoriteOnly =
                !favoriteOnly;


            favoriteFilter.classList.toggle(
                "active",
                favoriteOnly
            );


            applyFilters();

        }
    );

}


// ==================================================
// 名前の種類を判定
//
// 1 = アルファベット
// 2 = 数字
// 3 = ひらがな
// 4 = 漢字・その他
// ==================================================

function getNameCategory(name) {

    const text =
        String(name ?? "").trim();


    if (!text) {
        return 4;
    }


    const first =
        text.charAt(0);


    // アルファベット
    if (
        /[A-Za-zＡ-Ｚａ-ｚ]/.test(first)
    ) {

        return 1;

    }


    // 数字
    if (
        /[0-9０-９]/.test(first)
    ) {

        return 2;

    }


    // ひらがな
    if (
        /[\u3040-\u309F]/.test(first)
    ) {

        return 3;

    }


    // 漢字・その他
    return 4;

}


// ==================================================
// 名前順
//
// アルファベット
// ↓
// 数字
// ↓
// ひらがな
// ↓
// 漢字
// ==================================================

function compareName(a, b) {

    const categoryA =
        getNameCategory(a.name);

    const categoryB =
        getNameCategory(b.name);


    if (categoryA !== categoryB) {

        return categoryA - categoryB;

    }


    return String(a.name).localeCompare(
        String(b.name),
        "ja",
        {
            numeric: true,
            sensitivity: "base"
        }
    );

}


// ==================================================
// 並び替え
// ==================================================

function sortRadios(list) {

    const sortType =
        sortSelect
            ? sortSelect.value
            : "name";


    const sorted =
        [...list];


    switch (sortType) {

        // ------------------------------------------
        // 名前順
        // アルファベット → 数字 → ひらがな → 漢字
        // ------------------------------------------

        case "name":

            sorted.sort(
                compareName
            );

            break;


        // ------------------------------------------
        // 古い順
        // ------------------------------------------

        case "oldest":

            sorted.sort(
                (a, b) =>
                    String(a.addedAt || "")
                        .localeCompare(
                            String(b.addedAt || "")
                        )
            );

            break;


        // ------------------------------------------
        // 新しい順
        // ------------------------------------------

        case "newest":

            sorted.sort(
                (a, b) =>
                    String(b.addedAt || "")
                        .localeCompare(
                            String(a.addedAt || "")
                        )
            );

            break;

    }


    return sorted;

}


// ==================================================
// フィルター
// ==================================================

function getFilteredRadios() {

    const keyword =
        searchInput.value
            .trim()
            .toLowerCase();


    const filtered =
        radios.filter(
            radio => {

                // ------------------------------------------
                // キーワード
                // ------------------------------------------

                const searchText = [

                    radio.name,

                    radio.id,

                    radio.soundSourceUrl,

                    radio.officialUrl,

                    radio.type,

                    ...(radio.tags || [])

                ]
                    .join(" ")
                    .toLowerCase();


                const keywordMatch =
                    !keyword ||
                    searchText.includes(
                        keyword
                    );


                // ------------------------------------------
                // 音楽・効果音
                // ------------------------------------------

                let typeMatch = true;


                if (
                    selectedTypes.size > 0
                ) {

                    typeMatch =
                        selectedTypes.has(
                            radio.type
                        );

                }


                // ------------------------------------------
                // タグ
                // ------------------------------------------

                let tagMatch = true;


                if (
                    selectedTags.size > 0
                ) {

                    const radioTags =
                        radio.tags || [];


                    tagMatch =
                        Array.from(
                            selectedTags
                        ).some(
                            tag =>
                                radioTags.includes(
                                    tag
                                )
                        );

                }


                // ------------------------------------------
                // お気に入り
                // ------------------------------------------

                let favoriteMatch = true;


                if (favoriteOnly) {

                    favoriteMatch =
                        favorites.has(
                            getRadioKey(radio)
                        );

                }


                return (
                    keywordMatch &&
                    typeMatch &&
                    tagMatch &&
                    favoriteMatch
                );

            }
        );


    return sortRadios(
        filtered
    );

}


// ==================================================
// 一覧表示
// ==================================================

function displayRadios(list) {

    radioList.innerHTML = "";


    if (
        list.length === 0
    ) {

        noResult.style.display =
            "block";

        return;

    }


    noResult.style.display =
        "none";


    list.forEach(
        radio => {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "radio-card";


            const key =
                getRadioKey(radio);


            const savedNote =
                personalNotes[key] || "";


            const isFavorite =
                favorites.has(key);


            // ==========================================
            // タグ
            // ==========================================

            const tagsHTML =
                (radio.tags || [])
                    .map(
                        tag => `

                            <button
                                type="button"
                                class="card-tag"
                                data-tag="${escapeHTML(tag)}"
                            >
                                ${escapeHTML(tag)}
                            </button>

                        `
                    )
                    .join("");


            // ==========================================
            // MP3
            // ==========================================

            const mp3 =
                safeURL(
                    radio.mp3
                );


            let playerHTML = "";


            if (mp3) {

                playerHTML = `

                    <div class="player-area">

                        <button
                            type="button"
                            class="play-button"
                            data-url="${escapeHTML(mp3)}"
                        >
                            ▶
                        </button>


                        <div class="audio-progress">

                            <input
                                class="progress-bar"
                                type="range"
                                min="0"
                                max="100"
                                step="0.1"
                                value="0"
                            >


                            <div class="time">

                                <span class="current-time">
                                    0:00
                                </span>

                                /

                                <span class="duration">
                                    0:00
                                </span>

                            </div>

                        </div>

                    </div>

                `;

            }


            // ==========================================
            // サウンド元URL
            // ==========================================

            const soundSource =
                safeURL(
                    radio.soundSourceUrl
                );


            let soundSourceHTML = "";


            if (soundSource) {

                soundSourceHTML = `

                    <a
                        class="url-text"
                        href="${escapeHTML(soundSource)}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        ${escapeHTML(soundSource)}
                    </a>

                `;

            }


            // ==========================================
            // 本家URL
            // ==========================================

            const official =
                safeURL(
                    radio.officialUrl
                );


            let officialHTML = "";


            if (official) {

                officialHTML = `

                    <a
                        class="url-text"
                        href="${escapeHTML(official)}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        ${escapeHTML(official)}
                    </a>

                `;

            }


            // ==========================================
            // カード
            // ==========================================

            card.innerHTML = `

                <div class="card-header">

                    <h2 class="radio-name">
                        ${escapeHTML(
                            radio.name
                        )}
                    </h2>


                    <button
                        type="button"
                        class="favorite-button ${
                            isFavorite
                                ? "active"
                                : ""
                        }"
                        data-id="${escapeHTML(key)}"
                        aria-label="${
                            isFavorite
                                ? "お気に入りを解除"
                                : "お気に入りに追加"
                        }"
                        title="${
                            isFavorite
                                ? "お気に入りを解除"
                                : "お気に入りに追加"
                        }"
                    >
                        ${
                            isFavorite
                                ? "★"
                                : "☆"
                        }
                    </button>

                </div>


                <div class="id-area">

                    <span class="radio-id">
                        ${escapeHTML(
                            radio.id
                        )}
                    </span>


                    <button
                        type="button"
                        class="copy-button"
                        data-id="${escapeHTML(
                            radio.id
                        )}"
                    >
                        コピー
                    </button>

                </div>


                <div class="card-tags">

                    ${tagsHTML}

                </div>


                ${playerHTML}


                <div class="url-area">

                    <p class="url-label">
                        サウンド元
                    </p>

                    ${soundSourceHTML}

                </div>


                <div class="url-area">

                    <p class="url-label">
                        本家URL
                    </p>

                    ${officialHTML}

                </div>


                <div class="note-area">

                    <p class="note-label">
                        メモ
                    </p>


                    <button
                        type="button"
                        class="note-edit-button"
                        data-key="${escapeHTML(key)}"
                    >
                        編集
                    </button>

                </div>


                <textarea
                    class="personal-note-input"
                    data-key="${escapeHTML(key)}"
                    placeholder="自分用のメモ..."
                >${escapeHTML(savedNote)}</textarea>


                <button
                    type="button"
                    class="save-note-button"
                    data-key="${escapeHTML(key)}"
                >
                    保存
                </button>

            `;


            radioList.appendChild(
                card
            );

        }
    );


    setupAudioEvents();

}


// ==================================================
// 検索
// ==================================================

searchInput.addEventListener(
    "input",
    applyFilters
);


// ==================================================
// 並び替え
// ==================================================

if (sortSelect) {

    sortSelect.addEventListener(
        "change",
        applyFilters
    );

}


// ==================================================
// フィルター適用
// ==================================================

function applyFilters() {

    displayRadios(
        getFilteredRadios()
    );

}


// ==================================================
// カードクリック
// ==================================================

radioList.addEventListener(
    "click",
    event => {

        // ------------------------------------------
        // お気に入り
        // ------------------------------------------

        const favoriteButton =
            event.target.closest(
                ".favorite-button"
            );


        if (favoriteButton) {

            const id =
                favoriteButton.dataset.id;


            toggleFavorite(id);


            const isFavorite =
                favorites.has(id);


            favoriteButton.classList.toggle(
                "active",
                isFavorite
            );


            favoriteButton.textContent =
                isFavorite
                    ? "★"
                    : "☆";


            favoriteButton.setAttribute(
                "aria-label",
                isFavorite
                    ? "お気に入りを解除"
                    : "お気に入りに追加"
            );


            favoriteButton.setAttribute(
                "title",
                isFavorite
                    ? "お気に入りを解除"
                    : "お気に入りに追加"
            );


            // お気に入りだけ表示中なら
            // 解除したカードを消す
            if (
                favoriteOnly &&
                !isFavorite
            ) {

                applyFilters();

            }


            return;

        }


        // ------------------------------------------
        // タグ
        // ------------------------------------------

        const tagButton =
            event.target.closest(
                ".card-tag"
            );


        if (!tagButton) {
            return;
        }


        const tag =
            tagButton.dataset.tag;


        if (
            selectedTags.has(tag)
        ) {

            selectedTags.delete(tag);

        } else {

            selectedTags.add(tag);

        }


        updateTagButtons();

        applyFilters();

    }
);


// ==================================================
// タグ選択状態
// ==================================================

function updateTagButtons() {

    document
        .querySelectorAll(
            ".tag-filter"
        )
        .forEach(
            button => {

                const tag =
                    button.dataset.tag;


                button.classList.toggle(
                    "active",
                    selectedTags.has(tag)
                );

            }
        );

}


// ==================================================
// IDコピー
// ==================================================

radioList.addEventListener(
    "click",
    async event => {

        const button =
            event.target.closest(
                ".copy-button"
            );


        if (!button) {
            return;
        }


        const id =
            button.dataset.id;


        try {

            await navigator.clipboard
                .writeText(id);


            button.textContent =
                "コピー済";


            setTimeout(
                () => {

                    button.textContent =
                        "コピー";

                },
                1000
            );

        } catch {

            alert(
                "IDをコピーできませんでした。"
            );

        }

    }
);


// ==================================================
// 個人メモ
// ==================================================

radioList.addEventListener(
    "click",
    event => {

        // ------------------------------------------
        // 編集
        // ------------------------------------------

        const editButton =
            event.target.closest(
                ".note-edit-button"
            );


        if (editButton) {

            const key =
                editButton.dataset.key;


            const textarea =
                radioList.querySelector(
                    `.personal-note-input[data-key="${CSS.escape(key)}"]`
                );


            const saveButton =
                radioList.querySelector(
                    `.save-note-button[data-key="${CSS.escape(key)}"]`
                );


            if (!textarea) {
                return;
            }


            textarea.classList.toggle(
                "open"
            );


            saveButton.classList.toggle(
                "open"
            );


            if (
                textarea.classList.contains(
                    "open"
                )
            ) {

                editButton.textContent =
                    "閉じる";

                textarea.focus();

            } else {

                editButton.textContent =
                    "編集";

            }


            return;

        }


        // ------------------------------------------
        // 保存
        // ------------------------------------------

        const saveButton =
            event.target.closest(
                ".save-note-button"
            );


        if (!saveButton) {
            return;
        }


        const key =
            saveButton.dataset.key;


        const textarea =
            radioList.querySelector(
                `.personal-note-input[data-key="${CSS.escape(key)}"]`
            );


        if (!textarea) {
            return;
        }


        personalNotes[key] =
            textarea.value;


        localStorage.setItem(
            NOTE_STORAGE_KEY,
            JSON.stringify(
                personalNotes
            )
        );


        saveButton.textContent =
            "保存しました";


        setTimeout(
            () => {

                saveButton.textContent =
                    "保存";

            },
            1000
        );

    }
);


// ==================================================
// MP3プレイヤー
// ==================================================

function setupAudioEvents() {

    document
        .querySelectorAll(
            ".play-button"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const url =
                            button.dataset.url;


                        const player =
                            button.closest(
                                ".player-area"
                            );


                        const progress =
                            player.querySelector(
                                ".progress-bar"
                            );


                        const currentTime =
                            player.querySelector(
                                ".current-time"
                            );


                        const duration =
                            player.querySelector(
                                ".duration"
                            );


                        playMP3(
                            url,
                            button,
                            progress,
                            currentTime,
                            duration
                        );

                    }
                );

            }
        );


    document
        .querySelectorAll(
            ".progress-bar"
        )
        .forEach(
            progress => {

                progress.addEventListener(
                    "input",
                    () => {

                        if (
                            currentAudio &&
                            currentProgress === progress &&
                            Number.isFinite(
                                currentAudio.duration
                            )
                        ) {

                            currentAudio.currentTime =
                                currentAudio.duration *
                                (
                                    progress.value /
                                    100
                                );

                        }

                    }
                );

            }
        );

}


// ==================================================
// MP3再生
// ==================================================

function playMP3(
    url,
    button,
    progress,
    currentTime,
    duration
) {

    // 同じMP3
    if (
        currentAudio &&
        currentButton === button
    ) {

        if (
            currentAudio.paused
        ) {

            currentAudio
                .play()
                .then(
                    () => {

                        button.textContent =
                            "Ⅱ";

                    }
                );

        } else {

            currentAudio.pause();

            button.textContent =
                "▶";

        }


        return;

    }


    // 前のMP3を停止
    stopCurrentAudio();


    const audio =
        new Audio(url);


    currentAudio =
        audio;

    currentButton =
        button;

    currentProgress =
        progress;

    currentTimeElement =
        currentTime;


    audio.addEventListener(
        "loadedmetadata",
        () => {

            duration.textContent =
                formatTime(
                    audio.duration
                );

        }
    );


    audio.addEventListener(
        "timeupdate",
        () => {

            if (
                !audio.duration ||
                !Number.isFinite(
                    audio.duration
                )
            ) {

                return;

            }


            progress.value =
                (
                    audio.currentTime /
                    audio.duration
                ) * 100;


            currentTime.textContent =
                formatTime(
                    audio.currentTime
                );

        }
    );


    audio.addEventListener(
        "ended",
        () => {

            button.textContent =
                "▶";


            progress.value =
                0;


            currentTime.textContent =
                "0:00";


            currentAudio =
                null;

            currentButton =
                null;

            currentProgress =
                null;

            currentTimeElement =
                null;

        }
    );


    audio.addEventListener(
        "error",
        () => {

            button.textContent =
                "▶";


            alert(
                "MP3を読み込めませんでした。"
            );

        }
    );


    audio.play()
        .then(
            () => {

                button.textContent =
                    "Ⅱ";

            }
        )
        .catch(
            () => {

                button.textContent =
                    "▶";


                alert(
                    "MP3を再生できませんでした。"
                );

            }
        );

}


// ==================================================
// 現在のMP3を停止
// ==================================================

function stopCurrentAudio() {

    if (!currentAudio) {
        return;
    }


    currentAudio.pause();

    currentAudio.currentTime =
        0;


    if (currentButton) {

        currentButton.textContent =
            "▶";

    }


    if (currentProgress) {

        currentProgress.value =
            0;

    }


    if (currentTimeElement) {

        currentTimeElement.textContent =
            "0:00";

    }


    currentAudio =
        null;

    currentButton =
        null;

    currentProgress =
        null;

    currentTimeElement =
        null;

}


// ==================================================
// 左メニュー開閉
// ==================================================

const menuButton =
    document.getElementById(
        "menuButton"
    );


const sidebar =
    document.querySelector(
        ".sidebar"
    );


const main =
    document.querySelector(
        ".main"
    );


menuButton.addEventListener(
    "click",
    () => {

        const isClosed =
            sidebar.classList.toggle(
                "closed"
            );


        main.classList.toggle(
            "sidebar-closed",
            isClosed
        );

    }
);


// ==================================================
// 初期化
// ==================================================

createTagFilters();

displayRadios(
    getFilteredRadios()
);