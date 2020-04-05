import React, { Component } from 'react';
import { Text, View, Button } from 'react-native';

export default class Chat extends Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Hello Screen2!</Text>
      </View>
    );
  }
}
//  In Chat, you can access the user’s name via this.props.navigation.state.params.name. To display the user's name in the navigation bar at the top of Chat, you need to configure it. To do so, let's create a function called navigationOptions in Chat that returns a configuration object for the header bar. More specifically, you need to set the title to your user’s name:

// static navigationOptions = ({    navigation }) => {
//  return {
//    title: navigation.state.params.name,
//  };
// };
