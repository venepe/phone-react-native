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
import { deleteOwner } from '../../fetches';
import { getToken, getPhoneNumber } from '../../reducers';
import { logout } from '../../utilities/auth';
import R from '../../resources';

class Manage extends Component {

  constructor(props) {
    super(props);
    this.onLeave = this.onLeave.bind(this);
    this.state = {
      isLoading: false,
      token: props.token,
      phoneNumber: props.phoneNumber,
    };
  }

  componentDidUpdate(prevProps) {
    const props = this.props;
    if (props.token !== prevProps.token) {
      this.setState({
        token: props.token,
      });
    }
    if (props.phoneNumber !== prevProps.phoneNumber) {
      this.setState({
        phoneNumber: props.phoneNumber,
      });
    }
  }

  async onConfirmLeave() {
    const { token, phoneNumber } = this.state;
    this.setState({ isLoading: true });
    try {
      const data = await deleteOwner({ token, phoneNumber });
      console.log(data);
      let { owner } = data;
      if (owner) {
        logout();
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
    const { isLoading } = this.state;
    return (
      <View style={styles.root}>
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
    flexDirection: 'row',
    backgroundColor: R.colors.BACKGROUND_MAIN,
    alignItems: 'flex-end',
  },
  buttonContainer: {
    height: 100,
    flex: 1,
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
});

const mapStateToProps = state => ({
  phoneNumber: getPhoneNumber(state),
  token: getToken(state),
});

export default connect(
  mapStateToProps,
  { },
)(Manage);
