document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const gameMode = urlParams.get('mode') || 'classic';
    const gameModeTitle = document.getElementById('gameModeTitle');
    const wordDisplay = document.getElementById('wordDisplay');
    const gameInput = document.getElementById('gameInput');
    const startBtn = document.getElementById('startBtn');
    const timerDisplay = document.getElementById('timer');
    const wpmDisplay = document.getElementById('wpmDisplay');
    const accuracyDisplay = document.getElementById('accuracyDisplay');
    const livesDisplay = document.getElementById('livesDisplay');
    const raceProgress = document.getElementById('raceProgress');
    const resultModal = document.getElementById('resultModal');
    const resultSummary = document.getElementById('resultSummary');

    let isPlaying = false;
    let time = 0;
    let timerInterval;
    let words = [];
    let currentWordIndex = 0;
    let correctChars = 0;
    let totalChars = 0;
    let mistakes = 0;
    let lives = 3;

    // AI Race vars
    let aiProgressVal = 0;
    let aiInterval;

    // Game Configs
    const configs = {
        'classic': { title: 'Classic Time Attack', timeLimit: 60, type: 'timer' },
        'word-rain': { title: 'Word Rain', type: 'canvas' }, // Placeholder for complex logic, fallback to list
        'sentence': { title: 'Sentence Challenge', type: 'sentence' },
        'survival': { title: 'Survival Mode', lives: 5, type: 'survival' },
        'race': { title: 'AI Typing Race', type: 'race' }
    };

    const config = configs[gameMode] || configs['classic'];
    gameModeTitle.innerText = config.title;

    if (config.type === 'survival') {
        lives = config.lives;
        livesDisplay.style.display = 'inline';
        livesDisplay.innerHTML = `| Lives: <span style="color: var(--error)">${lives}</span>`;
    }

    if (config.type === 'race') {
        raceProgress.style.display = 'block';
    }

    // Word Bank
    const wordBank = [
        "the", "be", "to", "of", "and", "a", "in", "that", "have", "I",
        "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
        "this", "but", "his", "by", "from", "they", "we", "say", "her", "she",
        "or", "an", "will", "my", "one", "all", "would", "there", "their", "what",
        "about", "which", "when", "make", "like", "time", "just", "know", "take", "people",
        "year", "good", "some", "could", "see", "other", "than", "then", "now", "look",
        "only", "come", "its", "over", "think", "also", "back", "after", "use", "two",
        "how", "our", "work", "first", "well", "way", "even", "new", "want", "because"
    ];

    const sentences = [
        "The quick brown fox jumps over the lazy dog.",
        "Pack my box with five dozen liquor jugs.",
        "How vexingly quick daft zebras jump!",
        "Sphinx of black quartz, judge my vow.",
        "Two driven jocks help fax my big quiz."
    ];

    function getRandomWords(count) {
        let res = [];
        for (let i = 0; i < count; i++) {
            res.push(wordBank[Math.floor(Math.random() * wordBank.length)]);
        }
        return res;
    }

    function initGame() {
        if (config.type === 'sentence') {
            words = sentences[Math.floor(Math.random() * sentences.length)].split(' ');
        } else {
            words = getRandomWords(50);
        }

        currentWordIndex = 0;
        updateWordDisplay();
        gameInput.disabled = false;
        gameInput.value = '';
        gameInput.focus();
        isPlaying = true;
        startBtn.style.display = 'none';

        // Start Timer
        if (config.timeLimit) {
            time = config.timeLimit;
            timerDisplay.innerText = formatTime(time);
            timerInterval = setInterval(() => {
                time--;
                timerDisplay.innerText = formatTime(time);
                if (time <= 0) endGame();
            }, 1000);
        } else {
            // Count up for others
            time = 0;
            timerInterval = setInterval(() => {
                time++;
                timerDisplay.innerText = formatTime(time);
                if (config.type === 'race') updateAI();
            }, 1000);
        }
    }

    function updateAI() {
        // Simple AI logic: progress 5-10% every second
        aiProgressVal += Math.random() * 5 + 2;
        if (aiProgressVal >= 100) aiProgressVal = 100;
        document.getElementById('aiProgress').style.width = aiProgressVal + '%';

        if (aiProgressVal >= 100) {
            endGame(); // AI Wins
        }
    }

    function updateWordDisplay() {
        // Simple display: Current word highlighted
        if (config.type === 'sentence') {
            wordDisplay.innerHTML = words.map((w, i) =>
                `<span class="${i === currentWordIndex ? 'current' : ''} ${i < currentWordIndex ? 'correct' : ''}">${w}</span>`
            ).join(' ');
        } else {
            // Show current word large
            if (currentWordIndex < words.length) {
                wordDisplay.innerHTML = words[currentWordIndex];
            }
        }
    }

    gameInput.addEventListener('input', (e) => {
        if (!isPlaying) return;

        const val = e.target.value.trim();
        const currentTarget = words[currentWordIndex];

        // Check character matches if you wanted real-time char feedback, 
        // but for now we verify on space (word completion)

        if (e.data === ' ' || (config.type === 'sentence' && val === currentTarget)) {
            // Word submitted
            if (val === currentTarget) {
                // Correct
                correctChars += currentTarget.length + 1; // +1 for space
                currentWordIndex++;
                e.target.value = ''; // Clear input

                if (config.type === 'race') {
                    // Update player progress
                    const progress = (currentWordIndex / words.length) * 100;
                    document.getElementById('playerProgress').style.width = progress + '%';
                }

                if (currentWordIndex >= words.length) {
                    // Level done or Game done
                    if (config.type === 'sentence' || config.type === 'race') {
                        endGame();
                    } else {
                        // Add more words for infinite modes
                        words = words.concat(getRandomWords(10));
                    }
                }
                updateWordDisplay();

            } else {
                // Wrong word logic (if we want to block progression)
                // For simplified logic, we might just count error and clear or force retry
                // Let's force retry for accuracy, but count mistake
                mistakes++;
                if (config.type === 'survival') {
                    lives--;
                    livesDisplay.innerHTML = `| Lives: <span style="color: var(--error)">${lives}</span>`;
                    if (lives <= 0) endGame();
                }
            }

            totalChars += val.length + 1;
            updateStats();
        }
    });

    // Handle spacebar clear for non-sentence modes specifically if needed
    gameInput.addEventListener('keydown', (e) => {
        if (e.key === ' ' && config.type !== 'sentence') {
            // Logic handled in input event usually, but prevent default space insertion maybe?
            // Actually input event handles ' ' detection well.
            setTimeout(() => { e.target.value = ''; }, 0);
        }
    });

    function updateStats() {
        const minutes = config.timeLimit ? (config.timeLimit - time) / 60 : time / 60;
        // Avoid divide by zero
        const effectiveMin = minutes <= 0 ? 0.01 : minutes; // aprox

        const wpm = Math.round((correctChars / 5) / effectiveMin);
        const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;

        wpmDisplay.innerText = wpm;
        accuracyDisplay.innerText = accuracy + '%';
    }

    async function endGame() {
        clearInterval(timerInterval);
        isPlaying = false;
        gameInput.disabled = true;

        const wpm = parseInt(wpmDisplay.innerText);
        const accuracy = parseInt(accuracyDisplay.innerText);

        const summary = `You typed at <b>${wpm} WPM</b> with <b>${accuracy}%</b> accuracy.<br>Mistakes: ${mistakes}`;
        resultSummary.innerHTML = summary;
        resultModal.style.display = 'flex';

        // Save Result
        const token = localStorage.getItem('token');
        if (token) {
            try {
                await fetch('/api/results', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        gameType: config.title,
                        wpm,
                        accuracy,
                        mistakeCount: mistakes
                    })
                });
            } catch (err) {
                console.error('Failed to save result', err);
            }
        }
    }

    function formatTime(s) {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    }

    startBtn.addEventListener('click', initGame);
});
