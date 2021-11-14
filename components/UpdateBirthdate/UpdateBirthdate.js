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
import { getToken } from '../../reducers';
import { getMe, putUser } from '../../fetches';
import Empty from './Empty';
import R from '../../resources';

const UpdateBirthdateSchema = Yup.object().shape({
  birthdate: Yup.string()
    .min(2, R.strings.WARNING_MIN_LENGTH)
    .max(128, R.strings.WARNING_MAX_LENGTH)
    .required(R.strings.WARNING_FIELD_REQUIRED),
});

class UpdateBirthdate extends Component {

  constructor(props) {
    super(props);
    this.onUpdateBirthdate = this.onUpdateBirthdate.bind(this);
    this.stopLoading = this.stopLoading.bind(this);

    this.state = {
      isLoading: false,
      token: props.token,
      birthdate: '',
    };
  }

  async fetch() {
    try {
      const { token, accountId } = this.state;
      const data = await getMe({ token });
      console.log(data);
      let { user: { birthdate } } = data;
      console.log(birthdate);
      this.setState({
        birthdate,
      });
    } catch (e) {
      console.log(e);
    }
  }

  componentDidMount() {
    this.fetch();
  }

  componentDidUpdate(prevProps) {
    const props = this.props;
    if (props.token !== prevProps.token) {
      this.setState({
        token: props.token,
      });
    }
  }

  onUpdateBirthdate({ values }) {
    const { birthdate } = values;
    const { token } = this.state;
    this.setState({ isLoading: true });
    putUser({ token, birthdate })
    .then((response) => {
      const statusCode = response.status;
      const data = response.json();
      return Promise.all([statusCode, data]);
    })
    .then(([res, data]) => {
      if (res === 200) {
        const { user: { birthdate } } = data;
        this.setState({ birthdate });
        this.stopLoading();
      } else {
        Alert.alert('Error', 'Please retry',[{ text: 'Okay' }]);
        this.stopLoading();
      }
    })
    .catch((error) => {
      console.log(error);
      this.stopLoading();
    });
  }

  stopLoading() {
    this.setState({
      isLoading: false,
    });
  }

  render() {
    const { isLoading, birthdate } = this.state;
    if (!birthdate || birthdate.length < 1) {
      return (<Empty navigation={this.props.navigation}/>);
    }
    return (
      <View style={styles.root}>
        <Formik
          initialValues={{ birthdate }}
          validationSchema={UpdateBirthdateSchema}
          onSubmit={values => console.log(values)}
          >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid }) => (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.formContainer}>
              <TextInput
                  style={[styles.textInput, {margin: 5}]}
                  placeholder={R.strings.HINT_NAME}
                  onChangeText={handleChange('birthdate')}
                  onBlur={handleBlur('birthdate')}
                  value={values.birthdate}
                  autoFocus={true}
                  keyboardType={'default'}
                  returnKeyType={'done'}
                  maxLength={150}
                  autoCapitalize={'none'}
                />
                {errors.birthdate && touched.birthdate ? (
                  <Text style={styles.errorText}>{errors.birthdate}</Text>
                ) : null}
            <View style={styles.bottomContainer} >
              {(() => {
                const backgroundColor = isValid && values.birthdate.length > 0 ? R.colors.BACKGROUND_MAIN : R.colors.TEXT_BACKGROUND_LIGHT;
                  return (
                    <TouchableOpacity style={[styles.userTitleButtonContainer, { backgroundColor }]} disabled={!isValid || isLoading} onPress={() => this.onUpdateBirthdate({ values })}>
                      {
                        isLoading ? (
                          <ActivityIndicator style={styles.spinner} size='large' color={R.colors.SPINNER} />
                        ) : (
                          <Text style={styles.userTitleText}>{R.strings.LABEL_NEXT}</Text>
                        )
                      }
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
    marginTop: 20,
  },
  bottomContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 20,
  },
  userTitleButtonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: R.colors.BACKGROUND_MAIN,
  },
  userTitleText: {
    height: 36,
    fontSize: 25,
    color: R.colors.TEXT_MAIN,
  },
  errorText: {
    fontSize: 18,
    color: R.colors.TEXT_ERROR,
    margin: 10,
  },
  spinner: {
    height: 35,
  },
});

const mapStateToProps = state => ({
  token: getToken(state),
});

export default connect(
  mapStateToProps,
  {  },
)(UpdateBirthdate);
