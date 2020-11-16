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

const cardGenerator = () => {
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
// console.log(cardGenerator());

const CARDS = [
    { id: 0, rank: 1, name: 'Ace of Clubs' },
    { id: 1, rank: 2, name: '2 of Clubs' },
    { id: 2, rank: 3, name: '3 of Clubs' },
    { id: 3, rank: 4, name: '4 of Clubs' },
    { id: 4, rank: 5, name: '5 of Clubs' },
    { id: 5, rank: 6, name: '6 of Clubs' },
    { id: 6, rank: 7, name: '7 of Clubs' },
    { id: 7, rank: 8, name: '8 of Clubs' },
    { id: 8, rank: 9, name: '9 of Clubs' },
    { id: 9, rank: 10, name: '10 of Clubs' },
    { id: 10, rank: 11, name: 'Jack of Clubs' },
    { id: 11, rank: 12, name: 'Queen of Clubs' },
    { id: 12, rank: 13, name: 'King of Clubs' },
    { id: 13, rank: 1, name: 'Ace of Diamonds' },
    { id: 14, rank: 2, name: '2 of Diamonds' },
    { id: 15, rank: 3, name: '3 of Diamonds' },
    { id: 16, rank: 4, name: '4 of Diamonds' },
    { id: 17, rank: 5, name: '5 of Diamonds' },
    { id: 18, rank: 6, name: '6 of Diamonds' },
    { id: 19, rank: 7, name: '7 of Diamonds' },
    { id: 20, rank: 8, name: '8 of Diamonds' },
    { id: 21, rank: 9, name: '9 of Diamonds' },
    { id: 22, rank: 10, name: '10 of Diamonds' },
    { id: 23, rank: 11, name: 'Jack of Diamonds' },
    { id: 24, rank: 12, name: 'Queen of Diamonds' },
    { id: 25, rank: 13, name: 'King of Diamonds' },
    { id: 26, rank: 1, name: 'Ace of Hearts' },
    { id: 27, rank: 2, name: '2 of Hearts' },
    { id: 28, rank: 3, name: '3 of Hearts' },
    { id: 29, rank: 4, name: '4 of Hearts' },
    { id: 30, rank: 5, name: '5 of Hearts' },
    { id: 31, rank: 6, name: '6 of Hearts' },
    { id: 32, rank: 7, name: '7 of Hearts' },
    { id: 33, rank: 8, name: '8 of Hearts' },
    { id: 34, rank: 9, name: '9 of Hearts' },
    { id: 35, rank: 10, name: '10 of Hearts' },
    { id: 36, rank: 11, name: 'Jack of Hearts' },
    { id: 37, rank: 12, name: 'Queen of Hearts' },
    { id: 38, rank: 13, name: 'King of Hearts' },
    { id: 39, rank: 1, name: 'Ace of Spades' },
    { id: 40, rank: 2, name: '2 of Spades' },
    { id: 41, rank: 3, name: '3 of Spades' },
    { id: 42, rank: 4, name: '4 of Spades' },
    { id: 43, rank: 5, name: '5 of Spades' },
    { id: 44, rank: 6, name: '6 of Spades' },
    { id: 45, rank: 7, name: '7 of Spades' },
    { id: 46, rank: 8, name: '8 of Spades' },
    { id: 47, rank: 9, name: '9 of Spades' },
    { id: 48, rank: 10, name: '10 of Spades' },
    { id: 49, rank: 11, name: 'Jack of Spades' },
    { id: 50, rank: 12, name: 'Queen of Spades' },
    { id: 51, rank: 13, name: 'King of Spades' },
  ];

  /*
    (0, 1, 'Ace of Clubs' ),
    (1, 2, '2 of Clubs' ),
    (2, 3, '3 of Clubs' ),
    (3, 4, '4 of Clubs' ),
    (4, 5, '5 of Clubs' ),
    (5, 6, '6 of Clubs' ),
    (6, 7, '7 of Clubs' ),
    (7, 8, '8 of Clubs' ),
    (8, 9, '9 of Clubs' ),
    (9, 10, '10 of Clubs' ),
    (10, 11, 'Jack of Clubs' ),
    (11, 12, 'Queen of Clubs' ),
    (12, 13, 'King of Clubs' ),
    (13, 1, 'Ace of Diamonds' ),
    (14, 2, '2 of Diamonds' ),
    (15, 3, '3 of Diamonds' ),
    (16, 4, '4 of Diamonds' ),
    (17, 5, '5 of Diamonds' ),
    (18, 6, '6 of Diamonds' ),
    (19, 7, '7 of Diamonds' ),
    (20, 8, '8 of Diamonds' ),
    (21, 9, '9 of Diamonds' ),
    (22, 10, '10 of Diamonds' ),
    (23, 11, 'Jack of Diamonds' ),
    (24, 12, 'Queen of Diamonds' ),
    (25, 13, 'King of Diamonds' ),
    (26, 1, 'Ace of Hearts' ),
    (27, 2, '2 of Hearts' ),
    (28, 3, '3 of Hearts' ),
    (29, 4, '4 of Hearts' ),
    (30, 5, '5 of Hearts' ),
    (31, 6, '6 of Hearts' ),
    (32, 7, '7 of Hearts' ),
    (33, 8, '8 of Hearts' ),
    (34, 9, '9 of Hearts' ),
    (35, 10, '10 of Hearts' ),
    (36, 11, 'Jack of Hearts' ),
    (37, 12, 'Queen of Hearts' ),
    (38, 13, 'King of Hearts' ),
    (39, 1, 'Ace of Spades' ),
    (40, 2, '2 of Spades' ),
    (41, 3, '3 of Spades' ),
    (42, 4, '4 of Spades' ),
    (43, 5, '5 of Spades' ),
    (44, 6, '6 of Spades' ),
    (45, 7, '7 of Spades' ),
    (46, 8, '8 of Spades' ),
    (47, 9, '9 of Spades' ),
    (48, 10, '10 of Spades' ),
    (49, 11, 'Jack of Spades' ),
    (50, 12, 'Queen of Spades' ),
    (51, 13, 'King of Spades' );
*/