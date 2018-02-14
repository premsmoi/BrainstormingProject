import { StackNavigator, NavigationActions } from 'react-navigation';
import { AppRegistry } from 'react-native';
import LoginScreen from './src/LoginScreen';
import Draggable from './src/Draggable';
import Note from './src/Note';
import HomeScreen from './src/HomeScreen';
import GroupScreen from './src/GroupScreen';
import BoardScreen from './src/BoardScreen';
import MyComponent from './src/MyComponent'

const myNavigator = StackNavigator({
  Login: {
    screen: LoginScreen,
    navigationOptions: {
      headerTitle: 'Login',
    },
  },
  Home: {
    screen: HomeScreen,
  },
  Group: {
    screen: GroupScreen,
  },
  Board: {
    screen: BoardScreen,
  }
});

AppRegistry.registerComponent('BrainstormingApp', () => myNavigator);
//AppRegistry.registerComponent('BrainstormingApp', () => HomeScreen);
//AppRegistry.registerComponent('BrainstormingApp', () => MyComponent);
export default myNavigator;
//export default HomeScreen;