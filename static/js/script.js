let quizData = []; // Array to store quiz data
let englishWords = {};
let englishWordsRandomQuestion = {};
let is_quiz_start = false;
let currentQuiz = null;
let winnersArray = [];
let attempt = -1;
let timer = 0;
let timerInterval;
const timerSpinner = document.querySelector(".timer-spinner");
let isTimerSpinnerVisible = true;
const totalCountElement = document.getElementById("total-count");
let totalCountElementValue = 0;

let showStartWindow = document.getElementById("english-words-quiz");
let statisticWindow = document.getElementById("statistic-window");
let quizField = document.getElementById("quiz-field");
const rulesSection = document.getElementById("rules");
const settingsSection = document.getElementById("settings");

var startQuizButton = document.getElementById("start-quiz-button");
startQuizButton.addEventListener("click", fetchQuizData);

showStartWindow.addEventListener("click", (event) => {
  event.preventDefault();
  if (!is_quiz_start) {
    quizField.style.display = "none";
    statisticWindow.style.display = "block";
    rulesSection.style.display = "none";
    settingsSection.style.display = "none";
  }
  rulesLink.style.backgroundColor = "";
  settingsLink.style.backgroundColor = "";
});

const rulesLink = document.getElementById("rules-link");
rulesLink.addEventListener("click", (event) => {
  event.preventDefault();
  closeButtonHandler("closeButtonRules");
  quizField.style.display = "none";
  statisticWindow.style.display = "none";
  rulesSection.style.display = "block";
  settingsSection.style.display = "none";
  rulesLink.style.backgroundColor = "rgba(128, 124, 124, 0.7)";
  settingsLink.style.backgroundColor = "";
});

const settingsLink = document.getElementById("settings-link");
settingsLink.addEventListener("click", (event) => {
  event.preventDefault();
  quizField.style.display = "none";
  statisticWindow.style.display = "none";
  rulesSection.style.display = "none";
  settingsSection.style.display = "block";
  settingsLink.style.backgroundColor = "rgba(128, 124, 124, 0.7)";
  const rulesLink = document.getElementById("rules-link");
  rulesLink.style.backgroundColor = "";
  const resetButton = document.getElementById("resetSettingsDefault");
  resetButton.addEventListener("click", function () {
    initSettings();
  });
  closeButtonHandler("closeButtonSettings");
});

initSettings();

const wordCountSlider = document.getElementById("word-count-slider");
const sliderLabel = document.getElementById("word-count-label");
wordCountSlider.addEventListener("input", function () {
  sliderLabel.textContent = wordCountSlider.value;
});

wordCountSlider.addEventListener("change", function (event) {
  const newWordCount = event.target.value;
  let wordCount = parseInt(newWordCount);
  englishWords = Object.keys(englishWords)
    .slice(0, wordCount)
    .reduce((result, wordKey) => {
      const word = englishWords[wordKey];
      result[wordKey] = word;
      return result;
    }, {});
  applyChangeSettings();
});

const cefrCheckboxes = document.querySelectorAll('input[name="cefr-level"]');
cefrCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", applyChangeSettings);
});

const wordsTypesCheckboxes = document.querySelectorAll('input[name="words-types"]');
wordsTypesCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", applyChangeSettings);
});

const allCheckboxes = document.querySelectorAll('input[type="checkbox"]');
allCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("mouseover", () => {
    if (!checkbox.checked) {
      let tooltipText = "";
      const count = parseInt(checkbox.getAttribute("data-count"), 10);
      if (count === 0) {
        tooltipText = "Sorry, but  *" + checkbox.value + "*  words are not yet in our quiz dictionary.";
      } else {
        tooltipText = "Use Reset to restore settings";
      }
      setTooltip(checkbox, tooltipText);
    }
  });
});

