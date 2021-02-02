import React, { Component } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import moment from 'moment';
import { Base64 } from 'js-base64';
import { connect } from 'react-redux';
import { getPhoneNumber, getUserId } from '../../reducers';
import { init, getSignature } from '../../utilities/rsa';
import { initSocket } from '../../utilities/socket';
import R from '../../resources';
const SCREEN_WIDTH = Dimensions.get('window').width - 100;
const MINS_TO_EXPIRE = '15';

class ShareCode extends Component {

  constructor(props) {
    super(props);
    this.state = {
      phoneNumber: props.phoneNumber,
      userId: props.userId,
      invitation: '',
    };
  }

  async componentDidMount() {
    const { phoneNumber, userId } = this.state;
    const expires = moment.utc().add(MINS_TO_EXPIRE, 'minutes').toISOString();
    await init();
    initSocket({ phoneNumber });
    let message = JSON.stringify({ phoneNumber, userId, expires });
    const signature = await getSignature(message);
    const invitation = Base64.encode(message) + '.' + Base64.encode(signature);
    this.setState({
      invitation,
    });
  }

  render() {
    const { invitation } = this.state;

    return (
      <View style={styles.root}>
        {invitation.length > 0 ? <QRCode value={invitation} size={200}/> : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: R.colors.TEXT_MAIN,
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
