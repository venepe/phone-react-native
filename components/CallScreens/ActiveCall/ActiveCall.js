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
import { disconnectCall } from '../../../actions';
import { getActivePhoneNumber } from '../../../reducers';
import R from '../../../resources';

class ActiveCall extends Component {

  constructor(props) {
    super(props);
    this.onPressHangup = this.onPressHangup.bind(this);
    this.onPressMute = this.onPressMute.bind(this);
    this.state = {
      activePhoneNumber: props.activePhoneNumber,
      isMuted: false,
    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('beforeRemove', (e) => {
      e.preventDefault();
    });
  }

  componentDidUpdate(prevProps) {
    const props = this.props;
    if (props.activePhoneNumber !== prevProps.activePhoneNumber) {
      this.setState({
        activePhoneNumber: props.activePhoneNumber,
      });
    }
  }

  onPressMute() {
    let { isMuted } = this.state;
    isMuted = !isMuted;
    this.setState({
      isMuted,
    });
  }

  onPressHangup() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    this.props.disconnectCall();
    this.props.navigation.goBack();
  }

  render() {
    const { activePhoneNumber, isMuted } = this.state;
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
          <View style={styles.textContainer}>
            <Text style={styles.primaryText}>{activePhoneNumber}</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.secondaryText}>{'Connected'}</Text>
          </View>
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
});

export default connect(
  mapStateToProps,
  { disconnectCall },
)(ActiveCall);
