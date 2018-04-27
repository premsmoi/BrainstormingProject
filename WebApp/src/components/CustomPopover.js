import React, { Component } from 'react';
import { Popover } from 'react-bootstrap';

class CustomPopover extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tags:[]
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.tags !== this.props.tags) {
            this.setState({ tags: nextProps.tags });
            console.log(nextProps.tags);
        }
    }

    render() {
        return (
            <Popover {...this.props}>
                {this.state.tags.map((tag,index) => {
                    <span key={tag}>
                        {tag},
                    </span>
                })}
            </Popover>
        )
    }
}

export default CustomPopover;