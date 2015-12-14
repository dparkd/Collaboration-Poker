// These poker methods only work for 2 players

var resetBoard = function() {
  var poker = PokerGame.findOne();
  var group = Groups.findOne()._id;

  // reset the game state
  Groups.update(group, {$set: {'game.state': 'dealCards'}});


  // Reset the poker
  PokerGame.update(poker._id, {$set: {
    cards: [1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8, 9, 9, 9, 10, 10, 10],
    'group1.card': "",  
    'group2.card': "",  
    'playcards.card1': "", 
    'playcards.card2': "",
    'minigame.card1.winner': "",
    'minigame.card2.winner': "",
    'minigame.state': "card1",
    'poker.cardState': "start",
    'poker.currentPlayer': "group1",
    'poker.betAmt': 0,
    'poker.pot': 0,
    'poker.players': ['group1', 'group2'],
    'poker.startPlayer': "group1"
  }});
}

// Evaluate the poker hands of each player
var evaluateCards = function() {
  var poker = PokerGame.findOne(); 

  // player cards
  var p1 = poker.group1.card;
  var p2 = poker.group2.card; 

  // play cards
  var c1 = poker.playcards.card1; 
  var c2 = poker.playcards.card2; 

  // Hand states 
  var p1hand, p2hand;

  // Player 1
  // Check for triple
  if (p1 == c1 && p1 == c2) {
    p1hand = "triple"; 
  } else {
    // check for straight
    if (Math.abs(p1 - c1) < 3 && Math.abs(p1 - c2) < 3 && p1 != c1 && p1 != c2) {
      // Return if hand is a straight
      p1hand = "straight";
    } else {
      // Check for pair 
      if (p1 == c1) {
        p1hand = "pair"; 
      } else if (p1 == c2) {
        p1hand = "pair"; 
      } else {
        // Return the hand value
        p1hand = "kicker";
      }
    }
  }

  // Player 2
  // Check for triple
  if (p2 == c1 && p2 == c2) {
    p2hand = "triple"; 
  } else {
    // check for straight
    if (Math.abs(p2 - c1) < 3 && Math.abs(p2 - c2) < 3 && p2 != c1 && p2 != c2) {
      // Return if hand is a straight
      p2hand = "straight";
    } else {
      // Check for pair 
      if (p2 === c1) {
        p2hand = "pair"; 
      } else if (p2 === c2) {
        p2hand = "pair"; 
      } else {
        // Return the hand value
        p2hand = "kicker";
      }
    }
  }

  // print to the console 
  console.log(p1hand + ' ' + p2hand);

  // Check if both players have the same hand 
  if (p1hand === p2hand) {
    if (p1 > p2) {
      PokerGame.update(poker._id, {$inc: {'group1.chips': poker.poker.pot}});
    } else {
      PokerGame.update(poker._id, {$inc: {'group2.chips': poker.poker.pot}});
    }
    PokerGame.update(poker._id, {$set: {'poker.pot': 0}});
  } else {
    var rank = ['triple', 'straight', 'pair', 'kicker', 'undefined'];
    var p1rank = rank.indexOf(p1hand);
    var p2rank = rank.indexOf(p2hand);
    console.log(p1rank + ' ' + p2rank);
    
    if (p1rank < p2rank) {
      PokerGame.update(poker._id, {$inc: {'group1.chips': poker.poker.pot}});
    } else {
      PokerGame.update(poker._id, {$inc: {'group2.chips': poker.poker.pot}});
    }
    PokerGame.update(poker._id, {$set: {'poker.pot': 0}});
  }
}



