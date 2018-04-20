import React, { Component } from 'react';
import './mystyle/Note.css';

class ColorPalette extends Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        return (
                <div className="color-panel">
                                <button className="red" onClick={() => this.props.setColor("lightsalmon")}></button>
                                <button className="blue" onClick={() => this.props.setColor("lightblue")}></button>
                                <button className="green" onClick={() => this.props.setColor("lightgreen")}></button>
                                <button className="yellow" onClick={() => this.props.setColor("lightyellow")}></button>
                                <button className="grey" onClick={() => this.props.setColor("lightgrey")}></button>
                                <button className="white" onClick={() => this.props.setColor("white")}></button>
                            </div>
                );
    }
    }
    
export default ColorPalette;