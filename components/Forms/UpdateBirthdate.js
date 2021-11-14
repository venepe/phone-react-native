import React, { Component, Fragment } from 'react';
import {
  Alert,
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { connect } from 'react-redux';
import { getBirthdate, getBirthdateText, is18YearsOld, getBirthdatePayload } from '../../utilities/date';
import { getToken } from '../../reducers';
import { getMe, putUser } from '../../fetches';
import Empty from './Empty';
import R from '../../resources';

class UpdateBirthdate extends Component {

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onUpdateBirthdate = this.onUpdateBirthdate.bind(this);
    this.stopLoading = this.stopLoading.bind(this);
    const birthdate = getBirthdate();
    this.state = {
      isLoading: false,
      isValid: is18YearsOld(birthdate),
      token: props.token,
      birthdate: getBirthdate(),
    };
  }

  async fetch() {
    this.setState({ isLoading: true });
    try {
      let { token } = this.state;
      const data = await getMe({ token });
      let birthdate = data.user.birthdate;
      birthdate = getBirthdate(birthdate);
      this.setState({
        birthdate,
        isLoading: false,
        isValid: is18YearsOld(birthdate),
      });
    } catch (e) {
      this.setState({ isLoading: false });
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

  onChange(event, date) {
    const isValid = is18YearsOld(date);
    const birthdate = getBirthdate(date);
    this.setState({ birthdate, isValid });
  }

  onUpdateBirthdate() {
    const { token, birthdate } = this.state;
    const birthdatePayload = getBirthdatePayload(birthdate);
    this.setState({ isLoading: true });
    putUser({ token, birthdate: birthdatePayload })
    .then((response) => {
      const statusCode = response.status;
      const data = response.json();
      return Promise.all([statusCode, data]);
    })
    .then(([res, data]) => {
      if (res === 200) {
        this.stopLoading();
        this.props.onUpdateBirthdate();
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
    const { isLoading, isValid, birthdate } = this.state;
    const birthdateText = getBirthdateText(birthdate);
    const display = Platform.OS === 'ios' ? 'spinner' : 'calendar';
    if (isLoading) {
      return (<Empty navigation={this.props.navigation}/>);
    }
    return (
      <View style={styles.root}>
        <View style={styles.formContainer}>
          <Text
            style={[styles.textInput, {margin: 5}]}
            placeholder={R.strings.HINT_BIRTHDATE}
          >
            {birthdateText}
          </Text>
          <DateTimePicker
            style={[styles.textInput, {margin: 5}]}
            value={birthdate}
            maximumDate={new Date()}
            mode={'date'}
            onChange={this.onChange}
            display={display}
          />
          <View style={styles.bottomContainer} >
            {(() => {
              const backgroundColor = isValid ? R.colors.BACKGROUND_MAIN : R.colors.TEXT_BACKGROUND_LIGHT;
                return (
                  <TouchableOpacity style={[styles.userTitleButtonContainer, { backgroundColor }]} disabled={!isValid || isLoading} onPress={() => this.onUpdateBirthdate()}>
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

UpdateBirthdate.defaultProps = {
  onUpdateBirthdate: () => {},
};

const mapStateToProps = state => ({
  token: getToken(state),
});

export default connect(
  mapStateToProps,
  {  },
)(UpdateBirthdate);
