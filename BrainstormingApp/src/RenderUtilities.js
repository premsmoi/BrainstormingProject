import React, { Component } from 'react';
import { 
  Alert, 
  AppRegistry, 
  Button, 
  StyleSheet, 
  View, 
  TextInput, 
  Text,
  TouchableOpacity,
  Image,
} from 'react-native'; 

import styles from "./app.style";

renderButton = (text, onPress,) => (
  <View style = {{padding: 5}}>
  	<TouchableOpacity onPress={onPress}>
        <View style={
        	styles.buttonContainer
        }>
          <Text style = {
  			     styles.buttonText
          }>
          	{text}
          </Text>
        </View>
    </TouchableOpacity>
  </View>
)

renderIconButton = (src, onPress) => (
	<TouchableOpacity
    	onPress= {onPress}
    >
    	<Image 
        style={styles.imageIcon}
        source={src}
      />
  </TouchableOpacity>
)

export {renderButton, renderIconButton};