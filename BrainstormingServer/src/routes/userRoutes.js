'use strict';

module.exports = function(app) {
    var userList = require('../controllers/userController');

    // todoList Routes
    app.route('/all_user')
        .get(userList.list_all_user)
        .post(userList.create_a_user);

    app.route('/login')
        .post(userList.check_login);

    app.route('/new_user')
        .get(userList.create_a_user);
        //.put(dormList.update_a_dorm)
        //.delete(dormList.delete_a_dorm);
    
};