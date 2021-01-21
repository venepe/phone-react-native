import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { GiftedChat } from 'react-native-gifted-chat'
import { connect } from 'react-redux';
import Blank from '../Blank';
import ChatDetailItem from './ChatDetailItem';
import Empty from './Empty';
import { getDetailMessages, postMessage } from '../../fetches';
import { getToken, getPhoneNumber } from '../../reducers';
import analytics, { EVENTS } from '../../analytics';
import R from '../../resources';

class ChatDetailList extends Component {

  constructor(props) {
    super(props);
    this.renderItem = this.renderItem.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.fetch = this.fetch.bind(this);
    this.stopFetching = this.stopFetching.bind(this);
    this.onSend = this.onSend.bind(this);
    const { from } = this.props.route.params || {};
    this.state = {
      isFetching: false,
      token: props.token,
      phoneNumber: props.phoneNumber,
      from,
      messages: [],
    };
  }

  async fetch() {
    try {
      const { token, phoneNumber, from } = this.state;
      const response = await getDetailMessages({ token, phoneNumber, from });
      const statusCode = response.status;
      const data = await response.json();
      if (response.status === 200) {
        let { messages } = data;
        messages = messages.map((message) => {
          return {
            ...message,
            text: message.body,
          };
        })
        console.log(messages);
        this.setState({
          messages,
        });
      } else {
        console.log('here');
      }
    } catch (e) {
      console.log(e);
    }
  }

  componentDidMount() {
    this.fetch();
  }



  componentDidUpdate(prevProps) {
    const props = this.props;
    if (props.token !== prevProps.token) {
      this.setState({
        token: props.token,
      });
    }
    if (props.phoneNumber !== prevProps.phoneNumber) {
      this.setState({
        phoneNumber: props.phoneNumber,
      });
    }
  }

  async onRefresh() {
    this.setState({
      isFetching: true,
    });
    await this.fetch();;
    this.stopFetching();
  }

  stopFetching() {
    if (this.state.isFetching) {
      this.setState({ isFetching: false });
    }
  }

  renderItem({ item }) {
    const { navigation } = this.props;
    return (
      <ChatDetailItem chatDetailItem={item} navigation={navigation}/>
    )
  }

  onSend(message) {

  }

  render() {
    const { isFetching, messages, phoneNumber } = this.state;
    return (
      <GiftedChat
        placeholder={'Type a message'}
        renderAvatar={() => null}
        messages={messages}
        onSend={this.onSend}
        user={{
          to: phoneNumber,
        }}
      />
    )
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: R.colors.BACKGROUND_MAIN,
  },
  container: {
    flex: 1,
  },
});

ChatDetailList.defaultProps = {};

ChatDetailList.propTypes = {}

const mapStateToProps = state => ({
  token: getToken(state),
  phoneNumber: getPhoneNumber(state),
});

export default connect(
  mapStateToProps,
  { },
)(ChatDetailList);
