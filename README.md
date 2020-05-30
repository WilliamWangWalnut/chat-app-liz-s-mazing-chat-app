# Chit-Chat

Chit-Chat is a... you guessed it, a chat app created with React-Native.

## Installation

To install this app first enter the following into the terminal

```bash
npm install 
```
To run the app locally, enter
```bash
npm start 
```
## Project dependencies

```
"expo"
"react-native"
"firebase"
"react-dom"
"react-native-gesture-handler"
"react-native-gifted-chat"
"react-native-keyboard-spacer"
"react-native-maps"
"react-native-reanimated"
"react-navigation"
"@react-native-community/async-storage"
"@react-native-community/masked-view"
"@react-native-community/netinfo"
"@react-navigation/native"
"@react-navigation/stack"
"babel-preset-env"
"base-64"
```

## Set up the database
I used Firebase’s Cloud Firestore database to get real-time data.
1. Head over to Google Firebase and click on “Sign in”
2. Click on the “Go to console” link and click on "Create Project"
3. A form will appear asking you to fill basic in information about your new project.
4. Give your project a name.
5. With the default settings selected, agree to the terms and click “Create Project.”
6. Create a database, so click on “Develop” from the menu on the left-hand side.
7. From the additional menu that appears, select “Database”.
8. Choose “Create database” in the Cloud Firestore section.
9. Make sure that you’re creating a Firestore Database—NOT a “Realtime Database.”

### And with that, your database has been created!
