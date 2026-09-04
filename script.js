// ==================================================
// Roblox Radio Memo
// script.js 完全修正版
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
// localStorage
// ==================================================

const NOTE_STORAGE_KEY =
"roblox_radio_personal_notes";

const FAVORITE_STORAGE_KEY =
"roblox_radio_favorites";

const VOLUME_STORAGE_KEY =
"roblox_radio_volume";

// ==================================================
// 個人メモ読み込み
// ==================================================

let personalNotes = {};

try {

const savedNotes =
    localStorage.getItem(
        NOTE_STORAGE_KEY
    );

if (savedNotes) {

    const parsed =
        JSON.parse(savedNotes);

    if (
        parsed &&
        typeof parsed === "object" &&
        !Array.isArray(parsed)
    ) {

        personalNotes = parsed;

    }

}

} catch (error) {
console.warn(
    "個人メモを読み込めませんでした。",
    error
);

personalNotes = {};

}
// ==================================================
// お気に入り読み込み
// ==================================================

let favorites = new Set();

try {

const savedFavorites =
    localStorage.getItem(
        FAVORITE_STORAGE_KEY
    );

if (savedFavorites) {

    const parsed =
        JSON.parse(savedFavorites);

    if (Array.isArray(parsed)) {

        favorites =
            new Set(
                parsed.map(
                    id => String(id)
                )
            );

    }

}

} catch (error) {
console.warn(
    "お気に入りを読み込めませんでした。",
    error
);

favorites = new Set();

}
// ==================================================
// 音量読み込み
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

} catch (error) {
console.warn(
    "音量を読み込めませんでした。",
    error
);

volume = 25;

}
// ==================================================
// HTMLエスケープ
// ==================================================

