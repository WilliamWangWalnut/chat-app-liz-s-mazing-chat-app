import React, { Component } from "react";
import { AsyncStorage, View, StyleSheet, Platform, Text } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
// Keyboard Spacer for Android
import KeyboardSpacer from "react-native-keyboard-spacer";
const firebase = require("firebase");
require("firebase/firestore");
import { YellowBox } from "react-native";
YellowBox.ignoreWarnings(["Warning: ..."]);

console.disableYellowBox = true;
window.addEventListener = x => x;

export default class Chat extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.state.params.name
    };
  };
  constructor() {
    super();
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: "AIzaSyAAD4AKdA77lwM5-K72k7eCglp3OsjWOqk",
        authDomain: "chattington-a5567.firebaseapp.com",
        databaseURL: "https://chattington-a5567.firebaseio.com",
        projectId: "chattington-a5567",
        storageBucket: "chattington-a5567.appspot.com",
        messagingSenderId: "700350872056",
        appId: "1:700350872056:web:f11855f421d52679083e0d"
      });
    }
    this.referenceMessages = firebase.firestore().collection("messages");

    this.state = {
      messages: [],
      user: {
        _id: "",
        name: "",
        avatar: ""
      },
      uid: 0
    };
  }

  getMessages = async () => {
    let messages = "";
    try {
      messages = (await AsyncStorage.getItem("messages")) || [];
      this.setState({
        messages: JSON.parse(messages)
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  saveMessages = async () => {
    try {
      await AsyncStorage.setItem(
        "messages",
        JSON.stringify(this.state.messages)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  deleteMessages = async () => {
    try {
      await AsyncStorage.removeItem("messages");
    } catch (error) {
      console.log(error.message);
    }
  };
  componentDidMount() {
    NetInfo.fetch().then(state => {
      //console.log('Connection type', state.type);
      if (state.isConnected) {
        //console.log('Is connected?', state.isConnected);
        this.authUnsubscribe = firebase
          .auth()
          .onAuthStateChanged(async user => {
            if (!user) {
              try {
                await firebase.auth().signInAnonymously();
              } catch (error) {
                console.log("Unable to sign in: " + error.message);
              }
            }
            this.setState({
              isConnected: true,
              user: {
                _id: user.uid,
                name: this.props.navigation.state.params.name
              },
              loggedInText:
                this.props.navigation.state.params.name +
                " has entered the chat",
              messages: []
            });
            //console.log(user);
            this.unsubscribe = this.referenceMessages
              .orderBy("createdAt", "desc")
              .onSnapshot(this.onCollectionUpdate);
          });
      } else {
        this.setState({
          isConnected: false
        });
        this.getMessages();
      }
    });
  }

  onCollectionUpdate = querySnapshot => {
    const messages = [];
    querySnapshot.forEach(doc => {
      var data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text.toString(),
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
          avatar: data.user.avatar
        }
      });
    });
    this.setState({
      messages
    });
  };

  addMessages = () => {
    this.referenceMessages.add({
      _id: this.state.messages[0]._id,
      text: this.state.messages[0].text,
      createdAt: this.state.messages[0].createdAt,
      user: this.state.messages[0].user,
      uid: this.state.uid
    });
  };

  onSend(messages = []) {
    this.setState(
      previousState => ({
        messages: GiftedChat.append(previousState.messages, messages)
      }),
      () => {
        this.addMessages();
        this.saveMessages();
      }
    );
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#444"
          }
        }}
      />
    );
  }

  renderInputToolbar = props => {
    if (this.state.isConnected === false) {
    } else {
      return <InputToolbar {...props} />;
    }
  };
  componentWillUnmount() {
    this.authUnsubscribe();
    this.unsubscribe();
  }

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
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: 1
          }}
        />
        {Platform.OS === "android" ? <KeyboardSpacer /> : null}
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
    color: "#fff",
    alignSelf: "center",
    opacity: 0.5,
    marginTop: 25
  }
});
