import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import R from '../../resources';

class AvailableNumberItem extends Component {
  constructor(props) {
    super(props);
    this.getPlaceText = this.getPlaceText.bind(this);
    this.onPressPhoneNumber = this.onPressPhoneNumber.bind(this);
    this.state = {
      rowID: props.rowID,
      availableNumberItem: props.availableNumberItem,
    };
  }

  componentDidUpdate(prevProps) {
    const props = this.props;
    if (props.availableNumberItem !== prevProps.availableNumberItem) {
      this.setState({
        availableNumberItem: props.availableNumberItem,
      });
    }
  }

  getPlaceText({ locality, region }) {
    if (locality && locality.length > 0) {
      return `${locality}, ${region}`;
    } else {
      return `${region}`;
    }
  }

  onPressPhoneNumber() {
    const { navigation } = this.props;
    const { availableNumberItem: { phoneNumber } } = this.state;
    // navigation.push('SearchDealList');
  }

  render() {
    const { navigation } = this.props;
    const availableNumberItem = this.state.availableNumberItem || {};
    const opacity = 1.0;
    const { phoneNumber, locality, region } = availableNumberItem;

    return (
      <TouchableOpacity style={styles.card} onPress={this.onPressPhoneNumber}>
        <Text style={styles.phoneNumberText}>{phoneNumber}</Text>
        <Text style={styles.phoneNumberText}>{this.getPlaceText({ locality, region })}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'column',
    backgroundColor: R.colors.BACKGROUND_MAIN,
    shadowColor: R.colors.TEXT_MAIN,
    shadowOpacity: 0.3,
    shadowRadius: 2,
    shadowOffset: {
      height: 0,
      width: 0,
    },
  },
  phoneNumberText: {
    color: R.colors.TEXT_MAIN,
    fontSize: 28,
    fontWeight: '400',
  },
});

export default AvailableNumberItem;
