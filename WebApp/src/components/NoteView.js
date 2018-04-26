import React, { Component } from 'react';
import './mystyle/Note.css';
import './mystyle/NoteEdit.css';
import './mystyle/General.scss';
import TagPicker from './TagPicker';
import { Modal, Button } from 'react-bootstrap';

class NoteView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            note: {},
            show: false,
            color: '',
            text: '',
            value: '',
            noteTag: [],
            tags: [],
            writer: ''
        };
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.note !== this.props.note) {
            this.setState({ color: nextProps.note.color, value: nextProps.note.text, tags: nextProps.note.tags, writer: nextProps.note.writer });
        }
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    render() {
        var style = { backgroundColor: (this.props.note.color === this.state.color ? this.props.note.color : this.state.color) };
        return (
            <Modal show={this.props.view} onHide={this.props.closeNoteView}>
                <Modal.Header closeButton>
                    View Note
                    </Modal.Header>
                <Modal.Body>
                    <form>
                        <label className="block">
                            Idea:
                                <textarea className={"text-box new-idea " + this.props.note.color} value={this.state.value} onChange={this.handleChange} disabled />
                        </label>
                        <label className="block">
                            Writer:
                                <input className="text-box" value={this.state.writer} onChange={this.handleChange} disabled />
                        </label>
                    </form>

                    <label style={{ display: 'block' }}>
                        Tag:
                    <ul className="text-box">
                            {this.state.tags.map((item, i) =>
                                <li key={i} className="tag">
                                    {item}
                                </li>
                            )}
                        </ul>
                    </label>

                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle='success' onClick={() => {
                        this.props.closeNoteView();
                    }}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default NoteView;