function escapeHTML(value) {

    return String(value == null ? "" : value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}
// ==================================================
// URLチェック
// ==================================================

function safeURL(url) {

if (!url) {

    return "";

}

const value =
    String(url).trim();

if (!value) {

    return "";

}


// ------------------------------------------
// MP3などの相対パス
// ------------------------------------------

if (
    value.startsWith("./") ||
    value.startsWith("../") ||
    value.startsWith("sounds/")
) {

    return value;

}


// ------------------------------------------
// http / https のみ許可
// ------------------------------------------

try {

    const parsed =
        new URL(
            value,
            window.location.href
        );

    if (
        parsed.protocol === "http:" ||
        parsed.protocol === "https:"
    ) {

        return parsed.href;

    }

} catch (error) {

    return "";

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

return String(
    radio.id
);

}
// ==================================================
// お気に入り保存
// ==================================================

function saveFavorites() {

try {

    localStorage.setItem(
        FAVORITE_STORAGE_KEY,
        JSON.stringify(
            Array.from(favorites)
        )
    );

} catch (error) {

    console.warn(
        "お気に入りを保存できませんでした。",
        error
    );

}

}
// ==================================================
// お気に入り切り替え
// ==================================================

function toggleFavorite(id) {

const key =
    String(id);

if (favorites.has(key)) {

    favorites.delete(key);

} else {

    favorites.add(key);

}

saveFavorites();

}
// ==================================================
// 時間表示
// ==================================================

function formatTime(seconds) {

if (
    !Number.isFinite(seconds) ||
    seconds < 0
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
    ).padStart(
        2,
        "0"
    )
);

}
// ==================================================
// 音量UI
// ==================================================

function updateVolumeUI() {

if (volumeSlider) {

    volumeSlider.value =
        String(volume);

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

if (
    !Number.isFinite(
        numericValue
    )
) {

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


try {

    localStorage.setItem(
        VOLUME_STORAGE_KEY,
        String(volume)
    );

} catch (error) {

    console.warn(
        "音量を保存できませんでした。",
        error
    );

}


if (currentAudio) {

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

const tags =
    new Set();

radios.forEach(
    radio => {

        const radioTags =
            Array.isArray(
                radio.tags
            )
                ? radio.tags
                : [];

        radioTags.forEach(
            tag => {

                const value =
                    String(
                        tag
                    ).trim();

                if (value) {

                    tags.add(
                        value
                    );

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

        button.type =
            "button";

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
                    selectedTags.has(
                        tag
                    )
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
                selectedTags.has(
                    tag
                )
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

            if (!type) {

                return;

            }


            if (
                selectedTypes.has(
                    type
                )
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
                selectedTypes.has(
                    type
                )
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
    String(
        name ?? ""
    ).trim();

if (!text) {

    return 4;

}

const first =
    text.charAt(0);


// ------------------------------------------
// アルファベット
// ------------------------------------------

if (
    /[A-Za-zＡ-Ｚａ-ｚ]/.test(
        first
    )
) {

    return 1;

}


// ------------------------------------------
// 数字
// ------------------------------------------

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


// ------------------------------------------
// 漢字・カタカナ・その他
// ------------------------------------------

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


return String(
    a.name
).localeCompare(
    String(
        b.name
    ),
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


    default:

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
        ? String(
            searchInput.value || ""
        )
            .trim()
            .toLocaleLowerCase(
                "ja-JP"
            )
        : "";


const filtered =
    radios.filter(
        radio => {

            // ------------------------------------------
            // 検索対象
            // ------------------------------------------

            const searchText = [

                radio.name,

                radio.id,

                radio.soundSourceUrl,

                radio.officialUrl,

                radio.type,

                ...(Array.isArray(
                    radio.tags
                )
                    ? radio.tags
                    : []),

                personalNotes[
                    getRadioKey(
                        radio
                    )
                ] || ""

            ]
                .filter(
                    value =>
                        value !== null &&
                        value !== undefined
                )
                .join(" ")
                .toLocaleLowerCase(
                    "ja-JP"
                );


            // ------------------------------------------
            // キーワード
            // ------------------------------------------

            const keywordMatch =
                !keyword ||
                searchText.includes(
                    keyword
                );


            // ------------------------------------------
            // タイプ
            // ------------------------------------------

            let typeMatch =
                true;

            if (
                selectedTypes.size > 0
            ) {

                typeMatch =
                    selectedTypes.has(
                        String(
                            radio.type
                        )
                    );

            }


            // ------------------------------------------
            // タグ
            // ------------------------------------------

            let tagMatch =
                true;

            if (
                selectedTags.size > 0
            ) {

                const radioTags =
                    Array.isArray(
                        radio.tags
                    )
                        ? radio.tags.map(
                            tag =>
                                String(
                                    tag
                                )
                        )
                        : [];


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

            let favoriteMatch =
                true;

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
    !currentRadioId ||
    !radioList
) {

    return;

}


const buttons =
    radioList.querySelectorAll(
        ".play-button"
    );


let button =
    null;


buttons.forEach(
    item => {

        if (
            String(
                item.dataset.radioId
            ) ===
            String(
                currentRadioId
            )
        ) {

            button =
                item;

        }

    }
);


if (!button) {

    currentButton =
        null;

    currentProgress =
        null;

    currentTimeElement =
        null;

    currentDurationElement =
        null;

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


// ------------------------------------------
// ボタン状態
// ------------------------------------------

button.textContent =
    currentAudio.paused
        ? "▶"
        : "Ⅱ";


// ------------------------------------------
// 再生時間
// ------------------------------------------

updateCurrentAudioUI();

}
// ==================================================
// 現在のAudio UI更新
// ==================================================

function updateCurrentAudioUI() {

if (!currentAudio) {

    return;

}


if (
    currentProgress &&
    Number.isFinite(
        currentAudio.duration
    ) &&
    currentAudio.duration > 0
) {

    currentProgress.value =
        (
            currentAudio.currentTime /
            currentAudio.duration
        ) * 100;

}


if (currentTimeElement) {

    currentTimeElement.textContent =
        formatTime(
            currentAudio.currentTime
        );

}


if (
    currentDurationElement &&
    Number.isFinite(
        currentAudio.duration
    )
) {

    currentDurationElement.textContent =
        formatTime(
            currentAudio.duration
        );

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


// ------------------------------------------
// 0件
// ------------------------------------------

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


// ------------------------------------------
// カード生成
// ------------------------------------------

list.forEach(
    radio => {

        const card =
            document.createElement(
                "article"
            );

        card.className =
            "radio-card";


        const key =
            getRadioKey(
                radio
            );


        const savedNote =
            personalNotes[key] || "";


        const isFavorite =
            favorites.has(
                key
            );


        // ------------------------------------------
        // タグ
        // ------------------------------------------

        const tagsHTML =
            (
                Array.isArray(
                    radio.tags
                )
                    ? radio.tags
                    : []
            )
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


        // ------------------------------------------
        // MP3
        // ------------------------------------------

        const mp3 =
            safeURL(
                radio.mp3
            );


        let playerHTML =
            "";


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

                            <span class="current-time">0:00</span>

                            /

                            <span class="duration">0:00</span>

                        </div>

                    </div>

                </div>

            `;

        }


        // ------------------------------------------
        // サウンド元URL
        // ------------------------------------------

        const soundSource =
            safeURL(
                radio.soundSourceUrl
            );


        let soundSourceHTML =
            "";


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

        // ------------------------------------------
        // カード本体
        // ------------------------------------------

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
        `;


        radioList.appendChild(
            card
        );

    }
);


// ------------------------------------------
// 再生中Audioを新しいカードへ接続
// ------------------------------------------

reconnectCurrentAudio();


// ------------------------------------------
// プログレスイベント
// ------------------------------------------

setupProgressEvents();


// ------------------------------------------
// MP3の長さ取得
// ------------------------------------------

loadDurations();

}
// ==================================================
// MP3の長さを取得
// ==================================================

function loadDurations() {

if (!radioList) {

    return;

}


radioList
    .querySelectorAll(
        ".play-button"
    )
    .forEach(
        button => {

            const url =
                button.dataset.url;

            if (!url) {

                return;

            }


            const player =
                button.closest(
                    ".player-area"
                );


            if (!player) {

                return;

            }


            const durationElement =
                player.querySelector(
                    ".duration"
                );


            if (!durationElement) {

                return;

            }


            // ------------------------------------------
            // 現在再生中
            // ------------------------------------------

            if (
                currentAudio &&
                String(
                    currentRadioId
                ) ===
                String(
                    button.dataset.radioId
                )
            ) {

                if (
                    Number.isFinite(
                        currentAudio.duration
                    )
                ) {

                    durationElement.textContent =
                        formatTime(
                            currentAudio.duration
                        );

                }

                return;

            }


            // ------------------------------------------
            // メタデータだけ読み込む
            // ------------------------------------------

            const audio =
                new Audio();


            audio.preload =
                "metadata";


            audio.addEventListener(
                "loadedmetadata",
                () => {

                    if (
                        Number.isFinite(
                            audio.duration
                        )
                    ) {

                        durationElement.textContent =
                            formatTime(
                                audio.duration
                            );

                    }


                    audio.removeAttribute(
                        "src"
                    );

                    audio.load();

                },
                {
                    once: true
                }
            );


            audio.addEventListener(
                "error",
                () => {

                    audio.removeAttribute(
                        "src"
                    );

                },
                {
                    once: true
                }
            );


            audio.src =
                url;

        }
    );

}
// ==================================================
// 検索
// ==================================================

if (searchInput) {

searchInput.addEventListener(
    "input",
    () => {

        applyFilters();

    }
);

}
// ==================================================
// 並び替え
// ==================================================

if (sortSelect) {

sortSelect.addEventListener(
    "change",
    () => {

        applyFilters();

    }
);

}
// ==================================================
// フィルター適用
// ==================================================

function applyFilters() {

const filtered =
    getFilteredRadios();

displayRadios(
    filtered
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

            if (!id) {

                return;

            }


            toggleFavorite(
                id
            );


            const isFavorite =
                favorites.has(
                    id
                );


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

            if (!tag) {

                return;

            }


            if (
                selectedTags.has(
                    tag
                )
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


        if (!id) {

            return;

        }


        try {

            if (
                navigator.clipboard &&
                typeof navigator.clipboard.writeText ===
                    "function"
            ) {

                await navigator.clipboard.writeText(
                    id
                );

            } else {

                throw new Error(
                    "Clipboard API unavailable"
                );

            }


            showCopySuccess(
                button
            );

        } catch (error) {

            // ------------------------------------------
            // Clipboard APIが使えない場合
            // ------------------------------------------

            try {

                const textarea =
                    document.createElement(
                        "textarea"
                    );


                textarea.value =
                    id;

                textarea.style.position =
                    "fixed";

                textarea.style.left =
                    "-9999px";

                textarea.style.top =
                    "0";

                textarea.style.opacity =
                    "0";


                document.body.appendChild(
                    textarea
                );


                textarea.focus();

                textarea.select();


                const success =
                    document.execCommand(
                        "copy"
                    );


                textarea.remove();


                if (!success) {

                    throw new Error(
                        "Copy failed"
                    );

                }


                showCopySuccess(
                    button
                );

            } catch (copyError) {

                alert(
                    "IDをコピーできませんでした。"
                );

            }

        }

    }
);

}
// ==================================================
// コピー成功表示
// ==================================================

function showCopySuccess(button) {

button.textContent =
    "コピー済";


setTimeout(
    () => {

        if (
            button.isConnected
        ) {

            button.textContent =
                "コピー";

        }

    },
    1000
);

}

// ==================================================
// 個人メモ自動保存
// ==================================================

function savePersonalNote(textarea) {

    if (!textarea) {
        return;
    }

    const key =
        textarea.dataset.key;

    if (!key) {
        return;
    }

    personalNotes[key] =
        textarea.value;

    try {

        localStorage.setItem(
            NOTE_STORAGE_KEY,
            JSON.stringify(
                personalNotes
            )
        );

    } catch (error) {

        console.warn(
            "メモ保存エラー",
            error
        );

    }

}


// ==================================================
// メモ入力時に自動保存
// ==================================================

if (radioList) {

    radioList.addEventListener(
        "input",
        event => {

            const textarea =
                event.target.closest(
                    ".personal-note-input"
                );

            if (!textarea) {
                return;
            }

            savePersonalNote(
                textarea
            );

        }
    );


    // ==============================================
    // Ctrl + Enter でも保存
    // ==============================================

    radioList.addEventListener(
        "keydown",
        event => {

            const textarea =
                event.target.closest(
                    ".personal-note-input"
                );

            if (!textarea) {
                return;
            }


            if (
                event.key === "Enter" &&
                event.ctrlKey
            ) {

                savePersonalNote(
                    textarea
                );

                event.preventDefault();

            }

        }
    );

}
// ==================================================
// プログレスバー
// ==================================================

function setupProgressEvents() {

if (!radioList) {

    return;

}


radioList
    .querySelectorAll(
        ".progress-bar"
    )
    .forEach(
        progress => {

            // ------------------------------------------
            // 二重登録防止
            // ------------------------------------------

            if (
                progress.dataset.progressReady ===
                "true"
            ) {

                return;

            }


            progress.dataset.progressReady =
                "true";


            progress.addEventListener(
                "input",
                () => {

                    // ------------------------------------------
                    // 現在再生中のAudioではない
                    // ------------------------------------------

                    if (
                        !currentAudio ||
                        currentProgress !==
                            progress
                    ) {

                        return;

                    }


                    // ------------------------------------------
                    // duration未取得
                    // ------------------------------------------

                    if (
                        !Number.isFinite(
                            currentAudio.duration
                        ) ||
                        currentAudio.duration <= 0
                    ) {

                        return;

                    }


                    const percent =
                        Number(
                            progress.value
                        ) / 100;


                    currentAudio.currentTime =
                        currentAudio.duration *
                        percent;


                    if (
                        currentTimeElement
                    ) {

                        currentTimeElement.textContent =
                            formatTime(
                                currentAudio.currentTime
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
radioId,
button,
progress,
currentTime,
duration
) {

if (!url) {

    return;

}


const id =
    String(
        radioId
    );


// ==========================================
// 同じ音源
// ==========================================

if (
    currentAudio &&
    currentRadioId === id
) {

    currentButton =
        button;

    currentProgress =
        progress;

    currentTimeElement =
        currentTime;

    currentDurationElement =
        duration;


    if (
        currentAudio.paused
    ) {

        currentAudio
            .play()
            .then(
                () => {

                    if (
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
                        currentButton
                    ) {

                        currentButton.textContent =
                            "▶";

                    }

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
    new Audio(
        url
    );


audio.preload =
    "metadata";


audio.volume =
    volume / 100;


currentAudio =
    audio;

currentRadioId =
    id;

currentButton =
    button;

currentProgress =
    progress;

currentTimeElement =
    currentTime;

currentDurationElement =
    duration;


// ==========================================
// メタデータ読み込み完了
// ==========================================

audio.addEventListener(
    "loadedmetadata",
    () => {

        if (
            Number.isFinite(
                audio.duration
            )
        ) {

            if (duration) {

                duration.textContent =
                    formatTime(
                        audio.duration
                    );

            }

        }

    }
);


// ==========================================
// 再生時間更新
// ==========================================

audio.addEventListener(
    "timeupdate",
    () => {

        if (
            currentAudio !== audio
        ) {

            return;

        }


        if (
            Number.isFinite(
                audio.duration
            ) &&
            audio.duration > 0
        ) {

            if (currentProgress) {

                currentProgress.value =
                    (
                        audio.currentTime /
                        audio.duration
                    ) * 100;

            }

        }


        if (currentTimeElement) {

            currentTimeElement.textContent =
                formatTime(
                    audio.currentTime
                );

        }

    }
);


// ==========================================
// 再生開始
// ==========================================

audio.addEventListener(
    "play",
    () => {

        if (
            currentAudio === audio &&
            currentButton
        ) {

            currentButton.textContent =
                "Ⅱ";

        }

    }
);


// ==========================================
// 一時停止
// ==========================================

audio.addEventListener(
    "pause",
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


// ==========================================
// 再生終了
// ==========================================

audio.addEventListener(
    "ended",
    () => {

        if (
            currentAudio !== audio
        ) {

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
// エラー
// ==========================================

audio.addEventListener(
    "error",
    () => {

        if (
            currentAudio !== audio
        ) {

            return;

        }


        if (button) {

            button.textContent =
                "▶";

        }


        alert(
            "このサウンドの音源が見つからないため、再生できません。"
        );


        clearCurrentAudio();

    }
);


// ==========================================
// 再生
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
        error => {

            console.warn(
                "MP3再生に失敗しました。",
                error
            );


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
// 現在のAudioをクリア
// ==================================================

function clearCurrentAudio() {

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

} catch (error) {

    // 無視

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


clearCurrentAudio();

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


        menuButton.setAttribute(
            "aria-expanded",
            String(
                !isClosed
            )
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
