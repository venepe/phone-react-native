import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import Loading from './Loading';
import { storeAndSetActiveUser } from '../../actions';
import { login } from '../../utilities/auth';
import { postUser, getAccounts } from '../../fetches';
import R from '../../resources';

class Landing extends Component {

  constructor(props) {
    super(props);
    this.onLogin = this.onLogin.bind(this);
    this.state = {
      isLoading: false,
      didLogin: false,
    };
  }

  async onLogin() {
    this.setState({ isLoading: true });
    try {
      const credentials = await login();
      this.setState({ didLogin: true });
      const { accessToken: token } = credentials;
      await postUser({ token });
      const data = await getAccounts({ token });
      let { accounts } = data;
      if (accounts && accounts.length > 0) {
        const account = accounts[0];
        const { phoneNumber, isActive } = account;
        this.props.storeAndSetActiveUser({ payload: { phoneNumber, isActive } });
      } else {
        this.props.navigation.replace('LandingTwo');
      }
    } catch (e) {
      this.setState({ isLoading: false, didLogin: false });
      console.log(e);
    }
  }

  render() {
    const { isLoading, didLogin } = this.state;
    if (didLogin) {
      return (<Loading/>);
    }
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.topContainer}>
          <View style={styles.imageContainer}>
            <Image
              style={[styles.image, { alignSelf: 'flex-end' }]}
              source={require('../../assets/couple_two.png')}
            />
          </View>
          <Text style={styles.primaryText}>{R.strings.LABEL_APP_SLOGAN}</Text>
          <View style={styles.imageContainer}>
            <Image
              style={[styles.image, { alignSelf: 'flex-start' }]}
              source={require('../../assets/couple_one.png')}
            />
          </View>
        </View>
        <View>
          <View style={styles.actionContainer}>
            <TouchableOpacity style={styles.loginButtonContainer} disabled={isLoading} onPress={this.onLogin} isd>
              {
                isLoading ? (
                  <ActivityIndicator style={styles.spinner} size='large' color={R.colors.BACKGROUND_MAIN} />
                ) : (
                  <Text style={styles.loginText}>{R.strings.LABEL_GETTING_STARTED}</Text>
                )
              }
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#40C4FF',
  },
  topContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    fontWeight: 'bold',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  image: {
    height: 200,
    margin: 20,
  },
  primaryText: {
    fontSize: 24,
    color: R.colors.TEXT_DARK,
    fontWeight: 'bold',
    flexWrap:'wrap',
    alignSelf: 'center',
  },
  actionContainer: {
    height: 100,
  },
  loginButtonContainer: {
    height: 100,
    backgroundColor: '#FFF59D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginText: {
    height: 36,
    fontSize: 25,
    margin: 10,
    alignSelf: 'center',
    color: R.colors.TEXT_DARK,
  },
  spinner: {
    height: 35,
  },
});

export default connect(
  null,
  { storeAndSetActiveUser },
)(Landing);
