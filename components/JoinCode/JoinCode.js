import React, { Component } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import Video from 'react-native-video';
import JoinModal from '../JoinModal';
import { getAccountById, postOwners } from '../../fetches';
import { storeAndSetActiveUser } from '../../actions';
import { showCongratulationsAlert } from '../../utilities/alert';
import { login } from '../../utilities/auth';
import analytics, { EVENTS } from '../../analytics';
import R from '../../resources';
const SCREEN_HEIGHT = Dimensions.get('window').height;

class JoinCode extends Component {

  constructor(props) {
    super(props);
    const { invitation: accountId } = props.route.params || {};
    this.purchase = this.purchase.bind(this);
    this.closeJoinModal = this.closeJoinModal.bind(this);
    this.join = this.join.bind(this);
    this.exitSetup = this.exitSetup.bind(this);
    this.state = {
      accountId,
      isLoading: false,
      isJoinModalVisible: false,
      owners: [],
    };
  }

  async join() {
    const { accountId } = this.state;
    this.setState({ isLoading: true });
    try {
      // const { account: { owners, phoneNumber } }= await getAccountById({ accountId });
      let owners = [{
        name: 'Jolyne Chang',
      }];
      let phoneNumber = '+18155439618';
      this.setState({ owners, phoneNumber, isJoinModalVisible: true, isLoading: false });
    } catch (e) {
      this.setState({ isLoading: false, didLogin: false });
      console.log(e);
    }
  }

  exitSetup() {
    this.props.navigation.navigate('Welcome', {
      screen: 'LandingTwo'
    });
  }

  componentDidMount() {
    this.join();
    analytics.track(EVENTS.VIEWED_JOIN_CODE);
  }

  async purchase() {
    const { accountId } = this.state;
    this.setState({ isLoading: true });
    try {
      const { accessToken: token } = await login();
      const data = await postOwners({ token, accountId });
      let { owner } = data;
      if (owner) {
        const { phoneNumber } = owner;
        this.props.storeAndSetActiveUser({ payload: { accountId, phoneNumber, isActive: true } });
        showCongratulationsAlert();
      }
      this.setState({ isLoading: false });
    } catch (e) {
      console.log(e);
      this.setState({ isLoading: false });
    }
  }

  closeJoinModal() {
    this.setState({
      isLoading: false,
      isJoinModalVisible: false,
    });
  }

  render() {
    const { isLoading, isJoinModalVisible, phoneNumber, owners } = this.state;
    return (
      <SafeAreaView style={styles.root}>
        <Video
          source={require('../../assets/couple-running-background.mp4')}
          shouldPlay={true}
          resizeMode={'cover'}
          style={styles.backgroundVideo}
          isMuted={true}
          repeat={true}
          rate={1.0}
          ignoreSilentSwitch={'obey'}
        />
        <View style={styles.container}>
          {(isLoading) ?
            (<ActivityIndicator style={styles.spinner}
              size='large' color={R.colors.BACKGROUND_MAIN} />) :
              isJoinModalVisible ? (<View/>) :
              (
                <View style={styles.retryContainer}>
                  <TouchableOpacity onPress={this.join}>
                    <Text style={styles.retryText}>{R.strings.LABEL_RETRY}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={this.exitSetup}>
                    <Text style={styles.exitSetupText}>{R.strings.LABEL_EXIT_SETUP}</Text>
                  </TouchableOpacity>
                </View>
              )
            }
        </View>
        <JoinModal phoneNumber={phoneNumber} owners={owners}
          isVisible={isJoinModalVisible} onAccept={this.purchase} handleClose={this.closeJoinModal}/>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
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
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  spinner: {
    height: 35,
  },
  retryText: {
    alignSelf: 'center',
    color: R.colors.TEXT_MAIN,
    fontSize: 28,
    fontWeight: '400',
  },
  exitSetupText: {
    marginTop: 10,
    alignSelf: 'center',
    color: R.colors.TEXT_MAIN,
    fontSize: 14,
    fontWeight: '400',
  },
  retryContainer: {
    alignSelf: 'center',
  },
});

export default connect(
  null,
  { storeAndSetActiveUser },
)(JoinCode);
