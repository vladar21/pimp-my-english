document.addEventListener('DOMContentLoaded', () => {
    const wordSetSelectLanding = document.getElementById('wordSetSelectLanding');
    const hiddenFilteredWordsDiv = document.getElementById('hidden-filtered-words');
    const settingsLink = document.getElementById('settings-link');
    const startQuizButton = document.getElementById('start-quiz-button');
    let quiz = new Quiz();

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

    wordSetSelectLanding.addEventListener('change', function () {
        const selectedWordSetId = this.value;
        fetchFilteredWords(selectedWordSetId);
    });

    startQuizButton.addEventListener('click', () => {
        const selectedWordSetId = wordSetSelectLanding.value;
        fetchFilteredWords(selectedWordSetId);
    });

    const autostart = document.getElementById('autostart');
    if (autostart && autostart.dataset.autostart === '1') {
        const defaultWordSetId = wordSetSelectLanding.value;
        if (defaultWordSetId) {
            fetchFilteredWords(defaultWordSetId);
        }
    }

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

    updateOptionsWithStars();
});