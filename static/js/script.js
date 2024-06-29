// static/js/script.js

/**
 * Class representing a quiz.
 * Handles the logic for starting, stopping, and taking turns in a quiz,
 * as well as fetching and displaying quiz data.
 */
class Quiz {
  /**
   * Create a Quiz instance.
   * @param {Array} filteredWords - Array of filtered words for the quiz.
   */
  constructor(filteredWords = []) {
    this.filteredWords = filteredWords;
    this.data = [];
    this.englishWords = {};
    this.englishWordsRandomQuestion = {};
    this.isQuizStart = false;
    this.currentQuiz = null;
    this.winnersArray = [];
    this.attempt = 0;
    this.timer = 0;
    this.timerInterval = null;
    this.isTimerSpinnerVisible = true;

    this.timerSpinner = document.querySelector(".timer-spinner");

    this.showStartWindow = document.getElementById("english-words-quiz");
    this.statisticWindow = document.getElementById("statistic-window");
    this.quizField = document.getElementById("quiz-field");

    this.startQuizButton = document.getElementById("start-quiz-button");
    this.filteredWordsDiv = document.getElementById("hidden-filtered-words");

    this.totalCountElementValue = 0;

    this.toastContainer = document.getElementById("toast-container");

    this.initialize();
  }

  /**
   * Initialize the quiz by setting up event listeners.
   */
  initialize() {
    if (this.startQuizButton) {
      this.startQuizButton.addEventListener("click", () => {
        const words = this.filteredWordsDiv.dataset.words ? this.filteredWordsDiv.dataset.words.split(", ") : [];
        if (words.length > 0) {
          this.update(words).then(() => {
            this.startQuiz();
          });
        } else {
          console.error("No words available to start the quiz.");
        }
      });
    }

    const nextQuizButton = document.getElementById("next-button");
    if (nextQuizButton) {
      nextQuizButton.addEventListener("click", this.takeATurn.bind(this));
    }

    const stopQuizButton = document.getElementById("stop-button");
    if (stopQuizButton) {
      stopQuizButton.addEventListener("click", this.stopQuiz.bind(this));
    }
  }

