document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const namePromptContainer = document.getElementById('namePrompt');
    const nameInput = document.getElementById('nameInput');
    const okButton = document.getElementById('okButton');
    const mainGameArea = document.querySelector('.main-game-area');
    const playerNameDisplay = document.getElementById('playerName');
    const attemptsCountDisplay = document.getElementById('attemptsCount');
    const timeCountDisplay = document.getElementById('timeCount');
    const cardBoard = document.querySelector('.card-board');
    const restartButton = document.getElementById('restartButton');

    // Game Variables
    let cards = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let attempts = 0;
    let timer = null;
    let seconds = 0;
    let isGameRunning = false;
    let lockBoard = false;

    // Card Data (Image Paths)
    const cardData = [
        'img/Temp_img_1-1.png',
        'img/Temp_img_1-1.png',
        'img/Temp_img_2-1.png',
        'img/Temp_img_2-1.png',
        'img/Temp_img_3-1.png',
        'img/Temp_img_3-1.png'
    ];

    // Starts the game
    function startGame() {
        namePromptContainer.style.display = 'none';
        mainGameArea.style.display = 'flex';

        const userName = nameInput.value.trim() || 'Player 1';
        playerNameDisplay.textContent = userName;

        attempts = 0;
        matchedPairs = 0;
        seconds = 0;
        isGameRunning = true;
        attemptsCountDisplay.textContent = attempts;
        timeCountDisplay.textContent = '0:00';

        clearInterval(timer);
        timer = null;

        generateCards();
        timer = setInterval(updateTime, 1000);
    }

    // Generates the cards on the game board
    function generateCards() {
        cardBoard.innerHTML = '';
        cards = [];
        
        const shuffledCards = [...cardData].sort(() => 0.5 - Math.random());

        shuffledCards.forEach(imagePath => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.value = imagePath;
            card.innerHTML = `
                <div class="card-inner">
                    <div class="card-back"></div>
                    <div class="card-front">
                        <img src="${imagePath}" alt="card image">
                    </div>
                </div>
            `;
            card.addEventListener('click', flipCard);
            cardBoard.appendChild(card);
            cards.push(card);
        });
    }

    // Flips a card
    function flipCard() {
        if (!isGameRunning || lockBoard) return;
        if (this === flippedCards[0]) return;

        this.classList.add('flipped');
        flippedCards.push(this);

        if (flippedCards.length === 2) {
            attempts++;
            attemptsCountDisplay.textContent = attempts;
            checkForMatch();
        }
    }

    // Checks if the two flipped cards match
    function checkForMatch() {
        lockBoard = true;
        const [firstCard, secondCard] = flippedCards;
        const isMatch = firstCard.dataset.value === secondCard.dataset.value;

        if (isMatch) {
            matchedPairs++;
            disableCards();
            
            if (matchedPairs === cardData.length / 2) {
                endGame();
            }
        } else {
            unflipCards();
        }
    }

    // Disables matched cards
    function disableCards() {
        flippedCards.forEach(card => {
            card.removeEventListener('click', flipCard);
            card.classList.add('matched');
        });
        resetFlippedCards();
    }

    // Flips back unmatched cards
    function unflipCards() {
        setTimeout(() => {
            flippedCards.forEach(card => {
                card.classList.remove('flipped');
            });
            resetFlippedCards();
        }, 1000);
    }

    // Resets the flipped cards array
    function resetFlippedCards() {
        [flippedCards, lockBoard] = [[], false];
    }

    // Updates the game timer
    function updateTime() {
        seconds++;
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        timeCountDisplay.textContent = `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }

    // Ends the game and shows a result alert
    function endGame() {
        isGameRunning = false;
        clearInterval(timer);
        timer = null;
        setTimeout(() => {
            alert(`Congratulations, ${playerNameDisplay.textContent}! You won!\nTime: ${timeCountDisplay.textContent}\nAttempts: ${attempts}`);
        }, 500);
    }
    
    // Restarts the game
    function restartGame() {
        isGameRunning = false;
        clearInterval(timer);
        timer = null;
        matchedPairs = 0;
        attempts = 0;
        seconds = 0;
        flippedCards = [];
        lockBoard = false;
        
        namePromptContainer.style.display = 'flex';
        mainGameArea.style.display = 'none';
        
        nameInput.value = '';
    }

    // OK Button Event Listener
    okButton.addEventListener('click', () => {
        if (nameInput.value.trim() !== '') {
            startGame();
        } else {
            alert('Please enter your name.');
        }
    });

    // Restart Button Event Listener
    restartButton.addEventListener('click', restartGame);
});