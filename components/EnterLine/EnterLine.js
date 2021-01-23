import React, { Component, Fragment } from 'react';
import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import parsePhoneNumber from 'libphonenumber-js';
import { Formik } from 'formik';
import * as Yup from 'yup';
import 'yup-phone';
import R from '../../resources';

const EnterLineSchema = Yup.object().shape({
  phoneNumber: Yup.string()
    .phone('US', true, R.strings.WARNING_PHONE_NUMBER_REQUIRED)
    .required(R.strings.WARNING_PHONE_NUMBER_REQUIRED),
});

class EnterLine extends Component {

  constructor(props) {
    super(props);
    this.onEnterLine = this.onEnterLine.bind(this);
    this.state = {
      phoneNumber: '',
    };
  }

  onEnterLine({ values }) {
    const { phoneNumber } = values;
    if (phoneNumber && phoneNumber.length > 0) {
      const { navigation } = this.props;
      let formatter = parsePhoneNumber(phoneNumber, 'US');
      let fPhoneNumber = formatter.number;
      navigation.navigate('EnterCode', {
        title: fPhoneNumber,
        phoneNumber: fPhoneNumber,
      });
    }
  }

  render() {
    const { phoneNumber } = this.state;
    return (
      <View style={styles.root}>
        <Formik
          initialValues={{ phoneNumber: '' }}
          validationSchema={EnterLineSchema}
          >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid }) => (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
              <View style={styles.container}>
                <TextInput
                  style={styles.textInput}
                  placeholder={R.strings.HINT_PHONE_NUMBER}
                  placeholderTextColor={R.colors.TEXT_DISABLED}
                  onChangeText={handleChange('phoneNumber')}
                  onBlur={handleBlur('phoneNumber')}
                  value={values.phoneNumber}
                  autoFocus={true}
                  keyboardType={'phone-pad'}
                  returnKeyType={'done'}
                  maxLength={150}
                  autoCapitalize={'none'}
                  onSubmitEditing={() => this.onEnterLine({ values })}
                />
                {errors.phoneNumber && touched.phoneNumber ? (
                  <Text style={styles.errorText}>{errors.phoneNumber}</Text>
                ) : null}
              <View style={styles.buttonContainer} >
                {(() => {
                  const backgroundColor = isValid && values.phoneNumber.length > 0 ? '#FFFF00' : '#E0E0E0';
                    return (
                      <TouchableOpacity style={[styles.button, { backgroundColor }]} disabled={!isValid} onPress={() => this.onEnterLine({ values })}>
                        <Text style={styles.buttonText}>{R.strings.LABEL_NEXT}</Text>
                      </TouchableOpacity>
                    )
                  })()}
                </View>
              </View>
            </TouchableWithoutFeedback>
          )}
        </Formik>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: R.colors.BACKGROUND_MAIN,
  },
  container: {
    flex: 1,
    margin: 10,
    backgroundColor: R.colors.BACKGROUND_MAIN,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 20,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#E0E0E0',
  },
  buttonText: {
    height: 36,
    fontSize: 25,
    color: '#757575',
  },
  textInput: {
    color: R.colors.TEXT_MAIN,
    fontSize: 32,
    fontWeight: 'bold',
    flexWrap:'wrap',
    backgroundColor: R.colors.BACKGROUND_MAIN,
    borderBottomColor: R.colors.TEXT_MAIN,
    borderBottomWidth: 2,
  },
  errorText: {
    fontSize: 18,
    color: R.colors.TEXT_MAIN,
    margin: 10,
  },
  spinner: {
    height: 35,
  },
});

export default EnterLine;
