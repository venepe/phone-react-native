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
import { addMessage } from '../../actions';
import { getToken, getAccountId, getPhoneNumber, getMessages } from '../../reducers';
import { initSocket } from '../../utilities/socket';
import analytics, { EVENTS } from '../../analytics';
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
    // initSocket({ accountId });
    analytics.track(EVENTS.VIEWED_DETAIL_MESSAGES);
  }

  async componentDidUpdate(prevProps) {
    const props = this.props;
    if (props.token !== prevProps.token) {
      this.setState({
        token: props.token,
      });
    }
    if (props.accountId !== prevProps.accountId) {
      this.setState({
        accountId: props.accountId,
      });
    }
    if (props.phoneNumber !== prevProps.phoneNumber) {
      this.setState({
        phoneNumber: props.phoneNumber,
      });
    }
    if (props.messages !== prevProps.messages) {
      this.setState({
        messages: props.messages,
      });
    }
  }

  async onSend() {
    let { token, targetNumber: to, messages, accountId, text } = this.state;
    this.setState({ text: '' });
    try {
      await postMessages({ token, to, text, accountId });
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
      const { from, body, createdAt, sid } = message;
      message.createdAt = createdAt;
      message.text = body;
      message._id = sid;
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
            _id: phoneNumber,
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
  { addMessage },
)(ChatDetail);
