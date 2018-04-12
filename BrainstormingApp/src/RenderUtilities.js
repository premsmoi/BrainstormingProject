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

renderButton = (text, onPress) => (
	<TouchableOpacity onPress={onPress}>
      <View style={{
      	backgroundColor: 'lightblue',
        borderRadius: 10,
        justifyContent: "center",
      	alignItems: "center",
      }}>
        <Text style = {{
			fontSize: 14,
			color: 'black',
			marginVertical: 5,
			marginHorizontal: 10,
        }}>
        	{text}
        </Text>
      </View>
    </TouchableOpacity>
)

renderIconButton = (src, onPress) => (
	<TouchableOpacity
    	onPress= {onPress}
    >
    	<Image 
        style={{width: 24, height: 24, marginVertical: 5, marginHorizontal: 10}}
        source={src}
      />
  </TouchableOpacity>
)

export {renderButton, renderIconButton};