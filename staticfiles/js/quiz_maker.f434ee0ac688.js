// static/js/quiz_maker.js

/**
 * Class representing the quiz settings.
 */
class QuizSettings {
  /**
   * Create a QuizSettings instance.
   * @param {Object} settingsExternal - External settings object.
   */
  constructor(settingsExternal) {
    this.settingsExternal = settingsExternal;
    this.settings = {
      cefr_levels: settingsExternal.cefr_levels,
      word_types: settingsExternal.word_types,
      is_grow: true,
      isSettingsChange: null,
      total_word_count: settingsExternal.total_word_count,
      word_set: settingsExternal.word_set,
      selected_word_set_description:
        settingsExternal.selected_word_set_description,
      filtered_words: this.getFilteredWordsFromDiv(),
      unused_words: this.getUnusedWordsFromDiv(),
      use_filtered_words: false,
      csrf_token: settingsExternal.csrf_token,
    };

    this.init();
  }

  /**
   * Initialize the quiz settings by caching DOM elements, binding events, and populating word sets.
   */
  init() {
    this.cacheDomElements();
    this.previousTotalChecked = this.getTotalChecked();
    this.bindEvents();
    this.populateFilteredWords();
    this.populateUnusedWords();
    this.loadWordSets(
      this.settings.word_set,
      this.settings.selected_word_set_description
    ); // Load WordSets options
  }

  /**
   * Cache DOM elements used in the quiz settings interface.
   */
  cacheDomElements() {
    this.wordCountSlider = document.getElementById("word-count-slider");
    this.wordCountLabel = document.getElementById("word-count-label");
    this.closeButtonSettings = document.getElementById("closeButtonSettings");
    this.resetButton = document.getElementById("resetSettingsDefault");
    this.cefrCheckboxes = document.querySelectorAll(
      'input[name="cefr_levels"]'
    );
    this.wordTypeCheckboxes = document.querySelectorAll(
      'input[name="word_types"]'
    );
    this.wordSetSelect = document.getElementById("word-set-select");
    this.wordSetDescriptionDisplay = document.getElementById(
      "word-set-description"
    );
    this.startQuizButton = document.getElementById("startQuizButton");
    this.createWordSetButton = document.getElementById("createWordSetButton");
    this.saveWordSetButton = document.getElementById("saveWordSetButton");
    this.deleteWordSetButton = document.getElementById("deleteWordSetButton");
    this.filteredWords = document.getElementById("filtered-words");
    this.unusedWords = document.getElementById("unused-words");
    this.buttons = document.querySelectorAll("button"); // Select all buttons

    this.hiddenFilteredWords = document.getElementById("hidden-filtered-words");
    this.hiddenUnusedWords = document.getElementById("hidden-unused-words");

    this.createWordSetModal = document.getElementById("createWordSetModal");
    this.createWordSetForm = document.getElementById("createWordSetForm");
    this.wordSetTitle = document.getElementById("wordSetTitle");
    this.wordSetDescription = document.getElementById("wordSetDescription");
    this.filteredWordsList = document.getElementById("filtered-words-list");
    this.toastContainer = document.getElementById("toast-container");
  }

