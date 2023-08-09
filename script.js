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

/*... Adjust Card LayOut ...*/ 
// function adjustLayout() {
//   cards = document.querySelectorAll('.card');
//   totalCards = cards.length;
//   let columns = Math.ceil(Math.sqrt(totalCards));
//   let rows = Math.ceil(totalCards / columns);

//   let cardWidth = 100 / columns;

//   console.log(`Rows: ${rows}, Columns: ${columns}`); // Add this line

//   cards.forEach(card => {
//       card.style.flex = `1 0 calc(${cardWidth}% - 10px)`;
//   });
// }
// function adjustLayout() {
//   cards = document.querySelectorAll('.card');
//   totalCards = cards.length;
//   let columns = Math.ceil(Math.sqrt(totalCards));
//   let rows = Math.ceil(totalCards / columns);

//   let gameBoard = document.querySelector('.game-board');
//   gameBoard.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;

//   console.log(`Rows: ${rows}, Columns: ${columns}`);
// }
function adjustLayout() {
  cards = document.querySelectorAll('.card');
  totalCards = cards.length;
  let columns = Math.ceil(Math.sqrt(totalCards));

  let gameBoard = document.querySelector('.game-board');
  
  // Check if the viewport width is larger than our largest breakpoint (700px in this case)
  if (window.innerWidth > 700) {
    gameBoard.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
  } else {
    gameBoard.style.gridTemplateColumns = ""; // Reset to default so media queries can take over
  }
}

// Add an event listener to adjust the layout when the window is resized
window.addEventListener('resize', adjustLayout);

//................................................................

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

    // Animation for matched cards
    flippedCards.forEach(card => {
      card.style.animation = 'matched 0.5s'
      card.addEventListener('animationend', function () {
        card.style.animation = ''
      })
    })
    //................................................................

    // Attach the transitionend event to the second flipped card's front
    let cardFront = flippedCards[1].querySelector('.card-front')
    cardFront.addEventListener('transitionend', function onEnd () {
      if (matchedPairs === totalCards / 2) {
        showWinModal()
      }
      cardFront.removeEventListener('transitionend', onEnd)
    })

    flippedCards = []
  } else {
    // Animation for unmatched cards
    flippedCards.forEach(card => {
      card.style.animation = 'unmatched 0.5s alternate 2'
      card.addEventListener('animationend', function () {
        card.style.animation = ''
      })
    })
    //................................................................
    setTimeout(() => {
      flippedCards[0].classList.remove('flipped')
      flippedCards[1].classList.remove('flipped')
      flippedCards = []
    }, 1000)
  }
}
//................................................................

/* ... Timer ...*/
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
//................................................................

/*...Intro pop-up modal...*/
function showIntroModal () {
  const modal = document.getElementById('introModal')
  modal.style.display = 'block'

  const startGame = document.getElementById('startGame')
  startGame.onclick = function () {
    modal.style.display = 'none'
    startTimer()
  }
}

/* ...Pop-up...*/
function showWinModal () {
  const modal = document.getElementById('winModal')
  const timeTaken = document.getElementById('timer').textContent
  modal.querySelector(
    'p'
  ).textContent = `You've matched all the cards in ${timeTaken}!`
  modal.style.display = 'block'

  stopTimer() // Stop the timer

  modal.style.display = 'block'

  const closeModal = document.getElementById('closeModal')
  closeModal.onclick = function () {
    modal.style.display = 'none'
    document.getElementById('replay').classList.remove('hidden') // Show the "Play Again" button
  }

  const playAgain = document.getElementById('playAgain')
  playAgain.onclick = function () {
    modal.style.display = 'none'
    // Reset game state
    matchedPairs = 0
    cards.forEach(card => card.classList.remove('flipped'))
    shuffleCards()
  }
}
