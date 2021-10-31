import React, { Component, Fragment } from 'react';
import {
  Alert,
  ActivityIndicator,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import { createTodo } from '../../actions/todo';
import Empty from './Empty';
import R from '../../resources';

const CreateTodoSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, R.strings.WARNING_MIN_LENGTH)
    .max(128, R.strings.WARNING_MAX_LENGTH)
    .required(R.strings.WARNING_FIELD_REQUIRED),
});

class CreateTodoName extends Component {

  constructor(props) {
    super(props);
    this.onCreateTodo = this.onCreateTodo.bind(this);

    this.state = {
      name: '',
    };
  }

  onCreateTodo({ values }) {
    const { name } = values;
    this.props.createTodo({ name });
    this.props.navigation.goBack();
  }

  render() {
    const { name } = this.state;
    return (
      <View style={styles.root}>
        <Formik
          initialValues={{ name }}
          validationSchema={CreateTodoSchema}
          onSubmit={values => console.log(values)}
          >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid }) => (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.formContainer}>
              <TextInput
                  style={[styles.textInput, {margin: 5}]}
                  placeholder={R.strings.HINT_TODO_NAME}
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  value={values.name}
                  autoFocus={false}
                  keyboardType={'default'}
                  returnKeyType={'done'}
                  maxLength={150}
                  autoCapitalize={'none'}
                />
                {errors.name && touched.name ? (
                  <Text style={styles.errorText}>{errors.name}</Text>
                ) : null}
            <View style={styles.bottomContainer} >
              {(() => {
                const backgroundColor = isValid && values.name.length > 0 ? R.colors.BACKGROUND_MAIN : '#E0E0E0';
                  return (
                    <TouchableOpacity style={[styles.userNameButtonContainer, { backgroundColor }]} disabled={!isValid} onPress={() => this.onCreateTodo({ values })}>
                      <Text style={styles.userNameText}>{R.strings.LABEL_NEXT}</Text>
                    </TouchableOpacity>
                  )
                })()
              }
            </View>
          </View>
          </TouchableWithoutFeedback>
          )}
          </Formik>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: R.colors.BACKGROUND_DARK,
  },
  formContainer: {
    flex: 1,
    backgroundColor: R.colors.BACKGROUND_DARK,
  },
  textInput: {
    padding: 20,
    color: R.colors.BACKGROUND_DARK,
    fontSize: 24,
    fontWeight: '500',
    backgroundColor: R.colors.TEXT_BACKGROUND_LIGHT,
    borderRadius: 5,
  },
  bottomContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  userNameButtonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: R.colors.BACKGROUND_MAIN,
  },
  userNameText: {
    height: 36,
    fontSize: 25,
    color: R.colors.TEXT_MAIN,
  },
  errorText: {
    fontSize: 18,
    color: '#FF5252',
    margin: 10,
  },
  spinner: {
    height: 35,
  },
});

export default connect(
  null,
  { createTodo },
)(CreateTodoName);
