import React, { Component } from 'react';
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import R from '../../resources';

class Loading extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.container}>
          <View style={styles.imageContainer}>
            <Image
              style={[styles.image, { alignSelf: 'flex-end' }]}
              source={require('../../assets/couple_three.png')}
            />
          </View>
          <ActivityIndicator style={styles.spinner} size='large' color={R.colors.BACKGROUND_MAIN} />
          <View style={styles.imageContainer}>
            <Image
              style={[styles.image, { alignSelf: 'flex-start' }]}
              source={require('../../assets/couple_four.png')}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#18FFFF',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    fontWeight: 'bold',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  image: {
    height: 200,
    margin: 20,
  },
  spinner: {
    height: 35,
  },
});

export default Loading;
