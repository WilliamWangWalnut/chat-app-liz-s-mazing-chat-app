import React, { Component } from 'react';
import {
  Text,
  View,
  Button,
  TextInput,
  StyleSheet,
  ImageBackground,
  TouchableOpacity
} from 'react-native';

export default class Start extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      background: ''
    };
  }

  onPress = () => {};

  render() {
    return (
      <ImageBackground
        style={styles.backgroundImage}
        source={require('../assets/BackgroundImage.png')}>
        <Text style={styles.title}>Chit Chat</Text>

        {/* Container for TextInput */}
        <View style={styles.container}>
          <View style={styles.box}>
            <TextInput
              style={styles.nameInput}
              onChangeText={name => this.setState({ name })}
              value={this.state.name}
              placeholder="Your Name"
            />
          </View>
          <View style={styles.box}>
            <Text>Choose a background color</Text>

            {/* Background Color Choices */}
            <View style={styles.colorChoice}>
              <TouchableOpacity
                style={[styles.button1, styles.colorCircle]}
                onPress={() => {
                  this.props.navigation.navigate('Chat', {
                    background: this.setState({ background: '#090C08' })
                  });
                }}
              />

              <TouchableOpacity
                style={[styles.button2, styles.colorCircle]}
                onPress={() => {
                  this.props.navigation.navigate('Chat', {
                    background: this.setState({ background: '#474056' })
                  });
                }}
              />
              <TouchableOpacity
                style={[styles.button3, styles.colorCircle]}
                onPress={() => {
                  this.props.navigation.navigate('Chat', {
                    background: this.setState({ background: '#8A95A5' })
                  });
                }}
              />
              <TouchableOpacity
                style={[styles.button4, styles.colorCircle]}
                onPress={() => {
                  this.props.navigation.navigate('Chat', {
                    background: this.setState({ background: '#B9C6AE' })
                  });
                }}
              />
            </View>
          </View>
          <View style={styles.box}>
            <TouchableOpacity
              style={styles.chatButton}
              onPress={() => {
                this.props.navigation.navigate('Chat', {
                  name: this.state.name
                });
              }}>
              <Text style={styles.buttonText}>Start Chatting</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center'
  },
  container: {
    height: '44%',
    width: '88%',
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 50
  },
  title: {
    fontSize: 45,
    fontWeight: '600',
    color: '#ffffff',
    marginTop: 75
  },
  nameInput: {
    width: '88%',
    height: '50%',
    borderColor: 'gray',
    borderWidth: 1
  },
  colorChoice: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  chatButton: {
    height: '50%',
    backgroundColor: '#757083',
    width: '88%'
  },
  buttonText: {
    fontSize: 16,
    color: '#FFFFFF',
    alignItems: 'center'
  },
  colorCircle: {
    width: 50,
    height: 50,
    borderRadius: 25
  },
  button1: {
    backgroundColor: '#090C08'
  },
  button2: {
    backgroundColor: '#474056'
  },
  button3: {
    backgroundColor: '#8A95A5'
  },
  button4: {
    backgroundColor: '#B9C6AE'
  },
  box: {
    flex: 1,
    justifyContent: 'space-around'
  }
});
// create a TextInput component in the start screen where the user can type in their name. Then, we need to make the name a state and update it via setState when the user has entered their name.

// create an onPress function that gets called whenever the user presses a button. In this function, you can update your state name and navigate the user to the chat screen.

//  add an object as a second parameter to navigate and add data you want to use in the screen you’re transitioning to:
// this.props.navigation.navigate('Chat', { name: this.state.name })
