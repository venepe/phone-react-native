import React, { Component } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { List, Colors } from 'react-native-paper';
import { connect } from 'react-redux';
import { getAccountId } from '../../reducers';
import { getInvitationUrl } from '../../utilities';
import { copyText } from '../../utilities/copy';
import { openShare } from '../../utilities/share';
import analytics, { EVENTS } from '../../analytics';
import R from '../../resources';
const ICON_SIZE = 35;
const LARGE_ICON_SIZE = 60;

class ShareInvite extends Component {

  constructor(props) {
    super(props);
    this.copyLink = this.copyLink.bind(this);
    this.shareLink = this.shareLink.bind(this);
    this.shareQRCode = this.shareQRCode.bind(this);
    this.state = {
      accountId: props.accountId,
      invitationUrl: '',
    };
  }

  async componentDidMount() {
    const { accountId } = this.state;
    let invitationUrl = await getInvitationUrl(accountId);
    this.setState({ invitationUrl });
    analytics.track(EVENTS.VIEWED_SHARE);
  }

  async componentDidUpdate(prevProps) {
    const props = this.props;
    if (props.accountId !== prevProps.accountId) {
      const { accountId } = props;
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

  copyLink() {
    const { invitationUrl } = this.state;
    copyText(invitationUrl);
  }

  shareLink() {
    const { invitationUrl: url } = this.state;
    openShare({ url });
  }

  shareQRCode() {
    this.props.navigation.navigate('ShareQRCode');
  }

  render() {
    const { invitationUrl } = this.state;
    return (
      <View style={styles.root}>
          <View style={{flex: .1}}></View>
          <Text style={styles.titleText}>{R.strings.LABEL_INVITE}</Text>
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
});

export default connect(
  mapStateToProps,
  { },
)(ShareInvite);
