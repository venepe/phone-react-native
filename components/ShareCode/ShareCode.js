import React, { Component } from 'react';
import {
  AppState,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import moment from 'moment';
import { Base64 } from 'js-base64';
import { connect } from 'react-redux';
import { getPhoneNumber, getUserId } from '../../reducers';
import { init, getSignature } from '../../utilities/rsa';
import { initSocket } from '../../utilities/socket';
import { openShare } from '../../utilities/share';
import analytics, { EVENTS } from '../../analytics';
import R from '../../resources';
const SCREEN_WIDTH = Dimensions.get('window').width - 100;
const DAYS_TO_EXPIRE = 1;

class ShareCode extends Component {

  constructor(props) {
    super(props);
    this.handleAppStateChange = this.handleAppStateChange.bind(this);
    this.generateInvitationQRCode = this.generateInvitationQRCode.bind(this);
    this.renderInvitation = this.renderInvitation.bind(this);
    this.shareCode = this.shareCode.bind(this);
    this.state = {
      phoneNumber: props.phoneNumber,
      userId: props.userId,
      invitation: '',
      appState: AppState.currentState
    };
  }

  async componentDidMount() {
    const { phoneNumber } = this.state;
    AppState.addEventListener('change', this.handleAppStateChange);
    await init();
    initSocket({ phoneNumber });
    await this.generateInvitationQRCode();
    analytics.track(EVENTS.VIEWED_INVITATION);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange(nextAppState) {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      this.generateInvitationQRCode();
    }
    this.setState({ appState: nextAppState });
  }

  async generateInvitationQRCode() {
    const { phoneNumber, userId } = this.state;
    const expires = moment.utc().add(DAYS_TO_EXPIRE, 'days').toISOString();
    let message = JSON.stringify({ phoneNumber, userId, expires });
    const signature = await getSignature(message);
    const invitation = Base64.encode(message) + '.' + Base64.encode(signature);
    this.setState({
      invitation,
    });
  }

  async shareCode() {
    const { invitation: code } = this.state;
    const invitationId = 'asdf';
    openShare({ invitationId });
  }

  renderInvitation() {
    const { invitation } = this.state;
    if (invitation.length > 0) {
      return (
        <View style={styles.container}>
          <QRCode value={invitation} size={200}/>
          <Text style={styles.text}>{R.strings.LABEL_ACTIVATE}</Text>
          <TouchableOpacity onPress={this.shareCode}>
            <Text style={styles.logoutText}>{R.strings.TITLE_LOGOUT}</Text>
          </TouchableOpacity>
        </View>
      );
    }
  }

  render() {
    return (
      <View style={styles.root}>
        {this.renderInvitation()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: R.colors.TEXT_DARK,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
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
