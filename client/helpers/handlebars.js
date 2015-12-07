Template.registerHelper('equals', function (a, b) {
  return a === b;
});

Template.registerHelper('gameState', function() {
  return Groups.findOne();
});

Template.registerHelper('pokerGame', function() {
  return PokerGame.findOne();
})