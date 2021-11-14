import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { Video } from 'expo-av';
import Loading from './Loading';
import { showNoAccountAlert, showAlreadyHaveAccountAlert } from '../../utilities/alert';
import { clearSession, login } from '../../utilities/auth';
import { getAccounts } from '../../fetches';
import { storeAndSetActiveUser } from '../../actions';
import { getToken } from '../../reducers';
import analytics, { EVENTS } from '../../analytics';
import R from '../../resources';
const SCREEN_HEIGHT = Dimensions.get('window').height;
const MARGIN_WIDTH = 5;

class Landing extends Component {

  constructor(props) {
    super(props);

    this.onJoinLine = this.onJoinLine.bind(this);
    this.onCreateLine = this.onCreateLine.bind(this);
    this.onLogin = this.onLogin.bind(this);
    this.onLogout = this.onLogout.bind(this);
    this.getDidLogin = this.getDidLogin.bind(this);
    const didLogin = this.getDidLogin(props.token);
    this.state = {
      didLogin,
      isLoading: false,
    };
  }

  getDidLogin(token) {
    return (token && token.length > 0) ? true : false;
  }

  componentDidMount() {
    analytics.track(EVENTS.VIEWED_LANDING);
  }

  componentDidUpdate(prevProps) {
    const props = this.props;
    if (props.token !== prevProps.token) {
      const didLogin = this.getDidLogin(props.token);
      this.setState({
        didLogin,
      });
    }
  }

  async onLogin() {
    this.setState({ isLoading: true });
    try {
      const credentials = await login();
      const { accessToken: token } = credentials;
      const data = await getAccounts({ token }) || {};
      let { accounts } = data;
      if (accounts && accounts.length > 0) {
        const account = accounts[0];
        const { phoneNumber, isActive, id: accountId } = account;
        this.props.storeAndSetActiveUser({ payload: { phoneNumber, isActive, accountId } });
      } else {
        this.setState({ isLoading: false, didLogin: false });
        showNoAccountAlert();
      }
    } catch (e) {
      this.setState({ isLoading: false, didLogin: false });
      console.log(e);
    }
  }

  onJoinLine() {
    this.props.navigation.navigate('EnterCode');
  }

  async onCreateLine() {
    this.setState({ isLoading: true });
    try {
      const credentials = await login();
      const { accessToken: token } = credentials;
      const data = await getAccounts({ token }) || {};
      let { accounts } = data;
      if (!accounts || accounts.length < 1) {
        this.setState({ isLoading: false });
        this.props.navigation.navigate('CreateAccount', {
          screen: 'CreateName',
          params: { },
        });
      } else {
        this.setState({ isLoading: false, didLogin: false });
        showAlreadyHaveAccountAlert();
      }
    } catch (e) {
      this.setState({ isLoading: false, didLogin: false });
      console.log(e);
    }
  }

  async onLogout() {
    await clearSession();
    this.props.navigation.navigate('Landing');
  }

  render() {
    const { isLoading, didLogin } = this.state;
    if (isLoading && didLogin) {
      return (<Loading/>);
    }
    return (
      <SafeAreaView style={styles.root}>
        <Video
          source={require('../../assets/couple-background.mp4')}
          useNativeControlsA={false}
          resizeMode='cover'
          shouldPlay={true}
          style={styles.backgroundVideo}
          isMuted={true}
          isLooping={true}
          rate={1.0}
          ignoreSilentSwitch={'obey'}
        />
        <View style={styles.topContainer}>
          <Text style={styles.primaryText}>{R.strings.APP_NAME}</Text>
        </View>
        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.loginButtonContainer} onPress={this.onCreateLine}>
            <Text style={styles.loginText}>{R.strings.TITLE_CREATE_ACCOUNT}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.loginButtonContainer, { marginTop: MARGIN_WIDTH }]} onPress={this.onJoinLine}>
            <Text style={styles.loginText}>{R.strings.LABEL_JOIN_LINE}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.loginButtonContainer} onPress={this.onLogin}>
            <Text style={styles.loginText}>{R.strings.LABEL_HAVE_LINE}</Text>
          </TouchableOpacity>
          {(didLogin) ? (<TouchableOpacity onPress={this.onLogout}><Text style={styles.logoutText}>{R.strings.TITLE_LOGOUT}</Text></TouchableOpacity>) : null}
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: R.colors.BACKGROUND_MAIN,
  },
  backgroundVideo: {
    height: SCREEN_HEIGHT,
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'stretch',
    bottom: 0,
    right: 0,
  },
  topContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  primaryText: {
    fontSize: 36,
    color: R.colors.TEXT_MAIN,
    fontWeight: 'bold',
    flexWrap:'wrap',
    alignSelf: 'center',
  },
  actionContainer: {
    backgroundColor: R.colors.TRANSPARENT,
  },
  loginButtonContainer: {
    flexDirection: 'row',
    backgroundColor: R.colors.GREY_BACKGROUND,
    padding: 10,
    marginBottom: MARGIN_WIDTH,
    marginLeft: MARGIN_WIDTH,
    marginRight: MARGIN_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginText: {
    fontSize: 25,
    fontWeight: 'bold',
    margin: 10,
    alignSelf: 'center',
    color: R.colors.TEXT_MAIN,
  },
  logoutText: {
    fontSize: 14,
    margin: 5,
    alignSelf: 'center',
    color: R.colors.LOGO,
  },
});

const mapStateToProps = state => ({
  token: getToken(state),
});

export default connect(
  mapStateToProps,
  { storeAndSetActiveUser },
)(Landing);
