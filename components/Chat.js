/* eslint-disable react/prop-types */
/* eslint-disable no-console */
/* eslint-disable react/no-unused-state */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';
import {
  AsyncStorage, View, StyleSheet, Platform, Text,
  YellowBox,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import KeyboardSpacer from 'react-native-keyboard-spacer';

import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import CustomActions from './CustomActions';

const firebase = require('firebase');
require('firebase/firestore');

YellowBox.ignoreWarnings(['Warning: ...']);

window.addEventListener = (x) => x;

export default class Chat extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.name,
  });

  constructor() {
    super();
    this.state = {
      messages: [],
      user: {
        _id: '',
        name: '',
        avatar: '',
      },
      isConnected: false,
      image: null,
      location: null,
    };

    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: 'AIzaSyAAD4AKdA77lwM5-K72k7eCglp3OsjWOqk',
        authDomain: 'chattington-a5567.firebaseapp.com',
        databaseURL: 'https://chattington-a5567.firebaseio.com',
        projectId: 'chattington-a5567',
        storageBucket: 'chattington-a5567.appspot.com',
        messagingSenderId: '700350872056',
        appId: '1:700350872056:web:f11855f421d52679083e0d',
      });
    }
    this.referenceMessages = firebase.firestore().collection('messages');
  }

  componentDidMount() {
    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        this.authUnsubscribe = firebase
          .auth()
          .onAuthStateChanged(async (user) => {
            if (!user) {
              try {
                await firebase.auth().signInAnonymously();
              } catch (error) {
                console.log(`Unable to log in: ${error.message}`);
              }
            }
            this.setState({
              isConnected: true,
              user: {
                _id: user.uid,
                name: this.props.navigation.state.params.name,
              },
              loggedInText:
                `${this.props.navigation.state.params.name
                } has entered the chat`,
              messages: [],
            });
            this.unsubscribe = this.referenceMessages
              .orderBy('createdAt', 'desc')
              .onSnapshot(this.onCollectionUpdate);
          });
      } else {
        this.setState({
          isConnected: false,
        });
        this.getMessages();
      }
    });
  }

  componentWillUnmount() {
    this.authUnsubscribe();
    this.unsubscribe();
  }

  /**
* Sends messages
* @async
* @function onSend
* @param {string} messages
* @return {state} GiftedChat
*/
  onSend(messages = []) {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        this.addMessages();
        this.saveMessages();
      },
    );
  }

  /**
      * Update message state with recent data
      * @function onCollectionUpdate
      * @param {string} _id - message id
      * @param {string} text - content
      * @param {date} cratedAt - date and time sent
      * @param {string} user - user data
      * @param {string} image - image sent
      * @param {number} location - geographical coordinates
      * @param {boolean} sent
      * @returns {state}
      */
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // loop through documents
    querySnapshot.forEach((doc) => {
      // get data snapshot
      const data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text.toString(),
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
          avatar: data.user.avatar,
        },
        image: data.image || '',
        location: data.location,
      });
    });
    this.setState({
      messages,
    });
  };

  /**
  * Add message
  * @function addMessage
  * @param {string} _id - message id
  * @param {string} text - message content
  * @param {date} cratedAt - date and time of message
  * @param {string} image
  * @param {number} location - geographical coordinates
  * @param {boolean} sent
  */
  addMessages = () => {
    const message = this.state.messages[0];
    this.referenceMessages.add({
      _id: message._id,
      text: message.text || '',
      createdAt: message.createdAt,
      user: message.user,
      image: message.image || '',
      location: message.location || null,
      sent: true,
    });
  };

  /**
  * loads all messages from AsyncStorage
  * @async
  * @function getMessages
  * @param {string} messages
  * @return {state} messages
  */
  getMessages = async () => {
    let messages = [];
    try {
      messages = (await AsyncStorage.getItem('messages')) || [];
      this.setState({
        messages: JSON.parse(messages),
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  /**
* Saves all messages with AsyncStorage
* @async
* @function saveMessages
* @param {string} messages
* @return {AsyncStorage}
*/
  saveMessages = async () => {
    try {
      await AsyncStorage.setItem(
        'messages',
        JSON.stringify(this.state.messages),
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  /**
* Deletes messages with AsyncStorage
* @async
* @function deleteMessages
* @param {string} messages
* @return {AsyncStorage}
*/
  deleteMessages = async () => {
    try {
      await AsyncStorage.removeItem('messages');
    } catch (error) {
      console.log(error.message);
    }
  };

  /**
  * input toolbar is only rendered if online
  * @function renderBubble
  * @param {*} props
  */
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#444',
          },
          left: {
            backgroundColor: '#FF8C00',
          },
        }}
      />
    );
  }

  /**
    * input toolbar is only rendered if online
    * @function renderInputToolbar
    * @param {*} props
    * @returns {InputToolbar}
    */
  renderInputToolbar = (props) => {
    if (this.state.isConnected === false) {
      return <InputToolbar {...props} />;
    }
  };

  /**
    * @function renderCustomView
    * @param {*} props
    * @returns {MapView}
    * @returns {boolean} false
    */
  renderCustomView(props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <View>
          <MapView
            style={{
              width: 150, height: 100, borderRadius: 13, margin: 3,
            }}
            provider={PROVIDER_GOOGLE}
            region={{
              latitude: currentMessage.location.latitude,
              longitude: currentMessage.location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          />
        </View>
      );
    }
    return null;
  }

  /**
   * Renders pickImage, takePhoto and getLocation
   * @function renderCustomActions
   * @param {*} props
   * @returns {CustomActions}
   */
  renderCustomActions = (props) => <CustomActions {...props} />;

  render() {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: this.props.navigation.state.params.selectedColor,
          },
        ]}
      >
        <Text style={styles.userName}>
          {this.props.navigation.state.params.name}
          {' '}
          in da houz
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
          onSend={(messages) => this.onSend(messages)}
          image={this.state.image}
          user={{
            _id: 1,
          }}
        />
        {Platform.OS === 'android' ? <KeyboardSpacer /> : null}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userName: {
    fontSize: 10,
    color: '#fff',
    alignSelf: 'center',
    opacity: 0.5,
    marginTop: 25,
  },
});
