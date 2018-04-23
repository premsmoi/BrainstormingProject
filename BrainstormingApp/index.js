import { StackNavigator, NavigationActions } from 'react-navigation';
import { AppRegistry } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import BoardScreen from './src/screens/BoardScreen';
import Note from './src/components/Note';
import SmallNote from './src/components/SmallNote';
import BoardManagerScreen from './src/screens/BoardManagerScreen';

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
  Board: {
    screen: BoardScreen,
  },
  BoardManager: {
    screen: BoardManagerScreen
  }
},
{
  headerMode: 'none',
}
);

AppRegistry.registerComponent('BrainstormingApp', () => myNavigator);
//AppRegistry.registerComponent('BrainstormingApp', () => DrawBoard);
//AppRegistry.registerComponent('BrainstormingApp', () => Test);
export default myNavigator;
//export default Test;