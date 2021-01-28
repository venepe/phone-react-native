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

class ChatItem extends Component {
  constructor(props) {
    super(props);
    this.onPress = this.onPress.bind(this);

    this.state = {
      rowID: props.rowID,
      chatItem: props.chatItem,
    };
  }

  componentDidUpdate(prevProps) {
    const props = this.props;
    if (props.chatItem !== prevProps.chatItem) {
      this.setState({
        chatItem: props.chatItem,
      });
    }
  }

  onPress(phoneNumber) {
    Linking.openURL(`sms:${phoneNumber}`);
  }

  render() {
    const { navigation } = this.props;
    const chatItem = this.state.chatItem || {};
    const opacity = 1.0;
    const { from, body, dateCreated } = chatItem;

    return (
      <View style={styles.card}>
        <View style={styles.headerContainer}>
          <View style={styles.topContainer}>
            <View style={styles.topSubContainer}>
              <View>
                <MaterialIcons name='account-circle' size={30} color={R.colors.TEXT_MAIN} />
              </View>
              <View style={styles.topTextContainer}>
                <Text style={styles.topTitle}>{from}</Text>
                  <View style={styles.bodyTextContainer}>
                    <Text style={styles.bodyTitle}>{body}</Text>
                  </View>
              </View>
              <View style={styles.dateTextContainer}>
                <Text style={styles.topSubtitle}>{getDateDiffText(dateCreated)}</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.rightContainer} onPress={() => this.onPress(from)}>
            <MaterialIcons name='message' size={30} color={R.colors.TEXT_MAIN} />
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
    marginBottom: 5,
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
  rightContainer: {
    flex: .3,
    alignItems: 'flex-end',
    marginRight: 5,
  },
  dateTextContainer: {
    flex: 1,
    alignSelf: 'flex-start',
    marginLeft: 5,
    marginTop: 2,
  },
  bodyTextContainer: {
    marginBottom: 10,
  },
  bodyTitle: {
    color: R.colors.TEXT_MAIN,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChatItem;
