const cardIdentity = {
    1: 'Ace',
    2: '2',
    3: '3',
    4: '4',
    5: '5',
    6: '6', 
    7: '7', 
    8: '8',
    9: '9',
    10: '10',
    11: 'Jack',
    12: 'Queen',
    13: 'King'
};

const suits = ['Clubs', 'Diamonds', 'Hearts', 'Spades'];

const CARDS = () => {
    const cardsArr = [];

    // loop to generate card
    let rank = 1;
    let suitIndex = 0;
    // 52 cards, standard deck
    // 13 cards in each suit
    for (let i = 0; i < 52; i++) {
        // if rank > 13, rank = 1, suitIndex++;
        // on each iteration create an object and push it into the cardsArr
        // each object is as below, 
        if (rank > 13) {
            rank = 1;
            suitIndex++;
            // should only run 4 times
        }   

        const cardObj = {
            id: i,
            rank: rank,
            name: `${cardIdentity[rank]} of ${suits[suitIndex]}`
            // image src
        };

        rank++;

        cardsArr.push(cardObj);
    }

    return cardsArr; // IN ORDER
};

/* 
 {
     id: ${i},
     rank: 1,
     name: `${cardIdentity.rank} of ${suits[suitIndex]}`
 }
*/
console.log(CARDS());

module.export = CARDS;