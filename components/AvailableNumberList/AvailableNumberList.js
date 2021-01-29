import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import RNIap, { initConnection, requestSubscription, purchaseUpdatedListener, purchaseErrorListener, getSubscriptions } from 'react-native-iap';
import Blank from '../Blank';
import AvailableNumberItem from './AvailableNumberItem';
import Empty from './Empty';
import SubscriptionModal from '../SubscriptionModal';
import { getAvailableNumbers, postAccounts } from '../../fetches';
import { requestLocation } from '../../utilities/location';
import { storeAndSetPhoneNumber} from '../../actions';
import { getToken, getUserId } from '../../reducers';
import analytics, { EVENTS } from '../../analytics';
import R from '../../resources';

class AvailableNumberList extends Component {

  constructor(props) {
    super(props);
    this.purchaseUpdateSubscription = {};
    this.purchaseErrorSubscription = {};
    this.renderItem = this.renderItem.bind(this);
    this.startFetching = this.startFetching.bind(this);
    this.stopFetching = this.stopFetching.bind(this);
    this.fetch = this.fetch.bind(this);
    this.onAccept = this.onAccept.bind(this);
    this.onPress = this.onPress.bind(this);
    this.state = {
      isFetching: false,
      location: props.location,
      token: props.token,
      userId: props.userId,
      location: {
        latitude: null,
        longitude: null,
      },
      phoneNumber: '',
      phoneNumbers: [],
      isSubscriptionModalVisible: false,
    };
  }

  async componentDidMount() {
    console.log('componentDidMount');
    await initConnection();
    this.purchaseUpdateSubscription = purchaseUpdatedListener(async (purchase) => {
      const { phoneNumber, token } = this.state;
      const { productId, transactionId, transactionReceipt } = purchase;
      if (transactionReceipt && phoneNumber.length > 0) {
        const platform = Platform.OS;
        const response = await postAccounts({ token, phoneNumber, receipt: { productId, transactionId, transactionReceipt, platform } });
        const statusCode = response.status;
        const data = await response.json();
        if (response.status === 200) {
          try {
            await RNIap.finishTransaction(purchase, true);
            this.props.storeAndSetPhoneNumber({ payload: { phoneNumber } });
          } catch (e) {
            this.props.storeAndSetPhoneNumber({ payload: { phoneNumber } });
          }
        } else {
          this.setState({
            errorMessage: 'Failed up load. Try again.',
          });
        }
      } else {

      }
    });
    this.purchaseErrorSubscription = purchaseErrorListener(async (error) => {
      console.log('purchaseErrorListener', error);
      console.log(error);

    });
    this.fetch();

  }

  componentDidUpdate(prevProps) {
    const props = this.props;
    if (props.userId !== prevProps.userId) {
      this.setState({
        userId: props.userId,
      });
    }
    if (props.token !== prevProps.token) {
      this.setState({
        token: props.token,
      });
    }
  }

  componentWillUnmount() {
    this.purchaseUpdateSubscription.remove();
    this.purchaseErrorSubscription.remove();
  }

  async fetch() {
    this.startFetching();
    try {
      const { latitude, longitude } = await requestLocation();
      const data = await getAvailableNumbers({ latitude, longitude });
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

  onPress({ phoneNumber }) {
    this.setState({ phoneNumber, isSubscriptionModalVisible: true });
  }

  async onAccept() {
    try {
      const subscriptions = await getSubscriptions(['1month']);
      console.log(subscriptions);
      requestSubscription('1month');
    } catch (e) {
      console.log(e);
    }
  }

  renderItem({ item }) {
    const { navigation } = this.props;
    return (
      <AvailableNumberItem availableNumberItem={item} navigation={navigation} onPress={this.onPress}/>
    )
  }

  render() {
    const { isFetching, location, userId, phoneNumbers, phoneNumber, isSubscriptionModalVisible } = this.state;
    const { latitude, longitude } = location;
    return (
      <View style={styles.root}>
        <View style={styles.container}>
          <FlatList
            data={phoneNumbers}
            keyExtractor={(node) => node.nodeId}
            renderItem={this.renderItem}
            refreshControl={(<RefreshControl tintColor={R.colors.TEXT_MAIN} colors={[R.colors.TEXT_MAIN]}
              refreshing={isFetching} onRefresh={() => this.fetch()} />)}
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

const mapStateToProps = state => ({
  userId: getUserId(state),
  token: getToken(state),
});

export default connect(
  mapStateToProps,
  { storeAndSetPhoneNumber },
)(AvailableNumberList);
