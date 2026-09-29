const STORAGE_KEY =
    "RobloxRadioIDMemo_personalData";

const SOUND_FOLDER =
    "sounds/";

const JACKET_FOLDER =
    "jacket/";

const DEFAULT_JACKET =
    "jacket/None.png";

const ROBLOX_URL =
    "https://create.roblox.com/store/asset/";


const personalData =
    loadPersonalData();

let currentAudio = null;

let favoriteOnly = false;


const radioList =
    document.getElementById("radioList");

const radioCount =
    document.getElementById("radioCount");

const emptyMessage =
    document.getElementById("emptyMessage");

const searchInput =
    document.getElementById("searchInput");

const favoriteFilterButton =
    document.getElementById(
        "favoriteFilterButton"
    );

const toast =
    document.getElementById("toast");


// =========================================
// 初期表示
// =========================================

renderRadios();


// =========================================
// 検索
// =========================================

searchInput.addEventListener(
    "input",
    () => {
        renderRadios();
    }
);


// =========================================
// お気に入りフィルター
// =========================================

favoriteFilterButton.addEventListener(
    "click",
    () => {

        favoriteOnly =
            !favoriteOnly;

        favoriteFilterButton
            .classList
            .toggle(
                "active",
                favoriteOnly
            );

        favoriteFilterButton.textContent =
            favoriteOnly
                ? "★ お気に入りのみ"
                : "☆ お気に入り";

        renderRadios();
    }
);


// =========================================
// ラジオデータ作成
// =========================================

function createRadioData(radio) {

    const id =
        String(radio.id).trim();

    return {

        id: id,

        title:
            radio.title || "曲名不明",

        uploader:
            radio.uploader ||
            "アップロード者不明",

        mp3:
            `${SOUND_FOLDER}${id}.mp3`,

        jacket:
            `${JACKET_FOLDER}${id}.png`,

        robloxUrl:
            `${ROBLOX_URL}${id}`
    };
}


// =========================================
// 音源一覧取得
// =========================================

function getRadioList() {

    return radios
        .filter(
            (radio) => {

                return radio &&
                    radio.id !== undefined &&
                    String(
                        radio.id
                    ).trim() !== "";
            }
        )
        .map(
            (radio) => {

                return createRadioData(
                    radio
                );
            }
        );
}


// =========================================
// localStorage
// =========================================

function loadPersonalData() {

    try {

        const saved =
            localStorage.getItem(
                STORAGE_KEY
            );

        if (!saved) {
            return {};
        }

        const parsed =
            JSON.parse(saved);

        if (
            !parsed ||
            typeof parsed !== "object"
        ) {
            return {};
        }

        return parsed;

    } catch (error) {

        console.error(
            "保存データの読み込みに失敗しました:",
            error
        );

        return {};
    }
}


function savePersonalData() {

    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(
                personalData
            )
        );

    } catch (error) {

        console.error(
            "保存に失敗しました:",
            error
        );

        showToast(
            "保存できませんでした"
        );
    }
}


function getPersonalData(id) {

    if (!personalData[id]) {

        personalData[id] = {

            favorite: false,

            memo: ""
        };
    }

    return personalData[id];
}


// =========================================
// 一覧表示
// =========================================

function renderRadios() {

    const radioData =
        getRadioList();

    const keyword =
        searchInput.value
            .trim()
            .toLowerCase();

    const filteredRadios =
        radioData.filter(
            (radio) => {

                const personal =
                    getPersonalData(
                        radio.id
                    );

                // お気に入りのみ
                if (
                    favoriteOnly &&
                    !personal.favorite
                ) {
                    return false;
                }

                // 検索なし
                if (!keyword) {
                    return true;
                }

                // タグは検索対象から完全削除
                const searchableText = [

                    radio.id,

                    radio.title,

                    radio.uploader,

                    personal.memo

                ]
                    .join(" ")
                    .toLowerCase();

                return searchableText
                    .includes(keyword);
            }
        );


    radioList.innerHTML = "";


    radioCount.textContent =
        `${filteredRadios.length} / ${radioData.length} 件`;


    if (
        filteredRadios.length === 0
    ) {

        emptyMessage
            .classList
            .remove("hidden");

        return;
    }


    emptyMessage
        .classList
        .add("hidden");


    filteredRadios.forEach(
        (radio) => {

            const card =
                createRadioCard(
                    radio
                );

            radioList.appendChild(
                card
            );
        }
    );
}


