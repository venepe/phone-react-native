import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import AvailableNumberItem from './AvailableNumberItem';
import SearchBar from './SearchBar';
import Empty from './Empty';
import Loading from './Loading';
import { getAvailableNumbers, postAccounts } from '../../fetches';
import { requestLocation } from '../../utilities/location';
import { storeAndSetActiveUser} from '../../actions';
import { showConfirmPurchaseAlert, showVerifyEmailAddressAlert } from '../../utilities/alert';
import { login } from '../../utilities/auth';
import analytics, { EVENTS } from '../../analytics';
import R from '../../resources';

class AvailableNumberList extends Component {

  constructor(props) {
    super(props);
    this.renderItem = this.renderItem.bind(this);
    this.startFetching = this.startFetching.bind(this);
    this.stopFetching = this.stopFetching.bind(this);
    this.fetch = this.fetch.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onPress = this.onPress.bind(this);
    this.purchase = this.purchase.bind(this);
    this.state = {
      isFetching: false,
      location: props.location,
      location: {
        latitude: null,
        longitude: null,
      },
      phoneNumber: '',
      phoneNumbers: [],
      query: '',
      isPurchasing: false,
    };
  }

  async componentDidMount() {
    this.fetch();
    analytics.track(EVENTS.VIEWED_AVAILABLE_NUMBERS);
  }

  async onSearch({ query }) {
    this.setState({
      query,
    });
    this.fetch(query);
  }

  async fetch(query = '') {
    this.startFetching();
    try {
      const { latitude, longitude } = await requestLocation();
      const data = await getAvailableNumbers({ latitude, longitude, query });
      let { phoneNumbers } = data;
      this.setState({
        location: { latitude, longitude },
        phoneNumbers,
      });
    } catch (e) {
      console.log(e);
    }
    this.stopFetching();
  }

  startFetching() {
    this.setState({ isFetching: true });
  }

  stopFetching() {
    this.setState({ isFetching: false });
  }

  async purchase({ phoneNumber }) {
    const { isPurchasing } = this.state;
    if (!isPurchasing) {
      this.setState({ isPurchasing: true });
      try {
        const { accessToken: token } = await login();
        const data = await postAccounts({ token, phoneNumber });
        let { account } = data;
        if (account) {
          const { phoneNumber, isActive, id: accountId } = account;
          this.props.storeAndSetActiveUser({ payload: { phoneNumber, isActive, accountId } });
        } else {
          showVerifyEmailAddressAlert({ token });
        }
      } catch (e) {
        console.log(e);
      }
      this.setState({ isPurchasing: false });
    }
  }

  onPress({ phoneNumber }) {
    showConfirmPurchaseAlert({ phoneNumber }, ({ phoneNumber }) => this.purchase({ phoneNumber }));
  }

  renderItem({ item }) {
    const { navigation } = this.props;
    return (
      <AvailableNumberItem availableNumberItem={item} navigation={navigation} onPress={this.onPress}/>
    )
  }

  render() {
    const { isFetching, location = {}, phoneNumbers, phoneNumber, query, isPurchasing } = this.state;
    const { latitude, longitude } = location;
    if (isPurchasing) {
      return <Loading/>;
    }
    return (
      <View style={styles.root}>
        <View style={styles.container}>
          <SearchBar onSearch={this.onSearch}/>
          <FlatList
            data={phoneNumbers}
            keyExtractor={(node) => node.nodeId}
            renderItem={this.renderItem}
            refreshControl={(<RefreshControl tintColor={R.colors.TEXT_MAIN}
              progressBackgroundColor={R.colors.BACKGROUND_DARK}  colors={[R.colors.TEXT_MAIN]}
              refreshing={isFetching} onRefresh={() => this.fetch(query)} />)}
            ListEmptyComponent={(<Empty navigation={this.props.navigation}/>)}
            ListFooterComponent={() => {
              return (<View></View>)
            }
          }
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: R.colors.BACKGROUND_MAIN,
  },
  container: {
    flex: 1,
  },
  moreContainer: {
    alignItems: 'center',
  },
});

AvailableNumberList.defaultProps = {};

AvailableNumberList.propTypes = {}

export default connect(
  null,
  { storeAndSetActiveUser },
)(AvailableNumberList);
