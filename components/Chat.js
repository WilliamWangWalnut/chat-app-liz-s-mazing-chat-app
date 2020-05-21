import React, { Component } from "react";
import { AsyncStorage, View, StyleSheet, Platform, Text } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import KeyboardSpacer from "react-native-keyboard-spacer";
const firebase = require("firebase");
require("firebase/firestore");
import { YellowBox } from "react-native";
YellowBox.ignoreWarnings(["Warning: ..."]);
import CustomActions from "./CustomActions";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";

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
    this.state = {
      messages: [],
      user: {
        _id: "",
        name: "",
        avatar: ""
      },
      // uid: null,
      isConnected: false, // this line was creating an error, forcing to use this.state.isConnected on line 101
      image: null,
      location: null
    };

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
  }

  getMessages = async () => {
    let messages = [];
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
    // loop through documents
    querySnapshot.forEach(doc => {
      // get data snapshot
      var data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text.toString(),
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
          avatar: data.user.avatar
        },
        image: data.image || "",
        location: data.location
      });
    });
    this.setState({
      messages
    });
  };

  addMessages() {
    const message = this.state.messages[0];
    this.referenceMessages.add({
      _id: message._id,
      text: message.text || "",
      createdAt: message.createdAt,
      user: message.user,
      image: message.image || "",
      location: message.location || null,
      sent: true
    });
  }

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
          },
          left: {
            backgroundColor: "#FF8C00"
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

  renderCustomView(props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <View>
          <MapView
            style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
            region={{
              latitude: currentMessage.location.latitude,
              longitude: currentMessage.location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421
            }}
          />
        </View>
      );
    }
    return null;
  }

  renderCustomActions = props => {
    return <CustomActions {...props} />;
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
        {this.state.image && (
          <Image
            source={{ uri: this.state.image.uri }}
            style={{ width: 200, height: 200 }}
          />
        )}
        <GiftedChat
          renderCustomView={this.renderCustomView}
          renderActions={this.renderCustomActions}
          renderInputToolbar={this.renderInputToolbar}
          renderBubble={this.renderBubble}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          image={this.state.image}
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
