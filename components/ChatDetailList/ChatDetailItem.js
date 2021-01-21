import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import R from '../../resources';

class ChatDetailItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rowID: props.rowID,
      chatDetailItem: props.chatDetailItem,
    };
  }

  componentDidUpdate(prevProps) {
    const props = this.props;
    if (props.chatDetailItem !== prevProps.chatDetailItem) {
      this.setState({
        chatDetailItem: props.chatDetailItem,
      });
    }
  }

  render() {
    const { navigation } = this.props;
    const chatDetailItem = this.state.chatDetailItem || {};
    const opacity = 1.0;
    const { from, body } = chatDetailItem;

    return (
        <View style={styles.card}>
          <Text style={styles.phoneNumberText}>{body}</Text>
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

export default ChatDetailItem;
