import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { AsYouType } from 'libphonenumber-js';
import { connect } from 'react-redux';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { connectCall } from '../../actions';
import R from '../../resources';

class DialPad extends Component {

  constructor(props) {
    super(props);
    let { targetNumber } = props.route.params || {};
    targetNumber = targetNumber ? targetNumber : '';
    this.onCreateCall = this.onCreateCall.bind(this);
    this.onPressBackspace = this.onPressBackspace.bind(this);
    this.onPressContact = this.onPressContact.bind(this);
    this.onPressNumber = this.onPressNumber.bind(this);
    this.state = {
      targetNumber,
    };
  }

  componentDidUpdate(prevProps) {
    const props = this.props;
    if (props.route.params && props.route.params.targetNumber) {
      if (!prevProps.route.params || props.route.params.targetNumber !== prevProps.route.params.targetNumber) {
        let { targetNumber } = props.route.params;
        targetNumber = new AsYouType('US').input(targetNumber);
        this.setState({
          targetNumber,
        });
      }
    }
  }

  onPressNumber(number) {
    let { targetNumber } =  this.state;
    targetNumber = `${targetNumber}${number}`;
    targetNumber = new AsYouType('US').input(targetNumber);
    this.setState({
      targetNumber,
    });
  }

  onPressBackspace() {
    let { targetNumber: previousTargetNumber } = this.state;
    let targetNumber = previousTargetNumber.substring(0, previousTargetNumber.length - 1);
    targetNumber = new AsYouType('US').input(targetNumber);
    if (targetNumber === previousTargetNumber) {
      targetNumber = targetNumber.substring(0, targetNumber.length - 2);
      targetNumber = new AsYouType('US').input(targetNumber);
    }
    this.setState({
      targetNumber,
    });
  }

  onPressContact() {
    this.props.navigation.navigate('CreateCall');
  }

  onCreateCall() {
    const { targetNumber } = this.state;
    this.props.connectCall(targetNumber);
    this.props.navigation.navigate('CallStates', {
      screen: 'ActiveCall',
      params: { },
    });
  }

  render() {
    const { targetNumber } = this.state;
    let isBackspaceDisabled = targetNumber.length > 0 ? false : true;
    let backspaceColor = isBackspaceDisabled ? R.colors.DISABLED_MAIN : R.colors.TEXT_MAIN;
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.headerRow}>
          <View style={styles.phoneNumberTextContainer}>
            <Text style={styles.phoneNumberText}>{targetNumber}</Text>
          </View>
          <TouchableOpacity disabled={isBackspaceDisabled} style={styles.backspaceButton} onPress={() => this.onPressBackspace()}>
            <MaterialIcons name='backspace' size={30} color={backspaceColor} />
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity style={styles.button} onPress={() => this.onPressNumber(1)}>
            <Text style={styles.dialText}>{1}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => this.onPressNumber(2)}>
            <Text style={styles.dialText}>{2}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => this.onPressNumber(3)}>
            <Text style={styles.dialText}>{3}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity style={styles.button} onPress={() => this.onPressNumber(4)}>
            <Text style={styles.dialText}>{4}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => this.onPressNumber(5)}>
            <Text style={styles.dialText}>{5}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => this.onPressNumber(6)}>
            <Text style={styles.dialText}>{6}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity style={styles.button} onPress={() => this.onPressNumber(7)}>
            <Text style={styles.dialText}>{7}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => this.onPressNumber(8)}>
            <Text style={styles.dialText}>{8}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => this.onPressNumber(9)}>
            <Text style={styles.dialText}>{9}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity style={styles.button} onPress={() => this.onPressNumber('*')}>
            <Text style={styles.dialText}>{'*'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => this.onPressNumber(0)}>
            <Text style={styles.dialText}>{0}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => this.onPressNumber('#')}>
            <Text style={styles.dialText}>{'#'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.actionRow}>
          <View style={styles.contactButton}>
          </View>
          <TouchableOpacity style={styles.phoneButton} onPress={() => this.onCreateCall()}>
            <MaterialCommunityIcons name='phone' size={40} color={R.colors.TEXT_MAIN} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactButton} onPress={() => this.onPressContact()}>
            <MaterialIcons name='account-circle' size={40} color={R.colors.TEXT_MAIN} />
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
  column: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  headerRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dialText: {
    height: 32,
    fontSize: 24,
    color: R.colors.TEXT_MAIN,
    fontWeight: 'bold',
  },
  button: {
    flex: 1,
    backgroundColor: R.colors.GREY_BACKGROUND,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  phoneButton: {
    flexDirection: 'column',
    backgroundColor: R.colors.YES,
    padding: 20,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 30,
  },
  contactButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 30,
  },
  contactText: {
    fontSize: 12,
    color: R.colors.TEXT_MAIN,
  },
  phoneNumberText: {
    fontSize: 28,
    color: R.colors.TEXT_MAIN,
    marginLeft: 30,
  },
  backspaceButton: {
    alignItems: 'flex-end',
  },
  phoneNumberTextContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default connect(
  null,
  { connectCall },
)(DialPad);
