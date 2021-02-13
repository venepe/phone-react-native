import React, { Component, Fragment } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { MaterialIcons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { postOwners} from '../../fetches';
import { storeAndSetActiveUser} from '../../actions';
import { getToken } from '../../reducers';
import { showConfirmJoinAlert, showCongratulationsAlert } from '../../utilities/alert';
import PermissionStatus from '../../constants/PermissionStatus';
import { isUUID } from '../../utilities';
import analytics, { EVENTS } from '../../analytics';
import R from '../../resources';

class EnterCode extends Component {

  constructor(props) {
    super(props);
    this.handleBarCodeScanned = this.handleBarCodeScanned.bind(this);
    this.purchase = this.purchase.bind(this);
    this.state = {
      token: props.token,
      isLoading: false,
      errorMessage: '',
      isGranted: false,
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

  async handleBarCodeScanned({ data: accountId }) {
    if (isUUID(accountId)) {
      this.setState({
        accountId,
      });
      showConfirmJoinAlert({ }, () => this.purchase());
    }
  }

  async purchase() {
    const { token, accountId } = this.state;
    try {
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
      this.props.navigation.navigate('Welcome', {
        screen: 'LandingTwo'
      });
      console.log(e);
    }
  }

  render() {
    const { isGranted, errorMessage } = this.state;
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
