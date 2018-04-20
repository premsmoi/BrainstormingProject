import React, { Component } from 'react';

class NoteAdd extends Component {
    constructor(props) {
        super(props);
        this.state={};
    }
    
    render() {
        return(
                <div className="input-idea" style={{display: (this.state.show ? "block" : "none")}}>
                            <form onSubmit={this.handleSubmit}>
                                <label>
                                    Name:
                                    <input type="text" value={this.state.value} onChange={this.handleChange} />
                                </label>
                                <input type="submit" value="Submit" />
                            </form>
                            <ColorPalette setColor={this.setColor}/>
                        </div>
                );
    }
}

export default NoteAdd;