import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import 'react-native-gesture-handler';
import { decode, encode } from 'base-64';
// import the screens
import Start from './components/Start';
import Chat from './components/Chat';

if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}

// Create the navigator
const navigator = createStackNavigator({
  Start: { screen: Start },
  Chat: { screen: Chat },
});

const navigatorContainer = createAppContainer(navigator);
// Export it as the root component
export default navigatorContainer;
