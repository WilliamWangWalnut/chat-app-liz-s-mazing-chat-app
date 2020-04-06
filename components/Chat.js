import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default class Chat extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.state.params.name,
      style: navigation.state.params.background
    };
  };
  render() {
    return (
      <View style={styles.container}>
        <Text>Hi Ya</Text>
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
