Router.route('/pokerTable', function () {
  this.render('pokerTable');
});

Router.route('/userLogin', function() {
  this.render('userLogin');
});

Router.route('/game/:_group/poker', function() {
  this.render('pokerPlayer', {
    data: function() {
      templateData = {
        hello: 'poker'
      }
      return templateData;
    }
  });
});

Router.route('/game/:_group/minigame', function() {
  this.render('pokerPlayer', {
    data: function() {
      templateData = {
        hello: 'minigame'
      }
      return templateData;
    }
  });
});