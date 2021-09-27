import React, { Component } from 'react';
import {
  AppState,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { List, Colors } from 'react-native-paper';
import { Base64 } from 'js-base64';
import { connect } from 'react-redux';
import { getAccounts } from '../../fetches';
import { storeAndSetActiveUser } from '../../actions';
import { getAccountId, getToken } from '../../reducers';
import { getInvitationUrl } from '../../utilities';
import { copyText } from '../../utilities/copy';
import { initializeNotifications } from '../../utilities/notification';
import { initSocket } from '../../utilities/socket';
import { openShare } from '../../utilities/share';
import analytics, { EVENTS } from '../../analytics';
import R from '../../resources';
const ICON_SIZE = 35;
const LARGE_ICON_SIZE = 60;

class ShareCode extends Component {

  constructor(props) {
    super(props);
    this.copyLink = this.copyLink.bind(this);
    this.shareLink = this.shareLink.bind(this);
    this.shareQRCode = this.shareQRCode.bind(this);
    this.getAndSetActiveUser = this.getAndSetActiveUser.bind(this);
    this.handleAppStateChange = this.handleAppStateChange.bind(this);
    this.state = {
      accountId: props.accountId,
      token: props.token,
      createdAt: props.createdAt,
      invitationUrl: '',
      appState: AppState.currentState
    };
  }

  async componentDidMount() {
    const { accountId } = this.state;
    if (accountId && accountId.length > 0) {
      let invitationUrl = await getInvitationUrl(accountId);
      this.setState({ invitationUrl });
    }
    initSocket({ accountId });
    initializeNotifications();
    this.getAndSetActiveUser();
    AppState.addEventListener('change', this.handleAppStateChange);
    analytics.track(EVENTS.VIEWED_SHARE);
  }

  async componentDidUpdate(prevProps) {
    const props = this.props;
    if (props.accountId !== prevProps.accountId) {
      const { accountId } = props;
      initSocket({ accountId });
      let invitationUrl = await getInvitationUrl(accountId);
      this.setState({
        accountId,
        invitationUrl,
      });
    }
    if (props.token !== prevProps.token) {
      this.setState({
        token: props.token,
      });
    }
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange(nextAppState) {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      this.getAndSetActiveUser();
    }
    this.setState({ appState: nextAppState });
  }

  copyLink() {
    const { invitationUrl } = this.state;
    copyText(invitationUrl);
  }

  shareLink() {
    const { invitationUrl: url } = this.state;
    openShare({ url });
  }

  shareQRCode() {
    this.props.navigation.navigate('QRCode', {
      screen: 'ShareQRCode'
    });
  }

  async getAndSetActiveUser() {
    try {
      const { token } = this.state;
      const data = await getAccounts({ token }) || {};
      let { accounts } = data;
      if (accounts && accounts.length > 0) {
        const account = accounts[0];
        const { phoneNumber, isActive, id: accountId, createdAt } = account;
        this.setState({ createdAt });
        this.props.storeAndSetActiveUser({ payload: { phoneNumber, isActive, accountId } });
      }
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    const { invitationUrl, createdAt } = this.state;
    return (
      <View style={styles.root}>
          <View style={{flex: .1}}></View>
          <Text style={styles.titleText}>{R.strings.LABEL_ACTIVATE}</Text>
          <TouchableOpacity style={styles.rowContainer} onPress={this.shareLink}>
            <MaterialIcons style={styles.leftIcon} name="link" size={LARGE_ICON_SIZE} color={R.colors.TEXT_MAIN} />
            <Text style={styles.titleText}>{invitationUrl}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rowContainer} onPress={this.copyLink}>
            <MaterialIcons style={styles.leftIcon} name="content-copy" size={ICON_SIZE} color={R.colors.TEXT_MAIN} />
            <Text style={styles.titleText}>{R.strings.LABEL_COPY_LINK}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rowContainer} onPress={this.shareLink}>
            <MaterialCommunityIcons style={styles.leftIcon} name="share" size={ICON_SIZE} color={R.colors.TEXT_MAIN} />
            <Text style={styles.titleText}>{R.strings.LABEL_SHARE_LINK}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rowContainer} onPress={this.shareQRCode}>
            <MaterialIcons style={styles.leftIcon} name="qr-code" size={ICON_SIZE} color={R.colors.TEXT_MAIN} />
            <Text style={styles.titleText}>{R.strings.LABEL_QR_CODE}</Text>
          </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 20,
    backgroundColor: R.colors.BACKGROUND_MAIN,
  },
  text: {
    color: R.colors.TEXT_MAIN,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    paddingTop: 15,
    paddingBottom: 15,
    marginRight: 40,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: R.colors.GREY_BACKGROUND,
  },
  leftIcon: {
    marginRight: 15,
  },
  titleText: {
    color: R.colors.TEXT_MAIN,
    fontSize: 18,
    fontWeight: '600',
    flexWrap:'wrap',
  },
});

const mapStateToProps = state => ({
  accountId: getAccountId(state),
  token: getToken(state),
});

export default connect(
  mapStateToProps,
  { storeAndSetActiveUser },
)(ShareCode);
