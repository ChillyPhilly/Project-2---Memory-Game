let cards = [];
const deck = document.querySelector('.deck');
const restartButton = document.querySelector('.restart');
let stars = document.querySelector('.stars');
const starCheckpoints = ['11', '16', '21'] // Checkpoints at which to remove stars
let openCards = [];
let startDate;
let startTimer;
let unmatchedDisplayStatus = false; //Necessary for functionality in checking cards are different; prevents further clicks from activating the 1500ms delay again to flip over
const cardNames = [ 'fa-diamond',
               'fa-paper-plane-o',
               'fa-anchor',
               'fa-bolt',
               'fa-cube',
               'fa-leaf',
               'fa-bicycle',
               'fa-bomb',
];

//Create two of each card
cards = cardNames.concat(cardNames);

const beginTiming = () => {
  startTimer = setInterval( () => {
    let endDate = new Date();
    let timeTaken = Math.round((endDate.getTime() - startDate.getTime())/1000);
    document.querySelector('.timer').innerText = timeTaken;
    timer = timeTaken.toString();
  }, 1000);
};

//Custom popup window for win
const swalBoxWin = (message) => {
  Swal.fire({
  title: `You won. Maybe you feel like playing another.`,
  text: `${message}`,
  type: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Yes, your sass cannot discourage me!',
  cancelButtonText: `I am so ashamed of my ${moveCounter} moves that I must give up.`
}).then((result) => {
  if (result.value) {
      restart();
  }
})
};

//Custom popup window for restart
const swalBoxRestart = () => {
  Swal.fire({
  title: `Decided to try again have we?`,
  text: `Oh, you wanna try again? Maybe you'll do better this time...`,
  type: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Yes, your sass cannot discourage me!',
  cancelButtonText: `No, I do not believe I can do better and thus give up.`
}).then((result) => {
  if (result.value) {
      restart();
  }
})
};

const stopTimer = () => clearInterval(startTimer);

// Check if a card has "match" class
const isMatched = card => card.classList.contains('match');

//Check if won - [].slice.call(deck) is required to make deck an array. Otherwise .every won't work
const winCheck = () => [].slice.call(deck.children).every(isMatched)

//Increment move counter function
const incrementMoveCounter = () => {
  document.querySelector('.moves').innerText = (++moveCounter).toString();
}

//What to do when a card is clicked
const listenerFunction = () => {
  let card = event.target;

  //Flip card
  if (openCards.length < 2) {
    openCards.push(card);
    card.classList.add('show', 'open');
  }

  //Check if cards are different, then flip back over after a delay:
  if (openCards.length === 2 && !openCards[0].firstElementChild.isEqualNode(openCards[1].firstElementChild) && !unmatchedDisplayStatus) {
    openCards.forEach( child => {
      child.classList.add('notMatched', 'animated', 'headShake');
    });
    setTimeout( () => {openCards.forEach( (child) => {
      child.classList.remove('show', 'open', 'notMatched', 'animated', 'headShake');
    })
    openCards = [];
    unmatchedDisplayStatus = false;
    }, 1500);
    unmatchedDisplayStatus = true;
    incrementMoveCounter()
  }

  // Otherwise, if cards match, style as "matched" and continue showing icon:
  else if (openCards.length === 2 && openCards[0].firstElementChild.isEqualNode(openCards[1].firstElementChild)) {
    openCards.forEach( child => {
      child.classList.add('match', 'animated', 'bounce');
      child.classList.remove('show', 'open');
    });
    openCards = [];
    incrementMoveCounter();
  };

  //Take stars away when playing badly
  let i = starCheckpoints.indexOf(`${moveCounter}`);
  if (i !== -1) {
    if (i === 0) {
      stars.childNodes[i+1].classList.add('hidden');
    } else if (i === 1) {
      stars.childNodes[i+2].classList.add('hidden');
    } else if (i === 2) {
      stars.childNodes[i+3].classList.add('hidden');
    }
  }

  //Popup message if won
  if (winCheck() === true) {
    deck.classList.add('animated');
    let hiddenStars = stars.querySelectorAll('.hidden');
    let remainingStars = 3 - hiddenStars.length;
    let finalDate = new Date();
    let finalTime = Math.round((finalDate - startDate)/1000);
    stopTimer();
    setTimeout( () => {
      if (moveCounter < starCheckpoints[0]) {
        swalBoxWin(`Mum must be so proud of your mighty ${remainingStars} stars remaining. And it only took you ${finalTime} seconds!`);
    } else if (winCheck() === true && moveCounter < starCheckpoints[1]) {
      swalBoxWin(`Mum is probably okay with your meagre ${remainingStars} stars remaining, even if it did take you ${finalTime} seconds.`);
    } else if (winCheck() === true && moveCounter < starCheckpoints[2]) {
      swalBoxWin(`Mum would be disappointed with your ${remainingStars} stars remaining, even though you still completed it in ${finalTime} seconds.`);
    } else if (winCheck() === true && moveCounter > starCheckpoints[2]) {
      swalBoxWin(`But a hollow victory with ${remainingStars} stars remaining. Especially considering it took you a whole ${finalTime} seconds. Mum is ashamed.`);
    };
  }, 500);
  };
};

