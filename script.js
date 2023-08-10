let pairs = {
  melbourne: 'australia',
  beijing: 'china',
  brasilia: 'brazil',
  cairo: 'Egypt',
  madrid: 'spain',
  newyork: 'USA'
  // Add more pairs similarly
}

let totalCards
let cards
let flippedCards = []
let matchedPairs = 0
let startTime
let timerInterval

document.addEventListener('DOMContentLoaded', function () {
  showIntroModal()
  generateCards(pairs)
  shuffleCards()
  adjustLayout()
  attachCardListeners()

  const replayButton = document.getElementById('replay')
  replayButton.onclick = function () {
    // Reset game state
    matchedPairs = 0
    cards.forEach(card => card.classList.remove('flipped'))
    shuffleCards()
    startTimer()
    replayButton.classList.add('hidden') // Hide the "Play Again" button
  }
})

function generateCards (pairs) {
  const gameBoard = document.querySelector('.game-board')
  for (let city in pairs) {
    const country = pairs[city]

    // Create city card
    const cityCard = createCard(city)
    gameBoard.appendChild(cityCard)

    // Create country card
    const countryCard = createCard(country)
    gameBoard.appendChild(countryCard)
  }
}

function createCard (value) {
  const card = document.createElement('div')
  card.classList.add('card')
  card.setAttribute('data-value', value)

  const cardBack = document.createElement('div')
  cardBack.classList.add('card-back')
  cardBack.textContent = '?'
  card.appendChild(cardBack)

  const cardFront = document.createElement('div')
  cardFront.classList.add('card-front')

  // Check if the value is a city or a country and set the background image accordingly
  if (Object.keys(pairs).includes(value)) {
    // It's a city
    cardFront.style.backgroundImage = `url('images/${value}.webp')`
  } else {
    // It's a country
    cardFront.style.backgroundImage = `url('images/${value}.webp')`
  }

  card.appendChild(cardFront)

  return card
}

function shuffleCards () {
  let gameBoard = document.querySelector('.game-board')
  let cardsArray = Array.from(gameBoard.children)
  cardsArray.sort(() => Math.random() - 0.5)
  cardsArray.forEach(card => gameBoard.appendChild(card))
}

function adjustLayout() {
  cards = document.querySelectorAll('.card');
  totalCards = cards.length;
  let columns = Math.max(3, Math.ceil(Math.sqrt(totalCards))); // Ensure a minimum of 3 columns
  let gameBoard = document.querySelector('.game-board');
  gameBoard.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
}

function attachCardListeners () {
  cards.forEach(card => {
    card.addEventListener('click', () => {
      if (!card.classList.contains('flipped') && flippedCards.length < 2) {
        card.classList.add('flipped')
        flippedCards.push(card)

        if (flippedCards.length === 2) {
          checkMatch()
        }
      }
    })
  })
}

function checkMatch () {
  let card1 = flippedCards[0].getAttribute('data-value')
  let card2 = flippedCards[1].getAttribute('data-value')

  if (pairs[card1] === card2 || pairs[card2] === card1) {
    matchedPairs++
    flippedCards.forEach(card => {
      card.style.animation = 'matched 0.5s'
      card.addEventListener('animationend', function () {
        card.style.animation = ''
      })
    })

    let cardFront = flippedCards[1].querySelector('.card-front')
    cardFront.addEventListener('transitionend', function onEnd () {
      if (matchedPairs === totalCards / 2) {
        showWinModal()
      }
      cardFront.removeEventListener('transitionend', onEnd)
    })

    flippedCards = []
  } else {
    flippedCards.forEach(card => {
      card.style.animation = 'unmatched 0.5s alternate 2'
      card.addEventListener('animationend', function () {
        card.style.animation = ''
      })
    })
    setTimeout(() => {
      flippedCards[0].classList.remove('flipped')
      flippedCards[1].classList.remove('flipped')
      flippedCards = []
    }, 1000)
  }
}

function startTimer () {
  startTime = Date.now()
  timerInterval = setInterval(updateTimer, 1000)
}

function updateTimer () {
  const elapsed = Date.now() - startTime
  const minutes = Math.floor(elapsed / 60000)
  const seconds = Math.floor((elapsed % 60000) / 1000)
  document.getElementById('timer').textContent = `${String(minutes).padStart(
    2,
    '0'
  )}:${String(seconds).padStart(2, '0')}`
}

function stopTimer () {
  clearInterval(timerInterval)
}

function showIntroModal () {
  const modal = document.getElementById('introModal')
  modal.style.display = 'block'

  const startGame = document.getElementById('startGame')
  startGame.onclick = function () {
    modal.style.display = 'none'
    startTimer()
  }
}

function showWinModal () {
  const modal = document.getElementById('winModal')
  modal.style.display = 'block'

  stopTimer() // Stop the timer
}

// Reference to the form elements
const firstNameInput = document.getElementById('firstName');
const emailInput = document.getElementById('email');
const privacyPolicyCheckbox = document.getElementById('privacyPolicy');
const sendDataButton = document.getElementById('sendData');

// Enable or disable the Send button based on the checkbox
privacyPolicyCheckbox.addEventListener('change', function() {
  sendDataButton.disabled = !this.checked;
  if (this.checked) {
      sendDataButton.classList.remove('disabled-button');
  } else {
      sendDataButton.classList.add('disabled-button');
  }
});

// Send data to Cloudflare Worker when the Send button is clicked
sendDataButton.addEventListener('click', async function() {
  const data = {
    Name: firstNameInput.value,
    Email: emailInput.value
  };

  try {
      const response = await fetch('https://flipcardgame.derrickmal123.workers.dev/', {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
              'Content-Type': 'application/json'
          }
      });

      if (!response.ok) {
          throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.result === "success") {
        // alert('Data sent successfully!');
        
        // Hide the winModal
        document.getElementById('winModal').style.display = 'none';
        
        // Show the thankYouModal
        document.getElementById('thankYouModal').style.display = 'block';
    } else {
        alert('Failed to send data. Please try again.');
    }
    
  } catch (error) {
      console.error('Error sending data:', error);
      alert(`An error occurred: ${error.message}`);
  }
});

// An event listener to the "Restart" button to restart the game
document.getElementById('restartGame').addEventListener('click', function() {
  // Hide the thankYouModal
  document.getElementById('thankYouModal').style.display = 'none';
  
  // Reset game state (you can call the same function that the "Play Again" button calls)
  matchedPairs = 0;
  cards.forEach(card => card.classList.remove('flipped'));
  shuffleCards();
  startTimer();
  document.getElementById('replay').classList.add('hidden'); // Hide the "Play Again" button
});