import React, { Component } from 'react';
import { View, StyleSheet, Platform, Text } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
// Keyboard Spacer for Android
import KeyboardSpacer from 'react-native-keyboard-spacer';

export default class Chat extends Component {
  state = {
    messages: []
  };

  componentDidMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any'
          }
        }
      ]
    });
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages)
    }));
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#000'
          }
        }}
      />
    );
  }

  //  This adds the users name to the header
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.state.params.name
    };
  };
  render() {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: this.props.navigation.state.params.selectedColor
          }
        ]}>
        <Text style={styles.userName}>
          {this.props.navigation.state.params.name} in da houz
        </Text>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: 1
          }}
        />
        {Platform.OS === 'android' ? <KeyboardSpacer /> : null}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  userName: {
    fontSize: 10,
    color: '#fff',
    alignSelf: 'center',
    opacity: 0.5,
    marginTop: 25
  }
});
