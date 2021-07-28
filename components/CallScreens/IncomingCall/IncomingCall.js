import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { acceptCall, rejectCall } from '../../../actions';
import { getActivePhoneNumber, getCallState } from '../../../reducers';
import { getReadableNumber } from '../../../utilities/phone';
import R from '../../../resources';

class IncomingCall extends Component {

  constructor(props) {
    super(props);
    this.onPressHangup = this.onPressHangup.bind(this);
    this.onPressPickup = this.onPressPickup.bind(this);
    this.state = {
      activePhoneNumber: props.activePhoneNumber,
      activePhoneNumberFormatted: props.activePhoneNumber,
      callState: props.callState,
    };
  }

  async componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('beforeRemove', (e) => {
      e.preventDefault();
    });
    let { activePhoneNumber } = this.state;
    let activePhoneNumberFormatted = await getReadableNumber(activePhoneNumber);
    this.setState({
      activePhoneNumber,
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

  onPressPickup() {
    this.props.acceptCall();
    this.props.navigation.replace('ActiveCall');
  }

  onPressHangup() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    this.props.rejectCall();
    if (this.props.navigation.canGoBack()) {
      this.props.navigation.goBack();
    } else {
      this.props.navigation.navigate('ANumberForUs', {
        screen: 'Home',
        params: { },
      });
    }
  }

  render() {
    const { activePhoneNumber, activePhoneNumberFormatted } = this.state;
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
          <TouchableOpacity style={styles.hangup} onPress={() => this.onPressHangup()}>
            <MaterialCommunityIcons name='phone-hangup' size={40} color={R.colors.TEXT_MAIN} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.pickup} onPress={() => this.onPressPickup()}>
            <MaterialCommunityIcons name='phone' size={40} color={R.colors.TEXT_MAIN} />
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
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
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
  hangup: {
    backgroundColor: R.colors.NO,
    padding: 20,
    borderRadius: 100,
    margin: 20,
  },
  pickup: {
    backgroundColor: R.colors.YES,
    padding: 20,
    borderRadius: 100,
    margin: 20,
  },
});

const mapStateToProps = state => ({
  activePhoneNumber: getActivePhoneNumber(state),
});

export default connect(
  mapStateToProps,
  { acceptCall, rejectCall },
)(IncomingCall);
