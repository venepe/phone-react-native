import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import base64 from 'react-native-base64';
import { connect } from 'react-redux';
import { getPhoneNumber, getUserId } from '../../reducers';
import { init, getSignature } from '../../utilities/rsa';
import R from '../../resources';

class ShareCode extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isFetching: false,
      phoneNumber: props.phoneNumber,
      userId: props.userId,
      invitation: {},
    };
  }

  async componentDidMount() {
    const { phoneNumber, userId } = this.state;
    await init();
    let message = JSON.stringify({ phoneNumber, userId });
    const signature = await getSignature(message);
    const token = base64.encode(message) + '.' + base64.encode(signature);
    console.log(token);
  }

  render() {
    const { invitation: { code = '' } } = this.state;
    return (
      <View style={styles.root}>
        <Text style={styles.text}>{code}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
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
