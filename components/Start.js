import React, { Component } from 'react';
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  ImageBackground,
  TouchableOpacity
} from 'react-native';
// Keyboard Spacer
import KeyboardSpacer from 'react-native-keyboard-spacer';

export default class Start extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      selectedColor: ''
    };
  }

  render() {
    return (
      <ImageBackground
        style={styles.backgroundImage}
        source={require('../assets/BackgroundImage.png')}>
        <Text style={styles.title}>Chit Chat</Text>

        {/* Container for TextInput */}
        <View style={styles.container}>
          <View style={styles.box}>
            {/* Name to be displayed in header */}
            <TextInput
              style={[styles.nameInput, styles.alignment]}
              onChangeText={name => this.setState({ name })}
              value={this.state.name}
              placeholder="Your Name"
            />
          </View>
          <View style={styles.box}>
            <Text style={styles.alignment}>Choose a background color</Text>

            {/* Background Color Choices */}
            <View style={styles.colorChoice}>
              <TouchableOpacity
                onPress={() => this.setState({ selectedColor: '#090C08' })}
                style={[styles.button1, styles.colorCircle]}
              />

              <TouchableOpacity
                onPress={() => this.setState({ selectedColor: '#474056' })}
                style={[styles.button2, styles.colorCircle]}
              />
              <TouchableOpacity
                onPress={() => this.setState({ selectedColor: '#8A95A5' })}
                style={[styles.button3, styles.colorCircle]}
              />
              <TouchableOpacity
                onPress={() => this.setState({ selectedColor: '#B9C6AE' })}
                style={[styles.button4, styles.colorCircle]}
              />
            </View>
          </View>
          <View style={styles.box}>
            <TouchableOpacity
              accessible={true}
              accessibilityLabel="More options"
              accessibilityHint="Let’s you choose to send an image or your geolocation."
              accessibilityRole="button"
              style={[styles.chatButton, styles.alignment]}
              onPress={() => {
                this.props.navigation.navigate('Chat', {
                  name: this.state.name,
                  selectedColor: this.state.selectedColor
                });
              }}>
              <Text style={[styles.buttonText, styles.alignment]}>
                Start Chatting
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {Platform.OS === 'android' ? <KeyboardSpacer /> : null}
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
    paddingTop: 10
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
    justifyContent: 'space-evenly'
  },
  alignment: {
    alignSelf: 'center'
  }
});
