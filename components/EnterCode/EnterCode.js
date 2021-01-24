import React, { Component, Fragment } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { MaterialIcons } from '@expo/vector-icons';
import { Base64 } from 'js-base64';
import { connect } from 'react-redux';
import SubscriptionModal from './SubscriptionModal';
import PermissionStatus from '../../constants/PermissionStatus';
import { storeAndSetPhoneNumber} from '../../actions';
import { getInvitation, postInvitationVerify, postOwn } from '../../fetches';
import { getToken } from '../../reducers';
import R from '../../resources';

class EnterCode extends Component {

  constructor(props) {
    super(props);
    console.log('go');
    this.handleBarCodeScanned = this.handleBarCodeScanned.bind(this);
    this.onAccept = this.onAccept.bind(this);
    this.state = {
      phoneNumber: '',
      isSubscriptionModalVisible: false,
      errorMessage: '',
      code: '',
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
  }

  componentDidUpdate(prevProps) {
    const props = this.props;
    if (props.token !== prevProps.token) {
      this.setState({
        token: props.token,
      });
    }
  }

  async handleBarCodeScanned({ data: code }) {
    this.setState({
      didScan: true,
    });
    try {
      const { token } = this.state;
      response = await postInvitationVerify({ token, code });
      const statusCode = response.status;
      const data = await response.json();
      if (response.status === 200) {
        let { verify } = data;
        if (verify && verify.isValid) {
          let [ base64Message, base64Signature ] = code.split('.');
          const message = Base64.decode(base64Message);
          const payload = JSON.parse(message);
          const { phoneNumber } = payload;
          console.log(payload);
          this.setState({
            code,
            phoneNumber,
            isSubscriptionModalVisible: true,
          });
        } else {
          this.setState({
            didScan: false,
            errorMessage: 'Invalid code.',
          });
        }
      } else {
        this.setState({
          didScan: false,
          errorMessage: 'Invalid code.',
        });
      }
    } catch (e) {
      console.log(e);
    }
  }

  async onAccept() {
    try {
      const { phoneNumber, token, code } = this.state;
      const response = await postOwn({ token, phoneNumber, code });
      const statusCode = response.status;
      const data = await response.json();
      if (response.status === 200) {
        this.props.storeAndSetPhoneNumber({ payload: { phoneNumber } });
      } else {
        this.setState({
          errorMessage: 'Failed up load. Try again.',
        });
      }
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    const { code, phoneNumber, isGranted, isValid, isSubscriptionModalVisible, errorMessage } = this.state;
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
