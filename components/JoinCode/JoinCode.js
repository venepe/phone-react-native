import React, { Component } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { Video } from 'expo-av';
import RNIap, { initConnection, requestSubscription, purchaseUpdatedListener, purchaseErrorListener, getSubscriptions } from 'react-native-iap';
import JoinModal from '../JoinModal';
import { getAccountById, postOwners } from '../../fetches';
import { storeAndSetActiveUser } from '../../actions';
import { showCongratulationsAlert, showPurchaseFailed } from '../../utilities/alert';
import { login } from '../../utilities/auth';
import analytics, { EVENTS } from '../../analytics';
import R from '../../resources';
const SCREEN_HEIGHT = Dimensions.get('window').height;

class JoinCode extends Component {

  constructor(props) {
    super(props);
    const { invitation: accountId } = props.route.params || {};
    this.purchase = this.purchase.bind(this);
    this.closeJoinModal = this.closeJoinModal.bind(this);
    this.join = this.join.bind(this);
    this.exitSetup = this.exitSetup.bind(this);
    this.state = {
      accountId,
      isLoading: false,
      isJoinModalVisible: false,
      owners: [],
    };
  }

  async join() {
    const { accountId } = this.state;
    this.setState({ isLoading: true });
    try {
      const { account: { owners, phoneNumber } }= await getAccountById({ accountId });
      this.setState({ owners, phoneNumber, isJoinModalVisible: true, isLoading: false });
    } catch (e) {
      this.setState({ isLoading: false, didLogin: false, isJoinModalVisible: false });
      console.log(e);
    }
  }

  exitSetup() {
    this.props.navigation.navigate('Welcome', {
      screen: 'LandingTwo'
    });
  }

  async componentDidMount() {
    await initConnection();
    await RNIap.flushFailedPurchasesCachedAsPendingAndroid;
    this.purchaseUpdateSubscription = purchaseUpdatedListener(async (purchase) => {
      const { accountId, token } = this.state;
      const { productId, transactionId, transactionReceipt } = purchase;
      if (transactionReceipt && phoneNumber.length > 0) {
        const platform = Platform.OS;
        const data = await postOwners({ token, accountId, receipt: { productId, transactionId, transactionReceipt, platform } });
        let { owner } = data;
        if (owner) {
          await RNIap.finishTransaction(purchase, false);
          const { phoneNumber } = owner;
          this.props.storeAndSetActiveUser({ payload: { accountId, phoneNumber, isActive: true } });
          showCongratulationsAlert();
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
      showPurchaseFailed(error.message);
      console.log('purchaseErrorListener', error);
      console.log(error);
    });
    this.join();
    analytics.track(EVENTS.VIEWED_JOIN_CODE);
  }

  componentWillUnmount() {
    this.purchaseUpdateSubscription.remove();
    this.purchaseErrorSubscription.remove();
  }

  async purchase(subscription) {
    try {
      this.setState({ isLoading: true, isJoinModalVisible: false });
      const { accessToken: token } = await login();
      this.setState({ token });
      const subscriptions = await getSubscriptions([subscription]);
      console.log(subscriptions);
      requestSubscription(subscription);
    } catch (e) {
      showPurchaseFailed(e.message);
      console.log(e);
      this.setState({ isLoading: false });
    }
  }

  async purchase() {
    const { accountId } = this.state;
    this.setState({ isLoading: true, isJoinModalVisible: false });
    try {
      const { accessToken: token } = await login();
      const data = await postOwners({ token, accountId });
      let { owner } = data;
      if (owner) {
        const { phoneNumber } = owner;
        this.props.storeAndSetActiveUser({ payload: { accountId, phoneNumber, isActive: true } });
        showCongratulationsAlert();
      }
      this.setState({ isLoading: false });
    } catch (e) {
      console.log(e);
      this.setState({ isLoading: false });
    }
  }

  closeJoinModal() {
    this.setState({
      isLoading: false,
      isJoinModalVisible: false,
    });
  }

  render() {
    const { isLoading, isJoinModalVisible, phoneNumber, owners } = this.state;
    return (
      <SafeAreaView style={styles.root}>
        <Video
          source={require('../../assets/couple-running-background.mp4')}
          useNativeControlsA={false}
          resizeMode='cover'
          shouldPlay={true}
          style={styles.backgroundVideo}
          isMuted={true}
          isLooping={true}
          rate={1.0}
          ignoreSilentSwitch={'obey'}
        />
        <View style={styles.container}>
          {(isLoading) ?
            (<ActivityIndicator style={styles.spinner}
              size='large' color={R.colors.BACKGROUND_MAIN} />) :
              isJoinModalVisible ? (<View/>) :
              (
                <View style={styles.retryContainer}>
                  <TouchableOpacity onPress={this.join}>
                    <Text style={styles.retryText}>{R.strings.LABEL_RETRY}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={this.exitSetup}>
                    <Text style={styles.exitSetupText}>{R.strings.LABEL_EXIT_SETUP}</Text>
                  </TouchableOpacity>
                </View>
              )
            }
        </View>
        <JoinModal phoneNumber={phoneNumber} owners={owners}
          isVisible={isJoinModalVisible} onAccept={this.purchase} handleClose={this.closeJoinModal}/>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: R.colors.BACKGROUND_MAIN,
  },
  backgroundVideo: {
    height: SCREEN_HEIGHT,
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'stretch',
    bottom: 0,
    right: 0,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  spinner: {
    height: 35,
  },
  retryText: {
    alignSelf: 'center',
    color: R.colors.TEXT_MAIN,
    fontSize: 28,
    fontWeight: '400',
  },
  exitSetupText: {
    marginTop: 10,
    alignSelf: 'center',
    color: R.colors.TEXT_MAIN,
    fontSize: 14,
    fontWeight: '400',
  },
  retryContainer: {
    alignSelf: 'center',
  },
});

export default connect(
  null,
  { storeAndSetActiveUser },
)(JoinCode);
