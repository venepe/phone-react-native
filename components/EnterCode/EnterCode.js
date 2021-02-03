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
import PermissionStatus from '../../constants/PermissionStatus';
import { storeAndSetActiveUser} from '../../actions';
import { getInvitation, postInvitationVerify, postOwners } from '../../fetches';
import { getToken } from '../../reducers';
import { showConfirmPurchaseAlert, showCongratulationsAlert } from '../../utilities/alert';
import analytics, { EVENTS } from '../../analytics';
import R from '../../resources';

class EnterCode extends Component {

  constructor(props) {
    super(props);
    this.handleBarCodeScanned = this.handleBarCodeScanned.bind(this);
    this.purchase = this.purchase.bind(this);
    this.state = {
      phoneNumber: '',
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
    analytics.track(EVENTS.VIEWED_SCANNER);
  }

  componentDidUpdate(prevProps) {
    const props = this.props;
    if (props.token !== prevProps.token) {
      this.setState({
        token: props.token,
      });
    }
  }

  async handleBarCodeScanned({ data: invitation }) {
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
        });
        showConfirmPurchaseAlert({ phoneNumber }, () => this.purchase());
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

  async purchase() {
    const { token, phoneNumber, invitation } = this.state;
    try {
      const data = await postOwners({ token, phoneNumber, invitation });
      let { owner } = data;
      if (owner) {
        this.props.storeAndSetActiveUser({ payload: { phoneNumber, isActive: true } });
        showCongratulationsAlert();
      }
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    const { invitation, phoneNumber, isGranted, errorMessage } = this.state;
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
  { storeAndSetActiveUser },
)(EnterCode);
