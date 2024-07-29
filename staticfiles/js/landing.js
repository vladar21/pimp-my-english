document.addEventListener('DOMContentLoaded', () => {
    const wordSetSelectLanding = document.getElementById('wordSetSelectLanding');
    const hiddenFilteredWordsDiv = document.getElementById('hidden-filtered-words');
    const settingsLink = document.getElementById('settings-link');
    const startQuizButton = document.getElementById('start-quiz-button');
    let quiz = new Quiz();

    /**
     * Generates HTML for star ratings.
     *
     * @param {number} rating - The rating value (1-5).
     * @returns {string} - A string of HTML containing the star rating.
     */
    function generateStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += '&#9733;'; // filled star
            } else {
                stars += '&#9734;'; // empty star
            }
        }
        return stars;
    }

    /**
     * Updates the word set options with star ratings.
     */
    function updateOptionsWithStars() {
        const options = wordSetSelectLanding.options;
        for (let i = 0; i < options.length; i++) {
            const option = options[i];
            const rating = option.getAttribute('data-rating');
            if (rating) {
                option.innerHTML = `${option.getAttribute('data-name')} &nbsp; &nbsp; ${generateStars(rating)}`;
            }
        }
    }

    /**
     * Fetches filtered words based on the selected word set ID and updates the UI.
     *
     * @param {number} wordSetId - The ID of the selected word set.
     */
    function fetchFilteredWords(wordSetId) {
        hiddenFilteredWordsDiv.dataset.words = '';
        quiz.showSpinner();
        startQuizButton.disabled = true; // Disable the start button

        let url = wordSetId ? `/wordsets/${wordSetId}/words/` : `/wordsets/0/words/`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                hiddenFilteredWordsDiv.dataset.words = data.words.join(', ');
                quiz.update(data.words).then(() => {
                    quiz.hideSpinner();
                    startQuizButton.disabled = false; // Enable the start button
                });
            })
            .catch(error => {
                console.error("Error fetching filtered words:", error);
                quiz.hideSpinner();
            });
    }

    // Event listener for changing word sets
    wordSetSelectLanding.addEventListener('change', function () {
        const selectedWordSetId = this.value;
        fetchFilteredWords(selectedWordSetId);
    });

    // Event listener for starting the quiz
    startQuizButton.addEventListener('click', () => {
        const selectedWordSetId = wordSetSelectLanding.value;
        fetchFilteredWords(selectedWordSetId);
    });

    // Auto-start functionality
    const autostart = document.getElementById('autostart');
    if (autostart && autostart.dataset.autostart === '1') {
        const defaultWordSetId = wordSetSelectLanding.value;
        if (defaultWordSetId) {
            fetchFilteredWords(defaultWordSetId);
        }
    }

    // Event listener for settings link
    settingsLink.addEventListener('click', (event) => {
        event.preventDefault();
        const selectedWordSetId = wordSetSelectLanding.value;
        if (selectedWordSetId && selectedWordSetId !== "0") {
            const settingsUrl = `/quizzes/settings?word_set_id=${selectedWordSetId}`;
            window.location.href = settingsUrl;
        } else {
            const settingsUrl = "/quizzes/settings";
            window.location.href = settingsUrl;
        }
    });

    // Initial update of word set options with stars
    updateOptionsWithStars();
});