import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { getPhoneNumber } from '../../reducers';
import { getFormattedNumber } from '../../utilities/phone';
import { getDateDiffText } from '../../utilities/date';
import R from '../../resources';

class ChatItem extends Component {
  constructor(props) {
    super(props);
    this.onPressRow = this.onPressRow.bind(this);
    this.state = {
      rowID: props.rowID,
      chatItem: props.chatItem,
      phoneNumber: props.phoneNumber,
    };
  }

  componentDidUpdate(prevProps) {
    const props = this.props;
    if (props.chatItem !== prevProps.chatItem) {
      this.setState({
        chatItem: props.chatItem,
      });
    }
    if (props.phoneNumber !== prevProps.phoneNumber) {
      this.setState({
        phoneNumber: props.phoneNumber,
      });
    }
  }

  onPressRow({ from, to }) {
    this.props.onPressRow({ from, to });
  }

  render() {
    const { navigation } = this.props;
    const chatItem = this.state.chatItem || {};
    const { phoneNumber } = this.state;
    const opacity = 1.0;
    let { from, fromText, body, createdAt, to } = chatItem;
    if (from === phoneNumber) {
      body = `Us: ${body}`;
    }
    return (
      <TouchableOpacity style={styles.card} onPress={() => this.onPressRow({ from, to })}>
        <View style={styles.headerContainer}>
          <View style={styles.topContainer}>
            <View style={styles.topSubContainer}>
              <View>
                <MaterialIcons name='account-circle' size={30} color={R.colors.TEXT_MAIN} />
              </View>
              <View style={styles.topTextContainer}>
                <View style={styles.titleContainer}>
                  <Text style={styles.topTitle}>{fromText}</Text>
                  <Text style={styles.topSubtitle}>{getDateDiffText(createdAt)}</Text>
                </View>
                  <View style={styles.bodyTextContainer}>
                    <Text style={styles.bodyTitle}>{body}</Text>
                  </View>
              </View>
            </View>
          </View>
          <View style={styles.rightContainer}>
          </View>
        </View>
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
    alignItems: 'flex-start',
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
    marginLeft: 3,
    fontSize: 12,
    fontWeight: '200',
  },
  rightContainer: {
    flex: .1,
    alignItems: 'flex-end',
    marginRight: 5,
    padding: 5,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
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

ChatItem.defaultProps = {
  onPressRow: () => {},
};

const mapStateToProps = state => ({
  phoneNumber: getPhoneNumber(state),
});

export default connect(
  mapStateToProps,
  { },
)(ChatItem);
