import React, { Component } from "react";
import { View, StyleSheet, Platform, Text } from "react-native";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
// Keyboard Spacer for Android
import KeyboardSpacer from "react-native-keyboard-spacer";

//Firebase setup
const firebase = require("firebase");
require("firebase/firestore");

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      user: {
        _id: "",
        name: "",
        avatar: ""
      },
      uid: 0
    };
    var firebaseConfig = {
      apiKey: "AIzaSyBKKP2QvR8P3fJ3rSlGP5ybDhZmSqf5G2M",
      authDomain: "chat-app-211c2.firebaseapp.com",
      databaseURL: "https://chat-app-211c2.firebaseio.com",
      projectId: "chat-app-211c2",
      storageBucket: "chat-app-211c2.appspot.com",
      messagingSenderId: "483040447888",
      appId: "1:483040447888:web:18fc0b45e4222214407715",
      measurementId: "G-TT82NW9VT7"
    };

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    this.referenceMessages = firebase.firestore().collection("messages");
  }

  componentDidMount() {
    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async user => {
      if (!user) {
        await firebase.auth().signInAnonymously();
      }

      if (this.props.navigation.state.params.name) {
        this.setUser(user.uid, this.props.navigation.state.params.name);
      } else {
        this.setUser(user.uid);
      }

      this.setState({
        uid: user.uid,
        loggedInText: "Welcome to Chatroom"
      });

      this.unsubscribe = this.referenceMessages.onSnapshot(
        this.onCollectionUpdate
      );
    });

    this.setState({
      messages: [
        {
          _id: 1,
          text: "Hello developer",
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "React Native",
            avatar: "https://placeimg.com/140/140/tech"
          }
        },
        {
          _id: 2,
          text:
            this.props.navigation.state.params.name + " has entered the chat",
          createdAt: new Date(),
          system: true
        }
      ]
    });
  }

  componentWillUnmount() {
    this.authUnsubscribe();
    this.unsubscribe();
  }

  setUser = (_id, name = "Anonymous") => {
    this.setState({
      user: {
        _id: _id,
        name: name,
        avatar: "https://placeimg.com/140/140/tech"
      }
    });
  };

  get user() {
    return {
      name: this.props.navigation.state.params.name,
      _id: this.state.uid,
      id: this.state.uid
    };
  }

  addMessage() {
    this.referenceMessages.add({
      _id: this.state.messages[0]._id,
      text: this.state.messages[0].text || "",
      createdAt: this.state.messages[0].createdAt,
      // user: this.state.user,
      user: this.state.messages[0].user,
      uid: this.state.uid
    });
  }

  //custom function named onSend() when a user sends a message.
  onSend(messages = []) {
    this.setState(
      previousState => ({
        messages: GiftedChat.append(previousState.messages, messages)
      }),
      () => {
        this.addMessage();
      }
    );
  }

  onCollectionUpdate = querySnapshot => {
    const messages = [];
    querySnapshot.forEach(doc => {
      var data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.Date,
        user: data.user
      });
    });
    this.setState({
      messages
    });
  };

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#000"
          }
        }}
      />
    );
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.state.params.name
    };
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: this.props.navigation.state.params.color
        }}
      >
        {/* rendering your chat interface   */}
        <Text>{this.state.loggedInText}</Text>
        <GiftedChat
          // renderBubble={this.renderBubble}
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={this.state.user}
        />
        {Platform.OS === "android" ? <KeyboardSpacer topSpacing={55} /> : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    width: "100%"
  }
});