  /**
   * Fetch quiz data from the server.
   * @returns {Promise} A promise that resolves with the fetched quiz data.
   */
  fetchQuizData() {
    return fetch("/quizzes/api/quiz-data/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": this.getCSRFToken(),
      },
      body: JSON.stringify({ filtered_word_texts: this.filteredWords }),
    })
      .then((response) => response.json())
      .then((data) => {
        this.englishWords = data;
        this.englishWordsRandomQuestion = JSON.parse(JSON.stringify(data));
        console.log("Fetched Data: ", this.englishWords); // Debugging
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  }

  /**
   * Update the quiz with new filtered words and fetch new quiz data.
   * @param {Array} filteredWords - Array of filtered words for the quiz.
   * @returns {Promise} A promise that resolves with the updated quiz data.
   */
  update(filteredWords) {
    this.filteredWords = filteredWords;
    return this.fetchQuizData();
  }

  /**
   * Start the quiz by setting initial states and displaying the first question.
   */
  startQuiz() {
    this.isQuizStart = true;
    this.attempt++;
    this.data = [];
    this.englishWordsRandomQuestion = JSON.parse(
      JSON.stringify(this.englishWords)
    );

    this.toggleVisibility({
      "rules-start-settings": "none",
      "statistic-window": "none",
      "quiz-field": "flex",
    });

    this.resetQuizStats();
    this.startTimer();

    const randomQuestion = this.getRandomQuestion(
      this.englishWordsRandomQuestion
    );
    if (randomQuestion) {
      this.currentQuiz = this.displayQuestion(randomQuestion);
      this.currentQuiz.attempt = this.attempt;
      this.data.push(this.currentQuiz);
    } else {
      console.error("No valid question to display."); // Debugging
    }
  }

  /**
   * Stop the quiz and update the winners table.
   */
  stopQuiz() {
    this.addSpentTimeToLastAttempt(true);
    this.isQuizStart = false;

    this.toggleVisibility({
      "rules-start-settings": "flex",
      "statistic-window": "block",
      "quiz-field": "none",
    });

    this.stopTimer();
    this.updateWinnersTable();
  }

  /**
   * Take a turn in the quiz by checking the answer and displaying the next question.
   */
  takeATurn() {
    console.log("Starting takeATurn");
    this.addSpentTimeToLastAttempt(false);
    const selectedOption = document.querySelector(
      'input[name="answer-option"]:checked'
    );
    if (!selectedOption) {
      const wrongCountElement = document.getElementById("wrong-count");
      wrongCountElement.textContent =
        parseInt(wrongCountElement.textContent) + 1;
    }

    this.checkLastAnswer();

    const answeredCountElement = document.getElementById("answered-count");
    const answered = parseInt(answeredCountElement.textContent) + 1;
    answeredCountElement.textContent = answered;

    console.log(
      `Answered: ${answered} / Total: ${this.totalCountElementValue}`
    );

    if (answered >= this.totalCountElementValue) {
      this.stopQuiz();
      this.destroy();
    } else {
      const randomQuestion = this.getRandomQuestion(
        this.englishWordsRandomQuestion
      );
      if (randomQuestion) {
        this.currentQuiz = this.displayQuestion(randomQuestion);
        this.currentQuiz.attempt = this.attempt;
        this.currentQuiz.spentTime = 0;
        this.data.push(this.currentQuiz);
        console.log("Current Quiz Data: ", this.data);
      } else {
        console.error("No valid question to display."); // Debugging
      }
      this.timer = 30; // Reset timer for the next question
    }
    console.log("Current Quiz Data: ", this.data);
  }

  /**
   * Add the spent time to the last quiz attempt.
   * @param {boolean} isFinalTurn - Indicates if this is the final turn of the quiz.
   */
  addSpentTimeToLastAttempt(isFinalTurn) {
    if (this.data.length > 0) {
      if (isFinalTurn) {
        this.data[this.data.length - 1].spentTime = 30 - this.timer;
      } else {
        this.data[this.data.length - 1].spentTime = 30 - this.timer;
      }
    }
  }

  /**
   * Check the last answer given by the user.
   */
  checkLastAnswer() {
    const lastQuiz = this.data[this.data.length - 1];
    if (lastQuiz) {
      const answers = lastQuiz.answers;
      const lastUserAnswer = answers.find((answer) => answer.isUserChoice);
      if (lastUserAnswer) {
        if (lastUserAnswer.isCorrect) {
          const rightCountElement = document.getElementById("right-count");
          rightCountElement.textContent =
            parseInt(rightCountElement.textContent) + 1;
        } else {
          const wrongCountElement = document.getElementById("wrong-count");
          wrongCountElement.textContent =
            parseInt(wrongCountElement.textContent) + 1;
        }
      }
    }
  }

  /**
   * Get a random question from the available English words.
   * @param {Object} englishWordsRandomQuestion - Object containing random English words for the quiz.
   * @returns {Object|null} A random question object or null if no valid question is available.
   */
  getRandomQuestion(englishWordsRandomQuestion) {
    const wordKeys = Object.keys(englishWordsRandomQuestion);
    if (wordKeys.length === 0) {
      console.error("No words available for the quiz."); // Debugging
      return null;
    }
    const randomIndex = Math.floor(Math.random() * wordKeys.length);
    const selectedWordKey = wordKeys[randomIndex];
    const wordObject = this.englishWords[selectedWordKey];

    console.log(`Selected word: ${selectedWordKey}, Index: ${randomIndex}`);

    if (
      !wordObject ||
      !wordObject["word-types"] ||
      wordObject["word-types"].length === 0
    ) {
      console.error(
        `Word "${selectedWordKey}" does not have valid word-types.`
      );
      return null;
    }

    const randomWordType =
      wordObject["word-types"][
        Math.floor(Math.random() * wordObject["word-types"].length)
      ];

    if (
      !randomWordType ||
      !randomWordType.definitions ||
      randomWordType.definitions.length === 0
    ) {
      console.error(
        `Word type for "${selectedWordKey}" does not have valid definitions.`
      );
      return null;
    }

    const randomDefinition =
      randomWordType.definitions[
        Math.floor(Math.random() * randomWordType.definitions.length)
      ];

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
    console.log("Remaining words after deletion: ", englishWordsRandomQuestion);
    return question;
  }

  /**
   * Display the given question in the quiz interface.
   * @param {Object} question - The question object to display.
   * @returns {Object} The current quiz object with question and answers.
   */
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

  /**
   * Update the timer display in the quiz interface.
   */
  updateTimerDisplay() {
    this.timerSpinner.textContent = `${this.timer}`;
  }

  /**
   * Start the quiz timer.
   */
  startTimer() {
    this.timer = 30;
    this.updateTimerDisplay();
    this.timerInterval = setInterval(() => {
      this.timer--;
      this.updateTimerDisplay();
      if (this.timer <= 0) {
        this.addSpentTimeToLastAttempt(false);
        this.takeATurn();
      } else if (this.timer <= 10) {
        this.timerSpinner.style.backgroundColor = this.isTimerSpinnerVisible ? "red" : "white";
        this.timerSpinner.style.color = this.isTimerSpinnerVisible ? "white" : "red";
        this.isTimerSpinnerVisible = !this.isTimerSpinnerVisible;
      }
    }, 1000);
  }

  /**
   * Stop the quiz timer.
   */
  stopTimer() {
    clearInterval(this.timerInterval);
  }

  /**
   * Shuffle an array randomly.
   * @param {Array} array - The array to shuffle.
   * @returns {Array} The shuffled array.
   */
  shuffleArray(array) {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  }

  /**
   * Get the length of an object.
   * @param {Object} obj - The object whose length to get.
   * @returns {number} The length of the object.
   */
  getObjectLength(obj) {
    return Object.keys(obj).length;
  }

  /**
   * Reset the quiz statistics in the interface.
   */
  resetQuizStats() {
    document.getElementById("right-count").textContent = "0";
    document.getElementById("wrong-count").textContent = "0";
    document.getElementById("answered-count").textContent = "0";

    const hiddenFilteredWordsDiv = document.getElementById(
      "hidden-filtered-words"
    );
    const words = hiddenFilteredWordsDiv.dataset.words ? hiddenFilteredWordsDiv.dataset.words.split(", ") : [];
    this.totalCountElementValue = words.length;
    console.log(
      `Starting new quiz with total count: ${this.totalCountElementValue}`
    );
    this.totalCountElement = document.getElementById("total-count");
    this.totalCountElement.textContent = this.totalCountElementValue;
  }

  /**
   * Toggle the visibility of given elements.
   * @param {Object} elementsVisibility - An object mapping element IDs to display values.
   */
  toggleVisibility(elementsVisibility) {
    for (const [elementId, displayValue] of Object.entries(
      elementsVisibility
    )) {
      const element = document.getElementById(elementId);
      if (element) {
        element.style.display = displayValue;
      }
    }
  }

  /**
   * Show the spinner during data loading.
   */
  showSpinner() {
    const spinner = document.createElement("div");
    spinner.className = "spinner";
    document.body.appendChild(spinner);

    const startQuizButton = document.querySelector("#start-quiz-button");
    if (startQuizButton) {
      startQuizButton.disabled = true; // Disable the start button
    }
  }

  /**
   * Hide the spinner after data loading.
   */
  hideSpinner() {
    const spinner = document.querySelector(".spinner");
    if (spinner) {
      spinner.remove();
    }

    const startQuizButton = document.querySelector("#start-quiz-button");
    if (startQuizButton) {
      startQuizButton.disabled = false; // Enable the start button
    }
  }

  /**
   * Get the CSRF token from the cookies.
   * @returns {string|null} The CSRF token or null if not found.
   */
  getCSRFToken() {
    const name = "csrftoken";
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(name + "=")) {
        return cookie.substring(name.length + 1);
      }
    }
    return null;
  }

  /**
   * Update the winners table in the interface.
   */
  updateWinnersTable() {
    const winnersTableBody = document.querySelector('#winners-table tbody');
    const winnerData = {
        attempt: this.getAttemptString(this.attempt),
        scores: this.data.filter(quiz => quiz.answers.some(answer => answer.isCorrect && answer.isUserChoice)).length,
        time: this.data.reduce((totalTime, quiz) => totalTime + quiz.spentTime, 0)
    };
    this.winnersArray.push(winnerData);
    
    // Sort by scores descending and time ascending
    this.winnersArray.sort((a, b) => {
        if (b.scores === a.scores) {
            return a.time - b.time; // Sort by time ascending if scores are equal
        }
        return b.scores - a.scores; // Sort by scores descending
    });

    winnersTableBody.innerHTML = '';
    this.winnersArray.forEach((winner, index) => {
        const tr = document.createElement('tr');

        if (index === 0) {
            tr.classList.add('first-place');
        } else if (index === 1) {
            tr.classList.add('second-place');
        } else if (index === 2) {
            tr.classList.add('third-place');
        }

        tr.innerHTML = `<td>${index + 1}</td><td>${winner.attempt}</td><td>${winner.scores}</td><td>${winner.time}</td>`;
        winnersTableBody.appendChild(tr);
    });
  }

  /**
   * Get the string representation of the attempt number.
   * @param {number} attempt - The attempt number.
   * @returns {string} The string representation of the attempt.
   */
  getAttemptString(attempt) {
    const attempts = [
      "first",
      "second",
      "third",
      "fourth",
      "fifth",
      "sixth",
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
      "seventeenth",
      "eighteenth",
      "nineteenth",
      "twentieth",
    ];
    return attempts[attempt - 1] || attempt;
  }

  /**
   * Show a toast message in the interface.
   * @param {string} message - The message to display.
   * @param {string} [type='neutral'] - The type of the toast (e.g., 'success', 'error').
   */
  showToast(message, type = "neutral") {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerHTML = `<div id="desc">${message}</div>`;
    this.toastContainer.appendChild(toast);
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
      this.toastContainer.removeChild(toast);
    }, 15000);
  }

  /**
   * Destroy the quiz by resetting necessary parameters.
   */
  destroy() {
    this.isQuizStart = false;
    this.filteredWords = [];
    this.data = [];
    this.englishWords = {};
    this.englishWordsRandomQuestion = {};
    this.timer = 30;
    this.stopTimer();
    console.log("Quiz destroyed, necessary parameters reset.");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  /**
   * Create and display a toast message.
   * @param {string} message - The message to display in the toast.
   * @param {string} [type="success"] - The type of the toast message (e.g., "success", "error").
   */
  function createToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;

    document.getElementById("toast-container").appendChild(toast);

    setTimeout(() => {
      toast.classList.add("show");
    }, 100);

    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 15000);
  }

  /**
   * Display messages from the Django messages framework as toasts.
   */
  function displayDjangoMessages() {
    const messages = JSON.parse(
      document.getElementById("django-messages").textContent
    );
    messages.forEach((message) => {
      createToast(message.message, message.tags);
    });
  }

  if (document.getElementById("django-messages")) {
    displayDjangoMessages();
  }

  /**
   * Display form errors as toasts.
   */
  function displayFormErrors() {
    const errorLists = document.querySelectorAll(".errorlist.nonfield li");
    errorLists.forEach((error) => {
      createToast(error.textContent, "error");
    });
  }

  if (document.querySelectorAll(".errorlist.nonfield li")) {
    displayFormErrors();
  }

  // Event listeners and DOM manipulation for navigation and modals
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");
  const newsletterLink = document.getElementById("newsletter-link");
  const modal = document.getElementById("newsletter-modal");
  const closeModal = document.getElementsByClassName("close-nl")[0];

  navToggle.addEventListener("change", function () {
    if (navToggle.checked) {
      navMenu.classList.add("nav-open");
    } else {
      navMenu.classList.remove("nav-open");
    }
  });

  newsletterLink.addEventListener("click", function (event) {
    event.preventDefault();
    modal.style.display = "block";
  });

  closeModal.addEventListener("click", function () {
    modal.style.display = "none";
  });

  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  document
    .getElementById("subscribe-form")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      const formData = new FormData(this);

      fetch(subscribeUrl, {
        method: "POST",
        body: formData,
        headers: {
          "X-CSRFToken": "{{ csrf_token }}",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            createToast(data.error, "error");
          } else {
            createToast(data.message, "success");
          }
          modal.style.display = "none";
        })
        .catch((error) => {
          console.error("Error:", error);
          createToast(
            "An unexpected error occurred. Please try again later.",
            "error"
          );
          modal.style.display = "none";
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
  const fbIcon = document.getElementById("facebook-icon");
  const fbModal = document.getElementById("facebook-modal");
  const closeFb = document.getElementsByClassName("close-fb")[0];

  fbIcon.onclick = function () {
    fbModal.style.display = "block";
  };

  closeFb.onclick = function () {
    fbModal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == fbModal) {
      fbModal.style.display = "none";
    }
  };
});
