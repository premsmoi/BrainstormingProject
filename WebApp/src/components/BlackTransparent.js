import React, { Component } from 'react';
import './mystyle/BlackTransparent.css';

class BlackTransparent extends Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        return(
                <div className="black-clear" style={{display: (this.props.edit ? "block" : "none")}}></div>
                );
    }
}

export default BlackTransparent;