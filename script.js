/**
 * Point culture (en Français car je suis un peu obligé):
 * Dans ce genre de jeu, un mot equivaut a 5 caractères, y compris les espaces.
 * La precision, c'est le pourcentage de caractères tapées correctement sur toutes les caractères tapées.
 *
 * Sur ce... Amusez-vous bien !
 */
let startTime = null,
  previousEndTime = null;
let currentWordIndex = 0;
const wordsToType = [];
let timerInterval = null;
let timeLeft = 0;

const modeSelect = document.getElementById("mode");
const languageSelect = document.getElementById("language");
const chronoSelect = document.getElementById("chrono");
const wordDisplay = document.getElementById("word-display");
const inputField = document.getElementById("input-field");
const results = document.getElementById("results");

// Mots disponibles par langue et difficulté
const words = {
  en: {
    easy: ["apple", "banana", "grape", "orange", "cherry"],
    medium: ["keyboard", "monitor", "printer", "charger", "battery"],
    hard: [
      "synchronize",
      "complicated",
      "development",
      "extravagant",
      "misconception",
    ],
  },
  fr: {
    easy: ["pomme", "banane", "raisin", "orange", "cerise"],
    medium: ["clavier", "écran", "imprimante", "chargeur", "batterie"],
    hard: [
      "synchroniser",
      "compliqué",
      "développement",
      "extravagant",
      "méconnaissance",
    ],
  },
};

// Générer un mot aléatoire selon la langue et le mode sélectionnés
const getRandomWord = () => {
  const language = languageSelect.value;
  const mode = modeSelect.value;

  if (!words[language] || !words[language][mode]) {
    console.error(
      `Configuration manquante pour langue: ${language}, mode: ${mode}`
    );
    return "erreur";
  }

  const wordList = words[language][mode];
  return wordList[Math.floor(Math.random() * wordList.length)];
};

// Démarrer le chronomètre
const startChrono = (duration) => {
  clearInterval(timerInterval);
  timeLeft = duration;

  if (duration > 0) {
    timerInterval = setInterval(() => {
      timeLeft--;
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        endTest();
      }
    }, 1000);
  }
};

// Terminer le test
const endTest = () => {
  inputField.disabled = true;
  const elapsedTime = (Date.now() - startTime) / 1000 / 60;
  const totalChars = wordsToType.slice(0, currentWordIndex).join(" ").length;
  const wpm = totalChars / 5 / elapsedTime;
  results.textContent = `Test terminé! WPM final: ${wpm.toFixed(2)}`;
};

// Initialiser le test de dactylographie
const startTest = (wordCount = 50) => {
  wordsToType.length = 0;
  wordDisplay.innerHTML = "";
  currentWordIndex = 0;
  startTime = null;
  previousEndTime = null;
  inputField.disabled = false;
  inputField.focus();

  // Démarrer le chronomètre si activé
  const chronoValue = chronoSelect.value;
  if (chronoValue !== "off") {
    startChrono(parseInt(chronoValue));
  } else {
    clearInterval(timerInterval);
  }

  // Générer les mots
  for (let i = 0; i < wordCount; i++) {
    wordsToType.push(getRandomWord());
  }

  // Afficher les mots
  wordsToType.forEach((word, index) => {
    const span = document.createElement("span");
    span.textContent = word + " ";
    if (index === 0) span.style.color = "red";
    wordDisplay.appendChild(span);
  });

  inputField.value = "";
  results.textContent = "Results:";
};

// Calculer et retourner WPM & précision
const getCurrentStats = () => {
  const elapsedTime = (Date.now() - previousEndTime) / 1000;
  const wpm = wordsToType[currentWordIndex].length / 5 / (elapsedTime / 60);
  const accuracy =
    (wordsToType[currentWordIndex].length / inputField.value.length) * 100;

  return { wpm: wpm.toFixed(2), accuracy: accuracy.toFixed(2) };
};

// Passer au mot suivant
const updateWord = (event) => {
  if (event.key === " ") {
    if (inputField.value.trim() === wordsToType[currentWordIndex]) {
      if (!startTime) startTime = Date.now();
      if (!previousEndTime) previousEndTime = startTime;

      const { wpm, accuracy } = getCurrentStats();
      results.textContent = `WPM: ${wpm}, Accuracy: ${accuracy}%`;

      currentWordIndex++;
      previousEndTime = Date.now();
      highlightNextWord();

      inputField.value = "";
      event.preventDefault();

      if (currentWordIndex >= wordsToType.length) {
        endTest();
      }
    }
  }
};

// Mettre en surbrillance le mot courant
const highlightNextWord = () => {
  const wordElements = wordDisplay.children;
  if (currentWordIndex < wordElements.length) {
    Array.from(wordElements).forEach((el, i) => {
      el.style.color = i === currentWordIndex ? "red" : "black";
    });
  }
};

// Réinitialiser immédiatement quand les options changent
const handleOptionChange = () => {
  startTest();
  inputField.focus();
};

// Écouteurs d'événements
inputField.addEventListener("keydown", (event) => {
  if (!startTime) startTime = Date.now();
  updateWord(event);
});

modeSelect.addEventListener("change", handleOptionChange);
languageSelect.addEventListener("change", handleOptionChange);
chronoSelect.addEventListener("change", handleOptionChange);

// Démarrer le test initial
startTest();

const sections = document.querySelectorAll(".section");
function afficherSection(sectionId) {
  sections.forEach((section) => {
    section.classList.remove("section--active");
  });
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add("section--active");
  }
}

document.querySelectorAll(".barre-laterale__item").forEach((item) => {
  item.addEventListener("click", () => {
    const section = item.getAttribute("data-section");
    if (section) {
      afficherSection(section);
      if (section === "jeu-de-typing") {
        startTest();
      }
    }
  });
});

document
  .getElementById("inscription-btn")
  .addEventListener("click", () => afficherSection("formulaire-inscription"));
document
  .getElementById("submit-inscription")
  .addEventListener("click", () => afficherSection("accueil"));
