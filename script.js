// ==================================================
// Roblox Radio Memo
// script.js 完全版
// ==================================================
//
// ・MP3試聴
// ・音量 0～100%（初期25%）
// ・音量をブラウザに保存
// ・お気に入り
// ・個人メモ
// ・IDコピー
// ・タグ検索
// ・キーワード検索
// ・音楽 / 効果音フィルター
// ・名前順 / 古い順 / 新しい順
// ・並び替え中も再生状態を維持
// ==================================================


// ==================================================
// サウンドデータ
// ==================================================

const radios = [

    {
        name: "MESMERIZER / メズマライザー (Clown Remix)",
        id: "71934965392436",
        type: "music",
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
        mp3: "sounds/76819270320985.mp3",
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
        mp3: "sounds/92292285830973.mp3",
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
        mp3: "sounds/120871403922972.mp3",
        soundSourceUrl:
            "https://create.roblox.com/store/asset/120871403922972/CUTEMAKMAKFUNK-Slowed",
        officialUrl:
            "https://youtu.be/abwf-BdPFsQ?si=oS-r8xhUNXreV9On",
        tags: [
            "日本",
            "ボカロ",
            "Phonk"
        ]
    },

    {
        name: "Parry Gripp - Raining Tacos",
        id: "142376088",
        type: "music",
        mp3: "",
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
        mp3: "",
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
        mp3: "",
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
        mp3: "",
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
        mp3: "",
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
        mp3: "",
        soundSourceUrl:
            "https://create.roblox.com/store/asset/114087038177872/kyukurarin64",
        officialUrl: "",
        tags: [
            "日本",
            "ボカロ"
        ]
    }

];


// ==================================================
// localStorage
// ==================================================

const NOTE_STORAGE_KEY =
    "roblox_radio_personal_notes";

const FAVORITE_STORAGE_KEY =
    "roblox_radio_favorites";

const VOLUME_STORAGE_KEY =
    "roblox_radio_volume";


// ==================================================
// 個人メモ
// ==================================================

let personalNotes = {};

try {

    personalNotes = JSON.parse(
        localStorage.getItem(
            NOTE_STORAGE_KEY
        ) || "{}"
    );

} catch {

    personalNotes = {};

}


// ==================================================
// お気に入り
// ==================================================

let favorites = new Set();

try {

    const savedFavorites =
        JSON.parse(
            localStorage.getItem(
                FAVORITE_STORAGE_KEY
            ) || "[]"
        );

    favorites = new Set(
        savedFavorites.map(
            id => String(id)
        )
    );

} catch {

    favorites = new Set();

}


// ==================================================
// 音量
// ==================================================

let volume = 25;

