class Quiz {
  constructor() {
    this.data = []; // Array to store quiz data
    this.englishWords = {};
    this.englishWordsRandomQuestion = {};
    this.isQuizStart = false; // Flag indicating if the quiz has started
    this.currentQuiz = null;
    this.winnersArray = [];
    this.attempt = -1; // Initialize attempt counter
    this.timer = 0;
    this.timerInterval = null;
    this.isTimerSpinnerVisible = true;

    this.timerSpinner = document.querySelector(".timer-spinner");
    this.totalCountElement = document.getElementById("total-count");
    this.totalCountElementValue = 0;

    this.showStartWindow = document.getElementById("english-words-quiz");
    this.statisticWindow = document.getElementById("statistic-window");
    this.quizField = document.getElementById("quiz-field");
    this.rulesSection = document.getElementById("rules");
    this.settingsSection = document.getElementById("settings");

    this.startQuizButton = document.getElementById("start-quiz-button");
    this.rulesLink = document.getElementById("rules-link");
    this.settingsLink = document.getElementById("settings-link");

    this.initialize();
  }

  initialize() {
    this.startQuizButton.addEventListener("click", () => this.startQuiz());
    this.showStartWindow.addEventListener("click", (event) => this.handleStartWindowClick(event));
    this.rulesLink.addEventListener("click", (event) => this.handleRulesLinkClick(event));
    this.settingsLink.addEventListener("click", (event) => this.handleSettingsLinkClick(event));

    this.initSettings();

    const wordCountSlider = document.getElementById("word-count-slider");
    const sliderLabel = document.getElementById("word-count-label");
    wordCountSlider.addEventListener("input", () => {
      sliderLabel.textContent = wordCountSlider.value;
    });
    wordCountSlider.addEventListener("change", (event) => {
      this.handleWordCountSliderChange(event);
    });

    const cefrCheckboxes = document.querySelectorAll('input[name="cefr-level"]');
    cefrCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", () => this.applyChangeSettings());
    });

    const wordsTypesCheckboxes = document.querySelectorAll('input[name="words-types"]');
    wordsTypesCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", () => this.applyChangeSettings());
    });

    const allCheckboxes = document.querySelectorAll('input[type="checkbox"]');
    allCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener("mouseover", () => this.handleCheckboxMouseOver(checkbox));
    });
  }

  handleStartWindowClick(event) {
    event.preventDefault();
    if (!this.isQuizStart) {
      this.toggleVisibility({
        "quiz-field": "none",
        "statistic-window": "block",
        "rules": "none",
        "settings": "none"
      });
      this.resetLinkBackgrounds();
    }
  }

  handleRulesLinkClick(event) {
    event.preventDefault();
    this.closeButtonHandler("closeButtonRules");
    this.toggleVisibility({
      "quiz-field": "none",
      "statistic-window": "none",
      "rules": "block",
      "settings": "none"
    });
    this.rulesLink.style.backgroundColor = "rgba(128, 124, 124, 0.7)";
    this.settingsLink.style.backgroundColor = "";
  }

  handleSettingsLinkClick(event) {
    event.preventDefault();
    this.closeButtonHandler("closeButtonSettings");
    this.toggleVisibility({
      "quiz-field": "none",
      "statistic-window": "none",
      "rules": "none",
      "settings": "block"
    });
    this.settingsLink.style.backgroundColor = "rgba(128, 124, 124, 0.7)";
    this.rulesLink.style.backgroundColor = "";

    const resetButton = document.getElementById("resetSettingsDefault");
    resetButton.addEventListener("click", () => this.initSettings());
  }

  handleWordCountSliderChange(event) {
    const newWordCount = event.target.value;
    this.englishWords = Object.keys(this.englishWords)
      .slice(0, newWordCount)
      .reduce((result, wordKey) => {
        result[wordKey] = this.englishWords[wordKey];
        return result;
      }, {});
    this.applyChangeSettings();
  }

  handleCheckboxMouseOver(checkbox) {
    if (!checkbox.checked) {
      const count = parseInt(checkbox.getAttribute("data-count"), 10);
      const tooltipText = count === 0
        ? `Sorry, but *${checkbox.value}* words are not yet in our quiz dictionary.`
        : "Use Reset to restore settings";
      this.setTooltip(checkbox, tooltipText);
    }
  }

  toggleVisibility(elements) {
    Object.entries(elements).forEach(([key, value]) => {
      const element = document.getElementById(key);
      if (element) {
        element.style.display = value;
      } else {
        console.warn(`Element with ID "${key}" not found.`);
      }
    });
  }

  setTooltip(htmlElement, tooltipText) {
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
    tooltipElement.style.top = `${tooltipTop}px`;
    tooltipElement.style.left = `${tooltipLeft}px`;

    document.body.appendChild(tooltipElement);

    htmlElement.addEventListener("mouseout", () => {
      tooltipElement.remove();
    });

    setTimeout(() => {
      tooltipElement.remove();
    }, 1000);
  }

  setStartButtonStyle(totalWordsCount) {
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
        this.setTooltip(startButton, 'Use Reset to restore settings');
      });
      startButton.addEventListener('mouseout', () => {
        startButton.style.backgroundColor = disabledColor;
      });
    }
  }

  closeButtonHandler(closeButtonId) {
    const closeButton = document.getElementById(closeButtonId);
    closeButton.addEventListener("click", (event) => {
      event.preventDefault();
      if (!this.isQuizStart) {
        this.toggleVisibility({
          "quiz-field": "none",
          "statistic-window": "block",
          "rules": "none",
          "settings": "none"
        });
        this.resetLinkBackgrounds();
      }
    });
  }

  startQuiz() {
    this.applyChangeSettings();
    this.isQuizStart = true;
    this.toggleVisibility({
      "rules-start-settings": "none"
    });
    this.startTimer();

    this.attempt++;
    this.toggleVisibility({
      "statistic-window": "none",
      "rules": "none",
      "settings": "none",
      "quiz-field": "flex"
    });

    const nextQuizButton = document.getElementById("next-button");
    nextQuizButton.addEventListener("click", () => this.takeATurn());

    const stopQuizButton = document.getElementById("stop-button");
    stopQuizButton.addEventListener("click", () => this.stopQuiz());

    this.englishWordsRandomQuestion = JSON.parse(JSON.stringify(this.englishWords));
    const randomQuestion = this.getRandomQuestion(this.englishWordsRandomQuestion);
    this.currentQuiz = this.displayQuestion(randomQuestion);
    this.currentQuiz.attempt = this.attempt;
    this.data.push(this.currentQuiz);

    document.getElementById("right-count").textContent = "0";
    document.getElementById("wrong-count").textContent = "0";
    document.getElementById("answered-count").textContent = "0";
    this.totalCountElementValue = this.getObjectLength(this.englishWords);
    this.totalCountElement.textContent = this.totalCountElementValue;
  }

  stopQuiz() {
    this.addSpentTimeToLastAttempt();
    this.isQuizStart = false;

    this.toggleVisibility({
      "rules-start-settings": "flex"
    });

    this.resetLinkBackgrounds();
    this.stopTimer();

    const totalTimeSpent = this.data.reduce((totalTime, quiz) => {
      if (quiz.attempt === this.attempt) {
        totalTime += quiz.spentTime;
      }
      return totalTime;
    }, 0);

    this.toggleVisibility({
      "statistic-window": "block",
      "quiz-field": "none"
    });

    const winnersTable = document.querySelector("#winners-table tbody");

    const totalCorrectAnswers = this.data.reduce((total, quiz) => {
      const correctAnswers = quiz.answers.filter(
        (answer) => answer.isCorrect && answer.isUserChoice && quiz.attempt === this.attempt
      ).length;
      return total + correctAnswers;
    }, 0);

    if (totalCorrectAnswers > 0) {
      this.winnersArray.push({
        place: 0,
        attempt: this.attempt,
        scores: totalCorrectAnswers,
        timeSpent: totalTimeSpent,
      });
    }

    const winnersTableData = Array.from(winnersTable.rows).slice(1).map((row) => {
      const [place, attempt, scores, timeSpent] = row.cells;
      return {
        place: Number(place.textContent),
        attempt: attempt.textContent.trim(),
        scores: Number(scores.textContent),
        timeSpent: Number(timeSpent.textContent),
      };
    });

    winnersTableData.forEach((data) => {
      const existingWinner = this.winnersArray.find((winner) => winner.attempt === data.attempt);
      if (existingWinner) {
        existingWinner.place = data.place;
      }
    });

    this.winnersArray.sort((a, b) => {
      if (a.scores !== b.scores) {
        return b.scores - a.scores;
      } else {
        return a.timeSpent - b.timeSpent;
      }
    });

    this.winnersArray.forEach((winner, index) => {
      winner.place = index + 1;
    });

    winnersTable.innerHTML = "";
    this.winnersArray.forEach((winner, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
            <td>${winner.place}</td>
            <td>${this.getAttemptString(winner.attempt)}</td>
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

  takeATurn() {
    this.addSpentTimeToLastAttempt();
    this.timer = 31;
    const selectedOption = document.querySelector('input[name="answer-option"]:checked');
    if (!selectedOption) {
      const wrongCountElement = document.getElementById("wrong-count");
      wrongCountElement.textContent = parseInt(wrongCountElement.textContent) + 1;
    }

    this.checkLastAnswer();

    const answeredCountElement = document.getElementById("answered-count");
    const answered = parseInt(answeredCountElement.textContent) + 1;
    answeredCountElement.textContent = answered;
    if (answered >= this.totalCountElementValue) {
      this.stopQuiz();
    } else {
      const randomQuestion = this.getRandomQuestion(this.englishWordsRandomQuestion);
      this.currentQuiz = this.displayQuestion(randomQuestion);
      this.currentQuiz.attempt = this.attempt;
      this.currentQuiz.spentTime = 0;
      this.data.push(this.currentQuiz);
    }
  }

  addSpentTimeToLastAttempt() {
    this.data[this.data.length - 1].spentTime = 30 - this.timer;
  }

  checkLastAnswer() {
    const lastQuiz = this.data[this.data.length - 1];
    if (lastQuiz) {
      const answers = lastQuiz.answers;
      const lastUserAnswer = answers.find((answer) => answer.isUserChoice);
      if (lastUserAnswer) {
        if (lastUserAnswer.isCorrect) {
          const rightCountElement = document.getElementById("right-count");
          rightCountElement.textContent = parseInt(rightCountElement.textContent) + 1;
        } else {
          const wrongCountElement = document.getElementById("wrong-count");
          wrongCountElement.textContent = parseInt(wrongCountElement.textContent) + 1;
        }
      }
    }
  }

  getRandomQuestion(englishWordsRandomQuestion) {
    const wordKeys = Object.keys(englishWordsRandomQuestion);
    const randomIndex = Math.floor(Math.random() * wordKeys.length);
    const selectedWordKey = wordKeys[randomIndex];
    const wordObject = this.englishWords[selectedWordKey];
    const randomWordType = wordObject["word-types"][Math.floor(Math.random() * wordObject["word-types"].length)];
    const randomDefinition = randomWordType.definitions[Math.floor(Math.random() * randomWordType.definitions.length)];

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

    delete englishWordsRandomQuestion[selectedWordKey];
    return question;
  }

  displayQuestion(question) {
    const quizTaskElement = document.querySelector(".quiz-task");
    const wordTypeElement = document.querySelector(".word-type");
    const wordDefinitionElement = document.querySelector(".word-definition");
    const answersListElement = document.querySelector(".answers-list");
    const imgWordElement = document.querySelector(".img-word-image");

    this.timerSpinner.style.backgroundColor = "rgba(51, 51, 51, 0.7)";
    this.timerSpinner.style.color = "white";

    quizTaskElement.textContent = "Guess the word by definition:";
    wordTypeElement.textContent = question.wordType;
    wordDefinitionElement.textContent = question.definition;
    imgWordElement.src = question.imageUrl;
    imgWordElement.alt = question.definition;

    answersListElement.innerHTML = "";

    const answerOptions = [];
    answerOptions.push({
      answer: question.word,
      isCorrect: true,
      isUserChoice: false,
    });

    const uniqueIncorrectAnswers = [];
    while (uniqueIncorrectAnswers.length < 2) {
      const wordKeys = Object.keys(this.englishWords);
      const randomKey = wordKeys[Math.floor(Math.random() * wordKeys.length)];
      if (randomKey !== question.word && !uniqueIncorrectAnswers.includes(randomKey)) {
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

    const shuffledOptions = this.shuffleArray(answerOptions);

    shuffledOptions.forEach((option) => {
      const li = document.createElement("li");
      const input = document.createElement("input");
      const label = document.createElement("label");
      const audioElement = document.createElement("audio");
      const audioSourceElement = document.createElement("source");
      const audioButtonPlayElement = document.createElement("button");

      const currentWord = this.englishWords[option.answer];
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
        const selectedWord = this.englishWords[option.answer];
        if (selectedWord) {
          audioButtonPlayElement.onclick = function () {
            document.getElementById(option.answer).play();
          };
          audioElement.load();
          audioElement.play();
        }
      });
    });

    return {
      question: question.definition,
      answers: answerOptions,
      scores: 0,
      timeSpent: 0,
    };
  }

  updateTimerDisplay() {
    this.timerSpinner.textContent = `${this.timer}`;
  }

  startTimer() {
    this.timer = 30;
    this.updateTimerDisplay();
    this.timerInterval = setInterval(() => {
      --this.timer;
      this.updateTimerDisplay();
      if (this.timer < 0) {
        this.stopTimer();
        this.stopQuiz();
      } else if (this.timer <= 10) {
        this.timerSpinner.style.backgroundColor = this.isTimerSpinnerVisible ? "red" : "white";
        this.timerSpinner.style.color = this.isTimerSpinnerVisible ? "white" : "red";
        this.isTimerSpinnerVisible = !this.isTimerSpinnerVisible;
      }
    }, 1000);
  }

  stopTimer() {
    clearInterval(this.timerInterval);
  }

  shuffleArray(array) {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  }

  parseSettingsFromTable() {
    const settings = {
      cefrLevels: [],
      wordTypes: [],
      wordCount: 3,
    };

    const table = document.getElementById("settings-table");
    const checkboxes = table.querySelectorAll('input[name="cefr-level"]:checked, input[name="words-types"]:checked');
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

  applyChangeSettings() {
    const selectedSettings = this.parseSettingsFromTable();
    const filteredWords = this.filterWordsBySettings(this.englishWords, selectedSettings);
    this.englishWords = filteredWords;
    this.updateWordDisplay(filteredWords);
  }

  filterWordTypes(word, settings) {
    word["word-types"] = word["word-types"].filter((type) => settings.wordTypes.includes(type["word-type"]));
    return word["word-types"].length > 0;
  }

  filterWordsBySettings(englishWords, settings) {
    const filteredWords = JSON.parse(JSON.stringify(englishWords));
    for (const wordKey in filteredWords) {
      if (!this.filterWordTypes(filteredWords[wordKey], settings)) {
        delete filteredWords[wordKey];
      }
    }
    return Object.keys(filteredWords).reduce((result, wordKey) => {
      const word = filteredWords[wordKey];
      if (settings.cefrLevels.includes(word.cefr.level)) {
        result[wordKey] = word;
      }
      return result;
    }, {});
  }

  initSettings() {
    this.englishWords = JSON.parse(JSON.stringify(englishWordsInit));
    const words = Object.values(this.englishWords);
    const cefrCheckboxes = document.querySelectorAll('input[name="cefr-level"]');
    cefrCheckboxes.forEach((checkbox) => {
      const cefrLevel = checkbox.value;
      const cefrCountSpan = document.getElementById(`cefr-level-count-${cefrLevel}`);
      const filteredWords = words.filter((word) => word.cefr.level === cefrLevel);
      cefrCountSpan.textContent = filteredWords.length;
      checkbox.checked = filteredWords.length > 0;
      checkbox.disabled = filteredWords.length === 0;
      checkbox.setAttribute("data-count", filteredWords.length);
    });

    const wordTypeCheckboxes = document.querySelectorAll('input[name="words-types"]');
    wordTypeCheckboxes.forEach((checkbox) => {
      const wordType = checkbox.value;
      const wordTypeCountSpan = document.getElementById(`words-types-count-${wordType}`);
      const filteredWords = words.filter((word) => word["word-types"].some((type) => type["word-type"] === wordType));
      wordTypeCountSpan.textContent = filteredWords.length;
      checkbox.checked = filteredWords.length > 0;
      checkbox.disabled = filteredWords.length === 0;
      checkbox.setAttribute("data-count", filteredWords.length);
    });

    const totalWordsCount = Object.values(this.englishWords).length;
    document.getElementById("word-count-label").textContent = totalWordsCount;
    const wordCountSlider = document.getElementById("word-count-slider");
    wordCountSlider.value = totalWordsCount;
    wordCountSlider.min = 3;
    wordCountSlider.max = totalWordsCount;

    this.setStartButtonStyle(totalWordsCount);
  }

  updateWordDisplay(filteredWords) {
    const cefrLevels = ["A1", "A2", "B1", "B2", "C1", "C2"];
    cefrLevels.forEach((cefrLevel) => {
      const cefrCountSpan = document.getElementById(`cefr-level-count-${cefrLevel}`);
      const wordsMatchingCEFR = Object.values(filteredWords).filter((word) => word.cefr.level === cefrLevel).length;
      cefrCountSpan.textContent = wordsMatchingCEFR;
      const checkbox = document.getElementById(`cefr-checkbox-${cefrLevel}`);
      checkbox.checked = wordsMatchingCEFR > 0;
      checkbox.disabled = wordsMatchingCEFR === 0;
    });

    const totalWordsCount = this.getObjectLength(filteredWords);
    const wordTypes = ["noun", "adjective", "verb", "adverb", "preposition", "pronoun", "interjection"];
    const wordTypeCounts = wordTypes.reduce((counts, wordType) => {
      counts[wordType] = Object.values(filteredWords).filter((word) =>
        word["word-types"].some((type) => type["word-type"] === wordType)
      ).length;
      return counts;
    }, {});

    wordTypes.forEach((wordType) => {
      const wordTypeCountSpan = document.getElementById(`words-types-count-${wordType}`);
      wordTypeCountSpan.textContent = wordTypeCounts[wordType];
      const checkbox = document.getElementById(`words-types-checkbox-${wordType}`);
      checkbox.checked = wordTypeCounts[wordType] > 0;
      checkbox.disabled = wordTypeCounts[wordType] === 0;
    });

    document.getElementById("word-count-label").textContent = totalWordsCount;
    document.getElementById("word-count-slider").value = totalWordsCount;

    this.setStartButtonStyle(totalWordsCount);
  }

  getObjectLength(obj) {
    return Object.keys(obj).length;
  }

  resetLinkBackgrounds() {
    this.rulesLink.style.backgroundColor = "";
    this.settingsLink.style.backgroundColor = "";
  }

  getAttemptString(index) {
    const attemptStrings = [
      "first", "second", "third", "fourth", "fifth", "seventh", "eighth", "ninth", "tenth",
      "eleventh", "twelfth", "thirteenth", "fourteenth", "fifteenth", "sixteenth", "eighteenth",
      "nineteenth", "twentieth", "twenty-first",
    ];
    return attemptStrings[index] || "first";
  }
}

// Initialize quiz
const quiz = new Quiz();
