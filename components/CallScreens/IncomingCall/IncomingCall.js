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
import { getActivePhoneNumber } from '../../../reducers';
import R from '../../../resources';

class IncomingCall extends Component {

  constructor(props) {
    super(props);
    this.onPressHangup = this.onPressHangup.bind(this);
    this.onPressPickup = this.onPressPickup.bind(this);
    this.state = {
      activePhoneNumber: props.activePhoneNumber,
    };
  }

  onPressPickup() {

  }

  onPressHangup() {

  }

  render() {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.row}>
          <View style={styles.textContainer}>
            <Text style={styles.primaryText}>{'targetNumber'}</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.secondaryText}>{'Connected'}</Text>
          </View>
        </View>
        <View style={styles.bottomRow}>
          <TouchableOpacity style={styles.pickup} onPress={() => this.onPressPickup()}>
            <MaterialCommunityIcons name='phone' size={40} color={R.colors.TEXT_MAIN} />
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
  { },
)(IncomingCall);
