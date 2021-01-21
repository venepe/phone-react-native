import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import parsePhoneNumber from 'libphonenumber-js';
import { getDateDiffText } from '../../utilities/date';
import R from '../../resources';

class PhoneCallItem extends Component {
  constructor(props) {
    super(props);
    this.onPress = this.onPress.bind(this);

    this.state = {
      rowID: props.rowID,
      phoneCallItem: props.phoneCallItem,
    };
  }

  componentDidUpdate(prevProps) {
    const props = this.props;
    if (props.phoneCallItem !== prevProps.phoneCallItem) {
      this.setState({
        phoneCallItem: props.phoneCallItem,
      });
    }
  }

  onPress(phoneNumber) {
    Linking.openURL(`tel:${phoneNumber}`);
  }

  render() {
    const { navigation } = this.props;
    const phoneCallItem = this.state.phoneCallItem || {};
    const opacity = 1.0;
    const { from, body, date_created } = phoneCallItem;
    const phoneNumber = parsePhoneNumber(from);
    return (
      <View style={styles.card}>
        <View style={styles.headerContainer}>
          <View style={styles.topContainer}>
            <View style={styles.topSubContainer}>
              <View>
                <MaterialIcons name='account-circle' size={30} color={R.colors.TEXT_MAIN} />
              </View>
              <View style={styles.topTextContainer}>
                <Text style={styles.topTitle}>{phoneNumber.formatNational()}</Text>
                <Text style={styles.topSubtitle}>{getDateDiffText(date_created)}</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.dateContainer} onPress={() => this.onPress(from)}>
            <MaterialIcons name='phone' size={30} color={R.colors.TEXT_MAIN} />
          </TouchableOpacity>
        </View>
      </View>
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
  title: {
    color: R.colors.TEXT_MAIN,
    fontSize: 28,
    fontWeight: '400',
  },
  headerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 15,
    marginLeft: 5,
  },
  topContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  topSubContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topTextContainer: {
    marginLeft: 5,
    flexDirection: 'column',
  },
  topTitle: {
    color: R.colors.TEXT_MAIN,
    fontSize: 16,
    fontWeight: 'bold',
  },
  topSubtitle: {
    color: R.colors.TEXT_MAIN,
    fontSize: 12,
    fontWeight: '200',
  },
  dateContainer: {
    flex: 1,
    alignItems: 'flex-end',
    marginRight: 20,
  },
});

export default PhoneCallItem;