function setTooltip(htmlElement, tooltipText) {
  const tooltipElement = document.createElement("div");
  tooltipElement.className = "tooltip";
  tooltipElement.textContent = tooltipText;
  const htmlElementPosition = htmlElement.getBoundingClientRect();
  let tooltipTop = htmlElementPosition.top - tooltipElement.clientHeight - 30;
  if (tooltipTop < 0) {
    tooltipTop = 10;
  }
  let tooltipLeft = htmlElementPosition.left;
  if ((tooltipLeft + tooltipElement.clientWidth) > window.innerWidth) {
    tooltipLeft = window.innerWidth - tooltipElement.clientWidth - 10;
  }
  tooltipElement.style.position = "fixed";
  tooltipElement.style.top = tooltipTop + "px";
  tooltipElement.style.left = tooltipLeft + "px";
  document.body.appendChild(tooltipElement);
  htmlElement.addEventListener("mouseout", () => {
    tooltipElement.remove();
  });
  setTimeout(() => {
    tooltipElement.remove();
  }, 1000);
}

function setStartButtonStyle(totalWordsCount) {
  const startButton = document.getElementById('start-quiz-button');
  const normalColor = 'rgba(76, 175, 80, 0.9)';
  const hoverColor = 'rgba(35, 105, 39, 0.9)';
  const disabledColor = 'grey';
  startButton.style.backgroundColor = normalColor;
  if (totalWordsCount >= 3) {
    startButton.disabled = false;
    startButton.addEventListener('mouseover', () => {
      startButton.style.backgroundColor = hoverColor;
    });
    startButton.addEventListener('mouseout', () => {
      startButton.style.backgroundColor = normalColor;
    });
  } else {
    startButton.style.backgroundColor = disabledColor;
    startButton.disabled = true;
    startButton.addEventListener('mouseover', () => {
      startButton.style.backgroundColor = disabledColor;
      let tooltipText = 'Use Reset to restore settings';
      setTooltip(startButton, tooltipText);
    });
    startButton.addEventListener('mouseout', () => {
      startButton.style.backgroundColor = disabledColor;
    });
  }
}

function closeButtonHandler(closeButtonId) {
  const closeButton = document.getElementById(closeButtonId);
  closeButton.addEventListener("click", (event) => {
    event.preventDefault();
    if (!is_quiz_start) {
      quizField.style.display = "none";
      statisticWindow.style.display = "block";
      rulesSection.style.display = "none";
      settingsSection.style.display = "none";
    }
    rulesLink.style.backgroundColor = "";
    settingsLink.style.backgroundColor = "";
  });
}

function startQuiz() {
  applyChangeSettings();
  is_quiz_start = true;
  let rulesStartSettingsElement = document.getElementsByClassName("rules-start-settings")[0];
  rulesStartSettingsElement.style.display = "none";
  startTimer();
  attempt++;
  statisticWindow.style.display = "none";
  rulesSection.style.display = "none";
  settingsSection.style.display = "none";
  let quizField = document.getElementById("quiz-field");
  quizField.style.display = "flex";
  var nextQuizButton = document.getElementById("next-button");
  nextQuizButton.addEventListener("click", takeAturn);
  const stopQuizButton = document.getElementById("stop-button");
  stopQuizButton.addEventListener("click", stopQuiz);
  englishWordsRandomQuestion = JSON.parse(JSON.stringify(englishWords));
  const randomQuestion = getRandomQuestion(englishWordsRandomQuestion);
  currentQuiz = displayQuestion(randomQuestion);
  currentQuiz.attempt = attempt;
  quizData.push(currentQuiz);
  const rightCountElement = document.getElementById("right-count");
  const wrongCountElement = document.getElementById("wrong-count");
  rightCountElement.textContent = "0";
  wrongCountElement.textContent = "0";
  const answeredCountElement = document.getElementById("answered-count");
  answeredCountElement.textContent = "0";
  totalCountElementValue = getObjectLength(englishWords);
  totalCountElement.textContent = totalCountElementValue;
}

