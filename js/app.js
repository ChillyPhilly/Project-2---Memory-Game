/*
 * Create a list that holds all of your cards
 */

const cards = [];
const deck = document.querySelector('.deck');
const restartButton = document.querySelector('.restart');
let stars = document.querySelector('.stars');
let openCards = [];
let moveCounter = 0;
const cardNames = [ 'fa-diamond',
               'fa-paper-plane-o',
               'fa-anchor',
               'fa-bolt',
               'fa-cube',
               'fa-leaf',
               'fa-bicycle',
               'fa-bomb',
];

//FOR TESTING PURPOSES ONLY
//FOR TESTING PURPOSES ONLY
const matchAll = () => {
  for (i = 0; i < deck.children.length; i++) {
    deck.children[i].classList.add('match');
  }
}
//FOR TESTING PURPOSES ONLY
//FOR TESTING PURPOSES ONLY

//Create two of each card
cardNames.forEach( (card) => {
  cards.push(card);
  cards.push(card);
})


// Check if a card has "match" class
let isMatched = (card) => {
 return card.classList.contains('match');
}

//Check if won
function winCheck() {
  let deckArray = [].slice.call(deck.children);
  if (deckArray.every(isMatched)) {
    return true;
 }
}

//Increment move counter function
const incrementMoveCounter = () => {
  moveCounter += 1;
  document.querySelector('.moves').innerText = moveCounter.toString();
}

//What to do when a card is clicked
const listenerFunction = () => {
  let card = event.target;

  // Increment move counter
  if (openCards.length < 2) {
    incrementMoveCounter();
  }

  //Take stars away when playing badly
  if (moveCounter === 18) {
    stars.removeChild(stars.lastElementChild);
  } else if (moveCounter === 24) {
    stars.removeChild(stars.lastElementChild);
  } else if (moveCounter ===40) {
    stars.removeChild(stars.lastElementChild);
  };

  //Flip card
  console.log(moveCounter);
  if (openCards.length < 2 && !card.classList.contains('open')) {
    openCards.push(event.target);
    card.classList.add('show', 'open');
  }

  //Check if cards are different, then flip back over after a delay:
  if (openCards.length === 2 && !openCards[0].firstElementChild.isEqualNode(openCards[1].firstElementChild)) {
    setTimeout( () => {openCards.forEach( (child) => {
      child.classList.remove('show', 'open');
    });
    openCards = [];
  }, 1500);
  }

  // Otherwise, if cards match, style as "matched" and continue showing icon:
  else if (openCards.length === 2 && openCards[0].firstElementChild.isEqualNode(openCards[1].firstElementChild)) {
    openCards.forEach( (child) => {
      child.classList.add('match');
      child.classList.remove('show', 'open');
    });
    console.log('Match!');
      openCards = [];
  };
  //Popup message if won
  if (winCheck() === true && moveCounter < 18) {
    setTimeout( () => {
      window.alert(`You won. Mum must be so proud of your mighty ${Math.round(moveCounter)} moves.`);
    }, 1);
  } else if (winCheck() === true && moveCounter < 24) {
    window.alert(`You won. Mum is probably okay with your meagre ${Math.round(moveCounter)} moves.`);
  } else if (winCheck() === true && moveCounter < 40) {
    window.alert(`You won. Mum would be disappointed with your ${Math.round(moveCounter)} moves.`);
  } else if (winCheck() === true && moveCounter > 40) {
    window.alert(`You won. But a hollow victory with ${Math.round(moveCounter)} moves. Mum is ashamed.`);
  };
};

//Create individual cards and add them to the deck
const generateCard = (card) => {
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
  shuffle(cards);
  generateDeck();
  moveCounter = 0;
  document.querySelector('.moves').innerText = moveCounter.toString()
}

//Restart game - remove all cards then re-initialize
const restart  = () => {
  while (deck.firstChild) {
    deck.removeChild(deck.firstChild);
  };

  initialize();
}

//Popup window when clicking restart
restartButton.addEventListener('click', () => {
  if (confirm("Oh, you wanna try again? Maybe you'll do better this time...")) {
    txt = "Aight, good luck mayne!";
    restart();
  } else {
    alert("Ha, knew you'd wuss out.");
  }
});

initialize(); //GAME NO LOAD WITHOUT THIS. I M P O R T A N T   F U N C T I O N
