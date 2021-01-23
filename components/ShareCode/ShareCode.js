import React, { Component } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import base64 from 'react-native-base64';
import { connect } from 'react-redux';
import { getPhoneNumber, getUserId } from '../../reducers';
import { init, getSignature } from '../../utilities/rsa';
import R from '../../resources';
const SCREEN_WIDTH = Dimensions.get('window').width - 40;

class ShareCode extends Component {

  constructor(props) {
    super(props);
    this.state = {
      phoneNumber: props.phoneNumber,
      userId: props.userId,
      token: 'a',
    };
  }

  async componentDidMount() {
    const { phoneNumber, userId } = this.state;
    await init();
    let message = JSON.stringify({ phoneNumber, userId });
    const signature = await getSignature(message);
    const token = base64.encode(message) + '.' + base64.encode(signature);
    this.setState({
      token,
    });
  }

  render() {
    const { token = 'a' } = this.state;
    return (
      <View style={styles.root}>
        <QRCode
          value={token}
          size={SCREEN_WIDTH}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: R.colors.BACKGROUND_MAIN,
  },
  text: {
    color: R.colors.TEXT_MAIN,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

const mapStateToProps = state => ({
  phoneNumber: getPhoneNumber(state),
  userId: getUserId(state),
});

export default connect(
  mapStateToProps,
  { },
)(ShareCode);