//Create individual cards and add them to the deck
const generateCard = card => {
  const newTile = document.createElement(`li`); //Create list
  const newCard = document.createElement(`i`); //Create list elements
  newTile.classList.add(`card`);
  newCard.classList.add(`fa`);
  newCard.classList.add(`${card}`); //Add classlist for name of card
  newTile.appendChild(newCard); //Add new card to its tile
  newTile.addEventListener('click', listenerFunction); //Add event listener to each card as it is created
  deck.appendChild(newTile); //Add each tile/card to the deck
}

//Generate the deck on screen
const generateDeck = () => {
 cards.forEach(generateCard);
}

/*
* Display the cards on the page
*   - shuffle the list of cards using the provided "shuffle" method below
*   - loop through each card and create its HTML
*   - add each card's HTML to the page
*/

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
  }

  return array;
}

/*
* set up the event listener for a card. If a card is clicked:
*  - display the card's symbol (put this functionality in another function that you call from this one)
*  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
*  - if the list already has another card, check to see if the two cards match
*    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
*    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
*    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
*    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
*/

//Begin game by shuffling cards and generating deck, resetting move counter
const initialize = () => {
  openCards = []
  startDate = new Date();
  shuffle(cards);
  generateDeck();
  moveCounter = 0;
  beginTiming();
  document.querySelector('.moves').innerText = moveCounter.toString()
}

//Un-hide the hidden stars
const resetStars = () => {
  let hiddenStars = stars.querySelectorAll('.hidden');
  let i = 0;
  while (i < hiddenStars.length) {
    hiddenStars[i].classList.remove('hidden');
    i++;
  }
}

//Restart game - remove all cards then re-initialize and un-hide stars
const restart  = () => {
  deck.classList.add('bounceOutLeft');
  while (deck.firstChild) {
    deck.removeChild(deck.firstChild);
  };
  setTimeout( () => {
    document.querySelector('.timer').innerText = 0; // Put timer to 0
    resetStars();
    initialize();
    deck.classList.remove('bounceOutLeft');
    deck.classList.add('bounceInDown');
  }, 500);
};

//Popup window when clicking restart
restartButton.addEventListener('click', swalBoxRestart);

initialize(); //GAME NO LOAD WITHOUT THIS. I M P O R T A N T   F U N C T I O N


//FOR TESTING PURPOSES ONLY
//FOR TESTING PURPOSES ONLY
const matchAll = () => {
  for (i = 0; i < deck.children.length; i++) {
    deck.children[i].classList.add('match');
  }
}
//FOR TESTING PURPOSES ONLY
//FOR TESTING PURPOSES ONLY
