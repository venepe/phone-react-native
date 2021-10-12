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
import RNIap, { initConnection, requestSubscription, purchaseUpdatedListener, purchaseErrorListener, getSubscriptions } from 'react-native-iap';
import AvailableNumberItem from './AvailableNumberItem';
import SearchBar from './SearchBar';
import Empty from './Empty';
import SubscriptionModal from '../SubscriptionModal';
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
    this.onAccept = this.onAccept.bind(this);
    this.purchase = this.purchase.bind(this);
    this.state = {
      isFetching: false,
      location: props.location,
      token: '',
      location: {
        latitude: null,
        longitude: null,
      },
      phoneNumber: '',
      phoneNumbers: [],
      query: '',
      isPurchasing: false,
      isSubscriptionModalVisible: false,
    };
  }

  async componentDidMount() {
    await initConnection();
    await RNIap.flushFailedPurchasesCachedAsPendingAndroid;
    this.purchaseUpdateSubscription = purchaseUpdatedListener(async (purchase) => {
      const { phoneNumber, token } = this.state;
      const { productId, transactionId, transactionReceipt } = purchase;
      if (transactionReceipt && phoneNumber.length > 0) {
        const platform = Platform.OS;
        const data = await postAccounts({ token, phoneNumber, receipt: { productId, transactionId, transactionReceipt, platform } });
        let { account } = data;
        if (account) {
          await RNIap.finishTransaction(purchase, false);
          const { phoneNumber, isActive, id: accountId } = account;
          this.props.storeAndSetActiveUser({ payload: { phoneNumber, isActive, accountId } });
        } else {
          this.setState({
            errorMessage: 'Failed up load. Try again.',
          });
        }
      } else {
        this.setState({
          errorMessage: 'Failed up load. Try again.',
        });
      }
    });
    this.purchaseErrorSubscription = purchaseErrorListener(async (error) => {
      console.log('purchaseErrorListener', error);
      console.log(error);
    });
    this.fetch();
    analytics.track(EVENTS.VIEWED_AVAILABLE_NUMBERS);
  }

  componentWillUnmount() {
    this.purchaseUpdateSubscription.remove();
    this.purchaseErrorSubscription.remove();
  }

  comparePhoneNumbers(a, b) {
    const phoneNumberA = a.phoneNumber.toUpperCase();
    const phoneNumberB = b.phoneNumber.toUpperCase();

    let comparison = 0;
    if (phoneNumberA > phoneNumberB) {
      comparison = 1;
    } else if (phoneNumberA < phoneNumberB) {
      comparison = -1;
    }
    return comparison;
  }

  async onSearch({ query }) {
    this.setState({
      query,
    });
    this.fetch();
  }

  async fetch() {
    this.startFetching();
    const { query } = this.state;
    try {
      const { latitude, longitude } = await requestLocation();
      const data = await getAvailableNumbers({ latitude, longitude, query });
      let { phoneNumbers } = data;
      phoneNumbers = phoneNumbers.sort(this.comparePhoneNumbers);
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

  async onAccept() {
    try {
      const subscriptions = await getSubscriptions(['annual']);
      console.log(subscriptions);
      requestSubscription('annual');
    } catch (e) {
      console.log(e);
    }
  }

  async purchase({ phoneNumber }) {
    const { isPurchasing } = this.state;
    if (!isPurchasing) {
      this.setState({ phoneNumber, isPurchasing: true });
      try {
        const { accessToken: token } = await login();
        this.setState({ token, isSubscriptionModalVisible: true });
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
    return (
      <AvailableNumberItem availableNumberItem={item} onPress={this.onPress}/>
    )
  }

  render() {
    const { isFetching, location = {}, phoneNumbers, phoneNumber, query, isPurchasing, isSubscriptionModalVisible } = this.state;
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
            keyExtractor={(item) => item.phoneNumber}
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
        <SubscriptionModal phoneNumber={phoneNumber} isVisible={isSubscriptionModalVisible} onAccept={this.onAccept} handleClose={() => this.setState({ isSubscriptionModalVisible: false })}/>
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
