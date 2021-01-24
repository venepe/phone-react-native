import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { getFormattedNumber } from '../../utilities/phone';
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
    const { availableNumberItem } = this.state;
    this.props.onPress(availableNumberItem);
  }

  render() {
    const { navigation } = this.props;
    const availableNumberItem = this.state.availableNumberItem || {};
    const opacity = 1.0;
    const { phoneNumber, locality, region } = availableNumberItem;

    return (
      <TouchableOpacity style={styles.card} onPress={() => this.onPressPhoneNumber()}>
        <View style={styles.headerContainer}>
          <View style={styles.topContainer}>
            <View style={styles.topSubContainer}>
              <View style={styles.topTextContainer}>
                <Text style={styles.topTitle}>{getFormattedNumber(phoneNumber)}</Text>
                  <View style={styles.bodyTextContainer}>
                    <Text style={styles.bodyTitle}>{this.getPlaceText({ locality, region })}</Text>
                  </View>
              </View>
            </View>
          </View>
          <View style={styles.dateContainer}>
            <MaterialIcons name='message' size={30} color={R.colors.TEXT_MAIN} />
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
    marginRight: 5,
  },
  dateTextContainer: {
    flex: 1,
    alignSelf: 'flex-start',
    marginLeft: 5,
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

AvailableNumberItem.defaultProps = {
  onPress: () => {},
};

export default AvailableNumberItem;
