import React, { Component } from 'react';
import './mystyle/General.scss';
import './mystyle/TagPicker.scss';

class TagPicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            tagsInput: [],
            tagInput: "",
            color: "",
            index: 0,
            tagsIndex: [],
            tags_num: [],
            tags_list: [],
            update: false,
            tags_of_note: [],
            hasNotes: false
        }
        this.pickTag = this.pickTag.bind(this);
        this.changeColor = this.changeColor.bind(this);
        this.setNoteTag = this.setNoteTag.bind(this);
        this.sendNoteTag = this.sendNoteTag.bind(this);
    }

    componentDidMount() {
        //this.setState({ items: this.props.tags });

        //const tags_num = this.state.items.map((item) => {
        //    return 0;
        //});
        //this.setState({ tags_num: tags_num });
    }

    componentWillReceiveProps(nextProps) {
        var self = this;
        if (nextProps.tags !== this.props.tags || nextProps.tags_of_note !== this.props.tags_of_note) {
            this.setState({ items: nextProps.tags });

            const tags_num = [];
            console.log(nextProps.tags_of_note);
            if (nextProps.tags_of_note !== undefined) {
                console.log('edit');
                this.setState({ tags_of_note: nextProps.tags_of_note, hasNotes: true });
                
                nextProps.tags.map((item, index) => {
                    if (nextProps.tags_of_note.indexOf(item) > -1) {
                        console.log(index);
                        tags_num.push(1);
                    }
                    else {
                        tags_num.push(0);
                    }
                });
                this.setState({ tags_num: tags_num });
            }

            else {
                nextProps.tags.map((item) => {
                    tags_num.push(0);
                });
                this.setState({ tags_num: tags_num });
            }
        }
    }

    setNoteTag() {
        //const tags_list = [];
        const self = this;
        const tags_num = this.state.tags_num;
        const tags_list = tags_num.map((tag_member, i) => {
            if (tag_member === 1) {
                //tags_list.push(self.state.items[i]);
                return self.state.items[i];
            } else {
                return ('');
            }
        });
        //console.log(tags_list);
        this.setState({ tags_list: tags_list }, () => {
            console.log("done");
            self.sendNoteTag();
            //console.log(self.state.tags_list);
        });
        //this.setState({ tags_list: tags_list }, () => {
        //console.log(this.state.tags_list);
        //});
        //this.props.setNoteTag(tags_list);
        //console.log(this.state.tags_list);
    }

    sendNoteTag() {
        //console.log(this.state.tags_list);
        this.props.setNoteTag(this.state.tags_list);
    }

    pickTag(e, index) {
        //e.preventDefault();
        //const self = this;
        //const tags_num = this.state.tags_num;
        //tags_num[index] = (tags_num[index] === 0) ? 1 : 0;
        //this.setState({ tagsInput: tags_num }, () => {
        //    const tags_list = [];
        //    self.state.tagsInput.forEach((tag_member, i) => {
        //        if (tag_member === 1) {
        //            tags_list.push(self.state.items[i]);
        //            console.log(tags_list);
        //        }
        //        return;
        //    });
        //    self.setState({ tags_list: tags_list }, () => {
        //        self.sendNoteTag();
        //    });
        //});

        e.preventDefault();
        const self = this;

        const tags_num = this.state.tags_num;
        tags_num[index] = (tags_num[index] === 0) ? 1 : 0;
        this.setState({ tags_num: tags_num });

        const tags_list = [];
        tags_num.map((tag_member, i) => {
            if (tag_member === 1) {
                tags_list.push(self.state.items[i]);
                //console.log(tags_list);
            }
        });
        this.props.setNoteTag(tags_list);

        //self.setNoteProp(tags_list);
        //if (self.setNoteTag()) {
        //    console.log('please');
        //    self.sendNoteTag();
        //}

        //const tags_list = this.state.tags_list;
        //const tags_num = this.state.tags_num;
        //tags_num[index] = (tags_num[index] === 0) ? 1 : 0;
        //if (tags_num[index] === 1) {

        //}

        //e.preventDefault();
        //const tags_list = this.state.tags_list;
        //const tags_num = this.state.tags_num;
        //const i = tags_list.indexOf(this.state.items[index]);

        //var self = this;
        //if (this.state.tags_num[index] === 1) {
        //    if (i > -1) {
        //        tags_list.splice(i, 1);
        //    }
        //    tags_num[index] = 0;
        //    this.setState({ tags_num: tags_num }, () => {
        //        self.props.setNoteTag(self.state.tags_list);
        //    });
        //} else {
        //    if (i < 0) {
        //        tags_list.push(self.state.items[index]);
        //    }

        //    tags_num[index] = 1;
        //    this.setState({ tags_num: tags_num }, () => {
        //        self.props.setNoteTag(self.state.tags_list);
        //    });
        //}

    }

    changeColor(e, index) {
        e.preventDefault();
        //this.pickTag(e, index);
        //const { style } = e.currentTarget;
        //console.log(style);
        //console.log(index);
        const self = this;
        const tags_num = this.state.tags_num;
        tags_num[index] = (tags_num[index] === 0) ? 1 : 0;
        this.setState({ tags_num: tags_num });
        //this.setState({ tags_num: tags_num }, () => {
        //    const tags_list = [];
        //    self.state.tagsInput.forEach((tag_member, i) => {
        //        if (tag_member === 1) {
        //            tags_list.push(self.state.items[i]);
        //            console.log(tags_list);
        //        }
        //        return;
        //    });
        //    self.setState({ tags_list: tags_list });
        //});

        this.props.setNoteTag(tags_num);
    }

    render() {
        const styles = {
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
                        <li key={i} className={(this.state.tags_num[i] === 0) ? "tag" : "tag tag-active"} onClick={(e) => this.pickTag(e, i)}>
                            {item}
                        </li>
                    )}
                </ul>
            </label>
        );
    }
}

export default TagPicker;