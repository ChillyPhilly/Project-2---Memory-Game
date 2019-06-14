/*
 * Create a list that holds all of your cards
 */
const cards = [ 'fa-diamond', 'fa-diamond',
                'fa-paper-plane-o', 'fa-paper-plane-o',
                'fa-anchor','fa-anchor',
                'fa-bolt', 'fa-bolt',
                'fa-cube', 'fa-cube',
                'fa-leaf', 'fa-leaf',
                'fa-bicycle', 'fa-bicycle',
                'fa-bomb', 'fa-bomb',
];

let cardList = [];
let openCards = [];
let moveCounter = 0;
const deck = document.querySelector('.deck');

const generateCard = (card) => {
 let cardTemplate = `<li class="card"><i class="fa ${card}"></i></li>`;
 return cardTemplate;
}

const init = () => {
  shuffle(cards);
  const cardHTML = cards.map(function(card) {
    return generateCard(card);
  });

  deck.innerHTML = cardHTML.join('');
  moveCounter = 0;
}

init();

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

const restart = document.querySelector('.restart');

let isMatch = (card) => {
 return card.classList.contains('match');
}



onClick = () => {
  const allCards = document.querySelectorAll('.card');
  let allCardsArray = [].slice.call(allCards);
  allCards.forEach( (card) => {
    card.addEventListener("click", () => {
      document.getElementsByClassName('moves')[0].innerText = Math.round(moveCounter).toString(); //Control move counter display
      // Increment move counter
      if (cardList.length < 2) {
        moveCounter += 0.50;
      }
      //Flip card
      console.log(moveCounter);
      if (cardList.length < 2 && !card.classList.contains('open')) {
        cardList.push(card);
        card.classList.add('show', 'open');
      }
      //Check if cards are different, then flip back over after a delay:
      if (cardList.length === 2 && !cardList[0].firstElementChild.isEqualNode(cardList[1].firstElementChild)) {
        setTimeout( () => {cardList.forEach( (child) => {
          child.classList.remove('show', 'open');
        });
        cardList = [];
      }, 1500);
      }
    // Otherwise, if cards match, style as "matched" and continue showing icon:
      else if (cardList.length === 2 && cardList[0].firstElementChild.isEqualNode(cardList[1].firstElementChild)) {
        cardList.forEach( (child) => {
          child.classList.add('match');
          child.classList.remove('show', 'open');
        });
        console.log('Match!');
          cardList = [];
      }
      //Check if won
      function winCheck() {
       if (allCardsArray.every(isMatch)) {
         return true;
       }
      }
      //Popup message if won
      if (winCheck() === true) {
        setTimeout( () => {
          window.alert('You won. Mum must be so proud.');
        }, 0);
      }
    });
  });
};

onClick();

restart.addEventListener('click', () => {
  const popup = confirm('Would you like to play again?')
  if (popup == true) {
  deck.innerHTML = '';
  init();
  setTimeout(onClick(), 100);;
  }
});
