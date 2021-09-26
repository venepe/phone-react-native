import React, { Component } from 'react';
import {
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import { getFormattedNumber } from '../../utilities/phone';
import { MaterialIcons } from '@expo/vector-icons';
import { HOME_PAGE } from '../../config';
import R from '../../resources';

class JoinModal extends Component {

  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
    this.onAccept = this.onAccept.bind(this);
    this.getNameText = this.getNameText.bind(this);

    this.state = {
      isVisible: props.isVisible,
      phoneNumber: props.phoneNumber,
      owners: props.owners,
    };
  }

  componentDidUpdate(prevProps) {
    const props = this.props;
    if (props.isVisible !== prevProps.isVisible) {
      this.setState({
        isVisible: props.isVisible,
      });
    }
    if (props.phoneNumber !== prevProps.phoneNumber) {
      this.setState({
        phoneNumber: props.phoneNumber,
      });
    }
    if (props.owners !== prevProps.owners) {
      this.setState({
        owners: props.owners,
      });
    }
  }

  handleClose() {
    this.props.handleClose();
  }

  onAccept() {
    this.props.onAccept();
  }

  getNameText(owners) {
    let nameText = '';
    let length = owners.length;
    if (owners && length > 0) {
      if (length === 1) {
        nameText = owners[0].name;
      } else if (length === 2) {
        nameText = `${owners.map(({ name }) => name).join(' and ')}`;
      } else {
        const maxLength = 3;
        if (length > maxLength) {
          owners.splice(maxLength, length - maxLength);
          owners.push({ name: 'others' });
        }
        const last = owners.pop();
        nameText = `${owners.map(({ name }) => name).join(', ')}, and ${last.name}`;
      }
    }
    return nameText;
  }

  render() {
    const { isVisible, phoneNumber, owners } = this.state;
    const nameText = this.getNameText(owners);
    return (
      <Modal isVisible={isVisible} coverScreen={false}>
        <View style={styles.root}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={this.handleClose}>
              <MaterialIcons name='close' size={48} color={`${R.colors.TEXT_MAIN}`} />
            </TouchableOpacity>
          </View>
          <View style={styles.mainContainer}>
            <View style={styles.titleContainer}>
              <Text style={styles.titleText}>{`Join`}</Text>
              <Text style={styles.titleText}>{getFormattedNumber(phoneNumber)}</Text>
            </View>
            <View style={styles.bodyContainer}>
              <Text style={styles.bodyText}>{`Do you want to join ${nameText} on a phone number?`}</Text>
              <Text style={styles.bodyText}>{`By joining, you agree to Bubblepop's `}
                <Text style={styles.linkText} onPress={() => Linking.openURL(`${HOME_PAGE}/terms-of-service`)}>
                  {`Terms of Service `}
                </Text>
                <Text style={styles.bodyText}>{`and `}</Text>
                <Text style={styles.linkText} onPress={() => Linking.openURL(`${HOME_PAGE}/privacy`)}>
                  Privacy Policy
                </Text>
                <Text style={styles.bodyText}>.</Text>
              </Text>
            </View>
            <TouchableOpacity style={styles.subscribeButtonContainer} onPress={() => this.onAccept()}>
              <Text style={styles.btnPrimaryText}>{R.strings.CONFIRM_PURCHASE_AFFIRMATIVE}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButtonContainer} onPress={() => this.handleClose()}>
              <Text style={styles.bodyText}>{R.strings.CONFIRM_PURCHASE_NEGATIVE}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: R.colors.MODAL_BACKGROUND,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  titleContainer: {
    alignItems: 'center',
    padding: 10,
    marginTop: 2,
  },
  titleText: {
    color: `${R.colors.TEXT_MAIN}`,
    fontSize: 32,
    fontWeight: 'bold',
    flexWrap:'wrap'
  },
  bodyContainer: {
    flex: 1,
    alignItems: 'flex-start',
    padding: 10,
    marginTop: 2,
  },
  bodyText: {
    color: `${R.colors.TEXT_MAIN}`,
    fontSize: 18,
    fontWeight: 'bold',
    flexWrap:'wrap',
    padding: 5,
  },
  linkText: {
    color: `${R.colors.LOGO}`,
    fontSize: 18,
    fontWeight: 'bold',
  },
  btnPrimaryText: {
    color: `${R.colors.TEXT_MAIN}`,
    fontSize: 18,
    fontWeight: 'bold',
    flexWrap:'wrap',
  },
  btnSecondaryText: {
    color: `${R.colors.TEXT_MAIN}`,
    fontSize: 12,
    fontWeight: '400',
    flexWrap:'wrap',
  },
  freeTrialContainer: {
    alignItems: 'center',
  },
  freeTrialText: {
    color: `${R.colors.TEXT_MAIN}`,
    fontSize: 18,
    fontWeight: '500',
    flexWrap:'wrap',
    padding: 5,
  },
  subscribeButtonContainer: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: R.colors.BACKGROUND_MAIN,
  },
  cancelButtonContainer: {
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'transparent',
  }
});

JoinModal.defaultProps = {
  isVisible: false,
  owners: [],
  handleClose: () => {},
  onAccept: () => {},
};

export default JoinModal;
