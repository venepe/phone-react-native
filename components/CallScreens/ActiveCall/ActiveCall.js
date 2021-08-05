import React, { Component } from 'react';
import {
  AppState,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import TwilioVoice from 'react-native-twilio-programmable-voice';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { disconnectCall, displayCallStatus } from '../../../actions';
import { getActivePhoneNumber, getCallState } from '../../../reducers';
import { getReadableNumber } from '../../../utilities/phone';
import R from '../../../resources';

class ActiveCall extends Component {

  constructor(props) {
    super(props);
    this.handleAppStateChange = this.handleAppStateChange.bind(this);
    this.onPressHangup = this.onPressHangup.bind(this);
    this.onPressMute = this.onPressMute.bind(this);
    this.state = {
      activePhoneNumber: props.activePhoneNumber,
      activePhoneNumberFormatted: props.activePhoneNumber,
      callState: props.callState,
      isMuted: false,
      appState: AppState.currentState
    };
  }

  async componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
    this.unsubscribe = this.props.navigation.addListener('beforeRemove', (e) => {
      e.preventDefault();
    });
    let { activePhoneNumber } = this.state;
    let activePhoneNumberFormatted = await getReadableNumber(activePhoneNumber);
    this.setState({
      activePhoneNumberFormatted,
    });
  }

  async componentDidUpdate(prevProps) {
    const props = this.props;
    if (props.activePhoneNumber !== prevProps.activePhoneNumber) {
      let { activePhoneNumber } = props;
      let activePhoneNumberFormatted = await getReadableNumber(activePhoneNumber);
      this.setState({
        activePhoneNumber,
        activePhoneNumberFormatted,
      });
    }
    if (props.callState !== prevProps.callState) {
      this.setState({
        callState: props.callState,
      });
    }
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  onPressMute() {
    let { isMuted } = this.state;
    isMuted = !isMuted;
    TwilioVoice.setMuted(isMuted)
    this.setState({
      isMuted,
    });
  }

  handleAppStateChange(nextAppState) {
    const { appState, activePhoneNumber  } = this.state;
    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      if (!activePhoneNumber || activePhoneNumber.length < 1) {
        this.onPressHangup();
      }
    }
    this.setState({ appState: nextAppState });
  }


  onPressHangup() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    this.props.disconnectCall();
    const stack = this.props.navigation.dangerouslyGetState();
    const { routes } = stack;
    if (routes.length === 1) {
      this.props.navigation.goBack();
    } else {
      this.props.navigation.navigate('Home');
    }
    this.props.displayCallStatus();
  }

  render() {
    const { isMuted, activePhoneNumberFormatted, activePhoneNumber } = this.state;
    let micStyles = {
      backgroundColor: 'transparent',
      iconColor: R.colors.TEXT_MAIN,
    };
    if (isMuted) {
      micStyles = {
        backgroundColor: R.colors.TEXT_MAIN,
        iconColor: R.colors.BACKGROUND_MAIN,
      }
    }
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.row}>
          {
            (() => {
              if (activePhoneNumber && activePhoneNumber.length > 0) {
                return (
                  <View style={styles.row}>
                    <View style={styles.textContainer}>
                      <Text style={styles.primaryText}>{activePhoneNumberFormatted}</Text>
                    </View>
                    <View style={styles.textContainer}>
                      <Text style={styles.secondaryText}>{'Connected'}</Text>
                    </View>
                  </View>
                )
              }
            })()
          }
          <View style={styles.person}>
            <MaterialIcons name='person' size={100} color={R.colors.TEXT_MAIN} />
          </View>
        </View>
        <View style={styles.bottomRow}>
          <TouchableOpacity style={[styles.mic, { backgroundColor: micStyles.backgroundColor }]} onPress={() => this.onPressMute()}>
            <MaterialIcons name='mic-off' size={40} color={micStyles.iconColor} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.hangup} onPress={() => this.onPressHangup()}>
            <MaterialCommunityIcons name='phone-hangup' size={40} color={R.colors.TEXT_MAIN} />
          </TouchableOpacity>
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
  row: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomRow: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  textContainer: {

  },
  primaryText: {
    fontSize: 28,
    color: R.colors.TEXT_MAIN,
  },
  secondaryText: {
    fontSize: 18,
    color: R.colors.TEXT_MAIN,
  },
  person: {
    backgroundColor: R.colors.GREY_BACKGROUND,
    padding: 20,
    borderRadius: 100,
    margin: 20,
  },
  mic: {
    borderRadius: 100,
    padding: 15,
    margin: 10,
    backgroundColor: R.colors.TEXT_MAIN,
  },
  hangup: {
    backgroundColor: R.colors.NO,
    padding: 20,
    borderRadius: 100,
    margin: 20,
  },
});

const mapStateToProps = state => ({
  activePhoneNumber: getActivePhoneNumber(state),
  callState: getCallState(state),
});

export default connect(
  mapStateToProps,
  { disconnectCall, displayCallStatus },
)(ActiveCall);