try {

    const savedVolume =
        localStorage.getItem(
            VOLUME_STORAGE_KEY
        );

    if (savedVolume !== null) {

        const parsed =
            Number(savedVolume);

        if (Number.isFinite(parsed)) {

            volume =
                Math.max(
                    0,
                    Math.min(
                        100,
                        parsed
                    )
                );

        }

    }

} catch {

    volume = 25;

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

    url = String(url).trim();

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

const volumeSlider =
    document.getElementById(
        "volumeSlider"
    );

const volumeValue =
    document.getElementById(
        "volumeValue"
    );


// ==================================================
// フィルター状態
// ==================================================

const selectedTypes =
    new Set();

const selectedTags =
    new Set();

let favoriteOnly = false;


// ==================================================
// 現在再生中の情報
// ==================================================

let currentAudio = null;

let currentRadioId = null;

let currentProgress = null;

let currentTimeElement = null;

let currentDurationElement = null;

let currentButton = null;


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

    if (!Number.isFinite(seconds)) {
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
// 音量UI
// ==================================================

function updateVolumeUI() {

    if (volumeSlider) {

        volumeSlider.value =
            volume;

    }

    if (volumeValue) {

        volumeValue.textContent =
            volume + "%";

    }

}


// ==================================================
// 音量変更
// ==================================================

function setVolume(value) {

    const numericValue =
        Number(value);

    if (!Number.isFinite(numericValue)) {
        return;
    }

    volume =
        Math.max(
            0,
            Math.min(
                100,
                numericValue
            )
        );

    localStorage.setItem(
        VOLUME_STORAGE_KEY,
        String(volume)
    );

    if (currentAudio) {

        // Audio.volume は 0～1
        currentAudio.volume =
            volume / 100;

    }

    updateVolumeUI();

}


// ==================================================
// 音量バー
// ==================================================

if (volumeSlider) {

    volumeSlider.min = "0";
    volumeSlider.max = "100";
    volumeSlider.step = "1";

    volumeSlider.addEventListener(
        "input",
        () => {

            setVolume(
                volumeSlider.value
            );

        }
    );

}

updateVolumeUI();


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

    if (!tagFilters) {
        return;
    }

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
// 音楽 / 効果音フィルター
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
// 名前の種類
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

    if (
        /[A-Za-zＡ-Ｚａ-ｚ]/.test(
            first
        )
    ) {

        return 1;

    }

    if (
        /[0-9０-９]/.test(
            first
        )
    ) {

        return 2;

    }

    if (
        /[\u3040-\u309F]/.test(
            first
        )
    ) {

        return 3;

    }

    return 4;

}


// ==================================================
// 名前順
// ==================================================

function compareName(a, b) {

    const categoryA =
        getNameCategory(
            a.name
        );

    const categoryB =
        getNameCategory(
            b.name
        );

    if (
        categoryA !== categoryB
    ) {

        return (
            categoryA -
            categoryB
        );

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

        case "name":

            sorted.sort(
                compareName
            );

            break;

        case "oldest":

            sorted.sort(
                (a, b) =>
                    radios.indexOf(a) -
                    radios.indexOf(b)
            );

            break;

        case "newest":

            sorted.sort(
                (a, b) =>
                    radios.indexOf(b) -
                    radios.indexOf(a)
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
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";

    const filtered =
        radios.filter(
            radio => {

                const searchText = [

    radio.name,
    radio.id,
    radio.soundSourceUrl,
    radio.officialUrl,
    radio.type,
    ...(radio.tags || []),

    // 個人メモも検索対象にする
    personalNotes[getRadioKey(radio)] || ""

]
.join(" ")
.toLowerCase();

                const keywordMatch =
                    !keyword ||
                    searchText.includes(
                        keyword
                    );

                let typeMatch = true;

                if (
                    selectedTypes.size > 0
                ) {

                    typeMatch =
                        selectedTypes.has(
                            radio.type
                        );

                }

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

                let favoriteMatch = true;

                if (favoriteOnly) {

                    favoriteMatch =
                        favorites.has(
                            getRadioKey(
                                radio
                            )
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
// 再生中のカードを再接続
// ==================================================

function reconnectCurrentAudio() {

    if (
        !currentAudio ||
        !currentRadioId
    ) {

        return;

    }

    const button =
        radioList.querySelector(
            `.play-button[data-radio-id="${CSS.escape(currentRadioId)}"]`
        );

    if (!button) {

        currentButton = null;
        currentProgress = null;
        currentTimeElement = null;
        currentDurationElement = null;

        return;

    }

    const player =
        button.closest(
            ".player-area"
        );

    if (!player) {
        return;
    }

    currentButton =
        button;

    currentProgress =
        player.querySelector(
            ".progress-bar"
        );

    currentTimeElement =
        player.querySelector(
            ".current-time"
        );

    currentDurationElement =
        player.querySelector(
            ".duration"
        );

    // 再生 / 一時停止状態を反映
    button.textContent =
        currentAudio.paused
            ? "▶"
            : "Ⅱ";

    // 再生時間を反映
    if (
        Number.isFinite(
            currentAudio.duration
        )
    ) {

        if (currentProgress) {

            currentProgress.value =
                currentAudio.duration > 0
                    ? (
                        currentAudio.currentTime /
                        currentAudio.duration
                    ) * 100
                    : 0;

        }

        if (currentTimeElement) {

            currentTimeElement.textContent =
                formatTime(
                    currentAudio.currentTime
                );

        }

        if (currentDurationElement) {

            currentDurationElement.textContent =
                formatTime(
                    currentAudio.duration
                );

        }

    }

}


// ==================================================
// 一覧表示
// ==================================================

function displayRadios(list) {

    if (!radioList) {
        return;
    }

    radioList.innerHTML = "";

    if (list.length === 0) {

        if (noResult) {

            noResult.style.display =
                "block";

        }

        return;

    }

    if (noResult) {

        noResult.style.display =
            "none";

    }

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

            // MP3がある場合だけ再生ボタンを表示
            if (mp3) {

                playerHTML = `

                    <div class="player-area">

                        <button
                            type="button"
                            class="play-button"
                            data-url="${escapeHTML(mp3)}"
                            data-radio-id="${escapeHTML(key)}"
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

</div>


<textarea
    class="personal-note-input open"
    data-key="${escapeHTML(key)}"
    placeholder="自分用のメモ..."
>${escapeHTML(savedNote)}</textarea>


<button
    type="button"
    class="save-note-button open"
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


    // ==========================================
    // 再生中のAudioを新しいカードへ接続
    // ==========================================

    reconnectCurrentAudio();

}


// ==================================================
// 検索
// ==================================================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        applyFilters
    );

}


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

if (radioList) {

    radioList.addEventListener(
        "click",
        event => {

            // ==========================================
            // お気に入り
            // ==========================================

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

                if (
                    favoriteOnly &&
                    !isFavorite
                ) {

                    applyFilters();

                }

                return;

            }


            // ==========================================
            // タグ
            // ==========================================

            const tagButton =
                event.target.closest(
                    ".card-tag"
                );

            if (tagButton) {

                const tag =
                    tagButton.dataset.tag;

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

                return;

            }


            // ==========================================
            // 再生ボタン
            // ==========================================

            const playButton =
                event.target.closest(
                    ".play-button"
                );

            if (playButton) {

                const url =
                    playButton.dataset.url;

                const radioId =
                    playButton.dataset.radioId;

                const player =
                    playButton.closest(
                        ".player-area"
                    );

                if (!player) {
                    return;
                }

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
                    radioId,
                    playButton,
                    progress,
                    currentTime,
                    duration
                );

                return;

            }

        }
    );

}


// ==================================================
// IDコピー
// ==================================================

if (radioList) {

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

}


// ==================================================
// 個人メモ
// ==================================================

if (radioList) {

    radioList.addEventListener(
        "click",
        event => {

            // ==========================================
            // 編集
            // ==========================================

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

                if (saveButton) {

                    saveButton.classList.toggle(
                        "open"
                    );

                }

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


            // ==========================================
            // 保存
            // ==========================================

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

}


// ==================================================
// プログレスバー
// ==================================================

function setupProgressEvents() {

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
                            !currentAudio ||
                            currentProgress !== progress
                        ) {

                            return;

                        }

                        if (
                            !Number.isFinite(
                                currentAudio.duration
                            )
                        ) {

                            return;

                        }

                        currentAudio.currentTime =
                            currentAudio.duration *
                            (
                                Number(
                                    progress.value
                                ) / 100
                            );

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
    radioId,
    button,
    progress,
    currentTime,
    duration
) {

    if (!url) {
        return;
    }


    // ==========================================
    // 同じ音源の場合
    // ==========================================

    if (
        currentAudio &&
        currentRadioId === String(radioId)
    ) {

        currentButton =
            button;

        currentProgress =
            progress;

        currentTimeElement =
            currentTime;

        currentDurationElement =
            duration;


        if (currentAudio.paused) {

            currentAudio
                .play()
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

                    }
                );

        } else {

            currentAudio.pause();

            button.textContent =
                "▶";

        }

        return;

    }


    // ==========================================
    // 前の音源を停止
    // ==========================================

    stopCurrentAudio();


    // ==========================================
    // 新しいAudio
    // ==========================================

    const audio =
        new Audio(url);


    // 重要：
    // Audio.volume は 0～1
    audio.volume =
        volume / 100;


    currentAudio =
        audio;

    currentRadioId =
        String(radioId);

    currentButton =
        button;

    currentProgress =
        progress;

    currentTimeElement =
        currentTime;

    currentDurationElement =
        duration;


    // ==========================================
    // 読み込み完了
    // ==========================================

    audio.addEventListener(
        "loadedmetadata",
        () => {

            if (
                Number.isFinite(
                    audio.duration
                )
            ) {

                duration.textContent =
                    formatTime(
                        audio.duration
                    );

            }

        }
    );


    // ==========================================
    // 再生時間
    // ==========================================

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

            // 現在のカードが再接続後のものでも更新
            if (
                currentAudio === audio &&
                currentProgress
            ) {

                currentProgress.value =
                    (
                        audio.currentTime /
                        audio.duration
                    ) * 100;

            }

            if (
                currentAudio === audio &&
                currentTimeElement
            ) {

                currentTimeElement.textContent =
                    formatTime(
                        audio.currentTime
                    );

            }

        }
    );


    // ==========================================
    // 再生終了
    // ==========================================

    audio.addEventListener(
        "ended",
        () => {

            if (currentAudio !== audio) {
                return;
            }

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

            currentRadioId =
                null;

            currentButton =
                null;

            currentProgress =
                null;

            currentTimeElement =
                null;

            currentDurationElement =
                null;

        }
    );


    // ==========================================
    // MP3読み込みエラー
    // ==========================================

    audio.addEventListener(
        "error",
        () => {

            if (currentAudio !== audio) {
                return;
            }

            if (button) {

                button.textContent =
                    "▶";

            }

            alert(
                "このサウンドの音源が見つからないため、再生できません。"
            );

            currentAudio =
                null;

            currentRadioId =
                null;

            currentButton =
                null;

            currentProgress =
                null;

            currentTimeElement =
                null;

            currentDurationElement =
                null;

        }
    );


    // ==========================================
    // 再生開始
    // ==========================================

    audio.play()
        .then(
            () => {

                if (
                    currentAudio === audio &&
                    currentButton
                ) {

                    currentButton.textContent =
                        "Ⅱ";

                }

            }
        )
        .catch(
            () => {

                if (
                    currentAudio === audio &&
                    currentButton
                ) {

                    currentButton.textContent =
                        "▶";

                }

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

    const audio =
        currentAudio;

    audio.pause();

    try {

        audio.currentTime =
            0;

    } catch {

    }


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

    currentRadioId =
        null;

    currentButton =
        null;

    currentProgress =
        null;

    currentTimeElement =
        null;

    currentDurationElement =
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


if (
    menuButton &&
    sidebar &&
    main
) {

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

}


// ==================================================
// 初期化
// ==================================================

createTagFilters();

updateTagButtons();

updateVolumeUI();

displayRadios(
    getFilteredRadios()
);

// プログレスバーのイベントを設定
setupProgressEvents();
