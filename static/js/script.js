class Quiz {
  constructor() {
    this.data = [];
    this.englishWords = {};
    this.englishWordsRandomQuestion = {};
    this.isQuizStart = false;
    this.currentQuiz = null;
    this.winnersArray = [];
    this.attempt = -1;
    this.timer = 0;
    this.timerInterval = null;
    this.isTimerSpinnerVisible = true;

    this.timerSpinner = document.querySelector(".timer-spinner");
    this.totalCountElement = document.getElementById("total-count");
    this.totalCountElementValue = 0;

    this.showStartWindow = document.getElementById("english-words-quiz");
    this.statisticWindow = document.getElementById("statistic-window");
    this.quizField = document.getElementById("quiz-field");

    this.startQuizButton = document.getElementById("start-quiz-button");

    this.initialize();
    this.fetchQuizData();
  }

  initialize() {
    if (this.startQuizButton) {
      this.startQuizButton.addEventListener("click", () => this.startQuiz());
    }

    if (this.showStartWindow) {
      this.showStartWindow.addEventListener("click", (event) => this.handleStartWindowClick(event));
    }
  }

  async fetchQuizData() {
    try {
      const response = await fetch('/quizzes/api/quiz-data/');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      this.englishWords = await response.json();
      console.log('Fetched quiz data:', this.englishWords); // Debugging line to ensure data is fetched correctly
    } catch (error) {
      console.error('Fetch error:', error);
    }
  }

  handleStartWindowClick(event) {
    event.preventDefault();
    if (!this.isQuizStart) {
      this.toggleVisibility({
        "quiz-field": "none",
        "statistic-window": "block"
      });
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

  startQuiz() {
    this.isQuizStart = true;
    this.toggleVisibility({
      "rules-start-settings": "none"
    });
    this.startTimer();

    this.attempt++;
    this.toggleVisibility({
      "statistic-window": "none",
      "quiz-field": "flex"
    });

    const nextQuizButton = document.getElementById("next-button");
    if (nextQuizButton) {
      nextQuizButton.addEventListener("click", () => this.takeATurn());
    }

    const stopQuizButton = document.getElementById("stop-button");
    if (stopQuizButton) {
      stopQuizButton.addEventListener("click", () => this.stopQuiz());
    }

    this.englishWordsRandomQuestion = JSON.parse(JSON.stringify(this.englishWords));
    const randomQuestion = this.getRandomQuestion(this.englishWordsRandomQuestion);
    if (randomQuestion) {
      this.currentQuiz = this.displayQuestion(randomQuestion);
      this.currentQuiz.attempt = this.attempt;
      this.data.push(this.currentQuiz);
    }

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
      if (randomQuestion) {
        this.currentQuiz = this.displayQuestion(randomQuestion);
        this.currentQuiz.attempt = this.attempt;
        this.currentQuiz.spentTime = 0;
        this.data.push(this.currentQuiz);
      }
    }
  }

  addSpentTimeToLastAttempt() {
    if (this.data.length > 0) {
      this.data[this.data.length - 1].spentTime = 30 - this.timer;
    }
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
    if (wordKeys.length === 0) {
      console.error("No words available for the quiz.");
      return null;
    }
    const randomIndex = Math.floor(Math.random() * wordKeys.length);
    const selectedWordKey = wordKeys[randomIndex];
    const wordObject = this.englishWords[selectedWordKey];

    if (!wordObject || !wordObject["word-types"] || wordObject["word-types"].length === 0) {
      console.error(`Word "${selectedWordKey}" does not have valid word-types.`);
      return null;
    }

    const randomWordType = wordObject["word-types"][Math.floor(Math.random() * wordObject["word-types"].length)];

    if (!randomWordType || !randomWordType.definitions || randomWordType.definitions.length === 0) {
      console.error(`Word type for "${selectedWordKey}" does not have valid definitions.`);
      return null;
    }

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
    if (!question) {
      console.error("No valid question to display.");
      return;
    }

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

    if (question.imageUrl) {
      imgWordElement.src = question.imageUrl;
      imgWordElement.alt = question.definition;
    } else {
      imgWordElement.src = "";
      imgWordElement.alt = "No image available";
    }

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
      audioSourceElement.type = "audio/mpeg";
      audioButtonPlayElement.id = option.answer;
      audioButtonPlayElement.className = "play-sound-button";
      // audioButtonPlayElement.textContent = "";

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

      if (currentWord.sound_url) {
        li.appendChild(audioElement);
        li.appendChild(audioButtonPlayElement);
      } else {
        const noAudioMessage = document.createElement("span");
        noAudioMessage.textContent = "No audio available";
        li.appendChild(noAudioMessage);
      }

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

  getObjectLength(obj) {
    return Object.keys(obj).length;
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
