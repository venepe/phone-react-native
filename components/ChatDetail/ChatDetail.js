import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import _ from 'lodash';
import { connect } from 'react-redux';
import { GiftedChat } from 'react-native-gifted-chat';
import { postMessages } from '../../fetches';
import { getToken, getAccountId, getPhoneNumber, getMessages } from '../../reducers';
import { initSocket } from '../../utilities/socket';
import R from '../../resources';

class ChatDetail extends Component {

  constructor(props) {
    super(props);
    this.onSend = this.onSend.bind(this);
    const { targetNumber } = props.route.params;
    this.state = {
      isFetching: false,
      token: props.token,
      accountId: props.accountId,
      phoneNumber: props.phoneNumber,
      messages: props.messages,
      text: '',
      targetNumber,
    };
  }

  componentDidMount() {
    const { accountId } = this.state;
    initSocket({ accountId });
  }

  async onSend() {
    let { token, targetNumber: to, messages, accountId, text } = this.state;
    this.setState({ text: '' });
    try {
      const data = await postMessages({ token, to, text, accountId }) || {};
      let { message } = data;
      messages.unshift(message);
      this.setState({ messages });
    } catch (e) {
      this.setState({ text });
    }
  }

  render() {
    const { targetNumber, messages, phoneNumber, text } = this.state;
    let _messages = _.filter(messages, (message) => {
      return message.from === targetNumber || message.to === targetNumber;
    })
    .map((message) => {
      const { from, body, dateCreated } = message;
      message.createdAt = dateCreated;
      message.text = body;
      message.user = {
        _id: from,
      };
      return message;
    });

    return (
      <View style={styles.root}>
        <GiftedChat
          messages={_messages}
          user={{
            _id: '+13128151992',
          }}
          renderAvatar={null}
          text={text}
          onInputTextChanged={text => this.setState({ text })}
          onSend={() => this.onSend()}
        />
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

ChatDetail.defaultProps = {};

ChatDetail.propTypes = {}

const mapStateToProps = state => ({
  token: getToken(state),
  phoneNumber: getPhoneNumber(state),
  accountId: getAccountId(state),
  messages: getMessages(state),
});

export default connect(
  mapStateToProps,
  { },
)(ChatDetail);
