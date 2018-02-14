'use strict';
var express = require('express');

module.exports = function(app) {
	var boardList = require('../controllers/BoardController');
	
	app.get('/all_boards', boardList.list_all_boards);
	app.post('/create_board', boardList.create_a_board);

}