import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import R from '../../resources';

class ChatItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rowID: props.rowID,
      numberItem: props.numberItem,
    };
  }

  componentDidUpdate(prevProps) {
    const props = this.props;
    if (props.numberItem !== prevProps.numberItem) {
      this.setState({
        numberItem: props.numberItem,
      });
    }
  }

  render() {
    const { navigation } = this.props;
    const numberItem = this.state.numberItem || {};
    const opacity = 1.0;
    const { phoneNumber } = numberItem;

    return (
        <View style={styles.card}>
          <Text style={styles.phoneNumberText}>{phoneNumber}</Text>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'column',
    backgroundColor: R.colors.BACKGROUND_MAIN,
    shadowColor: R.colors.TEXT_MAIN,
    shadowOpacity: 0.3,
    shadowRadius: 2,
    shadowOffset: {
      height: 0,
      width: 0,
    },
  },
  phoneNumberText: {
    color: R.colors.TEXT_MAIN,
    fontSize: 28,
    fontWeight: '400',
  },
});

export default ChatItem;
