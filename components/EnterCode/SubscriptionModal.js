import React, { Component } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import { getFormattedNumber } from '../../utilities/phone';
import { MaterialIcons } from '@expo/vector-icons';
import RNIap, { initConnection, requestSubscription, purchaseUpdatedListener, purchaseErrorListener, getSubscriptions } from 'react-native-iap';
import R from '../../resources';

class SubscriptionModal extends Component {

  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
    this.onAccept = this.onAccept.bind(this);

    this.state = {
      isVisible: props.isVisible,
      phoneNumber: props.phoneNumber,
    };
  }

  async componentDidMount() {
    await initConnection();
    this.purchaseUpdateSubscription = purchaseUpdatedListener(async (purchase) => {
      console.log('purchaseUpdatedListener', purchase);
      const receipt = purchase.transactionReceipt;
      if (receipt) {
        console.log(receipt);
        await RNIap.finishTransaction(purchase, true);
        this.props.onAccept();
      } else {
        this.props.onAccept();
      }
    });
    this.purchaseErrorSubscription = purchaseErrorListener(async (error) => {
      console.log('purchaseErrorListener', error);
      console.log(error);
      this.props.onAccept();
    });
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

  async onAccept() {
    const subscriptions = await getSubscriptions(['1MONTH']);
    console.log(subscriptions);
    requestSubscription('1MONTH');
  }

  render() {
    const { isVisible, phoneNumber } = this.state;
    return (
      <Modal isVisible={isVisible} coverScreen={false}>
        <ScrollView style={styles.root}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={this.handleClose}>
              <MaterialIcons name="close" size={48} color={`${R.colors.TEXT_MAIN}`} />
            </TouchableOpacity>
          </View>
          <View style={styles.mainContainer}>
            <View style={styles.titleContainer}>
              <Text style={styles.titleText}>{`Join`}</Text>
              <Text style={styles.titleText}>{getFormattedNumber(phoneNumber)}</Text>
            </View>
            <View style={styles.bodyContainer}>
              <Text style={styles.bodyText}>{`Auto-renewable subscriptions are available from the App Store for $0.99.`}</Text>
              <Text style={styles.bodyText}>{`Payment will be charged to your iTunes account at confirmation of purchase and will automatically renew (at the duration/price selected) unless auto-renew is turned off at least 24 hrs before the end of the current period.`}</Text>
              <Text style={styles.bodyText}>{`Account will be charged for renewal within 24-hours prior to the end of the current period.`}</Text>
              <Text style={styles.bodyText}>{`Current subscription may not be cancelled during the active subscription period; however, you can manage your subscription and/or turn off auto-renewal by visiting your iTunes Account Settings after purchase.`}</Text>
              <Text style={styles.bodyText}>{`Please select one of the auto-renewable subscriptions below.`}</Text>
            </View>
            <TouchableOpacity style={styles.subscribeButtonContainer} onPress={this.onAccept}>
              <Text style={styles.bodyText}>{`$0.99/month`}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButtonContainer} onPress={this.handleClose}>
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
  subscribeButtonContainer: {
    alignItems: 'center',
    padding: 15,
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
