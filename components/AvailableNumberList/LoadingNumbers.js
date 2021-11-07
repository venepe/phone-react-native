import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import R from '../../resources';
const WAITING = 3000;

class LoadingNumbers extends Component {

  constructor(props) {
    super(props);
    this.state = {
      text: R.strings.LABEL_LOADING_NUMBERS,
    }
  }

  componentDidMount() {
    const intervalId = setInterval(() => {
      let { text } = this.state;
      text = `${text}.`;
      this.setState({ text });
    }, WAITING);
    this.setState({ intervalId });
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  render() {
    const { text } = this.state;
    return (
      <View style={styles.root}>
        <View style={styles.localContainer}>
          <ActivityIndicator style={styles.spinner} size='large' color={R.colors.TEXT_MAIN} />
          <Text style={styles.primaryText}>{text}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: R.colors.BACKGROUND_MAIN,
  },
  localContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: {
    marginTop: 5,
    height: 32,
    fontSize: 18,
    color: R.colors.TEXT_MAIN,
    fontWeight: 'bold',
  },
  spinner: {
    height: 35,
  },
});

export default LoadingNumbers;