// =========================================
// カード作成
// =========================================

function createRadioCard(radio) {

    const personal =
        getPersonalData(
            radio.id
        );


    const card =
        document.createElement(
            "article"
        );

    card.className =
        "radio-card";

    card.dataset.id =
        radio.id;


    // =====================================
    // 上部
    // =====================================

    const top =
        document.createElement(
            "div"
        );

    top.className =
        "radio-top";


    // =====================================
    // ジャケット
    // =====================================

    const jacket =
        document.createElement(
            "img"
        );

    jacket.className =
        "jacket";

    jacket.src =
        radio.jacket;

    jacket.alt =
        `${radio.title} ジャケット`;


    jacket.addEventListener(
        "error",
        () => {

            if (
                jacket.src.endsWith(
                    "/None.png"
                )
            ) {

                jacket.remove();


                const placeholder =
                    document.createElement(
                        "div"
                    );

                placeholder.className =
                    "jacket jacket-placeholder";

                placeholder.textContent =
                    "♪";


                top.insertBefore(
                    placeholder,
                    top.firstChild
                );

                return;
            }


            jacket.src =
                DEFAULT_JACKET;
        }
    );


    // =====================================
    // 情報
    // =====================================

    const info =
        document.createElement(
            "div"
        );

    info.className =
        "radio-info";


    const titleRow =
        document.createElement(
            "div"
        );

    titleRow.className =
        "radio-title-row";


    const title =
        document.createElement(
            "h2"
        );

    title.className =
        "radio-title";

    title.textContent =
        radio.title;


    // =====================================
    // お気に入り
    // =====================================

    const favoriteButton =
        document.createElement(
            "button"
        );

    favoriteButton.className =
        "favorite-button";


    updateFavoriteButton(
        favoriteButton,
        personal.favorite
    );


    favoriteButton.addEventListener(
        "click",
        () => {

            const data =
                getPersonalData(
                    radio.id
                );


            data.favorite =
                !data.favorite;


            savePersonalData();


            updateFavoriteButton(
                favoriteButton,
                data.favorite
            );


            if (
                favoriteOnly &&
                !data.favorite
            ) {

                renderRadios();
            }


            showToast(
                data.favorite
                    ? "お気に入りに追加しました"
                    : "お気に入りから外しました"
            );
        }
    );


    titleRow.appendChild(
        title
    );

    titleRow.appendChild(
        favoriteButton
    );


    // =====================================
    // アップロード者
    // =====================================

    const uploader =
        document.createElement(
            "p"
        );

    uploader.className =
        "radio-uploader";

    uploader.textContent =
        `アップロード者: ${radio.uploader}`;


    // =====================================
    // ID
    // =====================================

    const idRow =
        document.createElement(
            "div"
        );

    idRow.className =
        "id-row";


    const idText =
        document.createElement(
            "span"
        );

    idText.className =
        "radio-id";

    idText.textContent =
        `ID: ${radio.id}`;


    // =====================================
    // IDコピー
    // =====================================

    const copyIdButton =
        document.createElement(
            "button"
        );

    copyIdButton.className =
        "copy-id-button";

    copyIdButton.textContent =
        "コピー";

    copyIdButton.title =
        "IDをコピー";


    copyIdButton.addEventListener(
        "click",
        async () => {

            const success =
                await copyText(
                    radio.id
                );


            if (success) {

                copyIdButton.textContent =
                    "コピー済み";


                showToast(
                    `ID ${radio.id} をコピーしました`
                );


                setTimeout(
                    () => {

                        copyIdButton.textContent =
                            "コピー";

                    },
                    1200
                );

            } else {

                showToast(
                    "IDをコピーできませんでした"
                );
            }
        }
    );


    idRow.appendChild(
        idText
    );

    idRow.appendChild(
        copyIdButton
    );


    info.appendChild(
        titleRow
    );

    info.appendChild(
        uploader
    );

    info.appendChild(
        idRow
    );


    top.appendChild(
        jacket
    );

    top.appendChild(
        info
    );


    // =====================================
    // プレイヤー
    // =====================================

    const player =
        document.createElement(
            "div"
        );

    player.className =
        "player";


    const audio =
        document.createElement(
            "audio"
        );

    audio.preload =
        "metadata";

    audio.src =
        radio.mp3;


    // =====================================
    // コントロール
    // =====================================

    const playerControls =
        document.createElement(
            "div"
        );

    playerControls.className =
        "player-controls";


    // =====================================
    // 再生ボタン
    // =====================================

    const playButton =
        document.createElement(
            "button"
        );

    playButton.className =
        "play-button";

    playButton.textContent =
        "▶";

    playButton.title =
        "再生";


    // =====================================
    // 時間
    // =====================================

    const currentTime =
        document.createElement(
            "span"
        );

    currentTime.className =
        "time";

    currentTime.textContent =
        "0:00 / 0:00";


    // =====================================
    // プログレスバー
    // =====================================

    const progressArea =
        document.createElement(
            "div"
        );

    progressArea.className =
        "progress-area";


    const progressTrack =
        document.createElement(
            "div"
        );

    progressTrack.className =
        "progress-track";


    const progressFill =
        document.createElement(
            "div"
        );

    progressFill.className =
        "progress-fill";


    const progressInput =
        document.createElement(
            "input"
        );

    progressInput.className =
        "progress-input";

    progressInput.type =
        "range";

    progressInput.min =
        "0";

    progressInput.max =
        "0";

    progressInput.step =
        "0.01";

    progressInput.value =
        "0";


    progressArea.appendChild(
        progressTrack
    );

    progressArea.appendChild(
        progressFill
    );

    progressArea.appendChild(
        progressInput
    );


    playerControls.appendChild(
        playButton
    );

    playerControls.appendChild(
        currentTime
    );

    playerControls.appendChild(
        progressArea
    );


    player.appendChild(
        audio
    );

    player.appendChild(
        playerControls
    );


    // =====================================
    // Robloxページ
    // =====================================

    const externalLink =
        document.createElement(
            "a"
        );

    externalLink.className =
        "external-link";

    externalLink.href =
        radio.robloxUrl;

    externalLink.target =
        "_blank";

    externalLink.rel =
        "noopener noreferrer";

    externalLink.textContent =
        "Robloxのページを開く";


    player.appendChild(
        externalLink
    );


    // =====================================
    // 個人エリア
    // =====================================

    const personalArea =
        document.createElement(
            "div"
        );

    personalArea.className =
        "personal-area";


    const personalTitle =
        document.createElement(
            "div"
        );

    personalTitle.className =
        "personal-title";


    // =====================================
    // メモ
    // =====================================

    const memoLabel =
        document.createElement(
            "label"
        );

    memoLabel.className =
        "memo-label";


    const memoInput =
        document.createElement(
            "textarea"
        );

    memoInput.className =
        "memo-input";

    memoInput.placeholder =
        "メモ";

    memoInput.value =
        personal.memo;


    let memoTimer =
        null;


    memoInput.addEventListener(
        "input",
        () => {

            clearTimeout(
                memoTimer
            );


            memoTimer =
                setTimeout(
                    () => {

                        const data =
                            getPersonalData(
                                radio.id
                            );


                        data.memo =
                            memoInput.value;


                        savePersonalData();

                    },
                    300
                );
        }
    );


    personalArea.appendChild(
        personalTitle
    );

    personalArea.appendChild(
        memoLabel
    );

    personalArea.appendChild(
        memoInput
    );


    // =====================================
    // カード完成
    // =====================================

    card.appendChild(
        top
    );

    card.appendChild(
        player
    );

    card.appendChild(
        personalArea
    );


    // =====================================
    // 音声イベント
    // =====================================

    audio.addEventListener(
        "loadedmetadata",
        () => {

            if (
                Number.isFinite(
                    audio.duration
                )
            ) {

                progressInput.max =
                    String(
                        audio.duration
                    );

                updateProgress();
            }
        }
    );


    audio.addEventListener(
        "timeupdate",
        () => {

            updateProgress();
        }
    );


    audio.addEventListener(
        "play",
        () => {

            playButton.textContent =
                "⏸";

            playButton.title =
                "一時停止";
        }
    );


    audio.addEventListener(
        "pause",
        () => {

            playButton.textContent =
                "▶";

            playButton.title =
                "再生";
        }
    );


    audio.addEventListener(
        "ended",
        () => {

            audio.currentTime =
                0;

            updateProgress();

            playButton.textContent =
                "▶";

            playButton.title =
                "再生";

            if (
                currentAudio === audio
            ) {
                currentAudio = null;
            }
        }
    );


    // =====================================
    // 再生 / 一時停止
    // =====================================

    playButton.addEventListener(
        "click",
        async () => {

            if (
                currentAudio &&
                currentAudio !== audio
            ) {

                currentAudio.pause();
            }


            currentAudio =
                audio;


            try {

                if (audio.paused) {

                    await audio.play();

                } else {

                    audio.pause();
                }

            } catch (error) {

                console.error(
                    "再生に失敗しました:",
                    error
                );

                showToast(
                    "音源を再生できませんでした"
                );
            }
        }
    );


    // =====================================
    // シーク
    // =====================================

    progressInput.addEventListener(
        "input",
        () => {

            const newTime =
                Number(
                    progressInput.value
                );


            if (
                Number.isFinite(
                    newTime
                )
            ) {

                audio.currentTime =
                    newTime;

                updateProgress();
            }
        }
    );


    // =====================================
    // 再生位置更新
    // =====================================

    function updateProgress() {

        const duration =
            Number.isFinite(
                audio.duration
            )
                ? audio.duration
                : 0;


        const current =
            Number.isFinite(
                audio.currentTime
            )
                ? audio.currentTime
                : 0;


        if (duration > 0) {

            progressInput.max =
                String(duration);


            progressInput.value =
                String(
                    Math.min(
                        current,
                        duration
                    )
                );


            const percentage =
                (
                    current /
                    duration
                ) * 100;


            progressFill.style.width =
                `${Math.max(
                    0,
                    Math.min(
                        100,
                        percentage
                    )
                )}%`;
        }


        currentTime.textContent =
            `${formatTime(current)} / ${formatTime(duration)}`;
    }


    return card;
}


