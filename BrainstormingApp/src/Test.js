import ViewShot from "react-native-view-shot";
import React, {
  Component
} from 'react';

import {
  Alert,
  AppRegistry,
  Button,
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  BackHandler,
  KeyboardAvoidingView,
  Image,
  ImageBackground,
  ScrollView,
} from 'react-native';

import Modal from "react-native-modal";

// capture ScrollView content
class Test extends Component {
  constructor(props) {
    super(props);
    this.uri = '..'
    this.state = {
      visibleModal: false,
    }
  }

  onCapture = uri => {
    console.log(uri);
    this.uri = uri
  }

   _renderButton = (text, onPress) => (
    <TouchableOpacity onPress={onPress}>
      <View style=
      {{
        backgroundColor: "lightblue",
        padding: 6,
        margin: 8,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
        borderColor: "rgba(0, 0, 0, 0.1)"
      }}>
        <Text>{text}</Text>
      </View>
    </TouchableOpacity>
  )

  _renderModal = () => (
    <View>
      <Image source={{uri: "file:///data/user/0/com.brainstormingapp/cache/ReactNative-snapshot-image2085461881.png"}} />
    </View>
  )

  render() {
    return (
      <ScrollView>
        <Image source={{uri: "ReactNative-snapshot-image2085461881.png"}} />
        <ViewShot onCapture={this.onCapture} captureMode="mount">
          <Text>...The Scroll View Content Goes Here...</Text>
          {this._renderButton('Capture', () => this.setState({visibleModal: true}))}
        </ViewShot>
      </ScrollView>
    );
  }
}

export default Test;