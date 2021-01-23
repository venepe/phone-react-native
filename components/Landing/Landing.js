import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { storeAndSetPhoneNumber} from '../../actions';
import { login } from '../../utilities/auth';
import { postUser, getAccounts } from '../../fetches';
import R from '../../resources';
import { AUTH0_DOMAIN, AUTH0_CLIENT_ID, AUTH0_AUDIENCE } from '../../config';

class Landing extends Component {

  constructor(props) {
    super(props);
    this.onLogin = this.onLogin.bind(this);
  }

  async onLogin() {
    try {
      const credentials = await login();
      const { accessToken: token } = credentials;
      console.log(token);
      await postUser({ token });
      const response = await getAccounts({ token });
      const statusCode = response.status;
      const data = await response.json();
      if (response.status === 200) {
        let { accounts } = data;
        if (accounts && accounts.length > 0) {
          const account = accounts[0];
          const { phoneNumber } = account;
          this.props.storeAndSetPhoneNumber({ payload: { phoneNumber } });
        } else {
          this.props.navigation.replace('LandingTwo');
        }
      } else {
        this.props.navigation.replace('LandingTwo');
      }
    } catch (e) {
      console.log(e);
    }
  }

  render() {

    return (
      <View style={styles.root}>
        <View style={styles.iconContainer}>
          <View style={styles.subContainer}>
            <Text style={styles.primaryText}>{R.strings.LABEL_APP_SLOGAN}</Text>
          </View>
        </View>
        <View style={{flex: 1, flexDirection: 'row', alignItems: 'flex-end'}}>
          <View style={styles.actionContainer}>
            <TouchableOpacity style={styles.loginButtonContainer} onPress={this.onLogin}>
              <Text style={styles.loginText}>{R.strings.LABEL_GETTING_STARTED}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#18ffff',
  },
  subContainer: {
    flex: 1,
    alignItems: 'center',
  },
  emojiText: {
    height: 120,
    fontSize: 92,
  },
  primaryText: {
    height: 32,
    fontSize: 24,
    color: '#424242',
    fontWeight: 'bold',
  },
  secondaryText: {
    height: 26,
    fontSize: 12,
    color: '#424242',
  },
  iconContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    fontWeight: 'bold',
  },
  actionContainer: {
    flex: 1,
  },
  loginButtonContainer: {
    flex: .25,
    flexDirection: 'row',
    backgroundColor: '#FFFF00',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginText: {
    height: 36,
    fontSize: 25,
    margin: 10,
    alignSelf: 'center',
    color: '#424242',
  },
});

export default connect(
  null,
  { storeAndSetPhoneNumber },
)(Landing);
