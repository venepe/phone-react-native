import React, { Component } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import R from '../../resources';
const SCREEN_HEIGHT = Dimensions.get('window').height;

class Loading extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ImageBackground source={require('../../assets/couple-background.png')}
        resizeMode='cover' style={styles.root}>
        <View style={styles.container}>
          <ActivityIndicator style={styles.spinner} size='large' color={R.colors.TEXT_MAIN} />
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: R.colors.BACKGROUND_MAIN,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  spinner: {
    height: 35,
  },
});

export default Loading;
