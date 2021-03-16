import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  FlatList,
  PermissionsAndroid,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import _ from 'lodash';
import Contacts from 'react-native-contacts';
import { connect } from 'react-redux';
import Blank from '../Blank';
import ChatItem from './ChatItem';
import Empty from './Empty';
import { getMessages } from '../../fetches';
import { getToken, getAccountId } from '../../reducers';
import PermissionStatus from '../../constants/PermissionStatus';
import { getFormattedNumber, getReadableNumber } from '../../utilities/phone';
import { requestContactsPermission } from '../../utilities/permissions';
import analytics, { EVENTS } from '../../analytics';
import R from '../../resources';

class ChatList extends Component {

  constructor(props) {
    super(props);
    this.renderItem = this.renderItem.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.fetch = this.fetch.bind(this);
    this.formatMessages = this.formatMessages.bind(this);
    this.stopFetching = this.stopFetching.bind(this);
    this.onPressRow = this.onPressRow.bind(this);
    this.state = {
      isFetching: false,
      token: props.token,
      accountId: props.accountId,
      phoneNumber: props.phoneNumber,
      messages: [],
    };
  }

  async fetch() {
    try {
      const { token, accountId } = this.state;
      const data = await getMessages({ token, accountId }) || {};
      let { messages } = data;
      messages = _.uniqWith(messages, (a, b) => {
        return (a.to === b.to && a.from === b.from) || (a.to === b.from && a.from === b.to);
      });
      messages = await this.formatMessages(messages);
      this.setState({
        messages,
      });
    } catch (e) {
      console.log(e);
    }
  }

  componentDidMount() {
    this.fetch();
    analytics.track(EVENTS.VIEWED_MESSAGES);
  }

  componentDidUpdate(prevProps) {
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

  async onPressRow(phoneNumber) {
    const title = await getReadableNumber(phoneNumber);
    this.props.navigation.push('Messages', {
      screen: 'ChatDetail',
      params: { title },
    });
  }

  renderItem({ item }) {
    const { navigation } = this.props;
    return (
      <ChatItem chatItem={item} navigation={navigation} onPressRow={this.onPressRow}/>
    )
  }

  async formatMessages(messages) {
    try {
      await requestContactsPermission();
      await Promise.all(messages.map(async ({ from }, index) => {
        messages[index].fromText = await getReadableNumber(from);
      }));
    } catch (e) {
      console.log(e);
    }
    return messages;
  }

  render() {
    const { isFetching, messages } = this.state;
    return (
      <View style={styles.root}>
        <FlatList
          data={messages}
          keyExtractor={(message) => message.sid}
          renderItem={this.renderItem}
          refreshControl={(<RefreshControl tintColor={R.colors.TEXT_MAIN}
            progressBackgroundColor={R.colors.BACKGROUND_DARK}  colors={[R.colors.TEXT_MAIN]}
            refreshing={isFetching} onRefresh={() => this.onRefresh()} />)}
          ListEmptyComponent={(<Empty navigation={this.props.navigation}/>)}
          ListFooterComponent={() => {
            return (<View></View>)
          }
        }
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: R.colors.BACKGROUND_DARK,
  },
  container: {
    flex: 1,
  },
});

ChatList.defaultProps = {};

ChatList.propTypes = {}

const mapStateToProps = state => ({
  token: getToken(state),
  accountId: getAccountId(state),
});

export default connect(
  mapStateToProps,
  { },
)(ChatList);
