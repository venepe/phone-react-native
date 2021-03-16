import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import R from '../../resources';

class ChatDetail extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.root}>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: R.colors.BACKGROUND_MAIN,
  },
});

export default connect(
  null,
  { },
)(ChatDetail);
