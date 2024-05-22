let quizData = []; // Array to store quiz data
let englishWords = {};
let englishWordsRandomQuestion = {};
// flag, that true if quiz start, and false - is stop or don't start yet
let is_quiz_start = false;
// Declare currentQuiz at a higher scope
let currentQuiz = null;
// Define the winnersArray variable
let winnersArray = [];
// Initialize qty attempts
let attempt = -1;
// Initialize a timer variable
let timer = 0;
let timerInterval;
// Reference to the timer spinner element
const timerSpinner = document.querySelector(".timer-spinner");
// Flag to track whether the timer spinner is visible
let isTimerSpinnerVisible = true;
// get total tasks count
const totalCountElement = document.getElementById("total-count");
let totalCountElementValue = 0;

// Find sectionы you want to hide or show
let showStartWindow = document.getElementById("english-words-quiz");
let statisticWindow = document.getElementById("statistic-window");
let quizField = document.getElementById("quiz-field");
const rulesSection = document.getElementById("rules");
const settingsSection = document.getElementById("settings");

// Add an event listener to the "Start"
var startQuizButton = document.getElementById("start-quiz-button");
startQuizButton.addEventListener("click", startQuiz);

// Add an event listener to the back to start window
showStartWindow.addEventListener("click", (event) => {
  event.preventDefault(); // Prevent the link from navigating

  if (!is_quiz_start) {
    // Hide the current sections and show the "statistic" section
    quizField.style.display = "none";
    statisticWindow.style.display = "block";
    rulesSection.style.display = "none";
    settingsSection.style.display = "none";
  }

  // Change background rules-link
  rulesLink.style.backgroundColor = "";
  settingsLink.style.backgroundColor = "";
});

// Find the "Rules" link by its ID
const rulesLink = document.getElementById("rules-link");
// Add a click event listener to the "Rules" link
rulesLink.addEventListener("click", (event) => {
  event.preventDefault(); // Prevent the link from navigating
  // Add an event listener click close button event
  closeButtonHandler("closeButtonRules");
  // Hide the current sections and show the "rules" section
  quizField.style.display = "none";
  statisticWindow.style.display = "none";
  rulesSection.style.display = "block";
  settingsSection.style.display = "none";

  // Change background rules-link
  rulesLink.style.backgroundColor = "rgba(128, 124, 124, 0.7)";
  settingsLink.style.backgroundColor = "";
});

// Find the "Settings" link by its ID
const settingsLink = document.getElementById("settings-link");
// Add a click event listener to the "Settings" link
settingsLink.addEventListener("click", (event) => {
  event.preventDefault(); // Prevent the link from navigating

  // Hide the current sections and show the "rules" section
  quizField.style.display = "none";
  statisticWindow.style.display = "none";
  rulesSection.style.display = "none";
  settingsSection.style.display = "block";

  // Change background rules-link
  settingsLink.style.backgroundColor = "rgba(128, 124, 124, 0.7)";
  const rulesLink = document.getElementById("rules-link");
  rulesLink.style.backgroundColor = "";

  // Add handler for reset button
  const resetButton = document.getElementById("resetSettingsDefault");
  resetButton.addEventListener("click", function () {
    initSettings();
  });
  // Add an event listener click close button event
  closeButtonHandler("closeButtonSettings");
});

// init settings
initSettings();

// // Set the initial value for the word count slider
const wordCountSlider = document.getElementById("word-count-slider");

// update label value if slider value is changed
const sliderLabel = document.getElementById("word-count-label");
wordCountSlider.addEventListener("input", function () {
  sliderLabel.textContent = wordCountSlider.value;
});

// add listener for change value of word count slider
wordCountSlider.addEventListener("change", function (event) {
  const newWordCount = event.target.value;
  // Update wordCount with the new value
  let wordCount = parseInt(newWordCount);

  // Filter the englishWords object to contain exactly wordCount words
  englishWords = Object.keys(englishWords)
    .slice(0, wordCount)
    .reduce((result, wordKey) => {
      const word = englishWords[wordKey];
      result[wordKey] = word;
      return result;
    }, {});

  applyChangeSettings();
});

