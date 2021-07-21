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
import { FAB } from 'react-native-paper';
import { connect } from 'react-redux';
import Blank from '../Blank';
import CallItem from './CallItem';
import Empty from './Empty';
import { getActivationToken } from '../../fetches';
import { requestCalls } from '../../actions';
import { getToken, getAccountId, getCalls, getPhoneNumber } from '../../reducers';
import PermissionStatus from '../../constants/PermissionStatus';
import { getFormattedNumber, getReadableNumber } from '../../utilities/phone';
import { requestContactsPermission } from '../../utilities/permissions';
import analytics, { EVENTS } from '../../analytics';
import R from '../../resources';

class CallList extends Component {

  constructor(props) {
    super(props);
    this.renderItem = this.renderItem.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.fetch = this.fetch.bind(this);
    this.formatCalls = this.formatCalls.bind(this);
    this.stopFetching = this.stopFetching.bind(this);
    this.onCreateCall = this.onCreateCall.bind(this);
    this.onPressRow = this.onPressRow.bind(this);
    this.state = {
      isFetching: false,
      token: props.token,
      accountId: props.accountId,
      phoneNumber: props.phoneNumber,
      calls: [],
    };
  }

  async fetch() {
    try {
      this.props.requestCalls();
    } catch (e) {
      console.log(e);
    }
  }

  componentDidMount() {
    this.fetch();
    analytics.track(EVENTS.VIEWED_CALLS);
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
    if (props.calls !== prevProps.calls) {
      let calls = _.uniqWith(props.calls, (a, b) => {
        return (a.to === b.to && a.from === b.from) || (a.to === b.from && a.from === b.to);
      });
      calls = await this.formatCalls(calls);
      this.setState({
        calls,
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

  onCreateCall() {
    this.props.navigation.push('Calls', {
      screen: 'DialPad',
    });
    analytics.track(EVENTS.CLICKED_COMPOSE);
  }

  async onPressRow({ from, to }) {
    let { token, accountId } = this.state;
  }

  renderItem({ item }) {
    const { navigation } = this.props;
    return (
      <CallItem callItem={item} navigation={navigation} onPressRow={this.onPressRow}/>
    )
  }

  async formatCalls(calls) {
    const { phoneNumber } = this.state;
    try {
      await requestContactsPermission();
      await Promise.all(calls.map(async ({ from, to }, index) => {
        let number = (phoneNumber === from) ? to : from;
        calls[index].fromText = await getReadableNumber(number);
      }));
    } catch (e) {
      console.log(e);
    }
    return calls;
  }

  render() {
    const { isFetching, calls } = this.state;
    return (
      <View style={styles.root}>
        <FlatList
          data={calls}
          keyExtractor={(calls) => calls.sid}
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
        <FAB
          color={R.colors.TEXT_MAIN}
          style={styles.fab}
          large
          icon='dialpad'
          onPress={() => this.onCreateCall()}
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 15,
    bottom: 30,
  },
});

CallList.defaultProps = {};

CallList.propTypes = {};

const mapStateToProps = state => ({
  token: getToken(state),
  accountId: getAccountId(state),
  calls: getCalls(state),
  phoneNumber: getPhoneNumber(state),
});

export default connect(
  mapStateToProps,
  { requestCalls },
)(CallList);