// =========================================
// お気に入りボタン
// =========================================

function updateFavoriteButton(
    button,
    favorite
) {

    if (favorite) {

        button.classList.add(
            "active"
        );

        button.textContent =
            "★";

        button.title =
            "お気に入りから外す";

    } else {

        button.classList.remove(
            "active"
        );

        button.textContent =
            "☆";

        button.title =
            "お気に入りに追加";
    }
}


// =========================================
// IDコピー
// =========================================

async function copyText(text) {

    // Clipboard API
    if (
        navigator.clipboard &&
        window.isSecureContext
    ) {

        try {

            await navigator.clipboard.writeText(
                text
            );

            return true;

        } catch (error) {

            console.warn(
                "Clipboard API失敗:",
                error
            );
        }
    }


    // Clipboard APIが使えない環境用
    try {

        const textarea =
            document.createElement(
                "textarea"
            );


        textarea.value =
            text;


        textarea.style.position =
            "fixed";

        textarea.style.left =
            "-9999px";


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


        return success;

    } catch (error) {

        console.error(
            "コピーに失敗しました:",
            error
        );

        return false;
    }
}


// =========================================
// 時間表示
// =========================================

function formatTime(seconds) {

    if (
        !Number.isFinite(seconds) ||
        seconds < 0
    ) {

        return "0:00";
    }


    const totalSeconds =
        Math.floor(seconds);


    const minutes =
        Math.floor(
            totalSeconds / 60
        );


    const remainingSeconds =
        totalSeconds % 60;


    return (
        `${minutes}:` +
        `${String(
            remainingSeconds
        ).padStart(2, "0")}`
    );
}


// =========================================
// 通知
// =========================================

let toastTimer = null;


function showToast(message) {

    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            1800
        );
}