Meteor.methods({
  'removeCardFromHand': function(card) {
    var poker = PokerGame.findOne()._id;

    PokerGame.update(poker, {$pull: {cards: card}});
  },

  'dealCards': function() {
    var poker = PokerGame.findOne()._id;
    var obj = PokerGame.findOne({});
    var group = Groups.findOne()._id;

    for (var i = 1; i < 3; i++) {
      var pokerCards = obj.cards;
      var card = pokerCards[Math.floor(Math.random()*pokerCards.length)];
      var insCard = {};
      insCard['group'+i+'.card'] = card;

      // Remove the card from the cards array 
      var ia = pokerCards.indexOf(card);
      if(ia > -1) {
        pokerCards.splice(ia, 1);
      }
      insCard['cards'] = pokerCards;

      PokerGame.update(poker, {$set: insCard, });
    }

    Groups.update(group, {$set: {'game.state': 'minigame'}});
    PokerGame.update(poker, {$set: {'poker.currentPlayer': 'group1'}});
    PokerGame.update(poker, {$set: {
      'poker.cardState': 'start',
    }})
  },

  // The next player method
  'nextPlayer': function() {
    var poker = PokerGame.findOne();

    if (poker.currentPlayer === 'group1') {
      PokerGame.update(poker._id, {$set: {'poker.currentPlayer': 'group2'}});
    } else {
      PokerGame.update(poker._id, {$set: {'poker.currentPlayer': 'group1'}});
    }
  },

  // Fold function
  'fold': function(group) {
    var poker = PokerGame.findOne();

    var pot = poker.poker.pot;
    var playerWin = {};
    if (poker.poker.currentPlayer === 'group1') {
      playerWin['group2.chips'] = pot;
      PokerGame.update(poker._id, {$inc: playerWin});
    } else {
      playerWin['group1.chips'] = pot;
      PokerGame.update(poker._id, {$inc: playerWin});
    }

    PokerGame.update(poker._id, {$set: {'poker.pot': 0}});
    newRound();
  },

  // Betting method and function
  'bet': function(userGroup, amount) {
    var poker = PokerGame.findOne();
    var betAmt = {};
    var pot = {};

    // remove chips from the user
    var chips = {};
    chips[userGroup+'.chips'] = -amount;
    PokerGame.update(poker._id, {$inc: chips});
    
    if (poker.poker.currentPlayer === 'group1') {
      PokerGame.update(poker._id, {$set: {'poker.currentPlayer': 'group2'}});

      betAmt['poker.betAmt'] = parseInt(amount);
      pot['poker.pot'] = parseInt(amount);
      PokerGame.update(poker._id, {$set: betAmt});
      PokerGame.update(poker._id, {$inc: pot});
    } else {
      PokerGame.update(poker._id, {$set: {'poker.currentPlayer': 'group1'}});

      betAmt['poker.betAmt'] = parseInt(amount);
      pot['poker.pot'] = parseInt(amount);
      PokerGame.update(poker._id, {$set: betAmt});
      PokerGame.update(poker._id, {$inc: pot});
    }
  },

  'raise': function(userGroup, amount) {
    var poker = PokerGame.findOne();
    var betAmt = {};
    var pot = {};

    // Call the previous betAmt first 
    var called = {}; 
    called['poker.pot'] = poker.poker.betAmt;
    PokerGame.update(poker._id, {$inc: called});

    // remove chips from the user
    var chips = {};
    chips[userGroup+'.chips'] = - amount - poker.poker.betAmt;
    PokerGame.update(poker._id, {$inc: chips});
    
    if (poker.poker.currentPlayer === 'group1') {
      PokerGame.update(poker._id, {$set: {'poker.currentPlayer': 'group2'}});

      betAmt['poker.betAmt'] = parseInt(amount);
      pot['poker.pot'] = parseInt(amount);
      PokerGame.update(poker._id, {$set: betAmt});
      PokerGame.update(poker._id, {$inc: pot});
    } else {
      PokerGame.update(poker._id, {$set: {'poker.currentPlayer': 'group1'}});

      betAmt['poker.betAmt'] = parseInt(amount);
      pot['poker.pot'] = parseInt(amount);
      PokerGame.update(poker._id, {$set: betAmt});
      PokerGame.update(poker._id, {$inc: pot});
    }
  },

  // Calling the bet
  'call': function(userGroup) {
    var poker = PokerGame.findOne();

    // update the pot 
    var called = {}; 
    called['poker.pot'] = poker.poker.betAmt;
    PokerGame.update(poker._id, {$inc: called});

    // remove chips from the person who called
    var chips = {};
    chips[userGroup+'.chips'] = -(poker.poker.betAmt);
    PokerGame.update(poker._id, {$inc: chips});

    // Reset the betting slot
    PokerGame.update(poker._id, {$set: {'poker.betAmt': 0}});

    // changing the poker state
    if (poker.poker.cardState === 'start') {
      PokerGame.update(poker._id, {$set: {'poker.cardState': 'card1'}});
      PokerGame.update(poker._id, {$set: {'poker.currentPlayer': 'group1'}});
    } else if (poker.poker.cardState === 'card1') {
      PokerGame.update(poker._id, {$set: {'poker.cardState': 'card2'}});
      PokerGame.update(poker._id, {$set: {'poker.currentPlayer': 'group1'}});
    } else {
      evaluateCards();
      PokerGame.update(poker._id, {$set: {'poker.cardState': 'start'}});
      PokerGame.update(poker._id, {$set: {'poker.currentPlayer': 'group1'}});
    }
  },

  // Check logic 
  'check': function(userGroup) {
    var poker = PokerGame.findOne(); 

    // player check 
    var player = {};

    // Move to the next player
    if (poker.poker.startPlayer === poker.poker.currentPlayer) {
      if (poker.poker.currentPlayer === 'group1') {
        PokerGame.update(poker._id, {$set: {'poker.currentPlayer': 'group2'}});
      } else {
        PokerGame.update(poker._id, {$set: {'poker.currentPlayer': 'group1'}});
      }
    } else {
      if (poker.poker.cardState === 'start') {
        PokerGame.update(poker._id, {$set: {'poker.cardState': 'card1'}});

        // Change the start player
        if (poker.poker.currentPlayer === 'group1') {
          PokerGame.update(poker._id, {$set: {'poker.currentPlayer': 'group2'}});
        } else {
          PokerGame.update(poker._id, {$set: {'poker.currentPlayer': 'group1'}});
        }
      } else if (poker.poker.cardState === 'card1') {
        PokerGame.update(poker._id, {$set: {'poker.cardState': 'card2'}});

        // Change the start player
        if (poker.poker.currentPlayer === 'group1') {
          PokerGame.update(poker._id, {$set: {'poker.currentPlayer': 'group2'}});
        } else {
          PokerGame.update(poker._id, {$set: {'poker.currentPlayer': 'group1'}});
        }
      } else {
        evaluateCards();
        PokerGame.update(poker._id, {$set: {'poker.cardState': 'start'}});

        // Change the start player
        // if (poker.poker.currentPlayer === 'group1') {
        //   PokerGame.update(poker._id, {$set: {'poker.currentPlayer': 'group2'}});
        // } else {
        //   PokerGame.update(poker._id, {$set: {'poker.currentPlayer': 'group1'}});
        // }
      }
    }
  },

  // Reseting cards for easy development 
  'resetCards': function() {
    var poker = PokerGame.findOne();
    var group = Groups.findOne()._id;

    // reset the game state
    Groups.update(group, {$set: {'game.state': 'dealCards'}});


    // Reset the poker
    PokerGame.update(poker._id, {$set: {
      cards: [1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8, 9, 9, 9, 10, 10, 10],
      'group1.card': "", 
      'group1.chips': 300, 
      'group2.card': "", 
      'group2.chips': 300, 
      'playcards.card1': "", 
      'playcards.card2': "",
      'minigame.card1.winner': "",
      'minigame.card2.winner': "",
      'minigame.state': "card1",
      'poker.cardState': "start",
      'poker.currentPlayer': "group1",
      'poker.betAmt': 0,
      'poker.pot': 0,
      'poker.startPlayer': "group1"
    }});
  },

  // Reseting cards for easy development 
  'newRound': function() {
    var poker = PokerGame.findOne();
    var group = Groups.findOne()._id;

    // reset the game state
    Groups.update(group, {$set: {'game.state': 'dealCards'}});


    // Reset the poker
    PokerGame.update(poker._id, {$set: {
      cards: [1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8, 9, 9, 9, 10, 10, 10],
      'group1.card': "", 
      'group2.card': "",  
      'playcards.card1': "", 
      'playcards.card2': "",
      'minigame.card1.winner': "",
      'minigame.card2.winner': "",
      'minigame.state': "card1",
      'poker.cardState': "start",
      'poker.currentPlayer': "group1",
      'poker.betAmt': 0,
      'poker.pot': 0,
      'poker.startPlayer': "group1"
    }});
  }
});



var newRound = function() {
  var poker = PokerGame.findOne();
    var group = Groups.findOne()._id;

    // reset the game state
    Groups.update(group, {$set: {'game.state': 'dealCards'}});


    // Reset the poker
    PokerGame.update(poker._id, {$set: {
      cards: [1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8, 9, 9, 9, 10, 10, 10],
      'group1.card': "", 
      'group2.card': "",  
      'playcards.card1': "", 
      'playcards.card2': "",
      'minigame.card1.winner': "",
      'minigame.card2.winner': "",
      'minigame.state': "card1",
      'poker.cardState': "start",
      'poker.currentPlayer': "group1",
      'poker.betAmt': 0,
      'poker.pot': 0,
      'poker.startPlayer': "group1"
    }});
}

















