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
import { connect } from 'react-redux';
import Blank from '../Blank';
import ChatItem from './ChatItem';
import Empty from './Empty';
import { getMessages } from '../../fetches';
import { getToken, getPhoneNumber } from '../../reducers';
import analytics, { EVENTS } from '../../analytics';
import R from '../../resources';

class ChatList extends Component {

  constructor(props) {
    super(props);
    this.renderItem = this.renderItem.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.fetch = this.fetch.bind(this);
    this.stopFetching = this.stopFetching.bind(this);
    this.state = {
      isFetching: false,
      token: props.token,
      phoneNumber: props.phoneNumber,
      messages: [],
    };
  }

  async fetch() {
    try {
      const { token, phoneNumber } = this.state;
      const response = await getMessages({ token, phoneNumber });
      const statusCode = response.status;
      const data = await response.json();
      if (response.status === 200) {
        let { messages } = data;
        console.log(messages);
        this.setState({
          messages,
        });
      } else {

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
      <ChatItem chatItem={item} navigation={navigation}/>
    )
  }

  render() {
    const { isFetching, messages } = this.state;
    return (
      <FlatList
        data={messages}
        keyExtractor={(message) => message.sid}
        renderItem={this.renderItem}
        onRefresh={() => this.onRefresh()}
        refreshing={isFetching}
        ListEmptyComponent={(<Empty navigation={this.props.navigation}/>)}
        ListFooterComponent={() => {
          return (<View></View>)
        }
      }
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

ChatList.defaultProps = {};

ChatList.propTypes = {}

const mapStateToProps = state => ({
  token: getToken(state),
  phoneNumber: getPhoneNumber(state),
});

export default connect(
  mapStateToProps,
  { },
)(ChatList);
