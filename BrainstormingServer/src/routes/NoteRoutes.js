'use strict';
var express = require('express');

module.exports = function(app) {
	var noteList = require('../controllers/NoteController');
	
	app.get('/all_notes', noteList.list_all_notes);
	//app.post('/create_note', noteList.create_a_note);

}