import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { connectCall } from '../../actions';
import { getPhoneNumber } from '../../reducers';
import { getFormattedNumber } from '../../utilities/phone';
import { getDateTimeText } from '../../utilities/date';
import R from '../../resources';

class CallItem extends Component {
  constructor(props) {
    super(props);
    this.onCreateCall = this.onCreateCall.bind(this);
    this.onPressRow = this.onPressRow.bind(this);
    this.state = {
      rowID: props.rowID,
      callItem: props.callItem,
      phoneNumber: props.phoneNumber,
    };
  }

  componentDidUpdate(prevProps) {
    const props = this.props;
    if (props.callItem !== prevProps.callItem) {
      this.setState({
        callItem: props.callItem,
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

  onCreateCall({ conversation }) {
    this.props.connectCall(conversation);
    this.props.navigation.navigate('CallStates', {
      screen: 'ActiveCall',
      params: { },
    });
  }

  render() {
    const { navigation } = this.props;
    const callItem = this.state.callItem || {};
    const { phoneNumber } = this.state;
    const opacity = 1.0;
    let { from, fromText, createdAt, direction, to, status, conversation } = callItem;
    let callIcon;
    let callIconColor = R.colors.TEXT_MAIN;
    if (direction === 'inbound') {
      callIcon = (status === 'no-answer') ? 'call-missed' : 'call-received';
      callIconColor = (status === 'no-answer') ? R.colors.MISSED : R.colors.TEXT_MAIN;
    } else {
      callIcon = (status === 'no-answer') ? 'call-missed-outgoing' : 'call-made';
      callIconColor = (status === 'no-answer') ? R.colors.MISSED : R.colors.TEXT_MAIN;
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
                </View>
                  <View style={styles.bodyTextContainer}>
                    <MaterialIcons style={styles.callIcon} name={callIcon} color={callIconColor} />
                    <Text style={styles.bodyTitle}>{getDateTimeText(createdAt)}</Text>
                  </View>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.rightContainer} onPress={() => this.onCreateCall({ conversation })}>
            <MaterialIcons name='phone' size={25} color={R.colors.TEXT_MAIN} />
          </TouchableOpacity>
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
    marginRight: 20,
    padding: 5,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bodyTextContainer: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bodyTitle: {
    color: R.colors.TEXT_MAIN,
    fontSize: 16,
    fontWeight: 'bold',
    margin: 2,
  },
  callIcon: {
    fontSize: 16,
    fontWeight: 'bold',
    margin: 2,
  },
});

CallItem.defaultProps = {
  onPressRow: () => {},
};

const mapStateToProps = state => ({
  phoneNumber: getPhoneNumber(state),
});

export default connect(
  mapStateToProps,
  { connectCall },
)(CallItem);
