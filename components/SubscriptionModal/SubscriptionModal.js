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
const PRICE_99 = '9.99';
const PRICE_9 = '1.99';
const ANNUAL = 'annual';
const MONTHLY = 'monthly';

class SubscriptionModal extends Component {

  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
    this.onAccept = this.onAccept.bind(this);

    this.state = {
      isVisible: props.isVisible,
      phoneNumber: props.phoneNumber,
      storeName: Platform.select({
        ios: 'App Store',
        android: 'Google Play Store',
      }),
      accountName: Platform.select({
        ios: 'iTunes',
        android: 'Google Play',
      }),
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
  }

  handleClose() {
    this.props.handleClose();
  }

  onAccept() {
    this.props.onAccept();
  }

  render() {
    const { isVisible, phoneNumber, storeName, accountName } = this.state;
    return (
      <Modal isVisible={isVisible} coverScreen={false}>
        <ScrollView style={styles.root}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={this.handleClose}>
              <MaterialIcons name='close' size={48} color={`${R.colors.TEXT_MAIN}`} />
            </TouchableOpacity>
          </View>
          <View style={styles.mainContainer}>
            <View style={styles.titleContainer}>
              <Text style={styles.titleText}>{`Reserve`}</Text>
              <Text style={styles.titleText}>{getFormattedNumber(phoneNumber)}</Text>
            </View>
            <View style={styles.bodyContainer}>
              <Text style={styles.bodyText}>{`Congratulations! 🎉🎉🎉`}</Text>
              <Text style={styles.bodyText}>{`You are about to share a phone number designed for couples which includes unlimited talk and text.`}</Text>
              <Text style={styles.bodyText}>{`Side effects may include feelings of 😍🥰😀`}</Text>
              <Text style={styles.bodyText}>{`By signing up for a free trial, you agree to Bubblepop's `}
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
            <View style={styles.freeTrialContainer}>
              <Text style={styles.freeTrialText}>{`Start with a 30 day free trial.`}</Text>
            </View>
            <TouchableOpacity style={styles.subscribeButtonContainer} onPress={() => this.onAccept(ANNUAL)}>
              <Text style={styles.btnPrimaryText}>{`$${PRICE_99}/year`}</Text>
              <Text style={styles.btnSecondaryText}>{`Includes unlimited talk and text`}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.subscribeButtonContainer} onPress={() => this.onAccept(MONTHLY)}>
              <Text style={styles.btnPrimaryText}>{`$${PRICE_9}/month`}</Text>
              <Text style={styles.btnSecondaryText}>{`Includes unlimited talk and text`}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButtonContainer} onPress={() => this.handleClose()}>
              <Text style={styles.bodyText}>{`Cancel`}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
    marginTop: 5,
    padding: 10,
    backgroundColor: R.colors.BACKGROUND_MAIN,
  },
  cancelButtonContainer: {
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'transparent',
  }
});

SubscriptionModal.defaultProps = {
  isVisible: false,
  handleClose: () => {},
  onAccept: () => {},
};

export default SubscriptionModal;
