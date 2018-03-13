'use strict';
var express = require('express');

module.exports = function(app) {
	var notificationList = require('../controllers/NotificationController');
	
	app.get('/all_notification', notificationList.getAllNotification);
	
}