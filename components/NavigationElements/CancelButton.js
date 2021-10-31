import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import R from '../../resources';

class CancelButton extends Component {
  static propTypes = {}

  constructor(props) {
    super(props);
    this.onPress = this.onPress.bind(this);
  }

  onPress() {
    this.props.navigation.goBack();
  }

  render() {
    return (
      <TouchableOpacity style={styles.container} onPress={() => this.onPress()}>
        <Text style={styles.text}>{R.strings.LABEL_CANCEL}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    height: 26,
    fontSize: 18,
    color: '#FAFAFA',
  },
});

CancelButton.defaultProps = {
  onPress: () => {},
};

CancelButton.propTypes = {

}

export default CancelButton;
