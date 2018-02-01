import React, { Component } from "react";
import {
  StyleSheet,
  View,
  PanResponder,
  Animated
} from "react-native";

export default class Note extends Component {
  constructor() {
    super();
    this._panResponder = {};
    this._previousLeft = 0;
    this._previousTop = 0;
    this._circleStyles = {};
    this.circle = (null : ?{ setNativeProps(props: Object): void });
  }

 

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (e, gesture) => true,
      onMoveShouldSetPanResponder: (e, gesture) => true,
      onPanResponderGrant: (e, gesture) => {
        this._highlight();
      },
      onPanResponderMove: (e, gesture) => {
        this._circleStyles.style.left = this._previousLeft + gesture.dx;
        this._circleStyles.style.top = this._previousTop + gesture.dy;
        this._updateNativeStyles();
      },
      onPanResponderRelease: (e, gesture) => {
        this._unHighlight();
        this._previousLeft += gesture.dx;
        this._previousTop += gesture.dy;
      },
      onPanResponderTerminate: (e, gesture) => {
        this._unHighlight();
        this._previousLeft += gesture.dx;
        this._previousTop += gesture.dy;
      },
    });

    this._previousLeft = 0;
    this._previousTop = 0;
    this._circleStyles = {
      style: {
        left: this._previousLeft,
        top: this._previousTop,
        backgroundColor: 'green',
      }
    };
  };

  componentDidMount() {
    this._updateNativeStyles();
  }

  render() {
    return (
      <View
        style={styles.container}>
        <View
          ref={(circle) => {
            this.circle = circle;
          }}
          //style={styles.circle}
          style={styles.rectangle}
          {...this._panResponder.panHandlers}
        />
      </View>
    );
  }

  _highlight() {
    this._circleStyles.style.backgroundColor = 'blue';
    this._updateNativeStyles();
  }

  _unHighlight() {
    this._circleStyles.style.backgroundColor = 'green';
    this._updateNativeStyles();
  }

  _updateNativeStyles() {
    this.circle && this.circle.setNativeProps(this._circleStyles);
  }

}

var styles = StyleSheet.create({
  
  container: {
    flex: 1,
    paddingTop: 64,
  },
  rectangle: {
    width: 100 * 2,
    height: 100,
    backgroundColor: 'red'
  },
});