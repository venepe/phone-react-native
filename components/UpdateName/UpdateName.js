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

const UpdateNameSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, R.strings.WARNING_MIN_LENGTH)
    .max(128, R.strings.WARNING_MAX_LENGTH)
    .required(R.strings.WARNING_FIELD_REQUIRED),
});

class UpdateName extends Component {

  constructor(props) {
    super(props);
    this.onUpdateName = this.onUpdateName.bind(this);
    this.stopLoading = this.stopLoading.bind(this);

    this.state = {
      isLoading: false,
      token: props.token,
      name: '',
    };
  }

  async fetch() {
    try {
      const { token, accountId } = this.state;
      const data = await getMe({ token });
      console.log(data);
      let { user: { name } } = data;
      console.log(name);
      this.setState({
        name,
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

  onUpdateName({ values }) {
    const { name } = values;
    const { token } = this.state;
    this.setState({ isLoading: true });
    putUser({ token, name })
    .then((response) => {
      const statusCode = response.status;
      const data = response.json();
      return Promise.all([statusCode, data]);
    })
    .then(([res, data]) => {
      if (res === 200) {
        const { user: { name } } = data;
        this.setState({ name });
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
    const { isLoading, name } = this.state;
    if (!name || name.length < 1) {
      return (<Empty navigation={this.props.navigation}/>);
    }
    return (
      <View style={styles.root}>
        <Formik
          initialValues={{ name }}
          validationSchema={UpdateNameSchema}
          onSubmit={values => console.log(values)}
          >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid }) => (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.formContainer}>
              <TextInput
                  style={[styles.textInput, {margin: 5}]}
                  placeholder={R.strings.HINT_NAME}
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
                    <TouchableOpacity style={[styles.userTitleButtonContainer, { backgroundColor }]} disabled={!isValid || isLoading} onPress={() => this.onUpdateName({ values })}>
                      {
                        isLoading ? (
                          <ActivityIndicator style={styles.spinner} size='large' color='#757575' />
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
    borderRadius: 5,
  },
  bottomContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
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
    color: '#FF5252',
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
)(UpdateName);