function stopQuiz() {
  addSpentTimeToLastAttempt();
  is_quiz_start = false;
  let rulesStartSettingsElement = document.getElementsByClassName("rules-start-settings")[0];
  rulesStartSettingsElement.style.display = "flex";
  rulesLink.style.backgroundColor = "";
  settingsLink.style.backgroundColor = "";
  stopTimer();
  const totalTimeSpent = quizData.reduce((totalTime, quiz) => {
    if (quiz.attempt === attempt) {
      totalTime += quiz.spentTime;
    }
    return totalTime;
  }, 0);
  statisticWindow.style.display = "block";
  quizField.style.display = "none";
  const winnersTable = document.querySelector("#winners-table tbody");
  const totalCorrectAnswers = quizData.reduce((total, quiz) => {
    const correctAnswers = quiz.answers.filter(
      (answer) => answer.isCorrect && answer.isUserChoice && quiz.attempt === attempt
    ).length;
    return total + correctAnswers;
  }, 0);
  if (totalCorrectAnswers > 0) {
    winnersArray.push({
      place: 0,
      attempt: attempt,
      scores: totalCorrectAnswers,
      timeSpent: totalTimeSpent,
    });
  }
  const winnersTableData = Array.from(winnersTable.rows)
    .slice(1)
    .map((row) => {
      const [place, attempt, scores, timeSpent] = row.cells;
      return {
        place: Number(place.textContent),
        attempt: attempt.textContent.trim(),
        scores: Number(scores.textContent),
        timeSpent: Number(timeSpent.textContent),
      };
    });
  winnersTableData.forEach((data) => {
    const existingWinner = winnersArray.find(
      (winner) => winner.attempt === data.attempt
    );
    if (existingWinner) {
      existingWinner.place = data.place;
    }
  });
  winnersArray.sort((a, b) => {
    if (a.scores !== b.scores) {
      return b.scores - a.scores;
    } else {
      return a.timeSpent - b.timeSpent;
    }
  });
  winnersArray.forEach((winner, index) => {
    winner.place = index + 1;
  });
  winnersTable.innerHTML = "";
  winnersArray.forEach((winner, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${winner.place}</td>
            <td>${getAttemptString(winner.attempt)}</td>
            <td>${winner.scores}</td>
            <td>${winner.timeSpent}</td>
        `;
    if (index < 3) {
      row.classList.add("highlight");
    }
    winnersTable.appendChild(row);
  });
  const quizsquareFieldElement = document.querySelector(".quizsquare");
  quizsquareFieldElement.style.background = "rgba(39, 34, 34, 0.7)";
}

function getAttemptString(index) {
  const attemptStrings = [
    "first",
    "second",
    "third",
    "fourth",
    "fifth",
    "seventh",
    "eighth",
    "ninth",
    "tenth",
    "eleventh",
    "twelfth",
    "thirteenth",
    "fourteenth",
    "fifteenth",
    "sixteenth",
    "eighteenth",
    "nineteenth",
    "twentieth",
    "twenty-first",
  ];
  return attemptStrings[index] || "first";
}

function takeAturn() {
  addSpentTimeToLastAttempt();
  timer = 31;
  const selectedOption = document.querySelector(
    'input[name="answer-option"]:checked'
  );
  if (!selectedOption) {
    const wrongCountElement = document.getElementById("wrong-count");
    const wrongCount = parseInt(wrongCountElement.textContent) + 1;
    wrongCountElement.textContent = wrongCount;
  }
  checkLastAnswer();
  const answeredCountElement = document.getElementById("answered-count");
  const answered = parseInt(answeredCountElement.textContent) + 1;
  answeredCountElement.textContent = answered;
  if (answered >= totalCountElementValue) {
    stopQuiz();
  } else {
    const randomQuestion = getRandomQuestion(englishWordsRandomQuestion);
    currentQuiz = displayQuestion(randomQuestion);
    currentQuiz.attempt = attempt;
    currentQuiz.spentTime = 0;
    quizData.push(currentQuiz);
  }
}

function addSpentTimeToLastAttempt() {
  quizData[quizData.length - 1].spentTime = 30 - timer;
}

function checkLastAnswer() {
  const lastQuiz = quizData[quizData.length - 1];
  if (lastQuiz) {
    const answers = lastQuiz.answers;
    const lastUserAnswer = answers.find((answer) => answer.isUserChoice);
    if (lastUserAnswer) {
      if (lastUserAnswer.isCorrect) {
        const rightCountElement = document.getElementById("right-count");
        const rightCount = parseInt(rightCountElement.textContent) + 1;
        rightCountElement.textContent = rightCount;
      } else {
        const wrongCountElement = document.getElementById("wrong-count");
        const wrongCount = parseInt(wrongCountElement.textContent) + 1;
        wrongCountElement.textContent = wrongCount;
      }
    }
  }
}

function getRandomQuestion(englishWordsRandomQuestion) {
  const wordKeys = Object.keys(englishWordsRandomQuestion);
  if (wordKeys.length === 0) {
    throw new Error("No words available in englishWordsRandomQuestion");
  }
  const randomIndex = Math.floor(Math.random() * wordKeys.length);
  const selectedWordKey = wordKeys[randomIndex];
  const wordObject = englishWordsRandomQuestion[selectedWordKey];

  if (!wordObject || !wordObject.text) {
    throw new Error(`Word object or text property is missing for key: ${selectedWordKey}`);
  }

  const randomWordType = {
    definitions: [
      {
        definition: wordObject.text,
        translate: [], // Это значение нужно будет заменить, если данные включают перевод
      },
    ],
  };

  const question = {
    word: wordObject.text,
    wordType: wordObject.word_type,
    definition: randomWordType.definitions[0].definition,
    translations: randomWordType.definitions[0].translate,
    imageUrl: wordObject.image_data ? wordObject.image_data : '',
    soundUrl: wordObject.audio_data ? wordObject.audio_data : '',
    cefrLevel: wordObject.cefr_level,
    cefrTitle: wordObject.cefr_level, // Здесь также можно добавить заголовок уровня, если доступно
  };

  delete englishWordsRandomQuestion[selectedWordKey];
  return question;
}



function displayQuestion(question) {
  const quizTaskElement = document.querySelector(".quiz-task");
  const wordTypeElement = document.querySelector(".word-type");
  const wordDefinitionElement = document.querySelector(".word-definition");
  const answersListElement = document.querySelector(".answers-list");
  const imgWordeElement = document.querySelector(".img-word-image");
  const timerSpinner = document.querySelector(".timer-spinner");
  timerSpinner.style.backgroundColor = "rgba(51, 51, 51, 0.7)";
  timerSpinner.style.color = "white";
  quizTaskElement.textContent = "Guess the word by definition:";
  wordTypeElement.textContent = question.wordType;
  wordDefinitionElement.textContent = question.definition;
  imgWordeElement.src = question.imageUrl;
  imgWordeElement.alt = question.definition;
  answersListElement.innerHTML = "";
  const answerOptions = [];
  answerOptions.push({
    answer: question.word,
    isCorrect: true,
    isUserChoice: false,
  });
  const uniqueIncorrectAnswers = [];
  while (uniqueIncorrectAnswers.length < 2) {
    const wordKeys = Object.keys(englishWords);
    const randomKey = wordKeys[Math.floor(Math.random() * wordKeys.length)];
    if (
      randomKey !== question.word &&
      !uniqueIncorrectAnswers.includes(randomKey)
    ) {
      uniqueIncorrectAnswers.push(randomKey);
    }
  }
  uniqueIncorrectAnswers.forEach((randomKey) => {
    answerOptions.push({
      answer: randomKey,
      isCorrect: false,
      isUserChoice: false,
    });
  });
  const shuffledOptions = shuffleArray(answerOptions);
  shuffledOptions.forEach((option) => {
    const li = document.createElement("li");
    const input = document.createElement("input");
    const label = document.createElement("label");
    const audioElement = document.createElement("audio");
    const audioSourceElement = document.createElement("source");
    const audioButtonPlayElement = document.createElement("button");
    let currentWord = englishWords[option.answer];
    audioSourceElement.src = currentWord.sound_url;
    audioButtonPlayElement.id = option.answer;
    audioButtonPlayElement.className = "play-sound-button";
    audioButtonPlayElement.onclick = function () {
      document.getElementById(option.answer).play();
    };
    audioElement.id = option.answer;
    audioElement.classList.add("audio-container");
    input.type = "radio";
    input.className = "answer-option";
    input.name = "answer-option";
    input.value = option.answer;
    label.textContent = option.answer;
    audioElement.className = "audio-container";
    audioElement.controls = false;
    audioElement.appendChild(audioSourceElement);
    li.appendChild(input);
    li.appendChild(label);
    li.appendChild(audioElement);
    li.appendChild(audioButtonPlayElement);
    answersListElement.appendChild(li);
    li.addEventListener("click", () => {
      const radio = li.querySelector('input[type="radio"]');
      radio.checked = true;
      const event = new Event("change", { bubbles: true });
      radio.dispatchEvent(event);
    });
    input.addEventListener("change", () => {
      option.isUserChoice = input.checked;
      const allAudioElements = document.querySelectorAll(".word-audio");
      allAudioElements.forEach((audioElement) => {
        audioElement.pause();
      });
      const selectedWord = englishWords[option.answer];
      if (selectedWord) {
        audioButtonPlayElement.onclick = function () {
          document.getElementById(option.answer).play();
        };
        audioElement.load();
        audioElement.play();
      }
    });
  });
  currentQuiz = {
    question: question.definition,
    answers: answerOptions,
    scores: 0,
    timeSpent: 0,
  };
  return currentQuiz;
}

function updateTimerDisplay() {
  const timerDisplay = document.querySelector(".timer-spinner");
  timerDisplay.textContent = `${timer}`;
}

function startTimer() {
  timer = 30;
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    --timer;
    updateTimerDisplay();
    if (timer < 0) {
      stopTimer();
      stopQuiz();
    } else if (timer <= 10) {
      timerSpinner.style.backgroundColor = isTimerSpinnerVisible ? "red" : "white";
      timerSpinner.style.color = isTimerSpinnerVisible ? "white" : "red";
      isTimerSpinnerVisible = !isTimerSpinnerVisible;
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function shuffleArray(array) {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}

function parseSettingsFromTable() {
  const settings = {
    cefrLevels: [],
    wordTypes: [],
    wordCount: 3,
  };
  const table = document.getElementById("settings-table");
  const checkboxes = table.querySelectorAll(
    'input[name="cefr-level"]:checked, input[name="words-types"]:checked'
  );
  const wordCountSlider = document.getElementById("word-count-slider");
  checkboxes.forEach((checkbox) => {
    if (checkbox.getAttribute("name") === "cefr-level") {
      settings.cefrLevels.push(checkbox.value);
    } else if (checkbox.getAttribute("name") === "words-types") {
      settings.wordTypes.push(checkbox.value);
    }
  });
  settings.wordCount = parseInt(wordCountSlider.value);
  return settings;
}

function applyChangeSettings() {
  const selectedSettings = parseSettingsFromTable();
  const filteredWords = filterWordsBySettings(englishWords, selectedSettings);
  englishWords = filteredWords;
  updateWordDisplay(filteredWords);
}

function filterWordTypes(word, settings) {
  return settings.wordTypes.includes(word.word_type);
}

function filterWordsBySettings(englishWords, settings) {
  return Object.values(englishWords).filter(word => 
    settings.cefrLevels.includes(word.cefr_level) &&
    filterWordTypes(word, settings)
  );
}

function initSettings() {
  const cefrCheckboxes = document.querySelectorAll('input[name="cefr-level"]');
  englishWords = JSON.parse(JSON.stringify(englishWordsInit));
  const words = Object.values(englishWords);
  cefrCheckboxes.forEach((checkbox) => {
    const cefrLevel = checkbox.value;
    const cefrCountSpan = document.getElementById(`cefr-level-count-${cefrLevel}`);
    const filteredWords = words.filter((word) => word.cefr_level === cefrLevel);
    cefrCountSpan.textContent = filteredWords.length;
    if (filteredWords.length === 0) {
      checkbox.checked = false;
      checkbox.disabled = true;
      checkbox.setAttribute("data-count", 0);
    } else {
      checkbox.disabled = false;
      checkbox.checked = true;
      checkbox.setAttribute("data-count", filteredWords.length);
    }
  });
  const wordTypeCheckboxes = document.querySelectorAll('input[name="words-types"]');
  wordTypeCheckboxes.forEach((checkbox) => {
    const wordType = checkbox.value;
    const wordTypeCountSpan = document.getElementById(`words-types-count-${wordType}`);
    const filteredWords = words.filter((word) => word.word_type === wordType);
    wordTypeCountSpan.textContent = filteredWords.length;
    if (filteredWords.length === 0) {
      checkbox.checked = false;
      checkbox.disabled = true;
      checkbox.setAttribute("data-count", 0);
    } else {
      checkbox.disabled = false;
      checkbox.checked = true;
      checkbox.setAttribute("data-count", filteredWords.length);
    }
  });
  const totalWordsCount = Object.values(englishWords).length;
  document.getElementById("word-count-label").textContent = totalWordsCount;
  document.getElementById("word-count-slider").value = totalWordsCount;
  document.getElementById("word-count-slider").min = 3;
  document.getElementById("word-count-slider").max = totalWordsCount;
  setStartButtonStyle(totalWordsCount);
}

function updateWordDisplay(filteredWords) {
  const cefrLevels = ["A1", "A2", "B1", "B2", "C1", "C2"];
  cefrLevels.forEach((cefrLevel) => {
    const cefrCountSpan = document.getElementById(`cefr-level-count-${cefrLevel}`);
    let wordsMatchingCEFR = 0;
    for (const word of filteredWords) {
      if (word.cefr_level === cefrLevel) {
        wordsMatchingCEFR++;
      }
    }
    cefrCountSpan.textContent = wordsMatchingCEFR;
    const checkbox = document.getElementById(`cefr-checkbox-${cefrLevel}`);
    if (!wordsMatchingCEFR) {
      checkbox.checked = false;
      checkbox.disabled = true;
    } else {
      checkbox.disabled = false;
      checkbox.checked = true;
    }
  });
  const totalWordsCount = filteredWords.length;
  const wordTypes = [
    "noun",
    "adjective",
    "verb",
    "adverb",
    "preposition",
    "pronoun",
    "interjection",
  ];
  const wordTypeCounts = {};
  wordTypes.forEach((wordType) => {
    wordTypeCounts[wordType] = 0;
  });
  for (const word of filteredWords) {
    if (wordTypes.includes(word.word_type)) {
      wordTypeCounts[word.word_type] += 1;
    }
  }
  wordTypes.forEach((wordType) => {
    const wordTypeCountSpan = document.getElementById(`words-types-count-${wordType}`);
    wordTypeCountSpan.textContent = wordTypeCounts[wordType];
    const checkbox = document.getElementById(`words-types-checkbox-${wordType}`);
    if (!wordTypeCounts[wordType]) {
      checkbox.checked = false;
      checkbox.disabled = true;
    } else {
      checkbox.disabled = false;
      checkbox.checked = true;
    }
  });
  document.getElementById("word-count-label").textContent = totalWordsCount;
  document.getElementById("word-count-slider").value = totalWordsCount;
  setStartButtonStyle(totalWordsCount);
}

function getObjectLength(obj) {
  return Object.keys(obj).length;
}

// Fetch quiz data from the server
async function fetchQuizData() {
  try {
    const response = await fetch('/quizzes/api/quiz-data/');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log("Fetched quiz data:", data); // Debugging line
    englishWords = data.reduce((acc, word) => {
      if (!word.text) {
        throw new Error(`Missing text property in word: ${JSON.stringify(word)}`);
      }
      acc[word.text] = word;
      return acc;
    }, {});
    
    // Initialize englishWordsRandomQuestion with the fetched data
    englishWordsRandomQuestion = JSON.parse(JSON.stringify(englishWords));
    
    startQuiz();
  } catch (error) {
    console.error('Error fetching quiz data:', error);
  }
}


