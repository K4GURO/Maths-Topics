/* =========================================================
   MATHS MESSAGE GENERATOR
   script.js
   ========================================================= */


/* ================= ELEMENTS ================= */

const dateInput = document.getElementById("date");
const todayBtn = document.getElementById("todayBtn");

const chapterNumber = document.getElementById("chapterNumber");
const chapterName = document.getElementById("chapterName");

const topicsContainer = document.getElementById("topicsContainer");
const homeworkContainer = document.getElementById("homeworkContainer");

const addTopicBtn = document.getElementById("addTopicBtn");
const addHomeworkBtn = document.getElementById("addHomeworkBtn");

const exerciseInput = document.getElementById("exercise");
const noteInput = document.getElementById("note");

const generateBtn = document.getElementById("generateBtn");
const clearBtn = document.getElementById("clearBtn");

const messagePreview = document.getElementById("messagePreview");

const copyBtn = document.getElementById("copyBtn");
const copyStatus = document.getElementById("copyStatus");


/* ================= STORAGE KEY ================= */

const STORAGE_KEY = "mathsMessageGeneratorData";


/* ================= DATE FUNCTIONS ================= */

function getTodayDate() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


function formatDate(dateValue) {

    if (!dateValue) {
        return "";
    }

    const parts = dateValue.split("-");

    if (parts.length !== 3) {
        return dateValue;
    }

    const year = parts[0];
    const month = parts[1];
    const day = parts[2];

    return `${day}-${month}-${year}`;
}


/* ================= FANCY TEXT ================= */

/*
   Converts normal English letters into
   the Unicode style used in your group message.

   Example:
   TOPICS DISCUSSED
   ↓
   𝕋𝕆ℙ𝕀ℂ𝕊 𝔻𝕀𝕊ℂ𝕌𝕊𝕊𝔼𝔻
*/

const fancyUpper = {
    A: "𝔸",
    B: "𝔹",
    C: "ℂ",
    D: "𝔻",
    E: "𝔼",
    F: "𝔽",
    G: "𝔾",
    H: "ℍ",
    I: "𝕀",
    J: "𝕁",
    K: "𝕂",
    L: "𝕃",
    M: "𝕄",
    N: "ℕ",
    O: "𝕆",
    P: "ℙ",
    Q: "ℚ",
    R: "ℝ",
    S: "𝕊",
    T: "𝕋",
    U: "𝕌",
    V: "𝕍",
    W: "𝕎",
    X: "𝕏",
    Y: "𝕐",
    Z: "ℤ"
};


const fancyLower = {
    a: "ᴀ",
    b: "ʙ",
    c: "ᴄ",
    d: "ᴅ",
    e: "ᴇ",
    f: "ꜰ",
    g: "ɢ",
    h: "ʜ",
    i: "ɪ",
    j: "ᴊ",
    k: "ᴋ",
    l: "ʟ",
    m: "ᴍ",
    n: "ɴ",
    o: "ᴏ",
    p: "ᴘ",
    q: "ǫ",
    r: "ʀ",
    s: "ꜱ",
    t: "ᴛ",
    u: "ᴜ",
    v: "ᴠ",
    w: "ᴡ",
    x: "x",
    y: "ʏ",
    z: "ᴢ"
};


function fancyText(text) {

    return text
        .split("")
        .map(character => {

            if (fancyUpper[character]) {
                return fancyUpper[character];
            }

            if (fancyLower[character]) {
                return fancyLower[character];
            }

            return character;

        })
        .join("");
}


/* ================= DATE FANCY NUMBERS ================= */

const fancyNumbers = {
    "0": "𝟘",
    "1": "𝟙",
    "2": "𝟚",
    "3": "𝟛",
    "4": "𝟜",
    "5": "𝟝",
    "6": "𝟞",
    "7": "𝟟",
    "8": "𝟠",
    "9": "𝟡"
};


function fancyDate(date) {

    return date
        .split("")
        .map(character => fancyNumbers[character] || character)
        .join("");
}


/* ================= CREATE DYNAMIC INPUT ================= */

