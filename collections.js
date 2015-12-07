Groups = new Mongo.Collection('groups', {idGeneration: 'STRING'});

// Insert only 1 group if the collection is empty. . . dirty little hack 
if (Groups.find().count() == 0) {
  Groups.insert({});
}

// Create a game collection 
PokerGame = new Mongo.Collection('pokergame', {idGeneration: 'STRING'});


// Insert the poker cards
// 3 cards of 1-10
if (PokerGame.find().count() == 0) {
  PokerGame.insert({
    cards: [1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8, 9, 9, 9, 10, 10, 10],
    minigame: {
      answer: "b",
      state: "card1",
      card1: {
        winner: ""
      }, 
      card2: {
        winner: ""
      }
    },
    playcards: {
      card1: "",
      card2: ""
    },
    poker: {
      cardState: "start",
      currentPlayer: "group1"
    }
  });
}

// ['1a', '1b', '1c', '2a', '2b', '2c', '3a', '3b', '3c', '4a', '4b', '4c', '5a', '5b', '5c', '6a', '6b', '6c', '7a', '7b', '7c', '8a', '8b', '8c', '9a', '9b', '9c', '10a', '10b', '10c']