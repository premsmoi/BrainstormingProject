import React, { Component } from 'react';
import './mystyle/Note.css';

class ColorPalette extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="color-panel">
                <button className="red" onClick={() => this.props.setColor("#ff9999")}></button>
                <button className="blue" onClick={() => this.props.setColor("#ff99c2")}></button>
                <button className="green" onClick={() => this.props.setColor("#99ff99")}></button>
                <button className="yellow" onClick={() => this.props.setColor("#99ffff")}></button>
                <button className="grey" onClick={() => this.props.setColor("#ffff99")}></button>
            </div>
        );
    }
}

export default ColorPalette;