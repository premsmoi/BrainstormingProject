import React, { Component } from 'react';
import './mystyle/Note.css';
import './mystyle/NoteEdit.css';
import './mystyle/General.scss';
import ColorPalette from './ColorPalette';
import TagPicker from './TagPicker';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';

class NoteEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            note: {},
            show: false,
            color: '',
            text: '',
            value: '',
            noteTag: [],
            tags: []
        };
        this.setColor = this.setColor.bind(this);
        this.setTag = this.setTag.bind(this);
        this.deleteNote = this.deleteNote.bind(this);
        this.saveNote = this.saveNote.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.note !== this.props.note) {
            //console.log(this.state.note);
            this.setState({ color: nextProps.note.color, value: nextProps.note.text, tags: nextProps.note.tags });
            //console.log(nextProps.note);
        }
    }

    setColor(a) {
        this.setState({ color: a });
    }

    setTag(a) {
        this.setState({ tags: a });
    }

    deleteNote() {
        var deleteNote = {
            from: 'Board',
            code: 'deleteNote',
            boardId: this.props.boardId,
            noteId: this.props.note._id.toString()
        }
        var request = JSON.stringify(deleteNote);
        this.props.ws.send(request);

        this.props.closeNoteEdit();
    }

    saveNote() {
        var updatedObj = {
            from: 'Board',
            code: 'updateNote',
            updatedObj: {
                id: this.props.note._id.toString(),
                color: this.state.color,
                text: this.state.value,
                tags: this.state.tags,
                updated: new Date().getTime(),
            },
            //            tags: this.state.newNoteTags,
            updated: new Date().getTime(),
        }
        var requestString = JSON.stringify(updatedObj);
        this.props.ws.send(requestString);

        this.props.closeNoteEdit();
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    //    <div className="edit-panel" style={style}>
    //    <form onSubmit={this.handleSubmit}>
    //        <label className="block">
    //            Your Idea:
    //                                <textarea className="text-box new-idea" value={this.state.value} onChange={this.handleChange} />
    //        </label>
    //    </form>
    //    <ColorPalette setColor={this.setColor} />
    //    <TagPicker tags={this.props.tags} setNoteTag={this.setTag} tags_of_note={this.state.tags} />
    //    <div className="button-group">
    //        <button className="save-button" onClick={() => {
    //            //                        this.props.closeNoteEdit();
    //            this.saveNote();
    //        }}>save</button>
    //        <button className="delete-button" onClick={() => {
    //            //                            this.props.closeNoteEdit();
    //            this.deleteNote();
    //        }}>delete</button>
    //    </div>
    //</div>

    render() {
        var style = { backgroundColor: (this.props.note.color === this.state.color ? this.props.note.color : this.state.color) };
        return (
            <Modal show={this.props.edit} onHide={this.props.closeNoteEdit}>
                <Modal.Header closeButton>
                    Edit Note
                    </Modal.Header>
                <Modal.Body>
                    <form onSubmit={this.handleSubmit}>
                        <label className="block">
                            Your Idea:
                                <textarea className="text-box new-idea" value={this.state.value} onChange={this.handleChange} style={{ backgroundColor: (this.props.note.color === this.state.color ? this.props.note.color : this.state.color) }} />
                        </label>
                    </form>
                    <ColorPalette setColor={this.setColor} />
                    <TagPicker tags={this.props.tags} setNoteTag={this.setTag} tags_of_note={this.state.tags} />
                    <div className="button-group">
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle='success' onClick={() => {
                        this.saveNote();
                    }}>save</Button>
                    <Button bsStyle='danger' onClick={() => {
                        this.deleteNote();
                    }}>delete</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default NoteEdit;