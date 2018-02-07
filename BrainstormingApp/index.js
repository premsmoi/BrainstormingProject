import { StackNavigator, NavigationActions } from 'react-navigation';
import { AppRegistry } from 'react-native';
import LoginScreen from './src/LoginScreen';
import Draggable from './src/Draggable';
import Note from './src/Note';
import HomeScreen from './src/HomeScreen';
import GroupScreen from './src/GroupScreen';
import TopicScreen from './src/TopicScreen';

const myNavigator = StackNavigator({
  Login: {
    screen: LoginScreen,
    navigationOptions: {
      headerTitle: 'Login',
    },
  },
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      headerTitle: 'Home',
    },
  },
  Group: {
    screen: GroupScreen,
  },
  Topic: {
    screen: TopicScreen,
  }
});

AppRegistry.registerComponent('BrainstormingApp', () => myNavigator);
//AppRegistry.registerComponent('BrainstormingApp', () => Note);
export default myNavigator;