import React, { Component } from "react";
import {
  StyleSheet,
  View,
  PanResponder,
  Animated,
  Text
} from "react-native";

/*
### Color ### 
red = '#ff9999'
pink = '#ff99c2'
green = '#99ff99'
blue = '#99ffff'
yellow = '#ffff99'
*/

var COLOR = 'blue';

export default class Note extends Component {
  constructor(props) {
    super(props);
    this._panResponder = {};
    this.x = this.props.x;
    this.y = this.props.y;
    COLOR = this.props.color;
    this.rectangle = (null : ?{ setNativeProps(props: Object): void });
    this._rectangleStyles = {
      style: {
        left: this.x,
        top: this.y,
        backgroundColor: COLOR,
      }
    };
  }

 

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (e, gesture) => true,
      onMoveShouldSetPanResponder: (e, gesture) => true,
      onPanResponderGrant: (e, gesture) => {
        this._highlight();
      },
      onPanResponderMove: (e, gesture) => {
        this._rectangleStyles.style.left = this.x + gesture.dx;
        this._rectangleStyles.style.top = this.y + gesture.dy;
        this._updateNativeStyles();
      },
      onPanResponderRelease: (e, gesture) => {
        this._unHighlight();
        this.x += gesture.dx;
        this.y += gesture.dy;
      },
      onPanResponderTerminate: (e, gesture) => {
        this._unHighlight();
        this.x += gesture.dx;
        this.y += gesture.dy;
      },
    });

    
  };

  componentDidMount() {
    this._updateNativeStyles();
  }

  render() {
    return (
      <View
        //style={styles.container}
      >
        <View
          ref={(rectangle) => {
            this.rectangle = rectangle;
          }}
          //style={styles.rectangle}
          style={styles.rectangle}
          {...this._panResponder.panHandlers}
        >
          <Text style={styles.text}>Sticky!</Text>
        </View>
      </View>
    );
  }

  _highlight() {
    //this._rectangleStyles.style.backgroundColor = 'blue';
    this._updateNativeStyles();
  }

  _unHighlight() {
    //this._rectangleStyles.style.backgroundColor = 'green';
    this._updateNativeStyles();
  }

  _updateNativeStyles() {
    this.rectangle && this.rectangle.setNativeProps(this._rectangleStyles);
  }

}

var styles = StyleSheet.create({
  
  container: {
    flex: 1,
    paddingTop: 64,
  },
  rectangle: {
    width: 100,
    height: 100,
    position: 'absolute',
    //backgroundColor: COLOR
  },
  text: {
    marginTop   : 25,
    marginLeft  : 5,
    marginRight : 5,
    textAlign   : 'center',
    color       : 'black'
  },
});