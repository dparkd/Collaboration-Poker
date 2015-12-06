Meteor.methods({
  'removeCardFromHand': function(card) {
    var poker = PokerGame.findOne()._id;

    PokerGame.update(poker, {$pull: {cards: card}});
  },

  'dealCard': function() {
    var poker = PokerGame.findOne()._id;
    var obj = PokerGame.findOne({});
    var pokerCards = obj.cards;
    var card = pokerCards[Math.floor(Math.random()*pokerCards.length)];

    var insCard = {};
    insCard[Meteor.user().game.group] = card;

    PokerGame.update(poker, {$set: insCard});
  }
})