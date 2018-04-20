import React, { Component } from 'react';
import './mystyle/Note.css';
import axios from 'axios';
import NoteEdit from './NoteEdit';
import socketIOClient from 'socket.io-client';
import Draggable from 'react-draggable';
import Icon from 'react-icons-kit';
import { pencil, move } from 'react-icons-kit/iconic';
import BlackTransparent from './BlackTransparent';

class NoteBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            notes: [],
            note: {},
            edit: false,
            onDrag: false,
            mousePoint: "",
            noteIndex: 0,
            selectedNote: {}
        };
        this.showNoteEdit = this.showNoteEdit.bind(this);
        this.closeNoteEdit = this.closeNoteEdit.bind(this);
        this.updateBoard = this.updateBoard.bind(this);
        this.moveNote = this.moveNote.bind(this);
        this.sendMovingNote = this.sendMovingNote.bind(this);
        this.onControlledDrag = this.onControlledDrag.bind(this);
        this.onMousePoint = this.onMousePoint.bind(this);
    }

    componentDidMount() {
        this.setState({ notes: this.props.notes });
        console.log(this.state.notes);
    }

    showNoteEdit(event) {
        var index = this.state.notes.findIndex(x => x._id === event.currentTarget.parentNode.id);
        this.setState({ note: this.state.notes[index], edit: true });
        console.log(this.state.notes[index]);
    }

    onControlledDrag(e, position) {
        const { x, y } = position;
        //        console.log(position);
        //        this.setState({notes[this.state.noteIndex]: x, notes[this.state.noteIndex]: y});
        //        this.setState({notes[this.state.noteIndex].x: this});

        let oldNotes = this.state.notes.slice();
        oldNotes[this.state.noteIndex].x = x;
        oldNotes[this.state.noteIndex].y = y;
        this.setState({ notes: oldNotes });

        //        console.log(x + " " + y);
    }

    onMousePoint(e) {
        this.setState({ mousePoint: e.currentTarget.parentNode.id, noteIndex: this.state.notes.findIndex(x => x._id === e.currentTarget.parentNode.id) });
        console.log(e.currentTarget.parentNode.id + " " + this.state.notes.findIndex(x => x._id === e.currentTarget.parentNode.id) + " " + JSON.stringify(this.state.notes));
    }

    setNoteTag(a) {
        this.setState({ noteTag: a });
        console.log(this.state.noteTag);
    }

    moveNote(e, position) {
        const { x, y } = position;
        //        console.log(position);
        //        console.log(this.state.mousePoint);
        //        var index = this.state.notes.findIndex(x => x._id === this.state.mousePoint);

        //        var transform = event.target.parentElement.offsetParent.style.transform.toString();
        //        var l = transform.indexOf('(');
        //        var m = transform.indexOf(',');
        //        var r = transform.indexOf(')');
        //
        //        var x = parseInt(transform.substring(l + 1, m - 2));
        //        var y = parseInt(transform.substring(m + 1, r - 2));

        console.log(x + " " + y);
        var updatedObj = {
            from: 'Board',
            code: 'updateNote',
            updatedObj: {
                id: this.state.mousePoint,
                x: this.state.notes[this.state.noteIndex].x,
                y: this.state.notes[this.state.noteIndex].y,
                updated: new Date().getTime(),
            },
            //            tags: this.state.newNoteTags,
            updated: new Date().getTime()
        }
        var requestString = JSON.stringify(updatedObj);
        this.props.ws.send(requestString);
        //        this.sendMovingNote(requestString);
        //
        //        console.log(x + " " + y);
        //        console.log(this.state.notes[index].x + " " + this.state.notes[index].y);
    }

    sendMovingNote(requestString) {
        setTimeout(() => this.props.ws.send(requestString), 1000);
    }

    closeNoteEdit() {
        this.setState({ edit: false });
    }

    updateBoard(id) {
        //        var self = this;
        //        axios.put(`${'http://localhost:3001/api'}/${this.props.linkid}`, {_id: id})
        //                .then(function (response) {
        //                    console.log(response);
        //                    self.fetchNote();
        //                })
        //                .catch(err => {
        //                    console.log(err);
        //                });
    }

    componentWillReceiveProps(nextProps) {
        var self = this;
        if (nextProps !== this.props && nextProps.update === true) {
            //            axios.post('http://localhost:3001/api/notes', nextProps.note)
            //                    .then(function (response) {
            //                        console.log(response.data._id);
            //                        self.updateBoard(response.data._id);
            //                    })
            //                    .catch(function (error) {
            //                        console.log(error);
            //                    });

            //        this.setState(previousState => {
            //            var newNoteList = previousState.noteList;
            //            newNoteList.push(newNote);
            //            return {noteList: newNoteList};
            //        });
            var newNoteRequest = {
                from: 'Board',
                code: 'createNote',
                note: nextProps.note
            };
            var requestString = JSON.stringify(newNoteRequest);
            this.props.ws.send(requestString);
        }
        if (nextProps.notes !== this.props.notes) {
            this.setState({ notes: nextProps.notes });
        }
    }

    render() {
        return (
            <div className="container" id="Test">
                {this.state.notes.map((obj, index) =>
                    <Draggable handle=".move-button" defaultPosition={{ x: 0, y: 0 }} position={{ x: this.state.notes[index].x, y: this.state.notes[index].y }} onDrag={this.onControlledDrag} onStop={this.moveNote}>
                        <div className="idea-box" style={{ backgroundColor: obj.color }} key={obj._id} id={obj._id.toString()}>
                            <Icon className="move-button" icon={move} onMouseDown={this.onMousePoint} />
                            <Icon className={obj.writer === this.props.user ? "edit-button" : "edit-button none"} icon={pencil} onClick={this.showNoteEdit} />
                            <div className="body">{obj.text}</div>
                        </div>
                    </Draggable>)}
                <BlackTransparent edit={this.state.edit} />
                <NoteEdit linkid={this.props.linkid} ws={this.props.ws} boardId={this.props.linkid} setColor={this.props.setColor} closeNoteEdit={this.closeNoteEdit} edit={this.state.edit} note={this.state.note} tags={this.props.tags}></NoteEdit>
            </div>
        );
    }
}

export default NoteBox;