// Set event listeners for CEFR checkboxes and word type checkboxes
const cefrCheckboxes = document.querySelectorAll('input[name="cefr-level"]');
cefrCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", applyChangeSettings);
});

const wordsTypesCheckboxes = document.querySelectorAll(
  'input[name="words-types"]'
);
wordsTypesCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", applyChangeSettings);
});

// Make handler for tips to disabled settings checkboxes
// Get all the checkboxes
const allCheckboxes = document.querySelectorAll('input[type="checkbox"]');
// Add a mouseover event handler to each checkbox
allCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("mouseover", () => {
    // Check if the checkbox is not checked
    if (!checkbox.checked) {      
      // set tips for disabled checkboxes
      // Determine the tooltip text based on the 'count' value
      let tooltipText = "";  
       // Get the 'data-count' attribute value from the htmlElement
      const count = parseInt(checkbox.getAttribute("data-count"), 10);
      if (count === 0) {
        tooltipText = "Sorry, but  *" + checkbox.value + "*  words are not yet in our quiz dictionary.";
      } else {
        tooltipText = "Use Reset to restore settings";
      }
      // add tip to mouseover event for disabled button
      setTooltip(checkbox, tooltipText);
    }
  });
});


/////////////// Functions //////////////////

/**
 * Sets a tooltip element near the specified HTML element with the given text.
 *
 * @param {HTMLElement} htmlElement - The HTML element to position the tooltip near.
 * @param {string} tooltipText - The text content of the tooltip.
 */
function setTooltip(htmlElement, tooltipText) {
  // Create a new tooltip element
  const tooltipElement = document.createElement("div");
  tooltipElement.className = "tooltip";
  tooltipElement.textContent = tooltipText;

  // Calculate the position of the tooltip relative to the htmlElement
  const htmlElementPosition = htmlElement.getBoundingClientRect();
  let tooltipTop = htmlElementPosition.top - tooltipElement.clientHeight - 30;

  // Ensure the tooltip stays within the mobile screen boundaries
  if (tooltipTop < 0) {
    // If the tooltip would go above the top of the screen, adjust its position
    tooltipTop = 10; // Place it 10px from the top
  }

  // Calculate the left position of the tooltip, ensuring it doesn't go off-screen
  let tooltipLeft = htmlElementPosition.left;

  // Check if the tooltip would go off the right side of the screen
  if ((tooltipLeft + tooltipElement.clientWidth) > window.innerWidth) {
    // Adjust the left position to keep the tooltip within the screen
    tooltipLeft = window.innerWidth - tooltipElement.clientWidth - 10; // 10px from the right edge
  }

  tooltipElement.style.position = "fixed"; // Use fixed position to position relative to viewport
  tooltipElement.style.top = tooltipTop + "px";
  tooltipElement.style.left = tooltipLeft + "px";

  // Append the tooltip element to the document body
  document.body.appendChild(tooltipElement);

  // Add a mouseout event listener to remove the tooltip on mouseout
  htmlElement.addEventListener("mouseout", () => {
    tooltipElement.remove();
  });

  // Set a timer to remove the tooltip after 3 seconds
  setTimeout(() => {
    tooltipElement.remove();
  }, 1000);
}

/**
 * Sets the style for the start button based on the total word count.
 *
 * @param {number} totalWordsCount - The total number of words for the quiz.
 */
