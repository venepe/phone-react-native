import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from 'react-native';
const SCREEN_HEIGHT = Dimensions.get('window').height - 70;
import R from '../../resources';

class Loading extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.root}>
        <View style={styles.iconContainer}>
          <View style={styles.localContainer}>
            <ActivityIndicator style={styles.spinner} size='large' color={R.colors.TEXT_MAIN} />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: R.colors.BACKGROUND_MAIN,
    height: SCREEN_HEIGHT,
  },
  localContainer: {
    flex: 1,
    alignItems: 'center',
  },
  primaryText: {
    height: 32,
    fontSize: 24,
    color: R.colors.TEXT_MAIN,
    fontWeight: 'bold',
  },
  secondaryText: {
    height: 26,
    fontSize: 12,
    color: R.colors.TEXT_MAIN,
  },
  iconContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    fontWeight: 'bold',
  },
  spinner: {
    height: 35,
  },
});

export default Loading;