  /**
   * Bind event listeners to the quiz settings interface elements.
   */
  bindEvents() {
    if (this.closeButtonSettings) {
      this.closeButtonSettings.addEventListener("click", () => {
        window.location.href = "/"; // Redirect to home page or another page
      });
    }

    if (this.wordCountSlider && this.wordCountLabel) {
      this.wordCountSlider.addEventListener("input", () => {
        this.updateSliderLabel();
      });

      this.wordCountSlider.addEventListener("change", () => {
        this.handleSliderChange();
      });
    }

    const checkboxes = [...this.cefrCheckboxes, ...this.wordTypeCheckboxes];
    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", () => this.handleCheckboxChange());
    });

    if (this.resetButton) {
      this.resetButton.addEventListener("click", () => this.resetSettings());
    }

    if (this.wordSetSelect) {
      this.wordSetSelect.addEventListener("change", (event) =>
        this.handleWordSetChange(event)
      );
    }

    if (this.createWordSetButton) {
      this.createWordSetButton.addEventListener("click", () =>
        this.openCreateWordSetModal()
      );
    }

    if (this.saveWordSetButton) {
      this.saveWordSetButton.addEventListener("click", () =>
        this.openEditWordSetModal()
      );
    }

    if (this.deleteWordSetButton) {
      this.deleteWordSetButton.addEventListener("click", () =>
        this.deleteWordSet()
      );
    }

    if (this.startQuizButton) {
      this.startQuizButton.addEventListener("click", (event) =>
        this.startQuiz(event)
      );
    }

    if (this.filteredWords) {
      this.filteredWords.addEventListener("mouseover", (event) => {
        if (event.target.classList.contains("filtered-word")) {
          this.showWordMenu(event.target);
        }
      });

      this.filteredWords.addEventListener("mouseout", (event) => {
        if (
          event.target.classList.contains("filtered-word") &&
          !event.relatedTarget.closest(".word-menu")
        ) {
          this.hideAllWordMenus();
        }
      });

      this.filteredWords.addEventListener("click", (event) => {
        if (event.target.classList.contains("delete-button")) {
          event.stopPropagation();
          event.preventDefault();
          const wordElement = event.target.closest(".filtered-word");
          this.deleteWord(wordElement);
          this.hideAllWordMenus();
        }
      });
    }

    if (this.unusedWords) {
      this.unusedWords.addEventListener("mouseover", (event) => {
        if (event.target.classList.contains("unused-word")) {
          this.showWordMenu(event.target);
        }
      });

      this.unusedWords.addEventListener("mouseout", (event) => {
        if (
          event.target.classList.contains("unused-word") &&
          !event.relatedTarget.closest(".word-menu")
        ) {
          this.hideAllWordMenus();
        }
      });

      this.unusedWords.addEventListener("click", (event) => {
        if (event.target.classList.contains("add-button")) {
          event.stopPropagation();
          event.preventDefault();
          const wordElement = event.target.closest(".unused-word");
          this.addWord(wordElement);
          this.hideAllWordMenus();
        }
      });
    }

    if (this.createWordSetForm) {
      this.createWordSetForm.addEventListener("submit", (event) =>
        this.submitWordSetForm(event)
      );
    }

    document.addEventListener("mouseout", (event) => {
      if (
        event.target.classList.contains("word-menu") &&
        !event.relatedTarget.closest(".filtered-word")
      ) {
        this.hideAllWordMenus();
      }
    });

    if (this.createWordSetModal) {
      const closeModalButton =
        this.createWordSetModal.querySelector(".close-modal");
      if (closeModalButton) {
        closeModalButton.addEventListener("click", () =>
          this.closeCreateWordSetModal()
        );
      }

      window.addEventListener("click", (event) => {
        if (event.target === this.createWordSetModal) {
          this.closeCreateWordSetModal();
        }
      });
    }
  }

  /**
   * Start the quiz by navigating to the landing page.
   * @param {Event} event - The event object.
   */
  startQuiz(event) {
    event.preventDefault();
    window.location.href = "/quizzes/game/";
  }

  /**
   * Get filtered words from the hidden div.
   * @returns {Array} An array of filtered words.
   */
  getFilteredWordsFromDiv() {
    const hiddenFilteredWords = document.getElementById(
      "hidden-filtered-words"
    );
    return hiddenFilteredWords ? hiddenFilteredWords.dataset.words.split(", ") : [];
  }

  /**
   * Get unused words from the hidden div.
   * @returns {Array} An array of unused words.
   */
  getUnusedWordsFromDiv() {
    const hiddenUnusedWords = document.getElementById("hidden-unused-words");
    return hiddenUnusedWords ? hiddenUnusedWords.dataset.words.split(", ") : [];
  }

  /**
   * Show the word menu for the given word element.
   * @param {HTMLElement} wordElement - The word element.
   */
  showWordMenu(wordElement) {
    this.hideAllWordMenus(); // Hide all menus before showing a new one
    const menu = wordElement.querySelector(".word-menu");
    if (menu) {
      menu.style.display = "flex";
    }
  }

  /**
   * Hide all word menus.
   */
  hideAllWordMenus() {
    const menus = document.querySelectorAll(".word-menu");
    menus.forEach((menu) => {
      menu.style.display = "none";
    });
  }

  /**
   * Populate the filtered words section.
   */
  populateFilteredWords() {
    const wordsData = this.hiddenFilteredWords.dataset.words ? this.hiddenFilteredWords.dataset.words.split(", ") : [];
    this.filteredWords.innerHTML = ""; // Clear existing content
    wordsData.forEach((word) => {
      if (word.trim() === "") return; // Skip empty words
      const wordElement = document.createElement("span");
      wordElement.classList.add("filtered-word");
      wordElement.dataset.word = word;
      wordElement.textContent = word;

      const menu = document.createElement("div");
      menu.classList.add("word-menu");
      menu.innerHTML = `
                <button class="delete-button">Del</button>
            `;
      wordElement.appendChild(menu);

      this.filteredWords.appendChild(wordElement);
    });
  }

  /**
   * Populate the unused words section.
   */
  populateUnusedWords() {
    const wordsData = this.hiddenUnusedWords.dataset.words ? this.hiddenUnusedWords.dataset.words.split(", ") : [];
    this.unusedWords.innerHTML = ""; // Clear existing content
    wordsData.forEach((word) => {
      if (word.trim() === "") return; // Skip empty words
      const wordElement = document.createElement("span");
      wordElement.classList.add("unused-word");
      wordElement.dataset.word = word;
      wordElement.textContent = word;

      const menu = document.createElement("div");
      menu.classList.add("word-menu");
      menu.innerHTML = `
                <button class="add-button">Add</button>
            `;
      wordElement.appendChild(menu);

      this.unusedWords.appendChild(wordElement);
    });
  }

  /**
   * Load word sets from the server and populate the word set options.
   * @param {number|null} selectedWordSetId - The ID of the selected word set.
   * @param {string|null} selectedWordSetDescription - The description of the selected word set.
   */
  loadWordSets(selectedWordSetId = null, selectedWordSetDescription = null) {
    this.showSpinner();
    fetch("/wordsets")
      .then((response) => response.json())
      .then((data) => {
        this.populateWordSets(
          data.word_sets,
          selectedWordSetId,
          selectedWordSetDescription
        );
        this.hideSpinner();
      })
      .catch((error) => {
        console.error("Error loadWordSets:", error);
        this.showToast("An error occurred while loadWordSets.", "error");
        this.hideSpinner();
      });
  }

  /**
   * Populate the word set options in the select dropdown.
   * @param {Array} wordSets - The array of word sets.
   * @param {number|null} selectedWordSetId - The ID of the selected word set.
   * @param {string|null} selectedWordSetDescription - The description of the selected word set.
   */
  populateWordSets(
    wordSets,
    selectedWordSetId = null,
    selectedWordSetDescription = null
  ) {

    this.wordSetSelect.innerHTML = "";

    const emptyOption = document.createElement("option");
    emptyOption.value = "";
    emptyOption.textContent = "Select Word Set";
    this.wordSetSelect.appendChild(emptyOption);

    wordSets.forEach((set) => {
      const option = document.createElement("option");
      option.value = set.id;
      option.innerHTML = `${set.name} => ${set.description}`;
      option.setAttribute("data-description", set.description);

      if (selectedWordSetId && set.id == selectedWordSetId) {
        option.setAttribute("selected", "selected");
      }

      option.setAttribute("data-name", set.name);
      this.wordSetSelect.appendChild(option);
    });

    if (selectedWordSetId) {
      this.wordSetSelect.value = selectedWordSetId;
      const selectedOption = this.wordSetSelect.selectedOptions[0];
      selectedOption.textContent = selectedOption.getAttribute("data-name");
      this.wordSetDescriptionDisplay.textContent = selectedWordSetDescription;

      this.saveWordSetButton.style.display = "inline-block";
      this.deleteWordSetButton.style.display = "inline-block";
      this.createWordSetButton.style.display = "none";
    } else {
      this.saveWordSetButton.style.display = "none";
      this.deleteWordSetButton.style.display = "none";
      this.createWordSetButton.style.display = "inline-block";
    }
  }

  /**
   * Handle the change event for the word set select dropdown.
   * @param {Event} event - The event object.
   */
  handleWordSetChange(event) {
    this.showSpinner();
    const selectedWordSetId = this.wordSetSelect.value;
    const selectedOption = event.target.selectedOptions[0];
    let description = "";
    if (selectedOption && selectedOption.value !== "") {
      description = selectedOption.getAttribute("data-description");
      selectedOption.textContent = selectedOption.getAttribute("data-name");
    }

    // Restore the full text for all options
    Array.from(this.wordSetSelect.options).forEach((option) => {
      if (option.value !== "") {
        option.textContent = `${option.getAttribute(
          "data-name"
        )} => ${option.getAttribute("data-description")}`;
      } else {
        option.textContent = "Select Word Set";
      }
    });

    const wordSetDescriptionDiv = document.getElementById(
      "word-set-description"
    );
    wordSetDescriptionDiv.textContent = description || "";
    wordSetDescriptionDiv.style.display = description ? "block" : "none";

    if (selectedWordSetId) {
      fetch(`/wordsets/${selectedWordSetId}/words/`)
        .then((response) => response.json())
        .then((data) => {
          this.settings.word_set = selectedWordSetId;
          this.settings.filtered_words = data.words;
          this.settings.use_filtered_words = true;

          this.hiddenFilteredWords.dataset.words = data.words.join(", ");

          this.updateFilteredWords();

          this.sendSettingsToServer(() => {
            this.createWordSetButton.style.display = "none";
            this.saveWordSetButton.style.display = "inline-block";
            this.deleteWordSetButton.style.display = "inline-block";
            this.hideSpinner();
          });
        })
        .catch((error) => {
          console.error("Error handleWordSetChange:", error);
          this.showToast(
            "An error occurred while handleWordSetChange.",
            "error"
          );
          this.hideSpinner();
        });
    }
    this.hideSpinner();
  }

  /**
   * Save the current word set.
   */
  saveWordSet() {
    this.openEditWordSetModal();
  }

  /**
   * Delete the current word set.
   */
  deleteWordSet() {
    const selectedWordSetId = this.wordSetSelect.value;
    if (selectedWordSetId) {
      this.showSpinner();
      fetch(`/wordsets/${selectedWordSetId}/delete/`, {
        method: "POST",
        headers: {
          "X-CSRFToken": this.settingsExternal.csrf_token,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            this.showToast("WordSet deleted successfully.", "success");
            this.loadWordSets(); // Reload word sets
            this.resetSettings();
          } else {
            this.showToast(
              data.message || "An error occurred while deleting the WordSet.",
              "error"
            );
          }
          this.hideSpinner();
        })
        .catch((error) => {
          console.error("Error deleting WordSet:", error);
          this.showToast(
            "An error occurred while deleting the WordSet.",
            "error"
          );
          this.hideSpinner();
        });
    }
  }

  /**
   * Delete a word from the filtered words.
   * @param {HTMLElement} wordElement - The word element to delete.
   */
  deleteWord(wordElement) {
    // Logic to delete word
    const word = wordElement.dataset.word;
    this.removeWordFromFiltered(word);
    this.settings.use_filtered_words = true;
    this.updateFilteredWords();
  }

  /**
   * Remove a word from the filtered words.
   * @param {string} word - The word to remove.
   */
  removeWordFromFiltered(word) {
    const words = this.hiddenFilteredWords.dataset.words
      .split(", ")
      .filter((w) => w !== word);
    this.hiddenFilteredWords.dataset.words = words.join(", ");
    this.settings.filtered_words = words;
  }

  /**
   * Update the filtered words display.
   */
  updateFilteredWords() {
    this.populateFilteredWords();
    this.populateUnusedWords();
    this.sendSettingsToServer();
  }

  /**
   * Add a word to the filtered words.
   * @param {HTMLElement} wordElement - The word element to add.
   */
  addWord(wordElement) {
    const word = wordElement.dataset.word;
    this.addWordToFiltered(word);
    this.removeWordFromUnused(word);
    this.updateFilteredWords();
  }

  /**
   * Remove a word from the unused words.
   * @param {string} word - The word to remove.
   */
  removeWordFromUnused(word) {
    const words = this.hiddenUnusedWords.dataset.words
      .split(", ")
      .filter((w) => w !== word);
    this.hiddenUnusedWords.dataset.words = words.join(", ");
    this.settings.unused_words = words;
  }

  /**
   * Add a word to the filtered words.
   * @param {string} word - The word to add.
   */
  addWordToFiltered(word) {
    const words = this.hiddenFilteredWords.dataset.words.split(", ");
    words.push(word);
    this.hiddenFilteredWords.dataset.words = words.join(", ");
    this.settings.filtered_words = words;
  }

  /**
   * Update the slider label with the current value.
   */
  updateSliderLabel() {
    this.wordCountLabel.textContent = `${this.wordCountSlider.value} / ${this.wordCountSlider.max}`;
  }

  /**
   * Handle the change event for the CEFR level and word type checkboxes.
   */
  handleCheckboxChange() {
    this.showSpinner();
    const currentTotalChecked = this.getTotalChecked();
    this.settings.is_grow = currentTotalChecked > this.previousTotalChecked;

    this.updateSettings();
    this.sendSettingsToServer(() => {
      this.previousTotalChecked = this.getTotalChecked(); // Update after sending settings to server and updating UI
      this.hideSpinner();
    });
  }

  /**
   * Handle the change event for the word count slider.
   */
  handleSliderChange() {
    this.settings.total_word_count = parseInt(this.wordCountSlider.value);
    this.settings.isSettingsChange = "total_word_count";
    this.sendSettingsToServer();
  }

  /**
   * Get the total number of checked CEFR level and word type checkboxes.
   * @returns {number} The total number of checked checkboxes.
   */
  getTotalChecked() {
    this.showSpinner();
    const checkedCefrLevels = this.cefrCheckboxes ? Array.from(this.cefrCheckboxes).filter((checkbox) => checkbox.checked).map((checkbox) => checkbox.value) : [];
    const checkedWordTypes = this.wordTypeCheckboxes ? Array.from(this.wordTypeCheckboxes).filter((checkbox) => checkbox.checked).map((checkbox) => checkbox.value) : [];

    this.settings.cefr_levels = checkedCefrLevels;
    this.settings.word_types = checkedWordTypes;

    return checkedCefrLevels.length + checkedWordTypes.length;
  }

  /**
   * Update the settings based on the current state of the checkboxes.
   */
  updateSettings() {
    const checkedCefrLevels = this.cefrCheckboxes ? Array.from(this.cefrCheckboxes).filter((checkbox) => checkbox.checked).map((checkbox) => checkbox.value) : [];
    const checkedWordTypes = this.wordTypeCheckboxes ? Array.from(this.wordTypeCheckboxes).filter((checkbox) => checkbox.checked).map((checkbox) => checkbox.value) : [];

    this.settings.cefr_levels = checkedCefrLevels;
    this.settings.word_types = checkedWordTypes;
    this.settings.isSettingsChange = "updated"; // Indicating that settings have been updated
  }

  /**
   * Reset the settings to their default values.
   */
  resetSettings() {
    this.showSpinner();

    const cefrLevels = this.settingsExternal.cefr_levels;
    const wordTypes = this.settingsExternal.word_types;
    const totalWordCount = this.settingsExternal.total_word_count || 0;

    this.settings.cefr_levels = cefrLevels;
    this.settings.word_types = wordTypes;
    this.settings.is_grow = true;
    this.settings.isSettingsChange = "reset";
    this.settings.total_word_count = totalWordCount;
    this.settings.use_filtered_words = false;
    this.previousTotalChecked = this.getTotalChecked();

    this.sendSettingsToServer(() => {
      this.previousTotalChecked = this.getTotalChecked(); // Update after sending settings to server and updating UI
      this.wordSetDescriptionDisplay.textContent = "";
      this.createWordSetButton.style.display = "inline-block";
      this.saveWordSetButton.style.display = "none";
      this.deleteWordSetButton.style.display = "none";
      this.hideSpinner();
    });
  }

  /**
   * Send the current settings to the server.
   * @param {Function|null} callback - The callback function to execute after the settings are sent.
   */
  sendSettingsToServer(callback = null) {
    this.showSpinner();
    fetch(this.settingsExternal.update_quiz_settings_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": this.settingsExternal.csrf_token,
      },
      body: JSON.stringify(this.settings),
    })
      .then((response) => response.json())
      .then((data) => {
        this.updateUI(data);
        this.hiddenFilteredWords.dataset.words = data.filtered_words; // Update hidden filtered words
        this.hiddenUnusedWords.dataset.words = data.unused_words; // Update hidden unused words
        this.populateFilteredWords(); // Update filtered words display
        this.populateUnusedWords(); // Update unused words display
        if (callback) callback();
        this.settings.use_filtered_words = true;
        this.hideSpinner();
      })
      .catch((error) => {
        console.error("Error deleting sendSettingsToServer:", error);
        this.showToast(
          "An error occurred while sendSettingsToServer.",
          "error"
        );
        this.hideSpinner();
      });
  }

  /**
   * Update the UI based on the data received from the server.
   * @param {Object|null} data - The data received from the server.
   */
  updateUI(data = null) {
    this.showSpinner();
    if (data) {
      this.wordCountLabel.textContent = `${data.word_count} / ${data.max_word_count}`;
      this.wordCountSlider.max = data.max_word_count;
      this.wordCountSlider.value = data.word_count;

      Object.entries(data.cefr_counts).forEach(([level, count]) => {
        const span = document.getElementById(`cefr-level-count-${level}`);
        if (span) {
          span.textContent = `${count} / ${data.cefr_total_counts[level]}`;
        }
        const checkbox = document.getElementById(`cefr-checkbox-${level}`);
        if (checkbox) {
          checkbox.checked =
            count > 0 &&
            data.cefr_counts[level] === data.cefr_total_counts[level];
          checkbox.disabled = data.cefr_total_counts[level] === 0;
        }
      });

      Object.entries(data.word_type_counts).forEach(([wordType, count]) => {
        const span = document.getElementById(`words-types-count-${wordType}`);
        if (span) {
          span.textContent = `${count} / ${data.word_type_total_counts[wordType]}`;
        }
        const checkbox = document.getElementById(
          `words-types-checkbox-${wordType}`
        );
        if (checkbox) {
          checkbox.checked =
            count > 0 &&
            data.word_type_counts[wordType] ===
              data.word_type_total_counts[wordType];
          checkbox.disabled = data.word_type_total_counts[wordType] === 0;
        }
      });

      this.populateFilteredWords();
      this.populateUnusedWords();
    }
    this.hideSpinner();
  }

  /**
   * Open the modal to create a new word set.
   */
  openCreateWordSetModal() {
    this.wordSetTitle.value = "";
    this.wordSetDescription.value = "";
    this.filteredWordsList.innerHTML = "";
    const filteredWords = this.hiddenFilteredWords.dataset.words ? this.hiddenFilteredWords.dataset.words.split(", ") : [];
    filteredWords.forEach((word) => {
      const wordElement = document.createElement("span");
      wordElement.textContent = word;
      this.filteredWordsList.appendChild(wordElement);
    });
    this.createWordSetForm.dataset.wordSetId = "";
    this.createWordSetModal.style.display = "block";
  }

  /**
   * Open the modal to edit an existing word set.
   */
  openEditWordSetModal() {
    const selectedWordSetId = this.wordSetSelect.value;
    if (!selectedWordSetId) {
      this.showToast("Please select a WordSet to edit.", "error");
      return;
    }

    this.createWordSetForm.dataset.wordSetId = selectedWordSetId;
    const selectedOption = this.wordSetSelect.selectedOptions[0];
    const title = selectedOption.getAttribute("data-name").trim();
    const description = selectedOption.getAttribute("data-description").trim();

    this.wordSetTitle.value = title;
    this.wordSetDescription.value = description;

    this.filteredWordsList.innerHTML = "";
    const filteredWords = this.hiddenFilteredWords.dataset.words ? this.hiddenFilteredWords.dataset.words.split(", ") : [];
    filteredWords.forEach((word) => {
      const wordElement = document.createElement("span");
      wordElement.textContent = word;
      this.filteredWordsList.appendChild(wordElement);
    });

    this.createWordSetModal.style.display = "block";
  }

  /**
   * Close the create word set modal.
   */
  closeCreateWordSetModal() {
    this.filteredWordsList.innerHTML = "";
    this.createWordSetModal.style.display = "none";
  }

  /**
   * Submit the form to create or update a word set.
   * @param {Event} event - The event object.
   */
  submitWordSetForm(event) {
    event.preventDefault();
    const title = this.wordSetTitle.value.trim();
    const description = this.wordSetDescription.value.trim();
    const wordSetId = this.createWordSetForm.dataset.wordSetId;
    const url = wordSetId ? `/wordsets/${wordSetId}/update/` : `/wordsets/create/`;

    if (!title) {
      this.showToast("WordSet title is required.", "error");
      this.hideSpinner();
      return;
    }

    if (!description) {
      this.showToast("WordSet description is required.", "error");
      this.hideSpinner();
      return;
    }

    const filteredWords = this.getFilteredWordsFromDiv();
    this.settings.filtered_words = filteredWords;

    const data = {
      title: title,
      description: description,
      words: this.settings.filtered_words,
    };

    this.showSpinner();

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": this.settingsExternal.csrf_token,
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          const message = wordSetId ? "WordSet updated successfully." : "WordSet created successfully.";
          this.showToast(message, "success");
          this.closeCreateWordSetModal();
          this.loadWordSets(data.word_set_id, data.description);
          this.wordSetSelect.value = data.word_set_id;
          this.handleWordSetChange({ target: this.wordSetSelect });
        } else {
          this.showToast(
            data.message || "An error occurred while saving the WordSet.",
            "error"
          );
        }
        this.hideSpinner();
      })
      .catch((error) => {
        console.error("Error saving WordSet:", error);
        this.showToast("An error occurred while saving the WordSet.", "error");
        this.hideSpinner();
      });
  }

  /**
   * Show a toast message.
   * @param {string} message - The message to display.
   * @param {string} [type='neutral'] - The type of the toast message.
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
    }, 6000);
  }

  /**
   * Show the spinner and disable form elements.
   */
  showSpinner() {
    const spinner = document.getElementById("spinner");
    if (spinner) {
      spinner.style.display = "block";
    }
    this.toggleFormElements(true);
  }

  /**
   * Hide the spinner and enable form elements.
   */
  hideSpinner() {
    const spinner = document.getElementById("spinner");
    if (spinner) {
      spinner.style.display = "none";
    }
    this.toggleFormElements(false);
  }

  /**
   * Toggle the disabled state of form elements.
   * @param {boolean} disable - Whether to disable or enable the elements.
   */
  toggleFormElements(disable) {
    const form = document.getElementById("settings-form");
    if (form) {
      const elements = form.querySelectorAll("input, button, select, textarea");
      elements.forEach((element) => {
        element.disabled = disable;
        if (element.tagName === "BUTTON") {
          if (disable) {
            element.classList.add("disabled");
          } else {
            element.classList.remove("disabled");
          }
        }
      });
    }
  }
}