function setStartButtonStyle(totalWordsCount) {
  // Get a reference to the button element you want to change
  const startButton = document.getElementById('start-quiz-button');

  // Define the background color for normal, hover, and disabled states
  const normalColor = 'rgba(76, 175, 80, 0.9)';
  const hoverColor = 'rgba(35, 105, 39, 0.9)';
  const disabledColor = 'grey';

  // Set the initial background color
  startButton.style.backgroundColor = normalColor;

  if (totalWordsCount >= 3) {
    // Enable the button and add hover effects
    startButton.disabled = false;

    // Add a mouseover (hover) event listener
    startButton.addEventListener('mouseover', () => {
      startButton.style.backgroundColor = hoverColor;
    });

    // Add a mouseout (hover out) event listener to revert to normal color
    startButton.addEventListener('mouseout', () => {
      startButton.style.backgroundColor = normalColor;
    });
  } else {
    // Disable the button and change its style
    startButton.style.backgroundColor = disabledColor;
    startButton.disabled = true;

    // Add a mouseover (hover) event listener for the disabled state
    startButton.addEventListener('mouseover', () => {
      startButton.style.backgroundColor = disabledColor;

      // add tip to mouseover event for disabled button
      let tooltipText = 'Use Reset to restore settings';
      setTooltip(startButton, tooltipText);

    });

    // Add a mouseout (hover out) event listener for the disabled state
    startButton.addEventListener('mouseout', () => {
      startButton.style.backgroundColor = disabledColor;
    });
  }
}

/**
 * close button handler.
 *
 * @returns {void}
 */
function closeButtonHandler(closeButtonId) {
  // Add an event listener click close button event
  const closeButton = document.getElementById(closeButtonId);
  closeButton.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent the link from navigating

    if (!is_quiz_start) {
      // Hide the current sections and show the "statistic" section
      quizField.style.display = "none";
      statisticWindow.style.display = "block";
      rulesSection.style.display = "none";
      settingsSection.style.display = "none";
    }

    // Change background rules-link
    rulesLink.style.backgroundColor = "";
    settingsLink.style.backgroundColor = "";
  });
}

/**
 * start the quiz.
 *
 * @returns {void}
 */
function startQuiz() {
  // set quiz settings
  applyChangeSettings();

  // start quiz flag to true
  is_quiz_start = true;

  // Hidden rules and settings links, and start quiz button
  let rulesStartSettingsElement = document.getElementsByClassName(
    "rules-start-settings"
  )[0];
  rulesStartSettingsElement.style.display = "none";
  // Start the timer when the user proceeds to the next question
  startTimer();

  // Increment attempts when starting a new quiz
  attempt++;

  // Hide the start page "statistic-window"
  statisticWindow.style.display = "none";
  rulesSection.style.display = "none";
  settingsSection.style.display = "none";

  // Show quiz area
  let quizField = document.getElementById("quiz-field");
  quizField.style.display = "flex";

  // Add an event listener to the "Next" button
  var nextQuizButton = document.getElementById("next-button");
  nextQuizButton.addEventListener("click", takeAturn);
  // Add an event listener for the "Stop" quiz button
  const stopQuizButton = document.getElementById("stop-button");
  stopQuizButton.addEventListener("click", stopQuiz);

  englishWordsRandomQuestion = JSON.parse(JSON.stringify(englishWords));
  // Display new question
  const randomQuestion = getRandomQuestion(englishWordsRandomQuestion);
  currentQuiz = displayQuestion(randomQuestion);
  currentQuiz.attempt = attempt;
  quizData.push(currentQuiz);

  // Set right and wrong counts to 0
  const rightCountElement = document.getElementById("right-count");
  const wrongCountElement = document.getElementById("wrong-count");

  rightCountElement.textContent = "0";
  wrongCountElement.textContent = "0";

  // Get the container elements for the answered and total counts
  const answeredCountElement = document.getElementById("answered-count");

  answeredCountElement.textContent = "0";
  totalCountElementValue = getObjectLength(englishWords);
  totalCountElement.textContent = totalCountElementValue;
}

/**
 * finish the quiz.
 *
 * @returns {void}
 */
