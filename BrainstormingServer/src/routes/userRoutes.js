'use strict';
var express = require('express'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = require('../models/UserModel');

passport.use(new LocalStrategy(
    function(username, password, done){
      console.log('USE')
      User.getUserByUsername(username, function(err, user){
        if(err){ 
          console.log('err')
          throw(err);
        }
        if(!user){
          console.log('!user')
          return done(null, false, { loginSuccess: false, message: 'Unknown User' });
        }
        User.comparePassword(password, user.password, function(err, isMatch){
          if(err) throw err;
          if(isMatch){
            //console.log(user)
            user['loginSuccess'] = true;
            console.log(user)
            return done(null, {loginSuccess: true, user: user});
          } else {
            console.log('Invalid password')
            return done(null, false, { loginSuccess: false, message: 'Invalid password'});
          }
        });
      });
    })
);

passport.serializeUser(function(user, done) {
  console.log('SE')
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  console.log('DESE')
  User.getUerById(id, function(err, user) {
    done(err, user);
  });
});

module.exports = function(app) {
    var userList = require('../controllers/UserController');

    app.post('/login', function(req, res, next ){
        passport.authenticate('local', function(err, user, info) {
          if (err) { return next(err) }
          if (!user) { return res.json( { loginSuccess: false, message: info.message }) }
          res.json(user);
        })(req, res, next);   
    });

    app.get('/logout', function(req, res){
        req.logout();
        res.send({ logutSuccess: true})
    });
    /*
    app.post('/login', 
        passport.authenticate('local', { failureFlash: 'WTF' }),
        function(req, res) {
            res.send('Login Succcess')
            //console.log(res)
        });
*/  
    app.get('/user_list', userList.list_all_user);

    app.post('/register', userList.create_a_user);
        //.put(dormList.update_a_dorm)
        //.delete(dormList.delete_a_dorm);
    
};