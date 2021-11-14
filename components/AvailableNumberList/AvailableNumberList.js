import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { RadioButton } from 'react-native-paper';
import SearchBar from './SearchBar';
import Empty from './Empty';
import Loading from './Loading';
import LoadingNumbers from './LoadingNumbers';
import { getAvailableNumbers, postAccounts } from '../../fetches';
import { requestLocation } from '../../utilities/location';
import { storeAndSetActiveUser} from '../../actions';
import { getToken } from '../../reducers';
import { showConfirmPurchaseAlert, showPurchaseFailed, showVerifyEmailAddressAlert } from '../../utilities/alert';
import { getFormattedNumber } from '../../utilities/phone';
import analytics, { EVENTS } from '../../analytics';
import R from '../../resources';
const START_TIMER = 58;

class AvailableNumberList extends Component {

  constructor(props) {
    super(props);
    this.setPhoneNumber = this.setPhoneNumber.bind(this);
    this.startFetching = this.startFetching.bind(this);
    this.stopFetching = this.stopFetching.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.stopTimer = this.stopTimer.bind(this);
    this.fetch = this.fetch.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onAccept = this.onAccept.bind(this);
    this.state = {
      isFetching: false,
      location: props.location,
      token: props.token,
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

  setPhoneNumber(phoneNumber) {
    this.setState({ phoneNumber });
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
    if (this.intervalId) {
      this.stopTimer();
    }
    const { query } = this.state;
    try {
      const { latitude, longitude } = await requestLocation();
      const data = await getAvailableNumbers({ latitude, longitude, query });
      let { phoneNumbers } = data;
      phoneNumbers = phoneNumbers.sort(this.comparePhoneNumbers);
      let phoneNumber = '';
      if (phoneNumbers.length > 0) {
        phoneNumber = phoneNumbers[0];
      }
      this.setState({
        location: { latitude, longitude },
        phoneNumber,
        phoneNumbers,
      });
      this.startTimer();
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
      this.setState({ isPurchasing: true });
      const { phoneNumber: phoneNumberItem, token } = this.state;
      const phoneNumber = phoneNumberItem.phoneNumber;
      if (phoneNumber.length > 0) {
        const data = await postAccounts({ token, phoneNumber }) || {};
        let { account } = data;
        if (account) {
          const { phoneNumber, isActive, id: accountId } = account;
          this.props.storeAndSetActiveUser({ payload: { phoneNumber, isActive, accountId } });
          this.props.navigation.navigate('CreateAccount', {
            screen: 'ShareCode',
            params: { },
          });
        } else {
          this.setState({
            isPurchasing: false,
            errorMessage: 'Failed up load. Try again.',
          });
        }
      } else {
        this.setState({
          isPurchasing: false,
          errorMessage: 'Failed up load. Try again.',
        });
      }
    } catch (e) {
      console.log(e);
      this.setState({
        isPurchasing: false,
        errorMessage: 'Failed up load. Try again.',
      });
      console.log(e);
    }
  }

  startTimer() {
    this.setState({ timer: START_TIMER });
    this.intervalId = setInterval(() => {
      let { timer } = this.state;
      this.setState({ timer: timer - 1 });
    }, 1000);
  }

  stopTimer() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  componentDidUpdate() {
    if (this.state.timer === 0 && this.intervalId) {
      this.fetch();
    }
  }

  componentWillUnmount() {
    if (this.intervalId) {
      this.stopTimer();
    }
  }

  render() {
    const { isFetching, timer, location = {}, phoneNumbers, phoneNumber, query, isPurchasing } = this.state;
    const { latitude, longitude } = location;
    const refreshPhoneNumberTextColor = timer < 11 ? R.colors.TEXT_ERROR : R.colors.TEXT_MAIN;
    if (isPurchasing) {
      return <Loading/>;
    }

    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.container}>
          <SearchBar onSearch={this.onSearch}/>
          {(() => {
            if (isFetching && phoneNumbers.length < 1) {
              return (<LoadingNumbers/>);
            } else {
              return (
                <View style={styles.container}>
                  <Text style={[styles.refreshPhoneNumberText, { color: refreshPhoneNumberTextColor }]}>{`Numbers will refresh in ${timer} seconds`}</Text>
                  <RadioButton.Group onValueChange={newValue => this.setPhoneNumber(newValue)} value={phoneNumber}>
                    {
                      phoneNumbers.map(phoneNumber => {
                        return (
                          <View>
                            <RadioButton.Item
                              label={getFormattedNumber(phoneNumber.phoneNumber)}
                              value={phoneNumber}
                              labelStyle={styles.labelStyle}
                            />
                          </View>
                        )
                      })
                    }
                    </RadioButton.Group>
                    <View style={styles.bodyContainer}>
                      <View style={{ flex: 1, alignItems: 'flex-end' }}></View>
                      <TouchableOpacity style={styles.subscribeButtonContainer} onPress={() => this.onAccept()}>
                        <Text style={styles.btnPrimaryText}>{R.strings.LABEL_CONTINUE}</Text>
                      </TouchableOpacity>
                          <Text style={styles.bodyText}>{`By clicking ${R.strings.LABEL_CONTINUE}, you agree to Bubblepop's `}
                        <Text style={styles.linkText} onPress={() => Linking.openURL(`${HOME_PAGE}/terms-of-service`)}>
                          {`Terms of Service `}
                        </Text>
                        <Text style={styles.bodyText}>{`and `}</Text>
                        <Text style={styles.linkText} onPress={() => Linking.openURL(`${HOME_PAGE}/privacy`)}>
                          Privacy Policy
                        </Text>
                        <Text style={styles.bodyText}>.</Text>
                      </Text>
                    </View>
                  </View>
              );
            }
          })()
          }
        </View>
      </SafeAreaView>
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
  labelStyle: {
    color: R.colors.TEXT_MAIN,
    fontSize: 16,
    fontWeight: 'bold',
  },
  refreshPhoneNumberText: {
    marginTop: 5,
    color: R.colors.TEXT_MAIN,
    alignSelf: 'center',
    fontSize: 16,
  },
  moreContainer: {
    alignItems: 'center',
  },
  bodyContainer: {
    flex: 1,
    flexDirection: 'column',
    padding: 10,
    marginTop: 2,
  },
  bodyText: {
    color: `${R.colors.TEXT_MAIN}`,
    fontSize: 18,
    flexWrap:'wrap',
    padding: 5,
  },
  linkText: {
    color: `${R.colors.LOGO}`,
    fontSize: 18,
    fontWeight: 'bold',
  },
  btnPrimaryText: {
    color: `${R.colors.TEXT_MAIN}`,
    fontSize: 18,
    fontWeight: 'bold',
    flexWrap:'wrap',
  },
  subscribeButtonContainer: {
    alignItems: 'center',
    marginTop: 5,
    padding: 20,
    backgroundColor: R.colors.BACKGROUND_MAIN,
  },
});

AvailableNumberList.defaultProps = {};

const mapStateToProps = state => ({
  token: getToken(state),
});

export default connect(
  mapStateToProps,
  { storeAndSetActiveUser },
)(AvailableNumberList);
