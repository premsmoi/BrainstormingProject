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
  Dimensions,
} from 'react-native';

import Modal from "react-native-modal";
import ImageViewer from 'react-native-image-zoom-viewer';
import ImageZoom from 'react-native-image-pan-zoom';

// capture ScrollView content
class Test extends Component {
  constructor(props) {
    super(props);
    this.state = {
    	uri: '..',
		visibleModal: false,
    }
  }

  onCapture = uri => {
    console.log(uri);
    this.setState({uri: uri})
  };

  onImageLoad = () => {
    this.refs.viewShot.capture().then(uri => {
      console.log("do something with ", uri);
    })
  };

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
  	//console.log('uri: '+this.state.uri)
    return (
    	<View style = {{flex: 1}}>
    		<View style = {{flex: 1}}>
		      <ScrollView>
		        <ViewShot onCapture={this.onCapture} captureMode="mount">
		          <Text>...The Scroll View Content Goes Here...</Text>
		          {this._renderButton('Capture', () => {
		          	this.setState({visibleModal: true})
		          })}
		        </ViewShot>
		      </ScrollView>
		     </View>
	      <View style = {{flex: 1}}>
	      	<Image 
                        style={{width: 16, height: 16, marginTop: 8, marginHorizontal: 10}}
                        source={require('../img/search.png')}
                    />
	        
	      </View>
	       <ImageZoom cropWidth={Dimensions.get('window').width}
                       cropHeight={Dimensions.get('window').height}
                       imageWidth={400}
                       imageHeight={400}
                       >    
		      	<Image
			        style={{width: 400, height: 60}}
			        source={{isStatic: true, uri: this.state.uri}}
			     />
			</ImageZoom>
	     </View>
    );
  }
}

export default Test;