function createDynamicRow(type, value = "") {

    const row = document.createElement("div");

    row.className = "dynamic-row";

    const input = document.createElement("input");

    input.type = "text";

    input.className =
        type === "topic"
            ? "topic-input"
            : "homework-input";

    input.placeholder =
        type === "topic"
            ? "Enter topic discussed..."
            : "Enter homework...";

    input.value = value;

    const removeButton = document.createElement("button");

    removeButton.type = "button";
    removeButton.className = "remove-btn";
    removeButton.title = `Remove ${type}`;
    removeButton.textContent = "×";

    removeButton.addEventListener("click", () => {

        const rows =
            type === "topic"
                ? topicsContainer.querySelectorAll(".dynamic-row")
                : homeworkContainer.querySelectorAll(".dynamic-row");

        /*
           Keep at least one input box.
        */

        if (rows.length > 1) {
            row.remove();
        } else {
            input.value = "";
        }

        saveData();
    });

    input.addEventListener("input", saveData);

    row.appendChild(input);
    row.appendChild(removeButton);

    return row;
}


/* ================= ADD TOPIC ================= */

addTopicBtn.addEventListener("click", () => {

    const row = createDynamicRow("topic");

    topicsContainer.appendChild(row);

    const input = row.querySelector("input");

    input.focus();

    saveData();
});


/* ================= ADD HOMEWORK ================= */

addHomeworkBtn.addEventListener("click", () => {

    const row = createDynamicRow("homework");

    homeworkContainer.appendChild(row);

    const input = row.querySelector("input");

    input.focus();

    saveData();
});


/* ================= GET TOPICS ================= */

function getTopics() {

    return [...document.querySelectorAll(".topic-input")]
        .map(input => input.value.trim())
        .filter(value => value !== "");
}


/* ================= GET HOMEWORK ================= */

function getHomework() {

    return [...document.querySelectorAll(".homework-input")]
        .map(input => input.value.trim())
        .filter(value => value !== "");
}


/* ================= SAVE DATA ================= */

function saveData() {

    const data = {

        date: dateInput.value,

        chapterNumber: chapterNumber.value,

        chapterName: chapterName.value,

        exercise: exerciseInput.value,

        note: noteInput.value,

        topics: getTopics(),

        homework: getHomework()

    };

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
    );
}


/* ================= LOAD DATA ================= */

function loadData() {

    const savedData =
        localStorage.getItem(STORAGE_KEY);

    if (!savedData) {
        dateInput.value = getTodayDate();
        return;
    }

    try {

        const data = JSON.parse(savedData);

        dateInput.value =
            data.date || getTodayDate();

        chapterNumber.value =
            data.chapterNumber || "";

        chapterName.value =
            data.chapterName || "";

        exerciseInput.value =
            data.exercise || "";

        noteInput.value =
            data.note || "";


        /* ---------- TOPICS ---------- */

        topicsContainer.innerHTML = "";

        if (data.topics && data.topics.length > 0) {

            data.topics.forEach(topic => {

                topicsContainer.appendChild(
                    createDynamicRow("topic", topic)
                );

            });

        } else {

            topicsContainer.appendChild(
                createDynamicRow("topic")
            );

        }


        /* ---------- HOMEWORK ---------- */

        homeworkContainer.innerHTML = "";

        if (data.homework && data.homework.length > 0) {

            data.homework.forEach(homework => {

                homeworkContainer.appendChild(
                    createDynamicRow("homework", homework)
                );

            });

        } else {

            homeworkContainer.appendChild(
                createDynamicRow("homework")
            );

        }

    } catch (error) {

        console.error(
            "Could not load saved data:",
            error
        );

        dateInput.value = getTodayDate();
    }
}


/* ================= SAVE INPUT CHANGES ================= */

[
    dateInput,
    chapterNumber,
    chapterName,
    exerciseInput,
    noteInput
].forEach(element => {

    element.addEventListener(
        "input",
        saveData
    );

});


/* ================= TODAY BUTTON ================= */

todayBtn.addEventListener("click", () => {

    dateInput.value = getTodayDate();

    saveData();

});


