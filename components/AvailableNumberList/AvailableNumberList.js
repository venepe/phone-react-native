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
import Blank from '../Blank';
import AvailableNumberItem from './AvailableNumberItem';
import Empty from './Empty';
import { getAvailableNumbers, postAccounts } from '../../fetches';
import { requestLocation } from '../../utilities/location';
import { storeAndSetActiveUser} from '../../actions';
import { getToken, getUserId } from '../../reducers';
import { showConfirmPurchaseAlert} from '../../utilities/alert';
import analytics, { EVENTS } from '../../analytics';
import R from '../../resources';

class AvailableNumberList extends Component {

  constructor(props) {
    super(props);
    this.renderItem = this.renderItem.bind(this);
    this.startFetching = this.startFetching.bind(this);
    this.stopFetching = this.stopFetching.bind(this);
    this.fetch = this.fetch.bind(this);
    this.onPress = this.onPress.bind(this);
    this.purchase = this.purchase.bind(this);
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
    };
  }

  async componentDidMount() {
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

  async purchase({ phoneNumber }) {
    console.log('purchase');
    const { token } = this.state;
    try {
      const data = await postAccounts({ token, phoneNumber });
      let { account } = data;
      if (account) {
        const { phoneNumber, isActive } = account;
        this.props.storeAndSetActiveUser({ payload: { phoneNumber, isActive } });
      }
    } catch (e) {
      console.log(e);
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
    const { isFetching, location, userId, phoneNumbers, phoneNumber } = this.state;
    const { latitude, longitude } = location;
    return (
      <View style={styles.root}>
        <View style={styles.container}>
          <FlatList
            data={phoneNumbers}
            keyExtractor={(node) => node.nodeId}
            renderItem={this.renderItem}
            refreshControl={(<RefreshControl tintColor={R.colors.TEXT_MAIN}
              progressBackgroundColor={R.colors.BACKGROUND_DARK}  colors={[R.colors.TEXT_MAIN]}
              refreshing={isFetching} onRefresh={() => this.fetch()} />)}
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

const mapStateToProps = state => ({
  userId: getUserId(state),
  token: getToken(state),
});

export default connect(
  mapStateToProps,
  { storeAndSetActiveUser },
)(AvailableNumberList);
