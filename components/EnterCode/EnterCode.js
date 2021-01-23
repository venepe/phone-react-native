import React, { Component, Fragment } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import CodeInput from 'react-native-confirmation-code-input';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';
import SubscriptionModal from './SubscriptionModal';
import { storeAndSetPhoneNumber} from '../../actions';
import { getInvitation, postOwn } from '../../fetches';
import { getToken } from '../../reducers';
import R from '../../resources';

const EnterCodeSchema = Yup.object().shape({
  code: Yup.string()
    .min(2, R.strings.WARNING_MIN_LENGTH)
    .max(64, R.strings.WARNING_MAX_LENGTH)
    .required(R.strings.WARNING_FIELD_REQUIRED),
});

class EnterCode extends Component {

  constructor(props) {
    super(props);
    this.onFulfill = this.onFulfill.bind(this);
    this.onAccept = this.onAccept.bind(this);
    const { phoneNumber } = this.props.route.params || {};
    this.state = {
      phoneNumber,
      isSubscriptionModalVisible: false,
      errorMessage: '',
      code: '',
      token: props.token,
    };
  }

  componentDidUpdate(prevProps) {
    const props = this.props;
    if (props.token !== prevProps.token) {
      this.setState({
        token: props.token,
      });
    }
  }

  async onFulfill({ code, isValid }) {
    this.setState({
      code,
      isSubscriptionModalVisible: true,
    });
    return;
    try {
      const { phoneNumber, token } = this.state;
      const response = await getInvitation({ token, phoneNumber, code });
      const statusCode = response.status;
      const data = await response.json();
      if (response.status === 200) {
        let { invitation } = data;
        if (invitation && invitation.id) {
          this.setState({
            code,
            isSubscriptionModalVisible: true,
          });
        } else {
          this.setState({
            errorMessage: 'Invalid code.',
          });
        }
      } else {
        this.setState({
          errorMessage: 'Invalid code.',
        });
      }
    } catch (e) {
      console.log(e);
    }
  }

  async onAccept() {
    try {
      const { phoneNumber, token } = this.state;
      const response = await postOwn({ token, phoneNumber, code });
      const statusCode = response.status;
      const data = await response.json();
      if (response.status === 200) {
        this.props.storeAndSetPhoneNumber({ payload: { phoneNumber } });
      } else {
        this.setState({
          errorMessage: 'Failed up load. Try again.',
        });
      }
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    const { code, phoneNumber, isValid, isSubscriptionModalVisible, errorMessage } = this.state;
    return (
      <View style={styles.root}>
        <CodeInput
          ref='codeInputRef'
          keyboardType='numeric'
          codeLength={4}
          size={60}
          className='border-circle'
          compareWithCode={null}
          autoFocus={true}
          containerStyle={{flex: null}}
          codeInputStyle={{ fontWeight: '800', fontSize: 35 }}
          onFulfill={(isValid, code) => this.onFulfill({ isValid, code })}
          onCodeChange={() => this.setState({ errorMessage: '' })}
        />
        {errorMessage && errorMessage.length > 0 ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}
        <SubscriptionModal phoneNumber={phoneNumber} isVisible={isSubscriptionModalVisible} onAccept={this.onAccept} handleClose={() => this.setState({ isSubscriptionModalVisible: false })}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: R.colors.BACKGROUND_MAIN,
    justifyContent: 'flex-start',
  },
  errorText: {
    fontSize: 18,
    color: R.colors.TEXT_MAIN,
    margin: 10,
  },
});

const mapStateToProps = state => ({
  token: getToken(state),
});

export default connect(
  mapStateToProps,
  { storeAndSetPhoneNumber },
)(EnterCode);