/* ================= GENERATE MESSAGE ================= */

function generateMessage() {

    const date = formatDate(dateInput.value);

    const chapterNo =
        chapterNumber.value.trim();

    const chapter =
        chapterName.value.trim();

    const topics =
        getTopics();

    const exercise =
        exerciseInput.value.trim();

    const homework =
        getHomework();

    const note =
        noteInput.value.trim();


    /* ================= VALIDATION ================= */

    if (!chapterNo) {

        alert("Please enter the Chapter Number.");

        chapterNumber.focus();

        return;
    }


    if (!chapter) {

        alert("Please enter the Chapter Name.");

        chapterName.focus();

        return;
    }


    if (
        topics.length === 0 &&
        !exercise
    ) {

        alert(
            "Please enter at least one topic or exercise."
        );

        return;
    }


    /* ================= HEADER ================= */

    let message = "";

    message +=
        `*[${fancyDate(date)}] ${fancyText("TOPICS DISCUSSED")}:*\n\n`;


    /* ================= CHAPTER ================= */

    message +=
        `*Ch-${chapterNo}:* *${fancyText(chapter)}*\n`;


    /* ================= TOPIC BOX ================= */

    message +=
        `┌────────────────────────┐\n`;


    topics.forEach(topic => {

        message +=
            `│ ⋄  ${fancyText(topic)}\n`;

    });


    /* ================= EXERCISE ================= */

    if (exercise) {

        message +=
            `│ ⋄  ${fancyText(exercise)}\n`;

    }


    message +=
        `└────────────────────────┘\n`;


    /* ================= HOMEWORK ================= */

    if (homework.length > 0) {

        message += "\n";

        message +=
            `*HW*: ${fancyText(homework[0])}\n`;

        for (let i = 1; i < homework.length; i++) {

            message +=
                `      ➥ ${fancyText(homework[i])}\n`;

        }

    }


    /* ================= NOTE ================= */

    if (note) {

        message += "\n";

        message +=
            `*Note*: ${note}\n`;

    }


    /* ================= OUTPUT ================= */

    messagePreview.textContent =
        message.trim();


    copyBtn.disabled = false;

    copyStatus.textContent = "";

    saveData();

}


/* ================= GENERATE BUTTON ================= */

generateBtn.addEventListener(
    "click",
    generateMessage
);


/* ================= COPY MESSAGE ================= */

copyBtn.addEventListener("click", async () => {

    const message =
        messagePreview.textContent.trim();

    if (!message) {
        return;
    }


    try {

        await navigator.clipboard.writeText(message);

        copyStatus.textContent =
            "✓ Message copied successfully!";

        copyBtn.textContent =
            "✓ Copied!";


        setTimeout(() => {

            copyBtn.textContent =
                "📋 Copy Message";

        }, 1800);


    } catch (error) {

        /*
           Fallback for browsers where
           navigator.clipboard is unavailable.
        */

        const textarea =
            document.createElement("textarea");

        textarea.value = message;

        document.body.appendChild(textarea);

        textarea.select();

        document.execCommand("copy");

        textarea.remove();

        copyStatus.textContent =
            "✓ Message copied successfully!";

    }

});


/* ================= CLEAR ================= */

clearBtn.addEventListener("click", () => {

    const confirmed =
        confirm(
            "Clear all entered information?"
        );

    if (!confirmed) {
        return;
    }


    chapterNumber.value = "";
    chapterName.value = "";

    exerciseInput.value = "";
    noteInput.value = "";

    dateInput.value = getTodayDate();


    topicsContainer.innerHTML = "";

    topicsContainer.appendChild(
        createDynamicRow("topic")
    );


    homeworkContainer.innerHTML = "";

    homeworkContainer.appendChild(
        createDynamicRow("homework")
    );


    messagePreview.textContent =
        "Your generated message will appear here...";

    copyBtn.disabled = true;

    copyStatus.textContent = "";

    localStorage.removeItem(STORAGE_KEY);

});


/* ================= INITIALIZE ================= */

loadData();
