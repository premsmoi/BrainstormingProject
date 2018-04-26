import React, { Component } from 'react';
import './mystyle/ColorPalette.scss';

class ColorPalette extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="color-panel">
                <button className="red-panel" onClick={() => this.props.setColor("red")}></button>
                <button className="pink-panel" onClick={() => this.props.setColor("pink")}></button>
                <button className="green-panel" onClick={() => this.props.setColor("green")}></button>
                <button className="blue-panel" onClick={() => this.props.setColor("blue")}></button>
                <button className="yellow-panel" onClick={() => this.props.setColor("yellow")}></button>
            </div>
        );
    }
}

export default ColorPalette;