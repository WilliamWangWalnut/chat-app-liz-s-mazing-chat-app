import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default class Chat extends Component {
  //  This adds the users name to the header
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.state.params.name
    };
  };
  render() {
    return (
      <View
        style={[ styles.container, { backgroundColor: this.props.navigation.state.params.selectedColor }
        ]}>
        <Text>HiYa</Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
