import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import './mystyle/General.scss';

class TagInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            focused: false,
            input: '',
            count: 0
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleInputKeyDown = this.handleInputKeyDown.bind(this);
        this.handleRemoveItem = this.handleRemoveItem.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
    }

    componentDidMount() {
        this.setState({ items: this.props.tags });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps !== this.props) {
            this.setState({ items: nextProps.tags, input: '' });
        }
    }

    handleAdd() {
        const value = this.state.input;
        //this.setState(state => ({
        //    items: [...state.items, value],
        //    input: ''
        //}), () => {
        //    this.props.setTag(this.state.items);
        //});
        this.props.boardAddTag(value);
    }

    render() {
        const styles = {
            items: {
                display: 'inline-block',
                padding: '2px',
                border: '1px solid blue',
                borderRadius: '5px',
                marginRight: '5px',
                cursor: 'pointer'
            },
            input: {
                outline: 'none',
                border: 'none',
            }
        };
        return (
            <label style={{ display: 'block' }}>
                Tag:
                    <ul className="text-box">
                    {this.state.items.map((item, i) =>
                        <li key={i} style={styles.items} onClick={(e) => this.handleRemoveItem(e, i)}>
                            {item}
                            <span>(x)</span>
                        </li>
                    )}
                    <input
                        style={styles.input}
                        value={this.state.input}
                        onChange={this.handleInputChange}
                        onKeyDown={this.handleInputKeyDown} />
                </ul>
                <Button onClick={this.handleAdd}>
                    Add
                </Button>
            </label>
        );
    }

    handleInputChange(evt) {
        this.setState({ input: evt.target.value });
    }

    handleInputKeyDown(evt) {
        if (evt.keyCode === 13) {
            //const { value } = evt.target;
            //this.setState(state => ({
            //    items: [...state.items, value],
            //    input: ''
            //}), () => {
            //    this.props.setTag(this.state.items);
            //});

            const value = this.state.input;
            this.props.boardAddTag(value);
        }

        if (this.state.items.length && evt.keyCode === 8 && !this.state.input.length) {
            this.setState(state => ({
                items: state.items.slice(0, state.items.length - 1)
            }));
        }
    }

    handleRemoveItem(e, index) {
        e.preventDefault();
        //return () => {
        //    this.setState(state => ({
        //        items: state.items.filter((item, i) => i !== index)
        //    }));
        //}
        this.props.boardDeleteTag(this.state.items[index]);
    }
}

//ReactDOM.render(
//  <TagInput />,
//  document.getElementById('app')
//);

export default TagInput;