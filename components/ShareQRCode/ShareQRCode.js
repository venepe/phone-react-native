import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Base64 } from 'js-base64';
import { connect } from 'react-redux';
import { getAccountId } from '../../reducers';
import { initSocket } from '../../utilities/socket';
import analytics, { EVENTS } from '../../analytics';
import R from '../../resources';

class ShareCode extends Component {

  constructor(props) {
    super(props);
    this.state = {
      accountId: props.accountId,
    };
  }

  async componentDidMount() {
    const { accountId } = this.state;
    initSocket({ accountId });
    analytics.track(EVENTS.VIEWED_INVITATION);
  }

  render() {
    const { accountId } = this.state;
    return (
      <View style={styles.root}>
        <View style={styles.container}>
          <QRCode value={accountId} size={200}/>
          <Text style={styles.text}>{R.strings.LABEL_QR_CODE_SCAN}</Text>
        </View>
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
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
  },
  text: {
    color: R.colors.TEXT_DARK,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    flexWrap: 'wrap',
  },
});

const mapStateToProps = state => ({
  accountId: getAccountId(state),
});

export default connect(
  mapStateToProps,
  { },
)(ShareCode);
