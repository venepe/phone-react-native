import React, { Component, Fragment } from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { MaterialIcons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { getAccountById, postOwners } from '../../fetches';
import { storeAndSetActiveUser} from '../../actions';
import { showConfirmJoinAlert, showCongratulationsAlert } from '../../utilities/alert';
import { login } from '../../utilities/auth';
import PermissionStatus from '../../constants/PermissionStatus';
import { isUUID } from '../../utilities';
import analytics, { EVENTS } from '../../analytics';
import R from '../../resources';

class EnterCode extends Component {

  constructor(props) {
    super(props);
    this.handleBarCodeScanned = this.handleBarCodeScanned.bind(this);
    this.purchase = this.purchase.bind(this);
    this.cancel = this.cancel.bind(this);
    this.state = {
      isLoading: false,
      isGranted: false,
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

  async handleBarCodeScanned({ data: accountId }) {
    if (isUUID(accountId)) {
      this.setState({
        accountId,
        isLoading: true,
      });
      try {
        const { account: { owners, phoneNumber } }= await getAccountById({ accountId });
        showConfirmJoinAlert({ owners, phoneNumber }, () => this.purchase(), () => this.cancel());
      } catch (e) {
        this.setState({ isLoading: false });
        console.log(e);
      }
    }
  }

  async purchase() {
    const { accountId } = this.state;
    this.setState({ isLoading: true });
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
      this.setState({ isLoading: false });
      console.log(e);
    }
  }

  cancel() {
    this.setState({ isLoading: false });
  }

  render() {
    const { isGranted, isLoading } = this.state;
    if (!isGranted) {
      return (
        <View style={styles.root}>
        </View>
      )
    }
    if (isLoading) {
      return (
        <ImageBackground source={require('../../assets/couple-background.png')}
          resizeMode='cover' style={styles.root}>
          <ActivityIndicator style={styles.spinner} size='large' color={R.colors.TEXT_MAIN} />
        </ImageBackground>
      )
    }
    return (
      <View style={styles.root}>
        <BarCodeScanner
          barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
          onBarCodeScanned={this.state.isLoading ? undefined : this.handleBarCodeScanned}
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
  spinner: {
    flex: 1,
    alignSelf: 'center',
    height: 35,
  },
});

export default connect(
  null,
  { storeAndSetActiveUser },
)(EnterCode);
