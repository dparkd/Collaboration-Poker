Template.userLogin.events({
  'click #joinGroup': function(event) {
    Meteor.call('createGroup');
  },

  'click .join-game': function(e) {
    e.preventDefault();
    var gameRoom = Groups.findOne()._id;
    var gameType = $(e.currentTarget).data('type');
    var gameGroup = $(e.currentTarget).data('group');
    Meteor.call('joinGroup', gameRoom, gameType, gameGroup);
    Meteor.call('gameReady');

    Router.go('/game/'+gameGroup+'/'+gameType);
  }
});

Template.userLogin.helpers({
  'groups': function() {
    return Groups.findOne();
  },

  'groupLoop': function() {
    return [1, 2, 3, 4];
  }
});

Template.signupForm.events({
  "submit #signup-form": function(event, template) {
    event.preventDefault();
    Accounts.createUser({
      username: template.find("#signup-username").value,
      password: template.find("#signup-password").value,
    }, function(error) {
      if (error) {
        // Display the user creation error to the user however you want
      }
    });
  }
});

Template.loginForm.events({
  "submit #login-form": function(event, template) {
    event.preventDefault();
    Meteor.loginWithPassword(
      template.find("#login-username").value,
      template.find("#login-password").value,
      function(error) {
        if (error) {
          // Display the login error to the user however you want
        }
      }
    );
  }
});

Template.logoutForm.events({
  "submit #logout-form": function(event, template) {
    event.preventDefault();
    var gameRoom = Groups.findOne()._id;

    Meteor.call('userLogout', gameRoom);

    Meteor.logout(function(error) {
      if (error) {
        // Display the logout error to the user however you want
      }
    });
  }
});











