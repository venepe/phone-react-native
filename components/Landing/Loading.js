import React, { Component } from 'react';
import {
  ActivityIndicator,
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
          <ActivityIndicator style={styles.spinner} size='large' color={R.colors.BACKGROUND_MAIN} />
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
    justifyContent: 'center',
  },
  spinner: {
    height: 35,
  },
});

export default Loading;
