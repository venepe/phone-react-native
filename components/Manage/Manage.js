import React, { Component } from 'react';
import {
  Alert,
  ActivityIndicator,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { delOwner, getMe } from '../../fetches';
import { getToken, getAccountId } from '../../reducers';
import { clearSession } from '../../utilities/auth';
import { getBirthdateText } from '../../utilities/date';
import R from '../../resources';

class Manage extends Component {

  constructor(props) {
    super(props);
    this.onLeave = this.onLeave.bind(this);
    this.state = {
      isLoading: false,
      token: props.token,
      accountId: props.accountId,
      name: '',
      birthdate: '',
    };
  }

  componentDidMount() {
    this.fetch();
  }

  async fetch() {
    try {
      const { token } = this.state;
      const data = await getMe({ token });
      let { user: { name, birthdate } } = data;
      this.setState({
        birthdate,
        name,
      });
    } catch (e) {
      console.log(e);
    }
  }


  componentDidUpdate(prevProps) {
    const props = this.props;
    if (props.token !== prevProps.token) {
      this.setState({
        token: props.token,
      });
    }
    if (props.accountId !== prevProps.accountId) {
      this.setState({
        accountId: props.accountId,
      });
    }
  }

  async onConfirmLeave() {
    const { token, accountId } = this.state;
    this.setState({ isLoading: true });
    try {
      const data = await delOwner({ token, accountId });
      let { owner } = data;
      if (owner) {
        await clearSession();
      }
    } catch (e) {
      console.log(e);
    }
    this.setState({ isLoading: false });
  }

  onLeave() {
    Alert.alert(
      R.strings.LEAVE_LINE_TITLE,
      R.strings.LEAVE_LINE_MESSAGE,
      [
        { text: R.strings.LABEL_CANCEL },
        { text: R.strings.LEAVE_LINE_AFFIRMATIVE, style: 'destructive', onPress: () => this.onConfirmLeave() },
      ],
      { cancelable: true }
      );
  }

  render() {
    const { isLoading, name, birthdate } = this.state;
    const birthdateText = getBirthdateText(birthdate);
    return (
      <View style={styles.root}>
        <View style={styles.infoContainer}>
          <Text
            style={[styles.textInput, {margin: 5}]}
            onPress={() => this.props.navigation.navigate('Name')}
          >
            {name}
          </Text>
          <Text
            style={[styles.textInput, {margin: 5}]}
            onPress={() => this.props.navigation.navigate('Birthdate')}
          >
            {birthdateText}
          </Text>
        </View>
          <TouchableOpacity style={styles.buttonContainer} disabled={isLoading} onPress={this.onLeave} isd>
            {
              isLoading ? (
                <ActivityIndicator style={styles.spinner} size='large' color={R.colors.BACKGROUND_MAIN} />
              ) : (
                <Text style={styles.buttonText}>{R.strings.LABEL_LEAVE_LINE}</Text>
              )
            }
          </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: R.colors.BACKGROUND_MAIN,
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  buttonContainer: {
    height: 100,
    backgroundColor: R.colors.NO,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    height: 36,
    fontSize: 25,
    margin: 10,
    alignSelf: 'center',
    color: R.colors.TEXT_MAIN,
  },
  spinner: {
    height: 35,
  },
  textInput: {
    padding: 20,
    color: R.colors.BACKGROUND_DARK,
    fontSize: 24,
    fontWeight: '500',
    backgroundColor: R.colors.TEXT_BACKGROUND_LIGHT,
    marginTop: 20,
  },
});

const mapStateToProps = state => ({
  accountId: getAccountId(state),
  token: getToken(state),
});

export default connect(
  mapStateToProps,
  { },
)(Manage);
