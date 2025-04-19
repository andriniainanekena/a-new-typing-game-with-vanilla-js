/**
 * Point culture (en Français car je suis un peu obligé): 
 * Dans ce genre de jeu, un mot equivaut a 5 caractères, y compris les espaces. 
 * La precision, c'est le pourcentage de caractères tapées correctement sur toutes les caractères tapées.
 * 
 * Sur ce... Amusez-vous bien ! 
 */
let startTime = null, previousEndTime = null;
let currentWordIndex = 0;
const wordsToType = [];

const modeSelect = document.getElementById("mode");
const wordDisplay = document.getElementById("word-display");
const inputField = document.getElementById("input-field");
const results = document.getElementById("results");

const words = {
    easy: ["apple", "banana", "grape", "orange", "cherry"],
    medium: ["keyboard", "monitor", "printer", "charger", "battery"],
    hard: ["synchronize", "complicated", "development", "extravagant", "misconception"]
};

// Generate a random word from the selected mode
const getRandomWord = (mode) => {
    const wordList = words[mode];
    return wordList[Math.floor(Math.random() * wordList.length)];
};

// Initialize the typing test
const startTest = (wordCount = 50) => {
    wordsToType.length = 0; // Clear previous words
    wordDisplay.innerHTML = ""; // Clear display
    currentWordIndex = 0;
    startTime = null;
    previousEndTime = null;

    for (let i = 0; i < wordCount; i++) {
        wordsToType.push(getRandomWord(modeSelect.value));
    }

    wordsToType.forEach((word, index) => {
        const span = document.createElement("span");
        span.textContent = word + " ";
        if (index === 0) span.style.color = "red"; // Highlight first word
        wordDisplay.appendChild(span);
    });

    inputField.value = "";
    results.textContent = "";
};

// Start the timer when user begins typing
const startTimer = () => {
    if (!startTime) startTime = Date.now();
};

// Calculate and return WPM & accuracy
const getCurrentStats = () => {
    const elapsedTime = (Date.now() - previousEndTime) / 1000; // Seconds
    const wpm = (wordsToType[currentWordIndex].length / 5) / (elapsedTime / 60); // 5 chars = 1 word
    const accuracy = (wordsToType[currentWordIndex].length / inputField.value.length) * 100;

    return { wpm: wpm.toFixed(2), accuracy: accuracy.toFixed(2) };
};

// Move to the next word and update stats only on spacebar press
const updateWord = (event) => {
    if (event.key === " ") { // Check if spacebar is pressed
        if (inputField.value.trim() === wordsToType[currentWordIndex]) {
            if (!previousEndTime) previousEndTime = startTime;

            const { wpm, accuracy } = getCurrentStats();
            results.textContent = `WPM: ${wpm}, Accuracy: ${accuracy}%`;

            currentWordIndex++;
            previousEndTime = Date.now();
            highlightNextWord();

            inputField.value = ""; // Clear input field after space
            event.preventDefault(); // Prevent adding extra spaces
        }
    }
};

// Highlight the current word in red
const highlightNextWord = () => {
    const wordElements = wordDisplay.children;

    if (currentWordIndex < wordElements.length) {
        if (currentWordIndex > 0) {
            wordElements[currentWordIndex - 1].style.color = "black";
        }
        wordElements[currentWordIndex].style.color = "red";
    }
};

// Event listeners
// Attach `updateWord` to `keydown` instead of `input`
inputField.addEventListener("keydown", (event) => {
    startTimer();
    updateWord(event);
});
modeSelect.addEventListener("change", () => startTest());

// Start the test
startTest();


const sections = document.querySelectorAll('.section')
function afficherSection(sectionId) {
    sections.forEach(section => {
        section.classList.remove('section--active')
    })
    const targetSection = document.getElementById(sectionId)
    if (targetSection) {
        targetSection.classList.add('section--active')
        if (sectionId ==='jeu-de-typing') {
            startTest();
        }
    } else {
        console.warn(`Section "${sectionId}" introuvable, retour à l'accueil.`);
        document.getElementById('accueil').classList.add('section--active');
    }
};


document.querySelectorAll('.barre-laterale__item').forEach(item => {
    item.addEventListener('click', () => {
        const section = item.getAttribute('data-section')
        if (section) {
            afficherSection(section);
        }
    })
});


document.getElementById('start-test').addEventListener('click', () => {
    afficherSection('jeu-de-typing')
    startTest()
})

document.getElementById('start-competition').addEventListener('click', () => {
    afficherSection('jeu-de-typing')
    startTest()
})

const toggleModeButton = document.getElementById('toggle-mode')
const body = document.body;
const savedMode = localStorage.getItem('mode')

if (savedMode) {
    body.classList.add(savedMode)
    if (savedMode === 'mode-clair') {
        toggleModeButton.classList.remove('fa-moon')
        toggleModeButton.classList.add('fa-sun')
    }
}

toggleModeButton.addEventListener('click', () => {
    if (body.classList.contains('mode-clair')) {
        body.classList.remove('mode-clair')
        toggleModeButton.classList.remove('fa-sun')
        toggleModeButton.classList.add('fa-moon')
        localStorage.setItem('mode', '')
    } else {
        body.classList.add('mode-clair')
        toggleModeButton.classList.remove('fa-moon')
        toggleModeButton.classList.add('fa-sun')
        localStorage.setItem('mode', 'mode-clair')
    }
})

document
  .getElementById("inscription-btn")
  .addEventListener("click", () => afficherSection("formulaire-inscription"));
document
  .getElementById("submit-inscription")
  .addEventListener("click", () => afficherSection("accueil"));
