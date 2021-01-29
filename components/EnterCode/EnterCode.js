import React, { Component, Fragment } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { MaterialIcons } from '@expo/vector-icons';
import { Base64 } from 'js-base64';
import { connect } from 'react-redux';
import RNIap, { initConnection, requestSubscription, purchaseUpdatedListener, purchaseErrorListener, getSubscriptions } from 'react-native-iap';
import SubscriptionModal from '../SubscriptionModal';
import PermissionStatus from '../../constants/PermissionStatus';
import { storeAndSetPhoneNumber} from '../../actions';
import { getInvitation, postInvitationVerify, postOwners } from '../../fetches';
import { getToken } from '../../reducers';
import R from '../../resources';

class EnterCode extends Component {

  constructor(props) {
    super(props);
    this.purchaseUpdateSubscription = {};
    this.purchaseErrorSubscription = {};
    this.handleBarCodeScanned = this.handleBarCodeScanned.bind(this);
    this.onAccept = this.onAccept.bind(this);
    this.state = {
      phoneNumber: '',
      isSubscriptionModalVisible: false,
      errorMessage: '',
      invitation: '',
      isGranted: false,
      token: props.token,
      didScan: false,
    };
  }

  async componentDidMount() {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    if (status === PermissionStatus.GRANTED) {
      this.setState({
        isGranted: true,
      });
    }
    await initConnection();
    this.purchaseUpdateSubscription = purchaseUpdatedListener(async (purchase) => {
      const { productId, transactionId, transactionReceipt } = purchase;
      const { phoneNumber, token, invitation } = this.state;
      if (transactionReceipt) {
        const platform = Platform.OS;
        const response = await postOwners({ token, phoneNumber, invitation, receipt: { productId, transactionId, transactionReceipt, platform } });
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
  }

  componentDidUpdate(prevProps) {
    const props = this.props;
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

  async handleBarCodeScanned({ data: invitation }) {
    console.log(invitation);
    this.setState({
      didScan: true,
    });
    try {
      const { token } = this.state;
      let data = await postInvitationVerify({ token, invitation });
      let { verify } = data;
      if (verify && verify.isValid) {
        let [ base64Message, base64Signature ] = invitation.split('.');
        const message = Base64.decode(base64Message);
        const payload = JSON.parse(message);
        const { phoneNumber } = payload;
        console.log(payload);
        this.setState({
          invitation,
          phoneNumber,
          isSubscriptionModalVisible: true,
        });
      } else {
        this.setState({
          didScan: false,
          errorMessage: 'Invalid code.',
        });
      }
    } catch (e) {
      console.log(e);
      this.setState({
        didScan: false,
      });
    }
  }

  async onAccept() {
    try {
      const subscriptions = await getSubscriptions(['1MONTH']);
      console.log(subscriptions);
      requestSubscription('1MONTH');
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    const { invitation, phoneNumber, isGranted, isSubscriptionModalVisible, errorMessage } = this.state;
    if (!isGranted) {
      return (
        <View style={styles.root}>
        </View>
      )
    }
    return (
      <View style={styles.root}>
        <BarCodeScanner
          barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
          onBarCodeScanned={this.state.didScan ? undefined : this.handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        >
          <View style={styles.container}>
            <View style={styles.box}>
              <MaterialIcons name='crop-free' size={300} color={R.colors.TEXT_MAIN} />
            </View>
          </View>
        </BarCodeScanner>
        <SubscriptionModal phoneNumber={phoneNumber} isVisible={isSubscriptionModalVisible} onAccept={this.onAccept} handleClose={() => this.setState({ didScan: false, isSubscriptionModalVisible: false })}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: R.colors.BACKGROUND_MAIN,
    justifyContent: 'flex-start',
  },
  errorText: {
    fontSize: 18,
    color: R.colors.TEXT_MAIN,
    margin: 10,
  },
  container: {
    flex: 1,
  },
  box: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const mapStateToProps = state => ({
  token: getToken(state),
});

export default connect(
  mapStateToProps,
  { storeAndSetPhoneNumber },
)(EnterCode);
