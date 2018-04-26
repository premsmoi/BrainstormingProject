import React, { Component } from 'react';
import axios from 'axios';
import NoteEdit from './NoteEdit';
import NoteView from './NoteView';
import CustomPopover from './CustomPopover';
import socketIOClient from 'socket.io-client';
import Draggable from 'react-draggable';
import Icon from 'react-icons-kit';
import { pencil, move, thickTop, thickBottom, eye } from 'react-icons-kit/iconic';
import BlackTransparent from './BlackTransparent';
import { Glyphicon, Popover, OverlayTrigger, Button } from 'react-bootstrap';
import './mystyle/Note.css';

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
            selectedNote: {},
            view: false
        };
        this.showNoteEdit = this.showNoteEdit.bind(this);
        this.closeNoteEdit = this.closeNoteEdit.bind(this);
        this.showNoteView = this.showNoteView.bind(this);
        this.closeNoteView = this.closeNoteView.bind(this);
        this.moveNote = this.moveNote.bind(this);
        this.sendMovingNote = this.sendMovingNote.bind(this);
        this.onControlledDrag = this.onControlledDrag.bind(this);
        this.onMousePoint = this.onMousePoint.bind(this);
    }

    componentDidMount() {
        this.setState({ notes: this.props.notes });
        //console.log(this.state.notes);
        console.log(this.props.userVotedNotes);
    }

    onControlledDrag(e, position) {
        const { x, y } = position;
        let oldNotes = this.state.notes.slice();
        oldNotes[this.state.noteIndex].x = x;
        oldNotes[this.state.noteIndex].y = y;
        this.setState({ notes: oldNotes });
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
        console.log(x + " " + y);
        var updatedObj = {
            code: 'updateNote',
            updatedObj: {
                id: this.state.mousePoint,
                x: this.state.notes[this.state.noteIndex].x,
                y: this.state.notes[this.state.noteIndex].y,
                updated: new Date().getTime(),
            },
            updated: new Date().getTime()
        }
        var requestString = JSON.stringify(updatedObj);
        this.props.ws.send(requestString);
    }

    sendMovingNote(requestString) {
        setTimeout(() => this.props.ws.send(requestString), 1000);
    }

    showNoteEdit(event) {
        var index = this.state.notes.findIndex(x => x._id === event.currentTarget.parentNode.id);
        this.setState({ note: this.state.notes[index], edit: true });
        console.log(this.state.notes[index]);
    }

    closeNoteEdit() {
        this.setState({ edit: false });
    }

    showNoteView(event) {
        var index = this.state.notes.findIndex(x => x._id === event.currentTarget.parentNode.id);
        this.setState({ note: this.state.notes[index], view: true });
        console.log(this.state.notes[index]);
    }

    closeNoteView() {
        this.setState({ view: false });
    }

    componentWillReceiveProps(nextProps) {
        var self = this;
        if (nextProps !== this.props && nextProps.update === true) {
            var newNoteRequest = {
                code: 'createNote',
                note: nextProps.note
            };
            var requestString = JSON.stringify(newNoteRequest);
            this.props.ws.send(requestString);
        }
        if (nextProps.notes !== this.props.notes) {
            this.setState({ notes: nextProps.notes });
            console.log(nextProps.notes);
        }
        if (nextProps.userVotedNotes !== this.props.userVotedNotes) {
            this.setState({ userVotedNotes: nextProps.userVotedNotes });
            console.log(nextProps.userVotedNotes);
        }
    }

    render() {
        return (
            <div className="container" id="Test">
                {this.state.notes.map((obj, index) =>
                    <Draggable handle=".move-button" defaultPosition={{ x: 0, y: 0 }} position={{ x: this.state.notes[index].x, y: this.state.notes[index].y }} onDrag={this.onControlledDrag} onStop={this.moveNote}>
                        <div className={"idea-box " + obj.color} key={obj._id} id={obj._id.toString()}>
                            <Icon className="move-button" icon={move} onMouseDown={this.onMousePoint} />
                            <Icon className={obj.writer === this.props.user ? "edit-button" : "edit-button none"} icon={pencil} onClick={this.showNoteEdit} />
                            <Icon className={obj.writer === this.props.user ? "edit-button none" : "edit-button"} icon={eye} onClick={this.showNoteView} />
                            <div className="body">{obj.text}</div>
                            <div className="vote">
                                <span style={{ display: this.props.userVotedNotes.indexOf(obj._id) > -1 ? 'none' : 'inline-block' }}><Icon icon={thickTop} onClick={() => this.props.voteNote(obj._id, )} /></span>
                                <span style={{ display: this.props.userVotedNotes.indexOf(obj._id) > -1 ? 'inline-block' : 'none' }}><Icon icon={thickBottom} onClick={() => this.props.unvoteNote(obj._id)} /></span>
                                <span>Vote: {obj.voteScore.toString()}</span>
                            </div>
                        </div>
                    </Draggable>)}
                <BlackTransparent edit={this.state.edit} />
                <NoteEdit linkid={this.props.linkid} ws={this.props.ws} boardId={this.props.linkid} setColor={this.props.setColor} closeNoteEdit={this.closeNoteEdit} edit={this.state.edit} note={this.state.note} tags={this.props.tags}></NoteEdit>
                <NoteView closeNoteView={this.closeNoteView} view={this.state.view} note={this.state.note} tags={this.props.tags}></NoteView>
            </div>
        );
    }
}

export default NoteBox;