function stopQuiz() {
  addSpentTimeToLastAttempt();
  // stop quiz flag to false
  is_quiz_start = false;

  // Show rules and settings links, and start quiz button
  let rulesStartSettingsElement = document.getElementsByClassName(
    "rules-start-settings"
  )[0];
  rulesStartSettingsElement.style.display = "flex";

  // reset rules-lin background to default
  rulesLink.style.backgroundColor = "";
  settingsLink.style.backgroundColor = "";

  // Stop the timer when the user stops the quiz
  stopTimer();

  // Calculate the total time spent for the current attempt
  const totalTimeSpent = quizData.reduce((totalTime, quiz) => {
    if (quiz.attempt === attempt) {
      totalTime += quiz.spentTime;
    }
    return totalTime;
  }, 0);

  // Show the page "statistic-window"
  statisticWindow.style.display = "block";

  // Hide quiz area
  quizField.style.display = "none";

  // Access the winners' table element's tbody
  const winnersTable = document.querySelector("#winners-table tbody");

  // Calculate the total number of correct answers for the current attempt
  const totalCorrectAnswers = quizData.reduce((total, quiz) => {
    const correctAnswers = quiz.answers.filter(
      (answer) =>
        answer.isCorrect && answer.isUserChoice && quiz.attempt === attempt
    ).length;
    return total + correctAnswers;
  }, 0);

  // Add the total data to the array
  if (totalCorrectAnswers > 0) {
    winnersArray.push({
      place: 0, // Initialize with 0, will be updated later
      attempt: attempt, // Calculate attempts value
      scores: totalCorrectAnswers,
      timeSpent: totalTimeSpent,
    });
  }

  // Get the data from the winners table (excluding the first row)
  const winnersTableData = Array.from(winnersTable.rows)
    .slice(1)
    .map((row) => {
      const [place, attempt, scores, timeSpent] = row.cells;
      return {
        place: Number(place.textContent),
        attempt: attempt.textContent.trim(), // Use trim to remove leading/trailing whitespace
        scores: Number(scores.textContent),
        timeSpent: Number(timeSpent.textContent), // Corrected property name
      };
    });

  // Merge the data from the winners table into the winnersArray
  winnersTableData.forEach((data) => {
    const existingWinner = winnersArray.find(
      (winner) => winner.attempt === data.attempt
    );
    if (existingWinner) {
      // Update the place if a matching entry exists
      existingWinner.place = data.place;
    }
  });

  // Sort the array by scores in descending order and, if scores are equal, by time spent in ascending order
  winnersArray.sort((a, b) => {
    if (a.scores !== b.scores) {
      return b.scores - a.scores;
    } else {
      return a.timeSpent - b.timeSpent;
    }
  });

  // Update the 'place' values based on the sorted order
  winnersArray.forEach((winner, index) => {
    winner.place = index + 1;
  });

  // Populate the winners table HTML based on the sorted array
  winnersTable.innerHTML = "";
  winnersArray.forEach((winner, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${winner.place}</td>
            <td>${getAttemptString(winner.attempt)}</td>
            <td>${winner.scores}</td>
            <td>${winner.timeSpent}</td>
        `;
    // Add the .highlight class to the first three rows
    if (index < 3) {
      row.classList.add("highlight");
    }
    winnersTable.appendChild(row);
  });

  // Restore default background for quizsquare
  const quizsquareFieldElement = document.querySelector(".quizsquare");
  quizsquareFieldElement.style.background = "rgba(39, 34, 34, 0.7)";
}

/**
 * get a string representation of the attempt index.
 *
 * @param {number} index - The attempt index.
 * @returns {string} - The attempt string.
 */
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
  ]; // Add more as needed
  return attemptStrings[index] || "first";
}

/**
 * take the next turn in the quiz.
 *
 * @returns {void}
 */
function takeAturn() {
  addSpentTimeToLastAttempt();

  timer = 31; // restore timert value to 30 sec

  // Check if any answer option is selected
  const selectedOption = document.querySelector(
    'input[name="answer-option"]:checked'
  );

  if (!selectedOption) {
    // If no answer option is selected, consider it as an incorrect answer
    const wrongCountElement = document.getElementById("wrong-count");
    const wrongCount = parseInt(wrongCountElement.textContent) + 1;
    wrongCountElement.textContent = wrongCount;
  }

  // check last answer
  checkLastAnswer();

  // update quiz count and check that current question is last question
  const answeredCountElement = document.getElementById("answered-count");
  const answered = parseInt(answeredCountElement.textContent) + 1;
  answeredCountElement.textContent = answered;
  if (answered >= totalCountElementValue) {
    stopQuiz();
  } else {
    // Display new question
    // englishWordsRandomQuestion = JSON.parse(JSON.stringify(englishWords));
    const randomQuestion = getRandomQuestion(englishWordsRandomQuestion);
    currentQuiz = displayQuestion(randomQuestion);
    currentQuiz.attempt = attempt;
    currentQuiz.spentTime = 0;

    quizData.push(currentQuiz);
  }
}

/**
 * add spent time to the last attempt.
 *
 * @returns {void}
 */
function addSpentTimeToLastAttempt() {
  quizData[quizData.length - 1].spentTime = 30 - timer;
}

/**
 * check the last answer.
 *
 * @returns {void}
 */
function checkLastAnswer() {
  const lastQuiz = quizData[quizData.length - 1]; // Get the last quiz data

  if (lastQuiz) {
    const answers = lastQuiz.answers;
    const lastUserAnswer = answers.find((answer) => answer.isUserChoice);

    if (lastUserAnswer) {
      if (lastUserAnswer.isCorrect) {
        // User's answer is correct
        const rightCountElement = document.getElementById("right-count");
        const rightCount = parseInt(rightCountElement.textContent) + 1;
        rightCountElement.textContent = rightCount;
      } else {
        // User's answer is incorrect
        const wrongCountElement = document.getElementById("wrong-count");
        const wrongCount = parseInt(wrongCountElement.textContent) + 1;
        wrongCountElement.textContent = wrongCount;
      }
    }
  }
}

/**
 * get a random question for the quiz.
 *
 * @param {object} englishWordsRandomQuestion - The object containing random words.
 * @returns {object} - The random question object.
 */
function getRandomQuestion(englishWordsRandomQuestion) {
  // Get all word keys
  const wordKeys = Object.keys(englishWordsRandomQuestion);
  // Get a random index to select a word
  const randomIndex = Math.floor(Math.random() * wordKeys.length);

  // Get the selected word key
  const selectedWordKey = wordKeys[randomIndex];

  // Get the word object for the selected key
  const wordObject = englishWords[selectedWordKey];

  // Get a random word-type object from the "word-types" array
  const randomWordType =
    wordObject["word-types"][
      Math.floor(Math.random() * wordObject["word-types"].length)
    ];

  // Get a random definition object from the "definitions" array
  const randomDefinition =
    randomWordType.definitions[
      Math.floor(Math.random() * randomWordType.definitions.length)
    ];

  // Construct the question object
  const question = {
    word: selectedWordKey,
    wordType: randomWordType["word-type"],
    definition: randomDefinition.definition,
    translations: randomDefinition.translate,
    imageUrl: wordObject.image_url,
    soundUrl: wordObject.sound_url,
    cefrLevel: wordObject.cefr.level,
    cefrTitle: wordObject.cefr.title,
  };

  // Remove the used word from englishWords
  delete englishWordsRandomQuestion[selectedWordKey];

  return question;
}

/**
 * display the question in the quiz.
 *
 * @param {object} question - The question object to display.
 * @returns {object} - The current quiz object.
 */
function displayQuestion(question) {
  // Get DOM elements
  const quizTaskElement = document.querySelector(".quiz-task");
  const wordTypeElement = document.querySelector(".word-type");
  const wordDefinitionElement = document.querySelector(".word-definition");
  const answersListElement = document.querySelector(".answers-list");
  const imgWordeElement = document.querySelector(".img-word-image");
  const timerSpinner = document.querySelector(".timer-spinner");

  // Set timer background in default color
  timerSpinner.style.backgroundColor = "rgba(51, 51, 51, 0.7)";
  timerSpinner.style.color = "white";

  // Update question elements
  quizTaskElement.textContent = "Guess the word by definition:";
  wordTypeElement.textContent = question.wordType;
  wordDefinitionElement.textContent = question.definition;
  imgWordeElement.src = question.imageUrl;
  imgWordeElement.alt = question.definition;

  // Clear any previous answer options
  answersListElement.innerHTML = "";

  // Create an array to hold answer options (translations)
  const answerOptions = [];

  // Add the correct answer to the array
  answerOptions.push({
    answer: question.word,
    isCorrect: true,
    isUserChoice: false,
  });

  // Create a list of unique incorrect answers
  const uniqueIncorrectAnswers = [];

  while (uniqueIncorrectAnswers.length < 2) {
    // Get an array of keys (words) from englishWords
    const wordKeys = Object.keys(englishWords);

    // Select a random key from the array
    const randomKey = wordKeys[Math.floor(Math.random() * wordKeys.length)];

    // Make sure it's not the same as the correct answer and not already in uniqueIncorrectAnswers
    if (
      randomKey !== question.word &&
      !uniqueIncorrectAnswers.includes(randomKey)
    ) {
      uniqueIncorrectAnswers.push(randomKey);
    }
  }

  // Add unique incorrect answers to the array
  uniqueIncorrectAnswers.forEach((randomKey) => {
    answerOptions.push({
      answer: randomKey,
      isCorrect: false,
      isUserChoice: false,
    });
  });

  // Randomly shuffle the answer options
  const shuffledOptions = shuffleArray(answerOptions);

  // Add answer options to the DOM
  shuffledOptions.forEach((option) => {
    const li = document.createElement("li");
    const input = document.createElement("input");
    const label = document.createElement("label");
    const audioElement = document.createElement("audio");
    const audioSourceElement = document.createElement("source");
    const audioButtonPlayElement = document.createElement("button");

    // Add audio url for the current word
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

    // Add a click event handler for each <li>
    li.addEventListener("click", () => {
      // Find the radio button inside the <li>
      const radio = li.querySelector('input[type="radio"]');

      // Check the radio button
      radio.checked = true;

      // Trigger a change event on the radio button to ensure it reflects its checked state
      const event = new Event("change", { bubbles: true });
      radio.dispatchEvent(event);
    });

    // Add an event listener to track user's choice
    input.addEventListener("change", () => {
      option.isUserChoice = input.checked;

      // Stop any previously playing audio
      const allAudioElements = document.querySelectorAll(".word-audio");
      allAudioElements.forEach((audioElement) => {
        audioElement.pause();
      });

      // Find the selected word in englishWords
      const selectedWord = englishWords[option.answer];

      if (selectedWord) {
        // Play audio for the selected word
        audioButtonPlayElement.onclick = function () {
          document.getElementById(option.answer).play();
        };
        audioElement.load(); // Load the audio
        audioElement.play(); // Play the audio
      }
    });
  });

  // Add the currentQuiz object to the quizData array
  currentQuiz = {
    question: question.definition,
    answers: answerOptions,
    scores: 0, // Initialize scores for this quiz
    timeSpent: 0,
  };

  return currentQuiz;
}

/**
 * update the timer display.
 *
 * @returns {void}
 */
function updateTimerDisplay() {
  const timerDisplay = document.querySelector(".timer-spinner");
  timerDisplay.textContent = `${timer}`;
}

/**
 * start the timer.
 *
 * @returns {void}
 */
function startTimer() {
  timer = 30; // Set the initial time to 30 seconds
  updateTimerDisplay(); // Update the timer display with the initial time

  timerInterval = setInterval(() => {
    --timer; // Decrement the timer
    updateTimerDisplay(); // Update the timer display

    // Check if the timer has reached 0
    if (timer < 0) {
      // Time's up, do something (e.g., handle it as you need)
      stopTimer(); // Stop the timer when it reaches 0
      stopQuiz(); // Stop quiz
    } else if (timer <= 10) {
      // If the timer is 10 seconds or less, change the background color to red and make it flash
      timerSpinner.style.backgroundColor = isTimerSpinnerVisible ? "red" : "white";
      timerSpinner.style.color = isTimerSpinnerVisible ? "white" : "red";

      // Toggle the flag to control visibility
      isTimerSpinnerVisible = !isTimerSpinnerVisible;
    }
  }, 1000);
}

/**
 * stop the timer.
 *
 * @returns {void}
 */
function stopTimer() {
  clearInterval(timerInterval);
}

/**
 * shuffle a copy of an array randomly.
 *
 * @param {array} array - The array to shuffle.
 * @returns {array} - The shuffled array.
 */
function shuffleArray(array) {
  const shuffledArray = [...array]; // Создаем копию исходного массива
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}

//////////// work with settings ////////////

/**
 * parse settings from the HTML table.
 *
 * @returns {object} - The parsed settings object.
 */
function parseSettingsFromTable() {
  const settings = {
    cefrLevels: [],
    wordTypes: [],
    wordCount: 3, // Default value for word count
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

/**
 * apply selected settings and filter words accordingly.
 *
 * @returns {void}
 */
function applyChangeSettings() {
  // Parse the selected settings
  const selectedSettings = parseSettingsFromTable();

  // Filter words based on selected settings
  const filteredWords = filterWordsBySettings(englishWords, selectedSettings);
  englishWords = filteredWords;

  // Update the word display or perform any other actions as needed
  updateWordDisplay(filteredWords);
}

/**
 * filter word types based on user settings.
 *
 * @param {object} word - The word object to filter.
 * @param {object} settings - The user settings.
 * @returns {boolean} - Returns true if the word has matching word types, or false if removed.
 */
function filterWordTypes(word, settings) {
  word["word-types"] = word["word-types"].filter((type) => {
    const shouldIncludeType = settings.wordTypes.includes(type["word-type"]);
    if (!shouldIncludeType) {
      // Remove the definition if it does not match the settings
      return false;
    }
    return true;
  });

  if (word["word-types"].length === 0) {
    // If the word has no more definitions, remove it from filteredWords
    return false;
  }

  return true;
}

/**
 * filter words by settings.
 *
 * @param {object} englishWords - The original English words object.
 * @param {object} settings - The user settings.
 * @returns {object} - The filtered English words object.
 */
function filterWordsBySettings(englishWords, settings) {
  // Copy the source words into a new object so that we don't modify the original data
  const filteredWords = JSON.parse(JSON.stringify(englishWords));

  // Remove definitions and words without definitions according to the word-types settings
  for (const wordKey in filteredWords) {
    if (filteredWords.hasOwnProperty(wordKey)) {
      const word = filteredWords[wordKey];

      if (!filterWordTypes(word, settings)) {
        // If filterWordTypes returns false, remove the word from filteredWords
        delete filteredWords[wordKey];
      }
    }
  }

  englishWords = Object.keys(filteredWords).reduce((result, wordKey) => {
    const word = filteredWords[wordKey];
    const cefrMatch = settings.cefrLevels.includes(word.cefr.level);

    if (cefrMatch > 0) {
      result[wordKey] = word;
    }

    return result;
  }, {});

  return englishWords;
}

/**
 * initialize settings.
 *
 * @returns {void}
 */
function initSettings() {
  // Iterate through all CEFR levels and words
  const cefrCheckboxes = document.querySelectorAll('input[name="cefr-level"]');

  englishWords = JSON.parse(JSON.stringify(englishWordsInit));
  const words = Object.values(englishWords);

  cefrCheckboxes.forEach((checkbox) => {
    const cefrLevel = checkbox.value;
    const cefrCountSpan = document.getElementById(
      `cefr-level-count-${cefrLevel}`
    );

    // Filter words by CEFR level
    const filteredWords = words.filter((word) => word.cefr.level === cefrLevel);

    // Update the count based on the filtered words
    cefrCountSpan.textContent = filteredWords.length;

    // Check if the CEFR level exists in the englishWordsInit object
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

  // Iterate through all word types and variations
  const wordTypeCheckboxes = document.querySelectorAll(
    'input[name="words-types"]'
  );
  wordTypeCheckboxes.forEach((checkbox) => {
    const wordType = checkbox.value;
    const wordTypeCountSpan = document.getElementById(
      `words-types-count-${wordType}`
    );

    const words = Object.values(englishWords);

    // Filter words by word type and variations
    const filteredWords = words.filter((word) =>
      word["word-types"].some((type) => type["word-type"] === wordType)
    );

    // Update the count based on the filtered words
    wordTypeCountSpan.textContent = filteredWords.length;

    // Check if the word type exists in the englishWordsInit object
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

  // Update the "Total Words" value to the total number of words
  const totalWordsCount = Object.values(englishWords).length;
  document.getElementById("word-count-label").textContent = totalWordsCount;
  document.getElementById("word-count-slider").value = totalWordsCount;
  document.getElementById("word-count-slider").min = 3;
  document.getElementById("word-count-slider").max = totalWordsCount;

  // change disabled and background in start quiz button for different cases
  setStartButtonStyle(totalWordsCount);
}

/**
 * update the HTML settings table based on filtered words.
 *
 * @param {object} filteredWords - The filtered English words object.
 * @returns {void}
 */
function updateWordDisplay(filteredWords) {
  // Update CEFR levels in the settings table
  const cefrLevels = ["A1", "A2", "B1", "B2", "C1", "C2"];
  cefrLevels.forEach((cefrLevel) => {
    // Find the span element that displays the count for this CEFR level
    const cefrCountSpan = document.getElementById(
      `cefr-level-count-${cefrLevel}`
    );

    // Filter the words that match the current CEFR level
    let wordsMatchingCEFR = 0;
    for (const wordKey in filteredWords) {
      if (filteredWords.hasOwnProperty(wordKey)) {
        const word = filteredWords[wordKey];
        if (word.cefr.level === cefrLevel) {
          wordsMatchingCEFR++;
        }
      }
    }

    // Update the count displayed in the span element
    cefrCountSpan.textContent = wordsMatchingCEFR;

    // Find the checkbox element
    const checkbox = document.getElementById(`cefr-checkbox-${cefrLevel}`);

    // Update the checkbox state and disabled property based on CEFR level existence
    if (!wordsMatchingCEFR) {
      checkbox.checked = false;
      checkbox.disabled = true;
    } else {
      checkbox.disabled = false;
      checkbox.checked = true;
    }
  });

  // Update "Total Words" in the settings table
  const totalWordsCount = getObjectLength(filteredWords);

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

  // Initialise counters for each word type
  wordTypes.forEach((wordType) => {
    wordTypeCounts[wordType] = 0;
  });

  // Go through the words and increase the counters for the corresponding word types
  for (const wordKey in filteredWords) {
    if (filteredWords.hasOwnProperty(wordKey)) {
      const word = filteredWords[wordKey];
      word["word-types"].forEach((type) => {
        if (wordTypes.includes(type["word-type"])) {
          wordTypeCounts[type["word-type"]] += 1;
        }
      });
    }
  }

  wordTypes.forEach((wordType) => {
    // Find the span element that displays the count for this word type
    const wordTypeCountSpan = document.getElementById(
      `words-types-count-${wordType}`
    );
    wordTypeCountSpan.textContent = wordTypeCounts[wordType];
    // Find the checkbox element
    const checkbox = document.getElementById(
      `words-types-checkbox-${wordType}`
    );

    // Update the checkbox state and disabled property based on CEFR level existence
    if (!wordTypeCounts[wordType]) {
      checkbox.checked = false;
      checkbox.disabled = true;
    } else {
      checkbox.disabled = false;
      checkbox.checked = true;
    }
  });

  // change disabled and background in start quiz button for different cases
  document.getElementById("word-count-label").textContent = totalWordsCount;
  document.getElementById("word-count-slider").value = totalWordsCount;

  // change disabled and background in start quiz button for different cases
  setStartButtonStyle(totalWordsCount);
}

/**
 * get the length of an object.
 *
 * @param {object} obj - The object to measure.
 * @returns {number} - The length of the object.
 */
function getObjectLength(obj) {
  return Object.keys(obj).length;
}
