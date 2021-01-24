import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { getFormattedNumber } from '../../utilities/phone';
import { getDateDiffText } from '../../utilities/date';
import R from '../../resources';

class MemberItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rowID: props.rowID,
      memberItem: props.memberItem,
    };
  }

  componentDidUpdate(prevProps) {
    const props = this.props;
    if (props.memberItem !== prevProps.memberItem) {
      this.setState({
        memberItem: props.memberItem,
      });
    }
  }

  render() {
    const { navigation } = this.props;
    const memberItem = this.state.memberItem || {};
    const opacity = 1.0;
    const { name } = memberItem;

    return (
      <View style={styles.card}>
        <View style={styles.headerContainer}>
          <View>
            <MaterialIcons name='account-circle' size={30} color={R.colors.TEXT_MAIN} />
          </View>
          <View style={styles.topTextContainer}>
            <Text style={styles.topTitle}>{name}</Text>
          </View>
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
    margin: 12,
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
});

export default MemberItem;
